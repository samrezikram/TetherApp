import type { RootStackParamList } from "@/app/navigation/types";
import { Button, Card, Input, Screen, Text } from "@/design-system";
import type { WalletSummary } from "@/domain/wallet/types";
import { WalletRuntimeSplash } from "@/features/wallets/components/WalletRuntimeSplash";
import { useSecureSession } from "@/hooks/useSecureSession";
import { logger } from "@/infrastructure/logging/logger";
import { requireBiometric } from "@/services/biometric/biometricService";
import { lockSession } from "@/services/biometric/sessionService";
import {
  deleteSecret,
  getSecret,
  storeSecret,
} from "@/services/secure-storage/keychainStorage";
import {
  generateSeedPhrase,
  type SeedPhraseLength,
} from "@/services/wallets/seedPhrase";
import {
  createWalletId,
  deleteRegisteredWallet,
  getActiveWalletId,
  listRegisteredWallets,
  setActiveWalletId,
  upsertRegisteredWallet,
} from "@/services/wallets/walletRegistry";
import { clearWdkRuntimeCaches } from "@/services/wdk/wdkRuntimeCache";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";

export function WalletHomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    balances,
    clearWallet,
    createWallet,
    isInitialized,
    refreshWalletBalance,
    unlockWallet,
    wallet,
  } = useWallet();
  const secureSession = useSecureSession();
  const [walletName, setWalletName] = useState("Main Wallet");
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [seedPhraseLength, setSeedPhraseLength] =
    useState<SeedPhraseLength>(12);
  const [wallets, setWallets] = useState<WalletSummary[]>([]);
  const [activeWalletId, setActiveWalletIdState] = useState<string | null>(
    null,
  );
  const [isBusy, setIsBusy] = useState(false);

  const balanceRows = useMemo(() => balances?.list ?? [], [balances?.list]);
  const trimmedWalletName = walletName.trim();

  useEffect(() => {
    void refreshRegisteredWallets();
  }, []);

  async function refreshRegisteredWallets() {
    const [registeredWallets, activeId] = await Promise.all([
      listRegisteredWallets(),
      getActiveWalletId(),
    ]);
    setWallets(registeredWallets);
    setActiveWalletIdState(activeId);
  }

  async function handleUnlock() {
    setIsBusy(true);
    try {
      await secureSession.unlock();
      await clearWdkRuntimeCaches();
      await unlockWallet();
    } catch (error) {
      logger.warn("Wallet unlock rejected", error);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreateWallet() {
    if (!trimmedWalletName || isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      const walletId = createWalletId();
      const mnemonic = generateSeedPhrase(seedPhraseLength);
      await clearWdkRuntimeCaches();
      await createWallet({ mnemonic, name: trimmedWalletName });
      await storeSecret(`wallet:${walletId}:mnemonic`, mnemonic, {
        requireBiometry: true,
      });
      await upsertRegisteredWallet({
        activeAccountIndex: 0,
        createdAt: new Date().toISOString(),
        id: walletId,
        imported: false,
        name: trimmedWalletName,
      });
      await refreshWalletBalance();
      await refreshRegisteredWallets();
      setIsCreatingWallet(false);
      navigation.navigate("RecoveryPhrase", { walletId });
    } catch (error) {
      logger.error("Create wallet failed", error);
      Alert.alert(
        "Wallet creation failed",
        "Check WDK configuration and try again.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSwitchWallet(walletId: string) {
    if (isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      await requireBiometric("unlock");
      const selectedWallet = wallets.find(
        (candidate) => candidate.id === walletId,
      );
      const mnemonic = await getSecret(`wallet:${walletId}:mnemonic`, {
        requireBiometry: true,
      });

      if (!selectedWallet || !mnemonic) {
        throw new Error("Wallet secret not found");
      }

      await clearWallet();
      await clearWdkRuntimeCaches();
      await createWallet({ mnemonic, name: selectedWallet.name });
      await setActiveWalletId(walletId);
      await refreshWalletBalance();
      await refreshRegisteredWallets();
    } catch (error) {
      logger.error("Switch wallet failed", error);
      Alert.alert(
        "Switch failed",
        "Unable to unlock and switch to that wallet.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDeleteWallet(walletId: string) {
    if (isBusy) {
      return;
    }

    const walletToDelete = wallets.find((candidate) => candidate.id === walletId);

    if (!walletToDelete) {
      Alert.alert("Delete failed", "Wallet record was not found.");
      return;
    }

    Alert.alert(
      `Delete ${walletToDelete.name}?`,
      "This removes the encrypted wallet copy from this device. Keep your recovery phrase before deleting.",
      [
        { style: "cancel", text: "Cancel" },
        {
          style: "destructive",
          text: "Delete",
          onPress: () => {
            void (async () => {
              setIsBusy(true);
              try {
                await requireBiometric("settings");
                await deleteSecret(`wallet:${walletId}:mnemonic`);
                const remainingWallets = await deleteRegisteredWallet(walletId);
                if (walletId === activeWalletId) {
                  await clearWallet();
                  await clearWdkRuntimeCaches();
                  const nextWallet = remainingWallets[0];

                  if (nextWallet) {
                    const mnemonic = await getSecret(
                      `wallet:${nextWallet.id}:mnemonic`,
                      {
                        requireBiometry: true,
                      },
                    );

                    if (mnemonic) {
                      await createWallet({
                        mnemonic,
                        name: nextWallet.name,
                      });
                      await setActiveWalletId(nextWallet.id);
                      await refreshWalletBalance();
                    }
                  } else {
                    lockSession();
                    setIsCreatingWallet(false);
                  }
                }
                await refreshRegisteredWallets();
              } catch (error) {
                logger.error("Delete wallet failed", error);
                Alert.alert("Delete failed", "Unable to delete this wallet.");
              } finally {
                setIsBusy(false);
              }
            })();
          },
        },
      ],
    );
  }

  if (!isInitialized) {
    return <WalletRuntimeSplash />;
  }

  if (!wallet) {
    return (
      <Screen>
        {!isCreatingWallet ? (
          <>
            <Text variant="headlineLarge">Wallet setup</Text>
            <Text color="textMuted">
              Create a new self-custodial wallet or import an existing recovery
              phrase. No wallet is created until you choose an action.
            </Text>
            <Button
              disabled={isBusy}
              onPress={() => setIsCreatingWallet(true)}
              title="Create New Wallet"
            />
            <Button
              disabled={isBusy}
              onPress={() => navigation.navigate("ImportWallet")}
              title="Import Wallet"
              variant="outline"
            />
          </>
        ) : (
          <>
            <Text variant="headlineLarge">Create wallet</Text>
            <Text color="textMuted">
              A recovery phrase is generated locally, encrypted by WDK, and
              stored behind biometric Keychain access for wallet switching.
            </Text>
            <Input
              editable={!isBusy}
              label="Wallet name"
              onChangeText={setWalletName}
              value={walletName}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                disabled={isBusy}
                onPress={() => setSeedPhraseLength(12)}
                title="12 words"
                variant={seedPhraseLength === 12 ? "primary" : "outline"}
              />
              <Button
                disabled={isBusy}
                onPress={() => setSeedPhraseLength(24)}
                title="24 words"
                variant={seedPhraseLength === 24 ? "primary" : "outline"}
              />
            </View>
            <Button
              disabled={!trimmedWalletName || isBusy}
              isLoading={isBusy}
              onPress={handleCreateWallet}
              title="Create Wallet"
            />
            <Button
              disabled={isBusy}
              onPress={() => setIsCreatingWallet(false)}
              title="Cancel"
              variant="ghost"
            />
          </>
        )}
      </Screen>
    );
  }

  if (!secureSession.isUnlocked) {
    return (
      <Screen>
        <Text variant="headlineLarge">Wallet locked</Text>
        <Text color="textMuted">
          Biometric or device-passcode authentication is required before wallet
          data or signing actions are available.
        </Text>
        <Button isLoading={isBusy} onPress={handleUnlock} title="Unlock" />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text variant="headlineLarge">{wallet.name}</Text>
      <Card>
        <Text color="textMuted" variant="labelLarge">
          Portfolio
        </Text>
        <Text variant="displaySmall">
          {balanceRows.length === 0
            ? "No balances"
            : `${balanceRows.length} assets`}
        </Text>
      </Card>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          onPress={() => navigation.navigate("Receive" as never)}
          title="Receive"
          variant="secondary"
        />
        <Button
          onPress={() => navigation.navigate("Send" as never)}
          title="Send"
        />
      </View>
      <Button
        isLoading={balances?.isLoading}
        onPress={refreshWalletBalance}
        title="Refresh Balances"
        variant="outline"
      />
      <Text variant="titleLarge">Wallets</Text>
      {wallets.map((registeredWallet) => (
        <Card key={registeredWallet.id}>
          <Text variant="titleSmall">
            {registeredWallet.name}
            {registeredWallet.id === activeWalletId ? " (active)" : ""}
          </Text>
          <Text color="textMuted" variant="bodySmall">
            {registeredWallet.imported ? "Imported" : "Created"} on{" "}
            {new Date(registeredWallet.createdAt).toLocaleDateString()}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <Button
              disabled={registeredWallet.id === activeWalletId || isBusy}
              onPress={() => handleSwitchWallet(registeredWallet.id)}
              size="small"
              title="Switch"
              variant="outline"
            />
            <Button
              disabled={isBusy}
              onPress={() => handleDeleteWallet(registeredWallet.id)}
              size="small"
              title="Delete"
              variant="destructive"
            />
          </View>
        </Card>
      ))}
      {balanceRows.map(
        (balance: { denomination?: string; value?: string }, index: number) => (
          <Card key={`${balance.denomination ?? "asset"}-${index}`}>
            <Text variant="titleSmall">{balance.denomination ?? "Asset"}</Text>
            <Text color="textMuted">{balance.value ?? "0"}</Text>
          </Card>
        ),
      )}
    </Screen>
  );
}
