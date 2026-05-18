import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/navigation/types";
import { Button } from "@/design-system/components/Button";
import { Screen } from "@/design-system/components/Screen";
import { Text } from "@/design-system/components/Text";
import { parseQrPayload } from "@/services/qr/qrParser";

export function ScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
          Alert.alert("Scanned", parsed.address);
          navigation.navigate("Send", parsed);
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
