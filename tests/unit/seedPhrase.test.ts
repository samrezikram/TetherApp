import {
  generateSeedPhrase,
  getSeedPhraseWordCount,
  normalizeSeedPhrase,
  validateSeedPhrase,
} from "@/services/wallets/seedPhrase";

describe("seedPhrase", () => {
  it("generates 12 and 24 word phrases", () => {
    expect(getSeedPhraseWordCount(generateSeedPhrase(12))).toBe(12);
    expect(getSeedPhraseWordCount(generateSeedPhrase(24))).toBe(24);
  });

  it("normalizes spacing and case", () => {
    expect(normalizeSeedPhrase("  Abandon   ABOUT ")).toBe("abandon about");
  });

  it("validates BIP39 phrases", () => {
    expect(
      validateSeedPhrase(
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
      ),
    ).toBe(true);
    expect(validateSeedPhrase("abandon abandon invalid")).toBe(false);
  });
});
