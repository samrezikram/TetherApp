import type { TransactionRecord } from "@/domain/transaction/types";
import type { NetworkTypeId } from "@/domain/wallet/types";
import { env } from "@/infrastructure/env/env";

type TransactionHistoryParams = {
  address: string;
  network: NetworkTypeId;
  cursor?: string;
  token?: string;
};

export async function fetchTransactionHistory({
  address,
  cursor,
  network,
  token,
}: TransactionHistoryParams): Promise<TransactionRecord[]> {
  const resolvedToken = token ?? (network === "bitcoin" ? "btc" : "usdt");
  const url = new URL(
    `/api/v1/${network}/${resolvedToken}/${address}/token-transfers`,
    env.indexerBaseUrl,
  );
  url.searchParams.set("limit", "100");

  if (cursor) {
    url.searchParams.set("fromTs", cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.indexerApiKey ?? "",
    },
  });

  if (!response.ok) {
    throw new Error(`Indexer request failed with ${response.status}`);
  }

  const payload = (await response.json()) as { transfers?: TransactionRecord[] };
  return payload.transfers ?? [];
}
