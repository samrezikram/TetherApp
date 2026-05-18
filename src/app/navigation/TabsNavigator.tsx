import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Activity, Settings, WalletCards } from "lucide-react-native";
import type { AppTabParamList } from "@/app/navigation/types";
import { WalletHomeScreen } from "@/features/wallets/screens/WalletHomeScreen";
import { TransactionHistoryScreen } from "@/features/transactions/screens/TransactionHistoryScreen";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";
import { useTheme } from "@/design-system/theme/ThemeProvider";

const Tab = createBottomTabNavigator<AppTabParamList>();

export function TabsNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        component={WalletHomeScreen}
        name="Wallet"
        options={{
          tabBarIcon: ({ color, size }) => (
            <WalletCards color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={TransactionHistoryScreen}
        name="Activity"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Activity color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
