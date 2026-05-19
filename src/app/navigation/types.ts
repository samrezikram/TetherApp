import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";

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
        asset?: AssetTickerId;
        amount?: string;
        network?: NetworkTypeId;
        recipient?: string;
        scannedAt?: number;
      }
    | undefined;
  TransactionDetails: { transactionId: string; hash?: string };
};
