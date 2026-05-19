import type { NetworkTypeId } from "@/domain/wallet/types";

const evmAddress = /^0x[a-fA-F0-9]{40}$/;
const bitcoinAddress =
  /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
const tronAddress = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
const tonAddress = /^(EQ|UQ)[a-zA-Z0-9_-]{46}$/;

export function inferNetworkFromAddress(address: string): NetworkTypeId | null {
  const trimmed = address.trim();

  if (evmAddress.test(trimmed)) {
    return "ethereum";
  }

  if (bitcoinAddress.test(trimmed)) {
    return "bitcoin";
  }

  if (tronAddress.test(trimmed)) {
    return "tron";
  }

  if (tonAddress.test(trimmed)) {
    return "ton";
  }

  return null;
}

export function isValidAddress(
  network: NetworkTypeId,
  address: string,
): boolean {
  const trimmed = address.trim();

  if (trimmed.length === 0) {
    return false;
  }

  if (
    network === "ethereum" ||
    network === "polygon" ||
    network === "arbitrum" ||
    network === "sepolia"
  ) {
    return evmAddress.test(trimmed);
  }

  if (network === "bitcoin") {
    return bitcoinAddress.test(trimmed);
  }

  if (network === "tron") {
    return tronAddress.test(trimmed);
  }

  if (network === "ton") {
    return tonAddress.test(trimmed);
  }

  return false;
}

export function validateAddressOrThrow(
  network: NetworkTypeId,
  address: string,
): void {
  if (!isValidAddress(network, address)) {
    throw new Error(`Invalid ${network} recipient address`);
  }
}
