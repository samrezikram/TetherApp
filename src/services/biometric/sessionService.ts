import { AppState, type AppStateStatus } from "react-native";
import { env } from "@/infrastructure/env/env";
import type { SessionState } from "@/domain/security/types";

type Listener = (state: SessionState) => void;

const backgroundGraceMs = 30_000;
let sessionState: SessionState = { isUnlocked: false };
let backgroundedAt: number | undefined;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener(sessionState);
  }
}

export function getSessionState(): SessionState {
  return sessionState;
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function unlockSession(now = Date.now()): void {
  sessionState = {
    isUnlocked: true,
    lastActivityAt: now,
    unlockedAt: now,
  };
  notify();
}

export function touchSession(now = Date.now()): void {
  if (!sessionState.isUnlocked) {
    return;
  }

  sessionState = { ...sessionState, lastActivityAt: now };
  notify();
}

export function lockSession(): void {
  sessionState = { isUnlocked: false };
  notify();
}

export function isSessionExpired(now = Date.now()): boolean {
  if (!sessionState.isUnlocked || !sessionState.lastActivityAt) {
    return true;
  }

  return (
    now - sessionState.lastActivityAt >
    env.biometricTimeoutSeconds * 1000
  );
}

export function enforceSessionFreshness(now = Date.now()): void {
  if (isSessionExpired(now)) {
    lockSession();
    throw new Error("Secure session expired");
  }
}

export function bindAppStateSessionLock(): () => void {
  const subscription = AppState.addEventListener(
    "change",
    (nextState: AppStateStatus) => {
      if (nextState === "background" || nextState === "inactive") {
        backgroundedAt = Date.now();
        return;
      }

      if (
        nextState === "active" &&
        backgroundedAt &&
        Date.now() - backgroundedAt > backgroundGraceMs
      ) {
        lockSession();
      }
    },
  );

  return () => subscription.remove();
}
