import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";
import { Text } from "@/design-system/typography/Text";
import { useTheme } from "@/design-system/theme/ThemeProvider";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "small" | "medium" | "large";

type ButtonProps = PressableProps & {
  title: string;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const heights: Record<ButtonSize, number> = {
  large: 52,
  medium: 44,
  small: 36,
};

export function Button({
  disabled,
  isLoading,
  size = "medium",
  title,
  variant = "primary",
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || isLoading;
  const colors = {
    background:
      variant === "primary"
        ? theme.colors.primary
        : variant === "destructive"
          ? theme.colors.danger
          : variant === "secondary"
            ? theme.colors.surfaceMuted
            : "transparent",
    border:
      variant === "outline" ? theme.colors.border : "transparent",
    text:
      variant === "primary" || variant === "destructive"
        ? theme.colors.primaryText
        : theme.colors.text,
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      {...props}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          height: heights[size],
          opacity: isDisabled ? 0.5 : pressed ? 0.82 : 1,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={{ color: colors.text, textAlign: "center" }}
          variant="labelLarge"
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minWidth: 96,
    paddingHorizontal: 16,
  },
});
