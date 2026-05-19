import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import QRCode from "react-native-qrcode-svg";
import { Alert, View } from "react-native";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import { Button, Card, Screen, Text } from "@/design-system";

export function ReceiveScreen() {
  const { addresses } = useWallet();
  const firstAddress = Object.values(addresses ?? {})[0] ?? "";

  function copyAddress() {
    Clipboard.setString(firstAddress);
    Alert.alert("Copied", "Receive address copied.");
  }

  return (
    <Screen>
      <Text variant="headlineLarge">Receive</Text>
      <Card style={{ alignItems: "center", gap: 16 }}>
        {firstAddress ? (
          <QRCode size={220} value={firstAddress} />
        ) : (
          <Text color="textMuted">No receive address available.</Text>
        )}
        <Text selectable style={{ textAlign: "center" }} variant="bodySmall">
          {firstAddress}
        </Text>
      </Card>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button disabled={!firstAddress} onPress={copyAddress} title="Copy" />
      </View>
    </Screen>
  );
}
