import React from "react";
import { Alert } from "react-native";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import { Button, Card, Screen, Text } from "@/design-system";
import { lockSession } from "@/services/biometric/sessionService";
import { requireBiometric } from "@/services/biometric/biometricService";

export function SettingsScreen() {
  const { clearWallet } = useWallet();

  async function clearSecureWallet() {
    await requireBiometric("settings");
    await clearWallet();
    lockSession();
    Alert.alert("Wallet removed", "Secure wallet data was cleared.");
  }

  return (
    <Screen>
      <Text variant="headlineLarge">Settings</Text>
      <Card>
        <Text variant="titleSmall">Security</Text>
        <Text color="textMuted">
          Wallet access locks after inactivity and signing requires fresh
          biometric authorization.
        </Text>
      </Card>
      <Button onPress={lockSession} title="Lock Wallet" variant="outline" />
      <Button
        onPress={clearSecureWallet}
        title="Delete Wallet"
        variant="destructive"
      />
    </Screen>
  );
}
