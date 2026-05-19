import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useRoute } from "@react-navigation/native";
import { Button, Card, Screen, Text } from "@/design-system";
import { requireBiometric } from "@/services/biometric/biometricService";
import { getSecret } from "@/services/secure-storage/keychainStorage";
import { logger } from "@/infrastructure/logging/logger";

export function RecoveryPhraseScreen() {
  const route = useRoute();
  const { walletId } = route.params as { walletId: string };
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);

  useEffect(() => {
    void reveal();
  }, []);

  async function reveal() {
    try {
      await requireBiometric("export");
      const secret = await getSecret(`wallet:${walletId}:mnemonic`, {
        requireBiometry: true,
      });
      setSeedPhrase(secret);
    } catch (error) {
      logger.warn("Recovery phrase reveal rejected", error);
    }
  }

  function copy() {
    if (!seedPhrase) {
      return;
    }

    Clipboard.setString(seedPhrase);
    Alert.alert("Copied", "Recovery phrase copied.");
  }

  const words = seedPhrase?.split(" ") ?? [];

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Recovery phrase</Text>
      <Text color="danger">
        Store these words offline. Anyone with this phrase can move the wallet
        funds.
      </Text>
      <Card>
        {words.length === 0 ? (
          <Text color="textMuted">Authenticate to reveal the recovery phrase.</Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {words.map((word, index) => (
              <Card key={`${word}-${index}`} style={{ minWidth: "30%", padding: 8 }}>
                <Text color="textMuted" variant="labelSmall">
                  {index + 1}
                </Text>
                <Text variant="bodySmall">{word}</Text>
              </Card>
            ))}
          </View>
        )}
      </Card>
      <Button onPress={reveal} title="Reveal" variant="outline" />
      <Button disabled={!seedPhrase} onPress={copy} title="Copy" />
    </Screen>
  );
}
