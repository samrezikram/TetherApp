import { env } from "@/infrastructure/env/env";
import { CHAINS_CONFIG } from "@/services/wdk/chains";

export const wdkConfig = {
  chains: CHAINS_CONFIG,
  enableCaching: true,
  indexer: {
    apiKey: env.indexerApiKey ?? "",
    url: env.indexerBaseUrl,
  },
};
