import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import { Button, Input, Screen, Text } from "@/design-system";
import { logger } from "@/infrastructure/logging/logger";
import { storeSecret } from "@/services/secure-storage/keychainStorage";
import {
  createWalletId,
  upsertRegisteredWallet,
} from "@/services/wallets/walletRegistry";
import {
  getSeedPhraseWordCount,
  normalizeSeedPhrase,
  validateSeedPhrase,
} from "@/services/wallets/seedPhrase";
import { clearWdkRuntimeCaches } from "@/services/wdk/wdkRuntimeCache";

export function ImportWalletScreen() {
  const navigation = useNavigation();
  const { createWallet, refreshWalletBalance } = useWallet();
  const [name, setName] = useState("Imported Wallet");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const normalizedSeedPhrase = normalizeSeedPhrase(seedPhrase);
  const wordCount = getSeedPhraseWordCount(seedPhrase);
  const seedPhraseError =
    seedPhrase.length > 0 && !validateSeedPhrase(seedPhrase)
      ? "Enter a valid 12 or 24 word recovery phrase."
      : undefined;

  async function importWallet() {
    if (!validateSeedPhrase(seedPhrase)) {
      Alert.alert("Invalid recovery phrase", "Check the words and order.");
      return;
    }

    setIsBusy(true);
    try {
      const walletId = createWalletId();
      await clearWdkRuntimeCaches();
      await createWallet({ mnemonic: normalizedSeedPhrase, name });
      await storeSecret(`wallet:${walletId}:mnemonic`, normalizedSeedPhrase, {
        requireBiometry: true,
      });
      await upsertRegisteredWallet({
        activeAccountIndex: 0,
        createdAt: new Date().toISOString(),
        id: walletId,
        imported: true,
        name,
      });
      await refreshWalletBalance();
      navigation.goBack();
    } catch (error) {
      logger.error("Import wallet failed", error);
      Alert.alert("Import failed", "The wallet could not be imported.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Import wallet</Text>
      <Text color="textMuted">
        Recovery phrases are normalized locally and stored through biometric
        Keychain protection.
      </Text>
      <Input label="Wallet name" onChangeText={setName} value={name} />
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        error={seedPhraseError}
        label={`Recovery phrase (${wordCount} words)`}
        multiline
        onChangeText={setSeedPhrase}
        style={{ minHeight: 140, textAlignVertical: "top" }}
        value={seedPhrase}
      />
      <Button
        disabled={!validateSeedPhrase(seedPhrase)}
        isLoading={isBusy}
        onPress={importWallet}
        title="Import Wallet"
      />
    </Screen>
  );
}
