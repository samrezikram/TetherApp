import React from "react";
import { Button, Card, Screen, Text } from "@/design-system";
import { lockSession } from "@/services/biometric/sessionService";

export function SettingsScreen() {
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
      <Card>
        <Text variant="titleSmall">Wallet management</Text>
        <Text color="textMuted">
          Delete a specific wallet from the Wallet tab. Settings only controls
          app-level security actions.
        </Text>
      </Card>
      <Button onPress={lockSession} title="Lock Wallet" variant="outline" />
    </Screen>
  );
}
