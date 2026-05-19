import { CHAINS_CONFIG } from "@/services/wdk/chains";

export type WdkAddressMap = Partial<Record<string, string | null | undefined>>;

const supportedIndexerNetworks = new Set(Object.keys(CHAINS_CONFIG));

export function getSupportedIndexerNetworks() {
  return Array.from(supportedIndexerNetworks);
}

export function isConfiguredIndexerNetwork(network: string) {
  return supportedIndexerNetworks.has(network);
}

export function filterConfiguredIndexerAddresses(addresses: WdkAddressMap) {
  return Object.entries(addresses).reduce<WdkAddressMap>(
    (filteredAddresses, [network, address]) => {
      if (address && supportedIndexerNetworks.has(network)) {
        filteredAddresses[network] = address;
      }

      return filteredAddresses;
    },
    {},
  );
}

export function getUnsupportedIndexerNetworks(addresses: WdkAddressMap) {
  return Object.keys(addresses).filter(
    (network) => addresses[network] && !supportedIndexerNetworks.has(network),
  );
}
