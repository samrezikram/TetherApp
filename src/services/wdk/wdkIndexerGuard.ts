import {
  AssetBalanceMap,
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
    resolveWalletBalances: ResolveBalances;
    resolveWalletTransactions: ResolveTransactions;
  };

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
