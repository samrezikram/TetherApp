import type { RootStackParamList } from "@/app/navigation/types";
import { Button, Screen, Text } from "@/design-system";
import { parseQrPayload } from "@/services/qr/qrParser";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export function ScannerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      void requestPermission();
    }
  }, [permission?.granted, requestPermission]);

  if (!permission?.granted) {
    return (
      <Screen>
        <Text variant="headlineSmall">Camera permission required</Text>
        <Button onPress={requestPermission} title="Allow Camera" />
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => {
          if (scanned) {
            return;
          }

          setScanned(true);
          const parsed = parseQrPayload(data);
          const sendParams = {
            recipient: parsed.address,
            scannedAt: Date.now(),
            ...(parsed.asset ? { asset: parsed.asset } : {}),
            ...(parsed.amount ? { amount: parsed.amount } : {}),
            ...(parsed.network ? { network: parsed.network } : {}),
          };
          navigation.navigate({
            merge: true,
            name: "Send",
            params: sendParams,
          });
        }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
