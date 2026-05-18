jest.mock("@/infrastructure/env/env", () => ({
  env: {
    appEnv: "test",
    biometricTimeoutSeconds: 300,
    enableTestnet: false,
    indexerBaseUrl: "https://wdk-api.tether.io",
  },
}));

jest.mock("expo-local-authentication", () => ({
  authenticateAsync: jest.fn(async () => ({ success: true })),
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
}));

jest.mock("react-native-keychain", () => {
  const store = new Map<string, string>();

  return {
    ACCESSIBLE: {
      WHEN_UNLOCKED_THIS_DEVICE_ONLY: "WHEN_UNLOCKED_THIS_DEVICE_ONLY",
    },
    ACCESS_CONTROL: {
      BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE:
        "BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE",
      DEVICE_PASSCODE: "DEVICE_PASSCODE",
    },
    SECURITY_LEVEL: {
      SECURE_HARDWARE: "SECURE_HARDWARE",
    },
    getGenericPassword: jest.fn(async ({ service }: { service: string }) => {
      const password = store.get(service);
      return password ? { password, username: service } : false;
    }),
    hasGenericPassword: jest.fn(async ({ service }: { service: string }) =>
      store.has(service),
    ),
    resetGenericPassword: jest.fn(async ({ service }: { service: string }) => {
      store.delete(service);
      return true;
    }),
    setGenericPassword: jest.fn(
      async (
        username: string,
        password: string,
        { service }: { service: string },
      ) => {
        store.set(service, password);
        return { service, storage: "MOCK", username };
      },
    ),
  };
});
