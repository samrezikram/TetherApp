import { validateSendDraft } from "@/features/send/sendValidation";

describe("validateSendDraft", () => {
  it("accepts a valid send draft", () => {
    expect(
      validateSendDraft({
        accountIndex: 0,
        amount: "1.5",
        asset: "USDT",
        network: "ethereum",
        recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      }).valid,
    ).toBe(true);
  });

  it("rejects invalid recipient and amount", () => {
    const result = validateSendDraft({
      accountIndex: 0,
      amount: "0",
      asset: "USDT",
      network: "ethereum",
      recipient: "bad",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.recipient).toBeDefined();
    expect(result.errors.amount).toBeDefined();
  });
});
