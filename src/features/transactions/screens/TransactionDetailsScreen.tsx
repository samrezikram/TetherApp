import React from "react";
import { useRoute } from "@react-navigation/native";
import { Screen, Text } from "@/design-system";

export function TransactionDetailsScreen() {
  const route = useRoute();
  const params = route.params as { transactionId: string };
  const hash = (route.params as { hash?: string }).hash;

  return (
    <Screen>
      <Text variant="headlineLarge">Transaction</Text>
      <Text selectable>{params.transactionId}</Text>
      {hash ? (
        <Text selectable color="textMuted" variant="bodySmall">
          {hash}
        </Text>
      ) : null}
    </Screen>
  );
}
