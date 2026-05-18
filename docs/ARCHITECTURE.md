# WDK Wallet Architecture

## Decision

This app uses Expo with a development build. WDK React Native support requires
native modules, BareKit worklets, Metro polyfills, and Android API 29+, while
Expo dev-client keeps native builds compatible with EAS and fast local Metro
iteration.

## Boundaries

- UI lives in `src/features` and `src/design-system`.
- WDK calls live under `src/services/wdk`.
- Indexer API calls live under `src/services/indexer`.
- Secrets live behind `src/services/secure-storage`.
- Session and biometric checks live under `src/services/biometric`.
- Domain contracts live under `src/domain`.

Screens may use WDK provider hooks for public wallet state, but signing and fee
flows go through app-owned service functions so validation, session freshness,
and biometric authorization are enforced in one place.

## Security Model

- Sensitive storage uses `react-native-keychain`.
- App unlock does not authorize signing by itself.
- Transaction signing requires a fresh secure session and biometric prompt.
- Inactivity locks the app after `EXPO_PUBLIC_BIOMETRIC_TIMEOUT`, defaulting to
  five minutes.
- Backgrounding longer than 30 seconds locks the app.
- Logger redacts mnemonic-like strings, keys, tokens, and 32-byte hex secrets.
- Direct `console.*` calls are blocked in `src` except the logger.

## Git Workflow

- `main` is production.
- `develop` is integration.
- `feature/*` branches contain one logical feature.
- Commits use Conventional Commits, for example
  `feat(wallet): create wallet flow`.
- Before merging, rebase onto `develop`, squash to one logical PR commit, and
  push the feature branch with lease.

## PR Checklist

- Feature description
- Screenshots or screen recordings
- Test coverage summary
- Security checklist
- WDK integration notes
- CI passing
