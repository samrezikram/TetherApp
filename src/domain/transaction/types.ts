import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";

export type TransactionDirection = "incoming" | "outgoing";
export type TransactionStatus = "pending" | "confirmed" | "failed";

export type TransactionRecord = {
  id: string;
  hash: string;
  network: NetworkTypeId;
  asset: AssetTickerId | string;
  amount: string;
  direction: TransactionDirection;
  status: TransactionStatus;
  createdAt: string;
  counterparty?: string;
};

export type SendDraft = {
  network: NetworkTypeId;
  asset: AssetTickerId;
  accountIndex: number;
  recipient: string;
  amount: string;
};

export type FeeEstimate = {
  networkFee: string;
  serviceFee?: string;
  totalFee: string;
  asset: AssetTickerId | string;
};
