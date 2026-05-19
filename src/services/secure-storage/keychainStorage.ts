import * as Keychain from "react-native-keychain";
import type { SecureSecretKey } from "@/domain/security/types";
import { env } from "@/infrastructure/env/env";
import { logger } from "@/infrastructure/logging/logger";

const servicePrefix = "com.tetherapp.wdkwallet";

type SecretOptions = {
  requireBiometry?: boolean;
};

function accessControl(requireBiometry: boolean) {
  return requireBiometry
    ? Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE
    : Keychain.ACCESS_CONTROL.DEVICE_PASSCODE;
}

function shouldAllowSoftwareBackedStorage(error: unknown) {
  if (env.appEnv === "production") {
    return false;
  }

  const message = error instanceof Error ? error.message : String(error);
  return /required security guarantees|secure hardware|crypto/i.test(message);
}

function storageOptions(
  key: SecureSecretKey,
  options: SecretOptions,
  securityLevel: Keychain.SECURITY_LEVEL,
) {
  return {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl: accessControl(options.requireBiometry ?? true),
    authenticationPrompt: {
      title: "Authenticate to save wallet data",
    },
    securityLevel,
    service: `${servicePrefix}.${key}`,
  };
}

export async function storeSecret(
  key: SecureSecretKey,
  value: string,
  options: SecretOptions = {},
): Promise<void> {
  try {
    await Keychain.setGenericPassword(
      key,
      value,
      storageOptions(key, options, Keychain.SECURITY_LEVEL.SECURE_HARDWARE),
    );
  } catch (error) {
    if (!shouldAllowSoftwareBackedStorage(error)) {
      throw error;
    }

    logger.warn(
      "Secure hardware keychain unavailable; using software-backed storage for development",
      error,
    );
    await Keychain.setGenericPassword(
      key,
      value,
      storageOptions(key, options, Keychain.SECURITY_LEVEL.SECURE_SOFTWARE),
    );
  }
}

export async function getSecret(
  key: SecureSecretKey,
  options: SecretOptions = {},
): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    accessControl: accessControl(options.requireBiometry ?? true),
    authenticationPrompt: {
      title: "Authenticate to unlock wallet",
    },
    service: `${servicePrefix}.${key}`,
  });

  return credentials ? credentials.password : null;
}

export async function deleteSecret(key: SecureSecretKey): Promise<void> {
  await Keychain.resetGenericPassword({ service: `${servicePrefix}.${key}` });
}

export async function hasSecret(key: SecureSecretKey): Promise<boolean> {
  return Keychain.hasGenericPassword({ service: `${servicePrefix}.${key}` });
}
