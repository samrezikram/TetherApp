# WDK Wallet Challenge Approach

## Summary

I approached the challenge as a production mobile wallet problem rather than a
screen-by-screen demo. The main priorities were:

- Keep custody-sensitive operations isolated from UI code.
- Use Expo development builds so native WDK dependencies, biometrics, camera,
  Keychain, BareKit, and EAS builds can coexist.
- Build a small but extensible feature structure for wallet management, receive,
  send, scanning, balances, and activity.
- Make security behavior explicit: biometric unlock, session timeout, encrypted
  local storage, redacted logging, and no seed phrases in AsyncStorage.

## AI Tools Used

I used OpenAI Codex as the coding assistant inside the local project workspace.
Codex was used for:

- Reading and navigating the codebase.
- Implementing React Native/TypeScript changes.
- Running local checks: TypeScript, ESLint, Jest, and Android packaging tasks.
- Reviewing error output from Android, Metro, WDK worklets, and indexer calls.
- Drafting documentation and summarizing architecture decisions.

I also used web/documentation lookup for current WDK guidance, especially:

- React Native quickstart:
  https://docs.wdk.tether.io/start-building/react-native-quickstart
- WDK core module usage:
  https://docs.wdk.tether.io/sdk/core-module/usage/getting-started
- Indexer API reference:
  https://docs.wdk.tether.io/tools/indexer-api/api-reference

All code decisions were reviewed against the project behavior locally rather
than blindly accepting generated code.

## How I Broke Down the Requirements

I divided the work into layers:

1. Foundation: Expo dev-client, TypeScript strict mode, navigation, WDK provider,
   Metro polyfills, app shell, and test tooling.
2. Security: biometric unlock, session timeout, Keychain-backed wallet secrets,
   certificate pinning setup, redacted logging, and secure-state separation.
3. Wallet lifecycle: create wallet, import wallet, multi-wallet registry,
   switching, deletion, and recovery phrase display.
4. Core wallet features: balances, receive QR/copy, QR scanner, send form, fee
   estimation, and transaction history.
5. Operational readiness: CI, EAS config, docs, stable dependency versions,
   Android build fixes, app icon, and splash/runtime loading states.

The implementation keeps reusable UI components under the design toolkit,
domain types under `src/domain`, WDK calls under `src/services/wdk`, and
environment/security infrastructure under `src/infrastructure`.

## Implementation Order

I started with the project scaffolding and native compatibility because WDK
depends on native modules and worklet bundling. After that I added the design
toolkit and navigation so feature screens had a consistent surface.

Next, I implemented wallet creation/import and secure storage. Once a wallet
could exist, I added receive, balances, scanner, send, and transaction activity.
I then hardened the flows through validation and user feedback:

- Scanner output now updates the existing send screen and infers network from
  address format when possible.
- Send fee estimation checks recipient, amount, wallet unlock state, resolved
  sender address, and available balance before calling WDK.
- Receive shows funding addresses by network so users know exactly what address
  to fund for balances/history.
- Wallet deletion now happens from the Wallet screen against a named wallet,
  instead of an ambiguous Settings delete action.
- Empty wallet state now asks the user to choose Create or Import; it no longer
  presents an active create form by default.

Finally, I added a runtime loading screen and native app icon/splash config for
a cleaner startup experience.

## Notable WDK Feedback

The documented `@tetherto/wdk-react-native-provider` path works, but it requires
careful version alignment between:

- `@tetherto/wdk-react-native-provider`
- `@tetherto/pear-wrk-wdk`
- BareKit/native addons
- Expo/RN/Gradle versions

The provider also statically imports some chain modules. In this project TON is
not configured, but Metro still encountered TON crypto imports during bundling.
I addressed this by limiting configured runtime networks and adding local Metro
shims for unused TON-only native imports. This kept Android builds moving
without adding old native dependencies that conflict with current Gradle.

The WDK Indexer model is straightforward once the address map is resolved:
balances and history are not local wallet state. They appear only after real
indexed transfers to the correct network address.

## Key Challenges

### 1. Native Build Compatibility

Several failures came from dependency/version mismatches rather than app logic:

- Expo modules and React Native versions had to be aligned.
- Deprecated native packages such as `expo-barcode-scanner` and
  `react-native-fast-pbkdf2` caused Android build failures.
- Bare worklet native addon resolution needed pinned compatible versions.

The solution was to avoid `latest`, pin exact versions, remove incompatible
native packages, use Expo Camera's current scanner API, and keep WDK worklet
imports isolated behind Metro configuration.

### 2. Wallet UX Around Empty State and Fee Estimation

A newly created wallet has no spendable balance, so fee estimation cannot
produce a meaningful quote. Initially that surfaced as a generic WDK error.

The fix was to make the send flow explain prerequisites before calling WDK:

- The wallet must be unlocked.
- The active network must have a resolved sender address.
- The recipient must be valid for that network.
- The wallet must have a positive balance for the asset/network.

This makes the product behavior easier to understand and prevents users from
thinking the scanner or fee estimator is broken when the wallet simply has not
been funded yet.

## Security Mindset

The security model is intentionally conservative:

- Recovery phrases are never stored in AsyncStorage.
- Per-wallet mnemonics are stored in Keychain with biometric/device-passcode
  protection.
- Unlocking the app does not automatically authorize signing.
- Signing requires fresh biometric authorization.
- Session timeout defaults to five minutes and backgrounding locks the app.
- Logs redact seed-like phrases, tokens, keys, and long secrets.
- Certificate pinning is wired for native builds and production requires pins.
- UI state is treated as public; secure wallet material stays behind services.

Important future hardening work:

- Complete iOS device testing.
- Finalize production certificate pins.
- Run send/receive on testnet or with controlled low-value mainnet funds.
- Add E2E coverage for create/import/delete/switch/send with Maestro.
- Add a formal threat model for backup, recovery, and device migration.

## Architecture and Performance Review

The current architecture is workable for a small wallet and has clear boundaries,
but a larger product should keep pushing toward narrower service contracts:

- `src/domain`: pure types and constants.
- `src/services`: side-effecting wallet/indexer/security integrations.
- `src/features`: screen-level orchestration and UI composition.
- `src/design-system` / `src/design-toolkit`: reusable UI primitives only.

Recent cleanup centralized wallet network constants in
`src/domain/wallet/constants.ts`. This reduces duplicated assumptions around
receive networks, default assets, QR schemes, and address validation.

Configuration is intentionally split by responsibility:

- `src/infrastructure/env/env.ts` validates public Expo environment values.
- `src/services/wdk/chains.ts` owns WDK chain/provider configuration.
- `src/services/wdk/wdkConfig.ts` composes the WDK runtime config.
- `src/domain/wallet/constants.ts` owns app-level network/default-asset rules.
- `src/infrastructure/api/certificatePinning.ts` enforces production pinning
  requirements.
- `src/services/secure-storage/keychainStorage.ts` enforces secure hardware in
  production and only allows software-backed fallback in development.

Performance considerations:

- Balance and transaction refreshes should remain explicit or debounced; avoid
  polling aggressively on mobile.
- QR parsing and validation are synchronous and cheap.
- WDK initialization is native/worklet-heavy, so the runtime splash is better UX
  than rendering an unfinished screen.
- Future large transaction lists should use virtualized lists instead of mapping
  every row into cards.

## Future Enhancements

Recommended next steps for a larger production wallet:

- Add a network/asset selector to Send instead of inferring everything.
- Add Sepolia/testnet config for safe fee/send testing.
- Move chain/indexer settings into a typed app config module with environment
  validation per app environment.
- Add transaction detail normalization so WDK/indexer records map into one app
  domain type.
- Add account abstraction/send-state telemetry without logging sensitive data.
- Add wallet backup verification, recovery phrase confirmation, and explicit
  "I saved my phrase" gating before allowing real usage.
- Add migration-safe storage versioning for wallet registry and settings.
- Add multi-account derivation support beyond account index `0`.

## Note on `wdk-react-native-core`

The challenge notes mention `@tetherto/wdk-react-native-core` as a newer
provider option and also mention that WDK can be integrated directly through
packages such as `@tetherto/wdk`, wallet modules, and indexer modules.

My current implementation follows the public React Native quickstart path using
`@tetherto/wdk-react-native-provider` because that is what the documentation
currently demonstrates for Expo/React Native integration. That provider gives a
high-level `WalletProvider` and `useWallet()` API, but it also brings BareKit
worklet complexity and some static chain imports.

For a production rebuild, I would evaluate two alternatives:

1. Migrate to `@tetherto/wdk-react-native-core` if it is the recommended
   successor. This may reduce provider-level friction while preserving a React
   Native provider/hook style.
2. Integrate `@tetherto/wdk` and only the needed wallet modules directly. This
   could reduce bundle surface area and avoid unused chain imports, but it would
   require the app to own more lifecycle, storage, and threading decisions.

I would make that migration only after a short spike comparing wallet creation,
address resolution, fee quotes, send, balances, indexer integration, Android
release build, and iOS device behavior.
