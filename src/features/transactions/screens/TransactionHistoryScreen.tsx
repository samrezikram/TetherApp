import React from "react";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import { Card } from "@/design-system/components/Card";
import { Screen } from "@/design-system/components/Screen";
import { Text } from "@/design-system/components/Text";

export function TransactionHistoryScreen() {
  const { transactions } = useWallet();
  const rows = transactions?.list ?? [];

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Activity</Text>
      {rows.length === 0 ? (
        <Text color="textMuted">No transactions yet.</Text>
      ) : (
        rows.map((transaction: { hash?: string; amount?: string; status?: string }, index: number) => (
          <Card key={transaction.hash ?? index}>
            <Text variant="titleSmall">{transaction.amount ?? "Transaction"}</Text>
            <Text color="textMuted" variant="bodySmall">
              {transaction.status ?? transaction.hash}
            </Text>
          </Card>
        ))
      )}
    </Screen>
  );
}
