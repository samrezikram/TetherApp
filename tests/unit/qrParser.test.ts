import { parseQrPayload } from "@/services/qr/qrParser";

describe("parseQrPayload", () => {
  it("parses raw addresses", () => {
    expect(parseQrPayload("0xabc")).toEqual({ address: "0xabc" });
  });

  it("parses payment URI amount", () => {
    expect(parseQrPayload("ethereum:0xabc?amount=10")).toEqual({
      address: "0xabc",
      amount: "10",
    });
  });
});
