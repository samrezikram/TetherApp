import * as bip39 from "bip39";

export type SeedPhraseLength = 12 | 24;

const strengthByLength: Record<SeedPhraseLength, number> = {
  12: 128,
  24: 256,
};

export function generateSeedPhrase(length: SeedPhraseLength): string {
  return bip39.generateMnemonic(strengthByLength[length]);
}

export function normalizeSeedPhrase(seedPhrase: string): string {
  return seedPhrase.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateSeedPhrase(seedPhrase: string): boolean {
  return bip39.validateMnemonic(normalizeSeedPhrase(seedPhrase));
}

export function getSeedPhraseWordCount(seedPhrase: string): number {
  const normalized = normalizeSeedPhrase(seedPhrase);
  return normalized.length === 0 ? 0 : normalized.split(" ").length;
}
