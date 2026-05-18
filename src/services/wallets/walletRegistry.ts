import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WalletSummary } from "@/domain/wallet/types";

const WALLET_REGISTRY_KEY = "wallet_registry:v1";
const ACTIVE_WALLET_KEY = "wallet_registry:active:v1";

export async function listRegisteredWallets(): Promise<WalletSummary[]> {
  const raw = await AsyncStorage.getItem(WALLET_REGISTRY_KEY);
  return raw ? (JSON.parse(raw) as WalletSummary[]) : [];
}

export async function getRegisteredWallet(
  walletId: string,
): Promise<WalletSummary | undefined> {
  const wallets = await listRegisteredWallets();
  return wallets.find((wallet) => wallet.id === walletId);
}

export async function upsertRegisteredWallet(
  wallet: WalletSummary,
): Promise<WalletSummary[]> {
  const wallets = await listRegisteredWallets();
  const next = [
    wallet,
    ...wallets.filter((current) => current.id !== wallet.id),
  ];
  await AsyncStorage.setItem(WALLET_REGISTRY_KEY, JSON.stringify(next));
  await AsyncStorage.setItem(ACTIVE_WALLET_KEY, wallet.id);
  return next;
}

export async function deleteRegisteredWallet(
  walletId: string,
): Promise<WalletSummary[]> {
  const wallets = await listRegisteredWallets();
  const next = wallets.filter((wallet) => wallet.id !== walletId);
  await AsyncStorage.setItem(WALLET_REGISTRY_KEY, JSON.stringify(next));

  const activeWalletId = await getActiveWalletId();
  if (activeWalletId === walletId) {
    if (next[0]) {
      await AsyncStorage.setItem(ACTIVE_WALLET_KEY, next[0].id);
    } else {
      await AsyncStorage.removeItem(ACTIVE_WALLET_KEY);
    }
  }

  return next;
}

export async function getActiveWalletId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_WALLET_KEY);
}

export async function setActiveWalletId(walletId: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_WALLET_KEY, walletId);
}

export function createWalletId(): string {
  return `wallet_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
