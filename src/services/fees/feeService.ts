import type { SendDraft } from "@/domain/transaction/types";
import { quoteSend } from "@/services/wdk/wdkService";

export async function estimateSendFee(draft: SendDraft) {
  return quoteSend(draft);
}
