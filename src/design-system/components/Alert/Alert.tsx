import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { Button } from "@/design-system/components/Button";
import { Text } from "@/design-system/components/Text";
import { useTheme } from "@/design-system/theme/ThemeProvider";

export type AlertVariant = "info" | "success" | "warning" | "error";

export type AlertAction = {
  label: string;
  onPress: () => void;
};

type AlertProps = {
  action?: AlertAction;
  message: string;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
  variant?: AlertVariant;
};

const iconByVariant: Record<AlertVariant, LucideIcon> = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
};

export function Alert({
  action,
  message,
  onDismiss,
  style,
  testID,
  title,
  variant = "info",
}: AlertProps) {
  const theme = useTheme();
  const Icon = iconByVariant[variant];
  const palette = {
    error: theme.colors.danger,
    info: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
  };
  const accentColor = palette[variant];

  return (
    <View
      accessibilityRole="alert"
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconFrame,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: accentColor,
            },
          ]}
        >
          <Icon color={accentColor} size={18} strokeWidth={2.2} />
        </View>
        <View style={styles.content}>
          {title ? <Text variant="titleSmall">{title}</Text> : null}
          <Text color="textMuted" variant="bodySmall">
            {message}
          </Text>
        </View>
        {onDismiss ? (
          <Pressable
            accessibilityLabel="Dismiss alert"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              { opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <X color={theme.colors.textMuted} size={18} />
          </Pressable>
        ) : null}
      </View>
      {action ? (
        <View style={styles.actionRow}>
          <Button
            onPress={action.onPress}
            size="small"
            title={action.label}
            variant={variant === "error" ? "destructive" : "outline"}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: "flex-start",
    marginLeft: 42,
    marginTop: 12,
  },
  container: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  dismissButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  iconFrame: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
});
