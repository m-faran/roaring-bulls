"use client";

import { useState, useCallback, useMemo } from "react";
import { STOCKS_CATALOG, StockToken } from "./lib/data/stocks-catalog";
import { filterCompliantStocks } from "./lib/data/compliance-guard";
import { SwipeDeck } from "./components/swipe/swipe-deck";
import { BottomActionBar } from "./components/basket/bottom-action-bar";
import { BasketDrawer } from "./components/basket/basket-drawer";
import { SessionSetupModal } from "./components/swipe/session-setup";
import { ExecutionModal } from "./components/basket/execution-modal";
import { PortfolioDrawer } from "./components/portfolio/portfolio-drawer";
import { useBasket } from "./lib/store/basket-context";
import { usePortfolio, OrderType } from "./lib/store/portfolio-context";
import { useAppClient } from "./lib/client-provider";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useCluster } from "./components/cluster-context";
import {
  executeBasketOrder,
  ExecutionResult,
} from "./lib/execution/execution-service";
import { SOL_USD_PRICE } from "./lib/execution/mock-quotes";

export default function Home() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { cluster } = useCluster();
  const {
    basket,
    clearBasket,
    currency,
    setIsBasketOpen,
  } = useBasket();
  const { addPosition, addDCA, addLimitOrder } = usePortfolio();

  // Filter token catalog through the compliance guardrail
  const compliantStocks = useMemo(() => {
    return filterCompliantStocks(STOCKS_CATALOG);
  }, []);

  // Execution modal state
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(
    null
  );
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [lastOrderParams, setLastOrderParams] = useState<{
    orderType: OrderType;
    config?: any;
  } | null>(null);

  const handleExecuteBasket = useCallback(
    async (orderType: OrderType, config?: any) => {
      if (basket.length === 0) return;

      setLastOrderParams({ orderType, config });
      setIsExecutionModalOpen(true);
      setIsExecuting(true);
      setExecutionError(null);
      setExecutionResult(null);

      try {
        const result = await executeBasketOrder({
          client,
          rawSigner: connected?.signer,
          cluster,
          orderType,
          items: basket,
          currency,
          dcaConfig:
            orderType === "recurring-dca"
              ? {
                  frequency: config?.dcaFrequency || "daily",
                  cycles: config?.dcaCycles || 5,
                }
              : undefined,
          limitConfig:
            orderType === "limit-order"
              ? {
                  dipTargetPct: config?.limitDipPct || 3,
                }
              : undefined,
        });

        // Record in portfolio
        if (orderType === "buy-now") {
          basket.forEach((item) => {
            const solAmount =
              currency === "SOL"
                ? item.allocation
                : item.allocation / SOL_USD_PRICE;
            const usdAmount = solAmount * SOL_USD_PRICE;
            const tokenQty =
              item.stock.price > 0 ? usdAmount / item.stock.price : 0;

            addPosition({
              id: `pos_${Date.now()}_${item.stock.id}`,
              stock: item.stock,
              amountTokens: Math.round(tokenQty * 1000) / 1000,
              totalInvestedSol: Math.round(solAmount * 1000) / 1000,
              totalInvestedUsd: Math.round(usdAmount * 100) / 100,
              acquiredAt: Date.now(),
              txSignature: result.signature,
            });
          });
        } else if (orderType === "recurring-dca") {
          const cycles = config?.dcaCycles || 5;
          basket.forEach((item) => {
            const solAmount =
              currency === "SOL"
                ? item.allocation
                : item.allocation / SOL_USD_PRICE;
            addDCA({
              id: `dca_${Date.now()}_${item.stock.id}`,
              stock: item.stock,
              totalBudgetSol: solAmount,
              frequency: config?.dcaFrequency || "daily",
              totalCycles: cycles,
              completedCycles: 1,
              amountPerCycleSol: Math.round((solAmount / cycles) * 1000) / 1000,
              nextExecutionAt: Date.now() + 86400000,
              status: "active",
              txSignature: result.signature,
            });
          });
        } else {
          const dipPct = config?.limitDipPct || 3;
          basket.forEach((item) => {
            const solAmount =
              currency === "SOL"
                ? item.allocation
                : item.allocation / SOL_USD_PRICE;
            addLimitOrder({
              id: `limit_${Date.now()}_${item.stock.id}`,
              stock: item.stock,
              allocationSol: solAmount,
              targetPriceUsd: item.stock.price * (1 - dipPct / 100),
              currentPriceUsd: item.stock.price,
              status: "open",
              createdAt: Date.now(),
              txSignature: result.signature,
            });
          });
        }

        setExecutionResult(result);
        clearBasket();
        setIsBasketOpen(false);
      } catch (err: any) {
        setExecutionError(
          err?.message || "Execution encountered an on-chain error."
        );
      } finally {
        setIsExecuting(false);
      }
    },
    [
      basket,
      client,
      connected?.signer,
      cluster,
      currency,
      addPosition,
      addDCA,
      addLimitOrder,
      clearBasket,
      setIsBasketOpen,
    ]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Header Section Matching reference layout */}
      <section className="w-full max-w-xl mx-auto px-4 pt-6 pb-2 text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Investment ideas
        </h1>
        <p className="mt-1 text-sm text-slate-400 font-medium">
          Ready-made portfolios. Swipe right to add, left to skip.
        </p>
      </section>

      {/* Swipe Deck Section */}
      <section className="w-full flex-1 flex flex-col items-center justify-center">
        <SwipeDeck stocks={compliantStocks} />
      </section>

      {/* Persistent Bottom Bar */}
      <BottomActionBar onSkip={() => {}} />

      {/* Slide-out Basket Drawer */}
      <BasketDrawer onExecute={handleExecuteBasket} />

      {/* Session Setup Modal */}
      <SessionSetupModal />

      {/* Execution Progress & Confirmation Modal */}
      <ExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        isExecuting={isExecuting}
        result={executionResult}
        error={executionError}
        onRetry={() => {
          if (lastOrderParams) {
            handleExecuteBasket(
              lastOrderParams.orderType,
              lastOrderParams.config
            );
          }
        }}
      />

      {/* Portfolio Drawer */}
      <PortfolioDrawer />
    </main>
  );
}
