import {
  filterConfiguredIndexerAddresses,
  getUnsupportedIndexerNetworks,
} from "@/services/wdk/wdkIndexerGuardUtils";

describe("wdkIndexerGuard", () => {
  it("keeps only configured chain addresses before calling WDK indexer", () => {
    expect(
      filterConfiguredIndexerAddresses({
        arbitrum: "0xunsupported",
        bitcoin: "bc1configured",
        ethereum: "0xconfigured",
        polygon: "0xconfigured",
        ton: "EQunsupported",
      }),
    ).toEqual({
      bitcoin: "bc1configured",
      ethereum: "0xconfigured",
      polygon: "0xconfigured",
    });
  });

  it("reports resolved networks that are not configured in this app", () => {
    expect(
      getUnsupportedIndexerNetworks({
        arbitrum: "0xunsupported",
        ethereum: "0xconfigured",
        ton: null,
      }),
    ).toEqual(["arbitrum"]);
  });
});
