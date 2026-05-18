import React from "react";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
import { Text } from "@/design-system/components/Text";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card>
      <Text color="danger" variant="titleSmall">
        Something went wrong
      </Text>
      <Text color="textMuted" variant="bodySmall">
        {message}
      </Text>
      {onRetry ? (
        <Button onPress={onRetry} size="small" title="Retry" variant="outline" />
      ) : null}
    </Card>
  );
}
