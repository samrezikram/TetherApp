# Delivery Checklist

- Expo dev-client configured.
- TypeScript strict mode enabled.
- WDK Metro polyfills configured.
- Android min SDK set to 29.
- WDK provider mounted at the app root.
- Design-system tokens and base components implemented.
- Wallet creation, unlock, balance refresh, receive, send, scanner, and activity
  screens scaffolded.
- Wallet import and app-level wallet switching are implemented.
- Send flow includes recipient, amount, review, and result states.
- Transaction history groups indexer-backed WDK records and links to details.
- WDK service layer validates recipient addresses before quote or send.
- Signing path enforces secure session and biometric authentication.
- Keychain storage wrapper implemented.
- Certificate pinning initialization implemented for native builds.
- Logger redaction implemented.
- Unit tests cover address validation, QR parsing, session timeout, keychain
  facade, redaction, seed phrase validation, wallet registry, send validation,
  and certificate pinning setup.
- GitHub Actions run lint, typecheck, coverage, secret scan, and production EAS
  builds from `main`.
