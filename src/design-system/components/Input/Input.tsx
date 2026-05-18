import React from "react";
import { TextInput, View, StyleSheet, type TextInputProps } from "react-native";
import { Text } from "@/design-system/typography/Text";
import { useTheme } from "@/design-system/theme/ThemeProvider";

type InputProps = TextInputProps & {
  error?: string | undefined;
  label: string;
};

export function Input({ error, label, style, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="labelLarge">{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        {...props}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
          },
          style,
        ]}
      />
      {error ? (
        <Text color="danger" variant="bodySmall">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
  },
});
