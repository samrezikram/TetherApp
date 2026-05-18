import React from "react";
import { useRoute } from "@react-navigation/native";
import { Screen } from "@/design-system/components/Screen";
import { Text } from "@/design-system/components/Text";

export function TransactionDetailsScreen() {
  const route = useRoute();
  const params = route.params as { transactionId: string };

  return (
    <Screen>
      <Text variant="headlineLarge">Transaction</Text>
      <Text selectable>{params.transactionId}</Text>
    </Screen>
  );
}
