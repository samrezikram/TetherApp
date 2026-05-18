import {
  deleteSecret,
  getSecret,
  hasSecret,
  storeSecret,
} from "@/services/secure-storage/keychainStorage";

describe("keychainStorage", () => {
  const key = "session:unlock" as const;

  it("stores, reads, checks, and deletes secrets through keychain", async () => {
    await storeSecret(key, "secure");
    await expect(hasSecret(key)).resolves.toBe(true);
    await expect(getSecret(key)).resolves.toBe("secure");
    await deleteSecret(key);
    await expect(hasSecret(key)).resolves.toBe(false);
  });
});
