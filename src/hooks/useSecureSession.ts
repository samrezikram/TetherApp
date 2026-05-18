import { useEffect, useState } from "react";
import {
  getSessionState,
  subscribeSession,
  unlockSession,
} from "@/services/biometric/sessionService";
import { requireBiometric } from "@/services/biometric/biometricService";

export function useSecureSession() {
  const [session, setSession] = useState(getSessionState());

  useEffect(() => subscribeSession(setSession), []);

  async function unlock() {
    await requireBiometric("unlock");
    unlockSession();
  }

  return {
    isUnlocked: session.isUnlocked,
    unlock,
  };
}
