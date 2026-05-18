import { initializeSslPinning } from "react-native-ssl-public-key-pinning";
import { env } from "@/infrastructure/env/env";

let initialized = false;

export async function initializeCertificatePinning(): Promise<void> {
  if (initialized) {
    return;
  }

  const host = new URL(env.indexerBaseUrl).host;
  const publicKeyHashes = [env.indexerPinOne, env.indexerPinTwo].filter(
    (value): value is string => Boolean(value),
  );

  if (publicKeyHashes.length < 2) {
    if (env.appEnv === "production") {
      throw new Error("Production certificate pinning requires two public key hashes");
    }
    return;
  }

  await initializeSslPinning({
    [host]: {
      publicKeyHashes,
    },
  });

  initialized = true;
}
