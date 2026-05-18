declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_APP_ENV?: "development" | "preview" | "production" | "test";
    EXPO_PUBLIC_BIOMETRIC_TIMEOUT?: string;
    EXPO_PUBLIC_ENABLE_TESTNET?: string;
    EXPO_PUBLIC_ETH_RPC_URL?: string;
    EXPO_PUBLIC_TRON_API_KEY?: string;
    EXPO_PUBLIC_TRON_API_SECRET?: string;
    EXPO_PUBLIC_WDK_INDEXER_API_KEY?: string;
    EXPO_PUBLIC_WDK_INDEXER_BASE_URL?: string;
  }
}
