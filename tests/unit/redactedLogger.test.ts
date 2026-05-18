import { redactSecrets } from "@/infrastructure/logging/logger";

describe("redactSecrets", () => {
  it("redacts mnemonic-like strings", () => {
    const text =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    expect(redactSecrets(text)).toBe("[REDACTED]");
  });

  it("redacts sensitive object keys", () => {
    expect(redactSecrets({ mnemonic: "secret words", ok: true })).toContain(
      "[REDACTED]",
    );
  });
});
