import React, { useEffect, useMemo, useState } from "react";
import { Alert as NativeAlert, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import type { RootStackParamList } from "@/app/navigation/types";
import { Alert, Button, Card, Input, Screen, Text } from "@/design-system";
import type { SendDraft } from "@/domain/transaction/types";
import type { AssetTickerId, NetworkTypeId } from "@/domain/wallet/types";
import { estimateSendFee } from "@/services/fees/feeService";
import { sendTransaction } from "@/services/wdk/wdkService";
import { logger } from "@/infrastructure/logging/logger";
import { validateSendDraft } from "@/features/send/sendValidation";

type RouteParams = {
  asset?: AssetTickerId;
  amount?: string;
  network?: NetworkTypeId;
  recipient?: string;
  scannedAt?: number;
};

type SendStep = "recipient" | "amount" | "review" | "result";

function getDefaultAsset(network: NetworkTypeId): AssetTickerId {
  return network === "bitcoin" ? "BTC" : "USDT";
}

function formatFee(value: unknown, asset: AssetTickerId) {
  if (typeof value === "number") {
    return `${value.toFixed(8).replace(/\.?0+$/, "")} ${asset}`;
  }

  if (
    value &&
    typeof value === "object" &&
    "fee" in value &&
    typeof value.fee === "string"
  ) {
    return `${value.fee} ${asset}`;
  }

  return JSON.stringify(value);
}

function getErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Insufficient balance")) {
    return "This wallet does not have enough spendable balance to quote this transfer.";
  }

  if (message.includes("WDK Manager not initialized")) {
    return "Wallet engine is still starting. Unlock the wallet and try again.";
  }

  if (message.includes("Invalid")) {
    return message;
  }

  return "Check recipient, amount, network, and wallet balance.";
}

export function SendScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const { addresses, isUnlocked, wallet } = useWallet();
  const initialNetwork = params.network ?? "ethereum";
  const [recipient, setRecipient] = useState(params.recipient ?? "");
  const [amount, setAmount] = useState(params.amount ?? "");
  const [network, setNetwork] = useState<NetworkTypeId>(initialNetwork);
  const [asset, setAsset] = useState<AssetTickerId>(
    params.asset ?? getDefaultAsset(initialNetwork),
  );
  const [fee, setFee] = useState<string | null>(null);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [step, setStep] = useState<SendStep>(params.recipient ? "amount" : "recipient");
  const [result, setResult] = useState<string | null>(null);

  const draft: SendDraft = {
    accountIndex: 0,
    amount,
    asset,
    network,
    recipient,
  };

  useEffect(() => {
    const nextNetwork = params.network ?? network;

    if (params.recipient !== undefined) {
      setRecipient(params.recipient);
      setStep("amount");
    }

    if (params.amount !== undefined) {
      setAmount(params.amount);
    }

    if (params.network !== undefined) {
      setNetwork(params.network);
    }

    if (params.asset !== undefined || params.network !== undefined) {
      setAsset(params.asset ?? getDefaultAsset(nextNetwork));
    }

    if (params.recipient !== undefined || params.amount !== undefined) {
      setFee(null);
      setFeeError(null);
    }
    // params.scannedAt intentionally makes repeated scans of the same address update the form.
  }, [params.amount, params.asset, params.network, params.recipient, params.scannedAt]);

  const validation = useMemo(
    () => validateSendDraft(draft),
    [amount, asset, network, recipient],
  );
  const recipientError =
    recipient.length > 0 ? validation.errors.recipient : undefined;
  const amountError = amount.length > 0 ? validation.errors.amount : undefined;
  const senderAddress = (addresses as Partial<Record<NetworkTypeId, string>> | undefined)?.[
    network
  ];
  const canRequestFee = recipient.trim().length > 0 && amount.trim().length > 0;

  function setRecipientValue(value: string) {
    setRecipient(value);
    setFee(null);
    setFeeError(null);
  }

  function setAmountValue(value: string) {
    setAmount(value);
    setFee(null);
    setFeeError(null);
  }

  async function quote() {
    setFee(null);
    setFeeError(null);

    if (!validation.valid) {
      setFeeError(
        validation.errors.recipient ??
          validation.errors.amount ??
          "Enter a valid recipient and amount.",
      );
      return;
    }

    if (!wallet || !isUnlocked) {
      setFeeError("Unlock a wallet before estimating fees.");
      return;
    }

    if (!senderAddress) {
      setFeeError(`No ${network} address is resolved for this wallet yet.`);
      return;
    }

    setIsBusy(true);
    try {
      const quoteResult = await estimateSendFee(draft);
      setFee(formatFee(quoteResult, draft.asset));
      setStep("review");
    } catch (error) {
      const message = getErrorMessage(error);
      setFeeError(message);
      logger.warn("Fee estimate failed", error);
      NativeAlert.alert("Fee estimate failed", message);
    } finally {
      setIsBusy(false);
    }
  }

  async function send() {
    setIsBusy(true);
    try {
      const sendResult = await sendTransaction(draft);
      setResult(JSON.stringify(sendResult));
      setStep("result");
    } catch (error) {
      logger.error("Send transaction failed", error);
      NativeAlert.alert("Transaction failed", getErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Send</Text>
      {step === "recipient" ? (
        <>
          <Input
            autoCapitalize="none"
            error={recipientError}
            label="Recipient"
            onChangeText={setRecipientValue}
            value={recipient}
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              onPress={() => navigation.navigate("Scanner", { mode: "address" })}
              title="Scan"
              variant="secondary"
            />
            <Button
              disabled={!recipient || Boolean(recipientError)}
              onPress={() => setStep("amount")}
              title="Continue"
            />
          </View>
        </>
      ) : null}
      {step === "amount" ? (
        <>
          <Card>
            <Text color="textMuted" variant="labelLarge">
              Recipient
            </Text>
            <Text selectable variant="bodySmall">
              {recipient}
            </Text>
            <Text color="textMuted" variant="bodySmall">
              {asset} on {network}
            </Text>
          </Card>
          <Input
            error={amountError}
            keyboardType="decimal-pad"
            label="Amount"
            onChangeText={setAmountValue}
            value={amount}
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button onPress={() => setStep("recipient")} title="Back" variant="ghost" />
            <Button
              disabled={!canRequestFee || isBusy}
              isLoading={isBusy}
              onPress={quote}
              title="Estimate Fee"
              variant="outline"
            />
          </View>
          {recipientError ? (
            <Alert
              message={`${recipientError} Current network: ${network}.`}
              title="Recipient needs review"
              variant="warning"
            />
          ) : null}
          {feeError ? (
            <Alert
              message={feeError}
              title="Fee estimate unavailable"
              variant="warning"
            />
          ) : null}
        </>
      ) : null}
      {step === "review" ? (
        <>
          <Card>
            <Text variant="titleSmall">Review transaction</Text>
            <Text color="textMuted" variant="bodySmall">
              Asset: {draft.asset} on {draft.network}
            </Text>
            <Text color="textMuted" variant="bodySmall">
              Amount: {draft.amount}
            </Text>
            <Text color="textMuted" variant="bodySmall">
              Fee: {fee}
            </Text>
            <Text selectable color="textMuted" variant="bodySmall">
              To: {draft.recipient}
            </Text>
          </Card>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button onPress={() => setStep("amount")} title="Back" variant="ghost" />
            <Button
              disabled={!fee || !validation.valid}
              isLoading={isBusy}
              onPress={send}
              title="Confirm and Send"
            />
          </View>
        </>
      ) : null}
      {step === "result" ? (
        <>
          <Card>
            <Text color="success" variant="titleSmall">
              Transaction submitted
            </Text>
            <Text selectable color="textMuted" variant="bodySmall">
              {result}
            </Text>
          </Card>
          <Button
            onPress={() => {
              setAmount("");
              setFee(null);
              setRecipient("");
              setResult(null);
              setStep("recipient");
            }}
            title="Send Another"
          />
        </>
      ) : null}
    </Screen>
  );
}
