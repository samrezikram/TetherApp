import { z } from "zod";

const booleanString = z
  .string()
  .default("false")
  .transform((value) => value === "true");

const numberString = z
  .string()
  .default("300")
  .transform((value) => Number(value))
  .pipe(z.number().int().positive());

const EnvSchema = z.object({
  appEnv: z
    .enum(["development", "preview", "production", "test"])
    .default("production"),
  biometricTimeoutSeconds: numberString,
  enableTestnet: booleanString,
  ethRpcUrl: z.string().url().optional(),
  indexerApiKey: z.string().min(1).optional(),
  indexerBaseUrl: z.string().url().default("https://wdk-api.tether.io"),
  indexerPinOne: z.string().min(1).optional(),
  indexerPinTwo: z.string().min(1).optional(),
  tronApiKey: z.string().optional(),
  tronApiSecret: z.string().optional(),
});

export const env = EnvSchema.parse({
  appEnv: process.env.EXPO_PUBLIC_APP_ENV,
  biometricTimeoutSeconds: process.env.EXPO_PUBLIC_BIOMETRIC_TIMEOUT,
  enableTestnet: process.env.EXPO_PUBLIC_ENABLE_TESTNET,
  ethRpcUrl: process.env.EXPO_PUBLIC_ETH_RPC_URL,
  indexerApiKey: process.env.EXPO_PUBLIC_WDK_INDEXER_API_KEY,
  indexerBaseUrl: process.env.EXPO_PUBLIC_WDK_INDEXER_BASE_URL,
  indexerPinOne: process.env.EXPO_PUBLIC_WDK_INDEXER_PIN_1,
  indexerPinTwo: process.env.EXPO_PUBLIC_WDK_INDEXER_PIN_2,
  tronApiKey: process.env.EXPO_PUBLIC_TRON_API_KEY,
  tronApiSecret: process.env.EXPO_PUBLIC_TRON_API_SECRET,
});

export type AppEnv = typeof env;
