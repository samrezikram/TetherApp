import type { NavigatorScreenParams } from "@react-navigation/native";

export type AppTabParamList = {
  Activity: undefined;
  Settings: undefined;
  Wallet: undefined;
};

export type RootStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  ImportWallet: undefined;
  Receive: { address?: string; network?: string } | undefined;
  RecoveryPhrase: { walletId: string };
  Scanner: { mode: "address" | "payment-uri" };
  Send:
    | {
        amount?: string;
        recipient?: string;
      }
    | undefined;
  TransactionDetails: { transactionId: string; hash?: string };
};
