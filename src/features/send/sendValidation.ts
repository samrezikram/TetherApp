import type { SendDraft } from "@/domain/transaction/types";
import { isValidAddress } from "@/services/wdk/addressValidation";

export type SendValidation = {
  errors: Partial<Record<keyof SendDraft, string>>;
  valid: boolean;
};

export function validateSendDraft(draft: SendDraft): SendValidation {
  const errors: SendValidation["errors"] = {};
  const numericAmount = Number(draft.amount);

  if (!isValidAddress(draft.network, draft.recipient)) {
    errors.recipient = "Enter a valid recipient address.";
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    errors.amount = "Enter an amount greater than zero.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
