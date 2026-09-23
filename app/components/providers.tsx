"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { ClusterProvider } from "./cluster-context";
import { AppClientProvider } from "../lib/client-provider";
import { BasketProvider } from "../lib/store/basket-context";
import { PortfolioProvider } from "../lib/store/portfolio-context";
import { DataProvider } from "../lib/store/data-context";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ClusterProvider>
        <AppClientProvider>
          <PortfolioProvider>
            <DataProvider>
              <BasketProvider>{children}</BasketProvider>
            </DataProvider>
          </PortfolioProvider>
        </AppClientProvider>
        <Toaster position="bottom-right" />
      </ClusterProvider>
    </ThemeProvider>
  );
}
