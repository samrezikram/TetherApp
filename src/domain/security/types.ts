export type SecureSecretKey =
  | `wallet:${string}:mnemonic`
  | `wallet:${string}:metadata`
  | "session:unlock";

export type AuthenticationReason =
  | "unlock"
  | "sign"
  | "export"
  | "settings";

export type SessionState = {
  isUnlocked: boolean;
  unlockedAt?: number;
  lastActivityAt?: number;
};
