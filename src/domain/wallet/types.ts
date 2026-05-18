export type NetworkTypeId =
  | "ethereum"
  | "polygon"
  | "arbitrum"
  | "bitcoin"
  | "ton"
  | "tron"
  | "sepolia";

export type AssetTickerId = "USDT" | "XAUT" | "BTC" | "ETH";

export type WalletSummary = {
  id: string;
  name: string;
  createdAt: string;
  activeAccountIndex: number;
};

export type WalletBalance = {
  asset: AssetTickerId | string;
  network: NetworkTypeId;
  value: string;
  fiatValue?: string;
};

export type ReceiveAddress = {
  address: string;
  network: NetworkTypeId;
  accountIndex: number;
};
