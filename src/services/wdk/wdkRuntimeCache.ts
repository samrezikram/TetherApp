import AsyncStorage from "@react-native-async-storage/async-storage";

const WDK_RUNTIME_CACHE_KEYS = [
  "wdk_wallet_addresses",
  "wdk_wallet_balances",
  "wdk_wallet_transactions",
] as const;

export async function clearWdkRuntimeCaches() {
  await AsyncStorage.multiRemove([...WDK_RUNTIME_CACHE_KEYS]);
}
