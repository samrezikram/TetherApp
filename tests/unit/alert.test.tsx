import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Alert, AppThemeProvider } from "@/design-system";

describe("Alert", () => {
  it("renders message content and actions", () => {
    const onDismiss = jest.fn();
    const onAction = jest.fn();
    const screen = render(
      <AppThemeProvider>
        <Alert
          action={{ label: "Retry", onPress: onAction }}
          message="Wallet runtime failed to initialize."
          onDismiss={onDismiss}
          title="Connection issue"
          variant="warning"
        />
      </AppThemeProvider>,
    );

    expect(screen.getByText("Connection issue")).toBeTruthy();
    expect(screen.getByText("Wallet runtime failed to initialize.")).toBeTruthy();

    fireEvent.press(screen.getByText("Retry"));
    fireEvent.press(screen.getByLabelText("Dismiss alert"));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
