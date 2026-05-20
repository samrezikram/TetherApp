import { parseQrPayload } from "@/services/qr/qrParser";

describe("parseQrPayload", () => {
  it("parses raw addresses", () => {
    expect(parseQrPayload("0xabc")).toEqual({ address: "0xabc" });
  });

  it("infers network for raw EVM addresses", () => {
    expect(
      parseQrPayload("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"),
    ).toEqual({
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      asset: "USDT",
      network: "ethereum",
    });
  });

  it("parses payment URI amount", () => {
    expect(parseQrPayload("ethereum:0xabc?amount=10")).toEqual({
      address: "0xabc",
      asset: "USDT",
      amount: "10",
      network: "ethereum",
    });
  });

  it("normalizes EIP-681 addresses with chain ids", () => {
    expect(parseQrPayload("ethereum:0xabc@1?amount=2")).toEqual({
      address: "0xabc",
      asset: "USDT",
      amount: "2",
      network: "ethereum",
    });
  });

  it("detects bitcoin payment URIs", () => {
    expect(parseQrPayload("bitcoin:bc1wallet?amount=0.001")).toEqual({
      address: "bc1wallet",
      amount: "0.001",
      asset: "BTC",
      network: "bitcoin",
    });
  });
});
