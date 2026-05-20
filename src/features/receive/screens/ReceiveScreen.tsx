import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import QRCode from "react-native-qrcode-svg";
import { Alert, View } from "react-native";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import { Button, Card, Screen, Text } from "@/design-system";
import type { NetworkTypeId } from "@/domain/wallet/types";
import {
  getDefaultAssetForNetwork,
  RECEIVE_NETWORKS,
} from "@/domain/wallet/constants";

type ReceiveRow = {
  address: string;
  asset: string;
  network: NetworkTypeId;
};

export function ReceiveScreen() {
  const { addresses } = useWallet();
  const walletAddresses = addresses as
    | Partial<Record<NetworkTypeId, string>>
    | undefined;
  const receiveRows = RECEIVE_NETWORKS.reduce<ReceiveRow[]>((rows, network) => {
    const address = walletAddresses?.[network];

    if (!address) {
      return rows;
    }

    return [
      ...rows,
      {
        address,
        asset: getDefaultAssetForNetwork(network),
        network,
      },
    ];
  }, []);

  function copyAddress(address: string, network: NetworkTypeId) {
    Clipboard.setString(address);
    Alert.alert("Copied", `${network} receive address copied.`);
  }

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Receive</Text>
      <Text color="textMuted">
        Send funds to the matching network address. Balances and activity update
        after the transfer is indexed.
      </Text>
      {receiveRows.length === 0 ? (
        <Card>
          <Text color="textMuted">No receive address available.</Text>
        </Card>
      ) : null}
      {receiveRows.map((row) => (
        <Card key={row.network} style={{ alignItems: "center", gap: 16 }}>
          <Text variant="titleSmall">
            {row.asset} on {row.network}
          </Text>
          <QRCode size={220} value={row.address} />
          <Text selectable style={{ textAlign: "center" }} variant="bodySmall">
            {row.address}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              onPress={() => copyAddress(row.address, row.network)}
              title="Copy"
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
