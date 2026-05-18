import { env } from "@/infrastructure/env/env";

export const CHAINS_CONFIG = {
  ethereum: {
    blockchain: "ethereum",
    bundlerUrl: "https://api.candide.dev/public/v3/ethereum",
    chainId: 1,
    entrypointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
    paymasterAddress: "0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba",
    paymasterToken: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    paymasterUrl: "https://api.candide.dev/public/v3/ethereum",
    provider: env.ethRpcUrl,
    transferMaxFee: 5_000_000,
  },
  polygon: {
    blockchain: "polygon",
    bundlerUrl: "https://api.candide.dev/public/v3/polygon",
    chainId: 137,
    entrypointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
    paymasterAddress: "0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba",
    paymasterToken: {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    paymasterUrl: "https://api.candide.dev/public/v3/polygon",
    safeModulesVersion: "0.3.0",
    transferMaxFee: 5_000_000,
  },
  bitcoin: {
    host: "api.ordimint.com",
    port: 50001,
  },
  sepolia: {
    blockchain: "sepolia",
    bundlerUrl: "https://api.candide.dev/public/v3/sepolia",
    chainId: 11155111,
    entrypointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
    paymasterUrl: "https://api.candide.dev/public/v3/sepolia",
    transferMaxFee: 5_000_000,
  },
} as const;
