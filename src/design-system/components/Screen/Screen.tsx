import React from "react";
import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/design-system/theme/ThemeProvider";

type ScreenProps = ViewProps & {
  scroll?: boolean;
};

export function Screen({ children, scroll = false, style, ...props }: ScreenProps) {
  const theme = useTheme();
  const content = (
    <View {...props} style={[styles.content, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});
