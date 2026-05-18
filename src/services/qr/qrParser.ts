export type ParsedQrPayload = {
  address: string;
  amount?: string;
};

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
  const params = new URLSearchParams(query);

  const amount = params.get("amount");

  return amount ? { address, amount } : { address };
}
