import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "@/design-system/theme/tokens";

const ThemeContext = createContext<Theme>(lightTheme);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme === "dark" ? darkTheme : lightTheme),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
