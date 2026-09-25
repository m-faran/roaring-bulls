"use client";

import { useMemo, type ReactNode } from "react";
import { ClientProvider, useClient } from "@solana/react";
import { createAppClient, type AppClient } from "./solana-client";
import { useCluster } from "../components/cluster-context";
import { PrivyProvider } from "@privy-io/react-auth";

export function AppClientProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const client = useMemo(() => createAppClient(cluster), [cluster]);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "replace_me"}
      config={{
        appearance: { theme: "light" },
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          }
        },
      }}
    >
      <ClientProvider client={client}>{children}</ClientProvider>
    </PrivyProvider>
  );
}

export function useAppClient() {
  return useClient<AppClient>();
}
