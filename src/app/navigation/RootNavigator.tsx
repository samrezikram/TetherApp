import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/navigation/types";
import { TabsNavigator } from "@/app/navigation/TabsNavigator";
import { ReceiveScreen } from "@/features/receive/screens/ReceiveScreen";
import { ImportWalletScreen } from "@/features/wallets/screens/ImportWalletScreen";
import { RecoveryPhraseScreen } from "@/features/wallets/screens/RecoveryPhraseScreen";
import { ScannerScreen } from "@/features/scanner/screens/ScannerScreen";
import { SendScreen } from "@/features/send/screens/SendScreen";
import { TransactionDetailsScreen } from "@/features/transactions/screens/TransactionDetailsScreen";
import { useTheme } from "@/design-system";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen
        component={TabsNavigator}
        name="AppTabs"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={ReceiveScreen} name="Receive" />
      <Stack.Screen
        component={ImportWalletScreen}
        name="ImportWallet"
        options={{ title: "Import Wallet" }}
      />
      <Stack.Screen
        component={RecoveryPhraseScreen}
        name="RecoveryPhrase"
        options={{ title: "Recovery Phrase" }}
      />
      <Stack.Screen component={SendScreen} name="Send" />
      <Stack.Screen component={ScannerScreen} name="Scanner" />
      <Stack.Screen
        component={TransactionDetailsScreen}
        name="TransactionDetails"
        options={{ title: "Transaction" }}
      />
    </Stack.Navigator>
  );
}
