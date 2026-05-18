import React from "react";
import { Card } from "@/design-system/components/Card";
import { Text } from "@/design-system/components/Text";

export function OfflineBanner({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <Card>
      <Text color="warning" variant="labelLarge">
        Offline
      </Text>
      <Text color="textMuted" variant="bodySmall">
        Network data may be stale until connectivity returns.
      </Text>
    </Card>
  );
}
