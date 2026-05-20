import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";

export const EVM_NETWORKS = [
  "ethereum",
  "polygon",
  "arbitrum",
  "sepolia",
] as const satisfies readonly NetworkTypeId[];

export const RECEIVE_NETWORKS = [
  "ethereum",
  "polygon",
  "bitcoin",
] as const satisfies readonly NetworkTypeId[];

export const QR_SCHEME_NETWORKS = {
  arbitrum: "arbitrum",
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  polygon: "polygon",
  ton: "ton",
  tron: "tron",
} as const satisfies Partial<Record<string, NetworkTypeId>>;

export const DEFAULT_ASSET_BY_NETWORK = {
  arbitrum: "USDT",
  bitcoin: "BTC",
  ethereum: "USDT",
  polygon: "USDT",
  sepolia: "USDT",
  ton: "USDT",
  tron: "USDT",
} as const satisfies Record<NetworkTypeId, AssetTickerId>;

export function getDefaultAssetForNetwork(
  network: NetworkTypeId,
): AssetTickerId {
  return DEFAULT_ASSET_BY_NETWORK[network];
}

export function getNetworkForQrScheme(
  scheme: string,
): NetworkTypeId | undefined {
  return (QR_SCHEME_NETWORKS as Partial<Record<string, NetworkTypeId>>)[
    scheme.toLowerCase()
  ];
}
