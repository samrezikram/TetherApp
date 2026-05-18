import type { TransactionRecord } from "@/domain/transaction/types";
import type { NetworkTypeId } from "@/domain/wallet/types";
import { env } from "@/infrastructure/env/env";

type TransactionHistoryParams = {
  address: string;
  network: NetworkTypeId;
  cursor?: string;
};

export async function fetchTransactionHistory({
  address,
  cursor,
  network,
}: TransactionHistoryParams): Promise<TransactionRecord[]> {
  const url = new URL("/api/v1/transactions", env.indexerBaseUrl);
  url.searchParams.set("address", address);
  url.searchParams.set("chain", network);

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: env.indexerApiKey ? `Bearer ${env.indexerApiKey}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Indexer request failed with ${response.status}`);
  }

  const payload = (await response.json()) as { data?: TransactionRecord[] };
  return payload.data ?? [];
}
