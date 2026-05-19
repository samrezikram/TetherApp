# Funding Wallets

Balances and transaction history are not local state in this app. They come from
the WDK Indexer API after an on-chain transfer reaches one of this wallet's
receive addresses.

## Current Funding Path

1. Open the app and unlock the wallet.
2. Open Receive.
3. Copy the address for the exact network you want to fund.
4. Send the matching token to that address:
   - Ethereum: USDT on Ethereum mainnet.
   - Polygon: USDT on Polygon.
   - Bitcoin: BTC.
5. Wait for the transfer to be indexed.
6. Tap Refresh Balances on Wallet.
7. Tap Refresh on Activity.

## Important

Do not send funds to the wrong network. For example, Polygon USDT sent to an
Ethereum address on the Ethereum receive row will not produce the expected
Ethereum USDT balance.

For development without mainnet funds, add a Sepolia WDK chain configuration and
use a Sepolia USDT faucet supported by the WDK quickstart.
