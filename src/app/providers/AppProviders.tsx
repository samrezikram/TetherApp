import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { WalletProvider } from "@tetherto/wdk-react-native-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppThemeProvider } from "@/design-system";
import { wdkConfig } from "@/services/wdk/wdkConfig";
import { bindAppStateSessionLock } from "@/services/biometric/sessionService";
import { initializeCertificatePinning } from "@/infrastructure/api/certificatePinning";
import { logger } from "@/infrastructure/logging/logger";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => bindAppStateSessionLock(), []);
  useEffect(() => {
    void initializeCertificatePinning().catch((error) => {
      logger.error("Certificate pinning initialization failed", error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <WalletProvider config={wdkConfig}>
          <NavigationContainer>{children}</NavigationContainer>
        </WalletProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
