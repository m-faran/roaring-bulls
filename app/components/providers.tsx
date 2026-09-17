"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { ClusterProvider } from "./cluster-context";
import { AppClientProvider } from "../lib/client-provider";
import { BasketProvider } from "../lib/store/basket-context";
import { PortfolioProvider } from "../lib/store/portfolio-context";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ClusterProvider>
        <AppClientProvider>
          <PortfolioProvider>
            <BasketProvider>{children}</BasketProvider>
          </PortfolioProvider>
        </AppClientProvider>
        <Toaster position="bottom-right" richColors />
      </ClusterProvider>
    </ThemeProvider>
  );
}
