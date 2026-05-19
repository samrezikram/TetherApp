import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";

export type ParsedQrPayload = {
  address: string;
  asset?: AssetTickerId;
  amount?: string;
  network?: NetworkTypeId;
};

const networkByScheme: Partial<Record<string, NetworkTypeId>> = {
  arbitrum: "arbitrum",
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  polygon: "polygon",
  ton: "ton",
  tron: "tron",
};

function normalizeAddress(address: string) {
  return address.replace(/^pay-/, "").split("@")[0] ?? address;
}

export function parseQrPayload(payload: string): ParsedQrPayload {
  const trimmed = payload.trim();

  if (!trimmed.includes(":")) {
    return { address: trimmed };
  }

  const [scheme, rest] = trimmed.split(":");
  if (!scheme || !rest) {
    return { address: trimmed };
  }

  const [address, query] = rest.split("?");
  if (!address) {
    return { address: trimmed };
  }

  const params = new URLSearchParams(query);
  const normalizedScheme = scheme.toLowerCase();
  const network = networkByScheme[normalizedScheme];
  const amount = params.get("amount") ?? undefined;
  const asset = network === "bitcoin" ? "BTC" : undefined;
  const parsedAddress = normalizeAddress(address);

  return {
    address: parsedAddress,
    ...(asset ? { asset } : {}),
    ...(amount ? { amount } : {}),
    ...(network ? { network } : {}),
  };
}
