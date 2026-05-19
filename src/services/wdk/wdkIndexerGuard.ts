import {
  AssetBalanceMap,
  AssetAddressMap,
  type AssetTicker,
  WDKService,
} from "@tetherto/wdk-react-native-provider";

import { env } from "@/infrastructure/env/env";
import { logger } from "@/infrastructure/logging/logger";
import {
  filterConfiguredIndexerAddresses,
  getSupportedIndexerNetworks,
  getUnsupportedIndexerNetworks,
  type WdkAddressMap,
} from "@/services/wdk/wdkIndexerGuardUtils";

type ResolveBalances = (
  enabledAssets: AssetTicker[],
  addresses: WdkAddressMap,
) => Promise<Record<string, unknown>>;
type ResolveTransactions = (
  enabledAssets: AssetTicker[],
  addresses: WdkAddressMap,
) => Promise<Record<string, unknown[]>>;

const installedFlag = Symbol.for("wdk-wallet.indexer-guard.installed");
const addressGuardInstalledFlag = Symbol.for(
  "wdk-wallet.address-compat-guard.installed",
);

type CallMethodResponse = {
  result?: string | null;
};

function toNetwork(network: string): string {
  return network === "bitcoin" ? "bitcoin" : network;
}

function parseCallMethodResult(response: CallMethodResponse) {
  if (!response.result) {
    return null;
  }

  try {
    return JSON.parse(response.result) as unknown;
  } catch {
    return response.result;
  }
}

function normalizeAddressResult(result: unknown) {
  if (typeof result === "string") {
    return result;
  }

  if (result && typeof result === "object" && "address" in result) {
    const address = (result as { address?: unknown }).address;
    return typeof address === "string" ? address : null;
  }

  return null;
}

function emptyTransactionMap(enabledAssets: AssetTicker[]) {
  return enabledAssets.reduce<Record<string, unknown[]>>(
    (transactionMap, asset) => {
      const networks = AssetBalanceMap[asset];

      if (!networks) {
        return transactionMap;
      }

      Object.keys(networks).forEach((network) => {
        transactionMap[`${network}_${asset}`] = [];
      });

      return transactionMap;
    },
    {},
  );
}

function hasIndexerApiKey() {
  return Boolean(env.indexerApiKey);
}

function shouldSkipIndexerRequest(addresses: WdkAddressMap) {
  if (!hasIndexerApiKey()) {
    return true;
  }

  return Object.keys(filterConfiguredIndexerAddresses(addresses)).length === 0;
}

function logIndexerSkip(reason: string, addresses: WdkAddressMap) {
  const unsupportedNetworks = getUnsupportedIndexerNetworks(addresses);

  logger.warn("Skipping WDK indexer request", {
    configuredNetworks: getSupportedIndexerNetworks(),
    reason,
    unsupportedNetworks,
  });
}

export function installWdkIndexerGuard() {
  const service = WDKService as unknown as {
    [installedFlag]?: boolean;
    [addressGuardInstalledFlag]?: boolean;
    wdkManager?: {
      callMethod?: (args: {
        accountIndex: number;
        args?: string;
        methodName: string;
        network: string;
        options?: string;
      }) => Promise<CallMethodResponse>;
    };
    resolveWalletBalances: ResolveBalances;
    resolveWalletAddresses?: (
      enabledAssets: AssetTicker[],
      index?: number,
    ) => Promise<Record<string, string | null>>;
    resolveWalletTransactions: ResolveTransactions;
  };

  if (!service[addressGuardInstalledFlag] && service.resolveWalletAddresses) {
    const resolveWalletAddresses = service.resolveWalletAddresses.bind(service);

    service.resolveWalletAddresses = async (enabledAssets, index = 0) => {
      const manager = service.wdkManager;

      if (!manager?.callMethod) {
        return resolveWalletAddresses(enabledAssets, index);
      }

      const networkAddresses: Record<string, string | null> = {};

      for (const asset of enabledAssets) {
        const networks = AssetAddressMap[asset];

        if (!networks) {
          continue;
        }

        for (const network of Object.keys(networks)) {
          try {
            const response = await manager.callMethod({
              accountIndex: index,
              methodName: "getAddress",
              network: toNetwork(network),
              options: JSON.stringify({ defaultValue: null }),
            });
            networkAddresses[network] = normalizeAddressResult(
              parseCallMethodResult(response),
            );
          } catch (error) {
            logger.warn("WDK address resolution failed", {
              error,
              network,
            });
            networkAddresses[network] = null;
          }
        }
      }

      if (networkAddresses.ethereum) {
        networkAddresses.polygon = networkAddresses.ethereum;
        networkAddresses.arbitrum = networkAddresses.ethereum;
      }

      return networkAddresses;
    };

    service[addressGuardInstalledFlag] = true;
  }

  if (service[installedFlag]) {
    return;
  }

  const resolveWalletBalances =
    service.resolveWalletBalances.bind(service) as ResolveBalances;
  const resolveWalletTransactions =
    service.resolveWalletTransactions.bind(service) as ResolveTransactions;

  service.resolveWalletBalances = async (enabledAssets, addresses) => {
    const filteredAddresses = filterConfiguredIndexerAddresses(addresses);

    if (shouldSkipIndexerRequest(addresses)) {
      logIndexerSkip(
        hasIndexerApiKey()
          ? "No configured chain has a resolved address"
          : "EXPO_PUBLIC_WDK_INDEXER_API_KEY is not configured",
        addresses,
      );
      return {};
    }

    return resolveWalletBalances(enabledAssets, filteredAddresses);
  };

  service.resolveWalletTransactions = async (enabledAssets, addresses) => {
    const filteredAddresses = filterConfiguredIndexerAddresses(addresses);

    if (shouldSkipIndexerRequest(addresses)) {
      logIndexerSkip(
        hasIndexerApiKey()
          ? "No configured chain has a resolved address"
          : "EXPO_PUBLIC_WDK_INDEXER_API_KEY is not configured",
        addresses,
      );
      return emptyTransactionMap(enabledAssets);
    }

    return resolveWalletTransactions(enabledAssets, filteredAddresses);
  };

  service[installedFlag] = true;
}
