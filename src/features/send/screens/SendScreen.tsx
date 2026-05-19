import React, { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/navigation/types";
import { Button, Card, Input, Screen, Text } from "@/design-system";
import type { SendDraft } from "@/domain/transaction/types";
import { estimateSendFee } from "@/services/fees/feeService";
import { sendTransaction } from "@/services/wdk/wdkService";
import { logger } from "@/infrastructure/logging/logger";
import { validateSendDraft } from "@/features/send/sendValidation";

type RouteParams = {
  amount?: string;
  recipient?: string;
};

type SendStep = "recipient" | "amount" | "review" | "result";

export function SendScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const [recipient, setRecipient] = useState(params.recipient ?? "");
  const [amount, setAmount] = useState(params.amount ?? "");
  const [fee, setFee] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [step, setStep] = useState<SendStep>(params.recipient ? "amount" : "recipient");
  const [result, setResult] = useState<string | null>(null);

  const draft: SendDraft = {
    accountIndex: 0,
    amount,
    asset: "USDT",
    network: "ethereum",
    recipient,
  };

  const validation = useMemo(() => validateSendDraft(draft), [amount, recipient]);
  const recipientError =
    recipient.length > 0 ? validation.errors.recipient : undefined;
  const amountError = amount.length > 0 ? validation.errors.amount : undefined;

  async function quote() {
    setIsBusy(true);
    try {
      const quoteResult = await estimateSendFee(draft);
      setFee(typeof quoteResult === "number" ? `${quoteResult} ${draft.asset}` : JSON.stringify(quoteResult));
      setStep("review");
    } catch (error) {
      logger.warn("Fee estimate failed", error);
      Alert.alert("Fee estimate failed", "Check recipient, amount, and network.");
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
      Alert.alert("Transaction failed", "Authentication, validation, or broadcast failed.");
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
            onChangeText={setRecipient}
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
          </Card>
          <Input
            error={amountError}
            keyboardType="decimal-pad"
            label="Amount"
            onChangeText={setAmount}
            value={amount}
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button onPress={() => setStep("recipient")} title="Back" variant="ghost" />
            <Button
              disabled={!validation.valid}
              isLoading={isBusy}
              onPress={quote}
              title="Estimate Fee"
              variant="outline"
            />
          </View>
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
