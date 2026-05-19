import { parseQrPayload } from "@/services/qr/qrParser";

describe("parseQrPayload", () => {
  it("parses raw addresses", () => {
    expect(parseQrPayload("0xabc")).toEqual({ address: "0xabc" });
  });

  it("parses payment URI amount", () => {
    expect(parseQrPayload("ethereum:0xabc?amount=10")).toEqual({
      address: "0xabc",
      amount: "10",
      network: "ethereum",
    });
  });

  it("normalizes EIP-681 addresses with chain ids", () => {
    expect(parseQrPayload("ethereum:0xabc@1?amount=2")).toEqual({
      address: "0xabc",
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
