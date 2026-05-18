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
  const map: Record<SendDraft["network"], NetworkType> = {
    arbitrum: NetworkType.ARBITRUM,
    bitcoin: NetworkType.BITCOIN,
    ethereum: NetworkType.ETHEREUM,
    polygon: NetworkType.POLYGON,
    sepolia: NetworkType.SEPOLIA,
    ton: NetworkType.TON,
    tron: NetworkType.TRON,
  };

  return map[network];
}

function toAssetTicker(asset: SendDraft["asset"]) {
  const map: Record<SendDraft["asset"], AssetTicker> = {
    BTC: AssetTicker.BTC,
    ETH: AssetTicker.ETH,
    USDT: AssetTicker.USDT,
    XAUT: AssetTicker.XAUT,
  };

  return map[asset];
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
