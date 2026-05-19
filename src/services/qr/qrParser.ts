import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";
import { inferNetworkFromAddress } from "@/services/wdk/addressValidation";

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
    const network = inferNetworkFromAddress(trimmed);
    const asset = network === "bitcoin" ? "BTC" : undefined;

    return {
      address: trimmed,
      ...(asset ? { asset } : {}),
      ...(network ? { network } : {}),
    };
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
  const parsedAddress = normalizeAddress(address);
  const normalizedScheme = scheme.toLowerCase();
  const network = networkByScheme[normalizedScheme] ?? inferNetworkFromAddress(parsedAddress);
  const amount = params.get("amount") ?? undefined;
  const asset = network === "bitcoin" ? "BTC" : undefined;

  return {
    address: parsedAddress,
    ...(asset ? { asset } : {}),
    ...(amount ? { amount } : {}),
    ...(network ? { network } : {}),
  };
}
