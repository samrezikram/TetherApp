import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteRegisteredWallet,
  getActiveWalletId,
  listRegisteredWallets,
  upsertRegisteredWallet,
} from "@/services/wallets/walletRegistry";

jest.mock("@react-native-async-storage/async-storage", () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    removeItem: jest.fn(async (key: string) => {
      store.delete(key);
    }),
    setItem: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
  };
});

describe("walletRegistry", () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem("wallet_registry:v1");
    await AsyncStorage.removeItem("wallet_registry:active:v1");
  });

  it("stores wallet metadata and active wallet id", async () => {
    await upsertRegisteredWallet({
      activeAccountIndex: 0,
      createdAt: "2026-05-18T00:00:00.000Z",
      id: "wallet_1",
      imported: false,
      name: "Main",
    });

    await expect(listRegisteredWallets()).resolves.toHaveLength(1);
    await expect(getActiveWalletId()).resolves.toBe("wallet_1");
  });

  it("deletes wallets and clears active id", async () => {
    await upsertRegisteredWallet({
      activeAccountIndex: 0,
      createdAt: "2026-05-18T00:00:00.000Z",
      id: "wallet_1",
      imported: false,
      name: "Main",
    });

    await deleteRegisteredWallet("wallet_1");

    await expect(listRegisteredWallets()).resolves.toHaveLength(0);
    await expect(getActiveWalletId()).resolves.toBeNull();
  });
});
