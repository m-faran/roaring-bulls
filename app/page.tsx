"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useData } from "./lib/store/data-context";
import { SwipeDeck } from "./components/swipe/swipe-deck";
import { BasketDrawer } from "./components/basket/basket-drawer";
import { SessionSetupModal } from "./components/swipe/session-setup";
import { ExecutionModal } from "./components/basket/execution-modal";
import { PortfolioDrawer } from "./components/portfolio/portfolio-drawer";
import { StrategyWizard } from "./components/onboarding/strategy-wizard";
import { LandingPage } from "./components/landing/landing-page";
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
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function Home() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { cluster } = useCluster();
  const {
    basket,
    clearBasket,
    currency,
    setIsBasketOpen,
    hasCompletedOnboarding,
    isStrategyWizardOpen,
    setIsStrategyWizardOpen,
    riskTier,
    sessionBudget,
    remainingBudget,
    budgetUtilizationPct,
    totalAllocated,
    removeFromBasket,
    activeTab,
  } = useBasket();
  const { addPosition, addDCA, addLimitOrder } = usePortfolio();

  const { deckStocks, isLoading } = useData();

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

  // If user is on the Landing Page / Overview tab
  if (activeTab === "landing") {
    return (
      <main className="flex min-h-screen flex-col items-center bg-transparent text-ink">
        <LandingPage />
        <PortfolioDrawer />
      </main>
    );
  }

  // If user is on App tab but has not answered initial strategy questions, show Onboarding Questionnaire
  if (!hasCompletedOnboarding) {
    return (
      <main className="flex min-h-[85vh] flex-col items-center justify-center bg-transparent px-4 text-ink">
        <StrategyWizard />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-ink">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-2 sm:px-6">
        {/* Strategy chip removed per design pass */}
        <h1 className="sr-only">Investment ideas</h1>

        {/* Main Responsive Grid: Swipe Deck (Left) + Desktop Companion Panel (Right) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left / Center Area: Swipe Deck Terminal — actions render inside the deck, above the card */}
          <div className="flex flex-col items-stretch lg:col-span-8">
            {isLoading ? (
              <div className="ink-border ink-shadow-sm flex h-[600px] w-full max-w-[620px] items-center justify-center bg-paper-white">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink/20 border-t-sol-green"></div>
                  <p className="font-mono text-xs font-bold text-ink/60 uppercase tracking-widest">Loading Live Data</p>
                </div>
              </div>
            ) : (
              <SwipeDeck stocks={deckStocks} />
            )}
          </div>

          {/* Right Area: Desktop Companion Dashboard (Hidden on mobile) */}
          <div className="flex flex-col gap-5 pt-1 lg:col-span-4">
            {/* Basket Telemetry Card — receipt panel */}
            <div className="ink-border ink-shadow bg-paper-white">
              {/* Stub header */}
              <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                  Basket Allocation • Live Preview
                </span>
                <span className="ink-border-thin bg-sol-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">
                  {basket.length} {basket.length === 1 ? "asset" : "assets"}
                </span>
              </div>

              <div className="ink-frame space-y-4 p-4">
                {/* Budget Progress Meter — clean label/value box */}
                <div className="ink-border-thin divide-y-[1.5px] divide-ink/15 bg-paper">
                  <div className="flex items-center justify-between px-3 py-2 font-mono text-xs">
                    <span className="text-ink/60">
                      Session Budget Deployed
                    </span>
                    <span className="font-bold tabular-nums text-ink">
                      {totalAllocated} / {sessionBudget} {currency} (
                      {budgetUtilizationPct}%)
                    </span>
                  </div>
                  <div className="px-3 py-2.5">
                    <div className="ink-border-thin h-2.5 w-full overflow-hidden bg-paper-white">
                      <div
                        className="h-full bg-sol-green transition-all duration-300"
                        style={{ width: `${budgetUtilizationPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 font-mono text-[11px]">
                    <span className="text-ink/60">
                      Remaining:{" "}
                      <strong className="font-bold tabular-nums text-ink">
                        {remainingBudget} {currency}
                      </strong>
                    </span>
                    <span className="font-bold capitalize text-ink">
                      {riskTier} tier
                    </span>
                  </div>
                </div>

                {/* Added Assets List */}
                <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {basket.length === 0 ? (
                    <div className="ink-border-thin border-dashed bg-paper-white/60 py-8 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center border-[1.5px] border-ink/30 text-ink/50">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink/70">
                        No assets in basket yet
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50">
                        Swipe right on cards to allocate budget.
                      </p>
                    </div>
                  ) : (
                    basket.map((item) => (
                      <div
                        key={item.stock.id}
                        className="ink-border-thin flex items-center justify-between gap-2 bg-paper p-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="ink-border-thin flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden bg-paper-white p-1">
                            {item.stock.logoURI ? (
                              // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
                              <img
                                src={item.stock.logoURI}
                                alt={item.stock.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <span className="font-mono text-[10px] font-bold">
                                {item.stock.ticker.slice(0, 2)}
                              </span>
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="max-w-[140px] truncate text-xs font-bold text-ink">
                              {item.stock.name}
                            </p>
                            <p className="font-mono text-[10px] text-ink/50">
                              {item.stock.ticker}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="font-mono text-xs font-bold tabular-nums">
                            {item.allocation} {currency}
                          </span>
                          <button
                            onClick={() => removeFromBasket(item.stock.id)}
                            className="cursor-pointer p-1 text-ink/40 transition-colors hover:text-sol-pink"
                            title="Remove from basket"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Action Trigger */}
                <button
                  onClick={() => setIsBasketOpen(true)}
                  disabled={basket.length === 0}
                  className="ink-border ink-shadow-sm ink-press flex w-full cursor-pointer items-center justify-center gap-2 bg-sol-green py-3.5 font-display text-xs font-black uppercase tracking-wide text-ink disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Review & Execute Basket ({basket.length})</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Devnet note card + session shortcut removed — session setup lives in the budget strip gear */}
          </div>
        </div>
      </div>

      {/* Basket access: live-preview panel (stacks below the deck on narrow screens) */}

      {/* Slide-out Basket Drawer */}
      <BasketDrawer onExecute={handleExecuteBasket} />

      {/* Session Setup Modal */}
      <SessionSetupModal />

      {/* Interactive Strategy Wizard Modal (if reopened) */}
      {isStrategyWizardOpen && (
        <StrategyWizard
          isModal={true}
          onClose={() => setIsStrategyWizardOpen(false)}
        />
      )}

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
