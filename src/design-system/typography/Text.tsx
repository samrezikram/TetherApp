import React from "react";
import { Text as NativeText, type TextProps as NativeTextProps } from "react-native";
import { useTheme } from "@/design-system/theme/ThemeProvider";

export type TextVariant =
  | "displayLarge"
  | "displaySmall"
  | "headlineLarge"
  | "headlineSmall"
  | "titleLarge"
  | "titleSmall"
  | "bodyLarge"
  | "bodySmall"
  | "labelLarge"
  | "labelSmall";

const variantStyle: Record<TextVariant, { fontSize: number; lineHeight: number; fontWeight: "400" | "500" | "600" | "700" }> = {
  bodyLarge: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  displayLarge: { fontSize: 40, fontWeight: "700", lineHeight: 48 },
  displaySmall: { fontSize: 32, fontWeight: "700", lineHeight: 40 },
  headlineLarge: { fontSize: 28, fontWeight: "700", lineHeight: 36 },
  headlineSmall: { fontSize: 22, fontWeight: "600", lineHeight: 30 },
  labelLarge: { fontSize: 14, fontWeight: "600", lineHeight: 18 },
  labelSmall: { fontSize: 12, fontWeight: "600", lineHeight: 16 },
  titleLarge: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  titleSmall: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
};

type TextProps = NativeTextProps & {
  color?: "text" | "textMuted" | "danger" | "success" | "warning";
  variant?: TextVariant;
};

export function Text({
  color = "text",
  style,
  variant = "bodyLarge",
  ...props
}: TextProps) {
  const theme = useTheme();

  return (
    <NativeText
      {...props}
      style={[
        variantStyle[variant],
        { color: theme.colors[color], letterSpacing: 0 },
        style,
      ]}
    />
  );
}
