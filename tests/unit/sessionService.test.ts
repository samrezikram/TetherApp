import {
  enforceSessionFreshness,
  getSessionState,
  isSessionExpired,
  lockSession,
  unlockSession,
} from "@/services/biometric/sessionService";

describe("sessionService", () => {
  afterEach(() => {
    lockSession();
  });

  it("unlocks and locks session", () => {
    unlockSession(1000);
    expect(getSessionState().isUnlocked).toBe(true);

    lockSession();
    expect(getSessionState().isUnlocked).toBe(false);
  });

  it("expires stale sessions", () => {
    unlockSession(1000);
    expect(isSessionExpired(302_000)).toBe(true);
  });

  it("throws when freshness is expired", () => {
    expect(() => enforceSessionFreshness(1000)).toThrow("Secure session expired");
  });
});
