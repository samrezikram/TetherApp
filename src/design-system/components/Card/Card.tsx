import React from "react";
import { View, StyleSheet, type ViewProps } from "react-native";
import { useTheme } from "@/design-system/theme/ThemeProvider";

export function Card({ style, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
});
