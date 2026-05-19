import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useWallet } from "@tetherto/wdk-react-native-provider";
import type { RootStackParamList } from "@/app/navigation/types";
import { Button, Card, LoadingState, Screen, Text } from "@/design-system";

export function TransactionHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { refreshTransactions, transactions } = useWallet();
  const rows = transactions?.list ?? [];
  const grouped = rows.reduce<Record<string, typeof rows>>((groups, transaction) => {
    const key = transaction.timestamp
      ? new Date(transaction.timestamp).toLocaleDateString()
      : "Pending";
    groups[key] = [...(groups[key] ?? []), transaction];
    return groups;
  }, {});

  return (
    <Screen scroll>
      <Text variant="headlineLarge">Activity</Text>
      {transactions?.isLoading ? <LoadingState label="Loading transactions" /> : null}
      {rows.length === 0 && !transactions?.isLoading ? (
        <Text color="textMuted">No transactions yet.</Text>
      ) : (
        Object.entries(grouped).map(([date, transactionsForDate]) => (
          <View key={date} style={{ gap: 8 }}>
            <Text color="textMuted" variant="labelLarge">
              {date}
            </Text>
            {transactionsForDate.map((transaction, index) => (
              <Card key={transaction.transactionHash ?? index}>
                <Text variant="titleSmall">{transaction.amount ?? "Transaction"}</Text>
                <Text color="textMuted" variant="bodySmall">
                  {transaction.token} on {transaction.blockchain}
                </Text>
                <Text color="textMuted" selectable variant="bodySmall">
                  {transaction.transactionHash}
                </Text>
                <Button
                  onPress={() =>
                    navigation.navigate("TransactionDetails", {
                      hash: transaction.transactionHash,
                      transactionId: `${transaction.blockchain}:${transaction.transactionHash}`,
                    })
                  }
                  size="small"
                  title="Details"
                  variant="outline"
                />
              </Card>
            ))}
          </View>
        ))
      )}
      <Button
        isLoading={transactions?.isLoading}
        onPress={refreshTransactions}
        title="Refresh"
        variant="outline"
      />
    </Screen>
  );
}
