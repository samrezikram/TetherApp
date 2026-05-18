import {
  AssetTicker,
  NetworkType,
  WDKService,
} from "@tetherto/wdk-react-native-provider";
import type { SendDraft } from "@/domain/transaction/types";
import { requireBiometric } from "@/services/biometric/biometricService";
import { enforceSessionFreshness, touchSession } from "@/services/biometric/sessionService";
import { validateAddressOrThrow } from "@/services/wdk/addressValidation";

function toNetworkType(network: SendDraft["network"]) {
  const map: Partial<Record<SendDraft["network"], NetworkType>> = {
    arbitrum: NetworkType.ARBITRUM,
    bitcoin: NetworkType.SEGWIT,
    ethereum: NetworkType.ETHEREUM,
    polygon: NetworkType.POLYGON,
    ton: NetworkType.TON,
    tron: NetworkType.TRON,
  };

  const networkType = map[network];
  if (!networkType) {
    throw new Error(`Unsupported WDK network: ${network}`);
  }

  return networkType;
}

function toAssetTicker(asset: SendDraft["asset"]) {
  const map: Partial<Record<SendDraft["asset"], AssetTicker>> = {
    BTC: AssetTicker.BTC,
    USDT: AssetTicker.USDT,
    XAUT: AssetTicker.XAUT,
  };

  const assetTicker = map[asset];
  if (!assetTicker) {
    throw new Error(`Unsupported WDK asset: ${asset}`);
  }

  return assetTicker;
}

export async function quoteSend(draft: SendDraft) {
  validateAddressOrThrow(draft.network, draft.recipient);
  enforceSessionFreshness();
  touchSession();

  return WDKService.quoteSendByNetwork(
    toNetworkType(draft.network),
    draft.accountIndex,
    Number(draft.amount),
    draft.recipient,
    toAssetTicker(draft.asset),
  );
}

export async function sendTransaction(draft: SendDraft) {
  validateAddressOrThrow(draft.network, draft.recipient);
  enforceSessionFreshness();
  await requireBiometric("sign");
  touchSession();

  return WDKService.sendByNetwork(
    toNetworkType(draft.network),
    draft.accountIndex,
    Number(draft.amount),
    draft.recipient,
    toAssetTicker(draft.asset),
  );
}
