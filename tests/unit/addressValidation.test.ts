import { isValidAddress } from "@/services/wdk/addressValidation";

describe("address validation", () => {
  it("accepts EVM addresses for EVM networks", () => {
    expect(
      isValidAddress("ethereum", "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"),
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
});
