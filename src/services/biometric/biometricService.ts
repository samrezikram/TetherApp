import * as LocalAuthentication from "expo-local-authentication";
import type { AuthenticationReason } from "@/domain/security/types";

const reasonText: Record<AuthenticationReason, string> = {
  export: "Authenticate to reveal your recovery phrase.",
  settings: "Authenticate to change wallet security settings.",
  sign: "Authenticate to sign this transaction.",
  unlock: "Authenticate to unlock your wallet.",
};

export async function isBiometricAvailable(): Promise<boolean> {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);

  return hasHardware && isEnrolled;
}

export async function requireBiometric(
  reason: AuthenticationReason,
): Promise<void> {
  const result = await LocalAuthentication.authenticateAsync({
    biometricsSecurityLevel: "strong",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
    promptMessage: reasonText[reason],
    requireConfirmation: true,
  });

  if (!result.success) {
    throw new Error("Biometric authentication failed");
  }
}
