import type { NavigatorScreenParams } from "@react-navigation/native";

export type AppTabParamList = {
  Activity: undefined;
  Settings: undefined;
  Wallet: undefined;
};

export type RootStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  Receive: { address?: string; network?: string } | undefined;
  Scanner: { mode: "address" | "payment-uri" };
  Send:
    | {
        amount?: string;
        recipient?: string;
      }
    | undefined;
  TransactionDetails: { transactionId: string };
};
