import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/navigation/types";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
import { Input } from "@/design-system/components/Input";
import { Screen } from "@/design-system/components/Screen";
import { Text } from "@/design-system/components/Text";
import type { SendDraft } from "@/domain/transaction/types";
import { estimateSendFee } from "@/services/fees/feeService";
import { sendTransaction } from "@/services/wdk/wdkService";
import { isValidAddress } from "@/services/wdk/addressValidation";
import { logger } from "@/infrastructure/logging/logger";

type RouteParams = {
  amount?: string;
  recipient?: string;
};

export function SendScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const [recipient, setRecipient] = useState(params.recipient ?? "");
  const [amount, setAmount] = useState(params.amount ?? "");
  const [fee, setFee] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const draft: SendDraft = {
    accountIndex: 0,
    amount,
    asset: "USDT",
    network: "ethereum",
    recipient,
  };

  const recipientError =
    recipient.length > 0 && !isValidAddress(draft.network, recipient)
      ? "Enter a valid Ethereum recipient address."
      : undefined;

  async function quote() {
    setIsBusy(true);
    try {
      const quoteResult = await estimateSendFee(draft);
      setFee(JSON.stringify(quoteResult));
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
      const result = await sendTransaction(draft);
      Alert.alert("Transaction submitted", JSON.stringify(result));
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
      <Input
        autoCapitalize="none"
        error={recipientError}
        label="Recipient"
        onChangeText={setRecipient}
        value={recipient}
      />
      <Input
        keyboardType="decimal-pad"
        label="Amount"
        onChangeText={setAmount}
        value={amount}
      />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          onPress={() => navigation.navigate("Scanner", { mode: "address" })}
          title="Scan"
          variant="secondary"
        />
        <Button
          disabled={!recipient || !amount || Boolean(recipientError)}
          isLoading={isBusy}
          onPress={quote}
          title="Estimate Fee"
          variant="outline"
        />
      </View>
      {fee ? (
        <Card>
          <Text variant="titleSmall">Fee quote</Text>
          <Text color="textMuted" variant="bodySmall">
            {fee}
          </Text>
        </Card>
      ) : null}
      <Button
        disabled={!fee || Boolean(recipientError)}
        isLoading={isBusy}
        onPress={send}
        title="Confirm and Send"
      />
    </Screen>
  );
}
