# Design Toolkit

The app UI should import reusable interface primitives from `src/design-toolkit`.

## Components

- `Alert`: inline status and validation messages with `info`, `success`, `warning`, and `error` variants.
- `Button`: command actions with `primary`, `secondary`, `outline`, `ghost`, and `destructive` variants.
- `Card`: framed repeated content blocks.
- `Input`: labeled text entry with error messaging.
- `Screen`: themed page container with optional scroll.
- `Text`: themed typography variants.
- `ErrorState`, `LoadingState`, `OfflineBanner`: reusable state surfaces.

The older `src/design-system` implementation remains as the internal compatibility layer while new code should use the `design-toolkit` exports.
