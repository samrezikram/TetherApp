# WDK Wallet App

Production-oriented self-custodial crypto wallet built with Expo Dev Client,
React Native, TypeScript, and Tether WDK.

The app supports biometric unlock, wallet creation/import, multi-wallet
management, receive QR/copy, QR scanning, send preparation with fee checks,
balance views, and WDK Indexer transaction history.

The UI follows the device light/dark appearance and uses Tether-green primary
and success states through centralized design tokens.

## Purpose

This project demonstrates how to build a secure mobile wallet around WDK while
keeping custody-sensitive behavior out of the UI layer. The current build has
been verified on Android and iOS. Production WDK credentials, real chain
funding, and controlled send testing are still required before release.

## Demo Videos

| iOS | Android |
| --- | --- |
| [Watch iOS demo](docs/media/iOSWDKWalletRec.mp4) | [Watch Android demo](docs/media/androidWDKWalletRec.mp4) |

## Environment Lock

Use the same versions as the development machine. `npm install` is blocked when
Node does not match because `.npmrc` enables `engine-strict`.

| Tool | Required |
| --- | --- |
| Node.js | `22.17.1` |
| npm | `10.9.2` |
| Java/JDK | `21.0.1` |
| CocoaPods | `1.16.2` |
| Xcode | `26.5` |

These versions are the known working mobile toolchain for the verified Android
and iOS builds.

Check your machine:

```sh
nvm use
npm run env:check
```

Android requires Android Studio plus a configured SDK/emulator. iOS requires
macOS, Xcode, and CocoaPods.

## Environment Variables

Create `.env` from `.env.example`:

```sh
cp .env.example .env
```

Required for production/indexer-backed behavior:

```txt
EXPO_PUBLIC_WDK_INDEXER_BASE_URL=https://wdk-api.tether.io
EXPO_PUBLIC_WDK_INDEXER_API_KEY=
EXPO_PUBLIC_WDK_INDEXER_PIN_1=
EXPO_PUBLIC_WDK_INDEXER_PIN_2=
EXPO_PUBLIC_ETH_RPC_URL=
EXPO_PUBLIC_TRON_API_KEY=
EXPO_PUBLIC_TRON_API_SECRET=
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_BIOMETRIC_TIMEOUT=300
EXPO_PUBLIC_ENABLE_TESTNET=false
```

You must get the WDK Indexer API key from the WDK/Tether developer platform.
Production builds require two valid public-key pins for the indexer host.

## Installation

```sh
nvm use
npm install
npm run env:check
```

Generate native projects when needed:

```sh
npm run prebuild -- --clean
```

Install iOS pods:

```sh
cd ios
pod install
cd ..
```

## Run

Start Metro for the development client:

```sh
npm start
```

Run Android:

```sh
npm run android
```

Run iOS:

```sh
npm run ios
```

Build release artifacts with EAS:

```sh
npm run eas:build:android
npm run eas:build:ios
```

## Quality Gates

Run before pushing:

```sh
npm run typecheck
npm run lint
npm test -- --runInBand
```

Coverage:

```sh
npm run test:coverage
```

## Architecture Summary

- `src/app`: providers, navigation, bootstrap/runtime setup.
- `src/design-system`: reusable UI toolkit exports.
- `src/features`: screen-level wallet, receive, send, scanner, auth, and
  transaction flows.
- `src/domain`: pure wallet/security/transaction types and constants.
- `src/services`: WDK, indexer, fees, QR, biometric, and secure storage logic.
- `src/infrastructure`: environment validation, logging, API security.

WDK integration is intentionally isolated under `src/services/wdk` and app
providers. UI screens do not handle private keys directly.

## Security Notes

- Recovery phrases are not stored in AsyncStorage.
- Wallet secrets use `react-native-keychain`.
- Production requires secure hardware backed storage.
- Development can fall back to software-backed storage for emulators.
- Biometric unlock and session timeout protect wallet access.
- Signing requires fresh authorization.
- Logs redact mnemonic-like strings, private keys, bearer tokens, and long
  secrets.
- Certificate pinning is configured and enforced in production.

## WDK Notes

The current implementation follows the documented
`@tetherto/wdk-react-native-provider` path. The challenge notes also recommend
evaluating `@tetherto/wdk-react-native-core` as a newer provider, or integrating
`@tetherto/wdk` plus only required wallet modules directly.

For a production rebuild, run a short spike comparing:

- wallet creation/import
- address resolution
- fee estimation
- send flow
- indexer balances/history
- Android release build
- iOS release behavior

That migration may reduce unused chain imports and Bare thread complexity.
