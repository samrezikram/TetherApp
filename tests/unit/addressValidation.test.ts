import {
  inferNetworkFromAddress,
  isValidAddress,
} from "@/services/wdk/addressValidation";

describe("address validation", () => {
  it("accepts EVM addresses for EVM networks", () => {
    expect(
      isValidAddress("ethereum", "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"),
    ).toBe(true);
  });

  it("rejects malformed EVM addresses", () => {
    expect(isValidAddress("polygon", "0x1234")).toBe(false);
  });

  it("accepts bitcoin bech32 addresses", () => {
    expect(
      isValidAddress(
        "bitcoin",
        "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
      ),
    ).toBe(true);
  });

  it("rejects empty addresses", () => {
    expect(isValidAddress("ethereum", " ")).toBe(false);
  });

  it("infers network from address format", () => {
    expect(
      inferNetworkFromAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"),
    ).toBe("ethereum");
    expect(
      inferNetworkFromAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080"),
    ).toBe("bitcoin");
    expect(inferNetworkFromAddress("not-an-address")).toBeNull();
  });
});
