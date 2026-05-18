import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/design-system/components/Text";
import { useTheme } from "@/design-system/theme/ThemeProvider";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  const theme = useTheme();

  return (
    <View style={{ alignItems: "center", gap: 12, paddingVertical: 24 }}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text color="textMuted" variant="bodySmall">
        {label}
      </Text>
    </View>
  );
}
