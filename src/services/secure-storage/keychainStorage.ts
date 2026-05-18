import * as Keychain from "react-native-keychain";
import type { SecureSecretKey } from "@/domain/security/types";

const servicePrefix = "com.tetherapp.wdkwallet";

type SecretOptions = {
  requireBiometry?: boolean;
};

function accessControl(requireBiometry: boolean) {
  return requireBiometry
    ? Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE
    : Keychain.ACCESS_CONTROL.DEVICE_PASSCODE;
}

export async function storeSecret(
  key: SecureSecretKey,
  value: string,
  options: SecretOptions = {},
): Promise<void> {
  await Keychain.setGenericPassword(key, value, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl: accessControl(options.requireBiometry ?? true),
    authenticationPrompt: {
      title: "Authenticate to save wallet data",
    },
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    service: `${servicePrefix}.${key}`,
  });
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
