import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Card, Screen, Text, useTheme } from "@/design-system";

export function WalletRuntimeSplash() {
  const theme = useTheme();

  return (
    <Screen style={styles.screen}>
      <View
        accessibilityLabel="WDK Wallet"
        style={[
          styles.mark,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={styles.markText} variant="headlineLarge">
          W
        </Text>
      </View>
      <Card style={styles.card}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.center} variant="titleSmall">
          Preparing secure wallet
        </Text>
        <Text color="textMuted" style={styles.center} variant="bodySmall">
          Starting encrypted storage and wallet services.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  center: {
    textAlign: "center",
  },
  mark: {
    alignItems: "center",
    borderRadius: 28,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  markText: {
    color: "#FFFFFF",
  },
  screen: {
    alignItems: "center",
    justifyContent: "center",
  },
});
