"use client";

import { useState, useCallback, useMemo } from "react";
import { STOCKS_CATALOG } from "./lib/data/stocks-catalog";
import { filterCompliantStocks } from "./lib/data/compliance-guard";
import { SwipeDeck } from "./components/swipe/swipe-deck";
import { BottomActionBar } from "./components/basket/bottom-action-bar";
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

  // If user is on the Landing Page / Overview tab
  if (activeTab === "landing") {
    return (
      <main className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center">
        <LandingPage />
        <PortfolioDrawer />
      </main>
    );
  }

  // If user is on App tab but has not answered initial strategy questions, show Onboarding Questionnaire
  if (!hasCompletedOnboarding) {
    return (
      <main className="min-h-[85vh] bg-transparent text-slate-100 flex flex-col items-center justify-center px-4">
        <StrategyWizard />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center">
      {/* Expansive Responsive Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-28">
        {/* Top Context & Strategy Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Investment ideas
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400 font-medium">
              Ready-made portfolios. Swipe right to add, left to skip.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStrategyWizardOpen(true)}
              className="cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition shadow-xs group"
              title="Click to reconfigure strategy"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition"></span>
              <span>
                Strategy: <strong className="text-white capitalize">{riskTier}</strong> ({currency})
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-medium underline underline-offset-2 decoration-emerald-500/40">
                Change
              </span>
            </button>
          </div>
        </div>

        {/* Main Responsive Grid: Swipe Deck (Left) + Desktop Companion Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center Area: Swipe Deck */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <SwipeDeck stocks={compliantStocks} />
          </div>

          {/* Right Area: Desktop Companion Dashboard (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-5 pt-2">
            {/* Basket Telemetry Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0D1322] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Basket Allocation</h3>
                    <p className="text-[11px] text-slate-400">Live session portfolio preview</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  {basket.length} {basket.length === 1 ? "asset" : "assets"}
                </span>
              </div>

              {/* Budget Progress Meter */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Session Budget Deployed</span>
                  <span className="font-mono text-white font-semibold">
                    {totalAllocated} / {sessionBudget} {currency} ({budgetUtilizationPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${budgetUtilizationPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    Remaining: <strong className="text-emerald-400 tabular-nums">{remainingBudget} {currency}</strong>
                  </span>
                  <span className="capitalize text-slate-300 font-medium">{riskTier} tier</span>
                </div>
              </div>

              {/* Added Assets List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {basket.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
                      🛒
                    </div>
                    <p className="font-medium text-slate-400">No assets in basket yet</p>
                    <p className="text-[11px] text-slate-500">Swipe right on cards to allocate budget.</p>
                  </div>
                ) : (
                  basket.map((item) => (
                    <div
                      key={item.stock.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-900 text-xs transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                          {item.stock.logoURI ? (
                            <img
                              src={item.stock.logoURI}
                              alt={item.stock.name}
                              className="h-full w-full object-contain rounded"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">
                              {item.stock.ticker.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[140px]">
                            {item.stock.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {item.stock.ticker}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                          {item.allocation} {currency}
                        </span>
                        <button
                          onClick={() => removeFromBasket(item.stock.id)}
                          className="cursor-pointer text-slate-500 hover:text-rose-400 p-1 transition"
                          title="Remove from basket"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => setIsBasketOpen(true)}
                  disabled={basket.length === 0}
                  className="cursor-pointer w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Review & Execute Basket ({basket.length})</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Devnet Safety & Strategy Guarantee */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Solana Devnet Locked</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All order routes simulate and execute against Solana Devnet with zero real asset risk. Quotes track live equity and Raydium LaunchLab feeds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Bar (Visible on mobile/tablet) */}
      <BottomActionBar onSkip={() => {}} />

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
