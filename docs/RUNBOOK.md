# Runbook

## Local Runtime

Use Node `22.17.1`.

```bash
nvm use
npm install
npm run typecheck
npm run lint
npm test -- --runInBand
npm run start
```

## Certificate Pins

Production requires two base64-encoded SHA-256 SPKI public key hashes:

```bash
EXPO_PUBLIC_WDK_INDEXER_PIN_1=
EXPO_PUBLIC_WDK_INDEXER_PIN_2=
```

TrustKit on iOS requires backup pins, so one pin is intentionally not enough.

## Git

Use feature branches from `develop`, conventional commits, and squash the branch
to one logical PR commit before merging.
