import { initializeCertificatePinning } from "@/infrastructure/api/certificatePinning";

jest.mock("react-native-ssl-public-key-pinning", () => ({
  initializeSslPinning: jest.fn(async () => undefined),
}));

describe("initializeCertificatePinning", () => {
  it("skips pinning outside production when pins are not configured", async () => {
    await expect(initializeCertificatePinning()).resolves.toBeUndefined();
  });
});
