"use client";

import { ThemeToggle } from "./theme-toggle";
import { ClusterSelect } from "./cluster-select";
import { WalletButton } from "./wallet-button";
import { useBasket } from "../lib/store/basket-context";
import { usePortfolio } from "../lib/store/portfolio-context";
import { ChevronDown, Layers } from "lucide-react";

export function AppHeader() {
  const {
    riskTier,
    setIsPortfolioOpen,
    remainingBudget,
    currency,
    setIsStrategyWizardOpen,
    activeTab,
    setActiveTab,
  } = useBasket();
  const { positions, dcas, limitOrders } = usePortfolio();
  const totalActive = positions.length + dcas.length + limitOrders.length;

  return (
    <header className="paper-texture sticky top-0 z-30 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink px-4 py-3 sm:px-6">
      {/* Brand Logo & Tagline */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className="group flex cursor-pointer items-center gap-2.5 text-left"
        >
          {/* Logo sticker badge */}
          <div className="ink-border ink-shadow-sm flex h-9 w-9 items-center justify-center bg-sol-green text-base font-display font-black text-ink transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            S
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-display font-black tracking-tight text-ink">
                Swpper
              </span>
              <span className="ink-border-thin bg-sol-yellow px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-ink">
                Stocks
              </span>
            </div>
            <p className="hidden font-mono text-[10px] tracking-tight text-ink/70 sm:block">
              Swipe DCA for Tokenized Equities
            </p>
          </div>
        </button>

        {/* View Switcher: Overview vs Swipe Deck */}
        <div className="ink-border-thin flex items-center whitespace-nowrap bg-paper-white p-1 text-xs font-semibold text-ink">
          <button
            type="button"
            onClick={() => setActiveTab("landing")}
            className={`cursor-pointer px-2.5 py-1.5 font-display text-xs transition-all duration-200 sm:px-3.5 ${
              activeTab === "landing"
                ? "ink-border-thin bg-sol-yellow font-bold"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("app")}
            className={`flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 font-display text-xs transition-all duration-200 sm:gap-2 sm:px-3.5 ${
              activeTab === "app"
                ? "ink-border-thin bg-sol-green font-bold"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <span>Swipe Deck</span>
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          </button>
        </div>

        {/* Strategy Reconfigure Pill (When in App) */}
        {activeTab === "app" && (
          <button
            type="button"
            onClick={() => setIsStrategyWizardOpen(true)}
            className="ink-border-thin ink-shadow-sm ink-press hidden cursor-pointer items-center gap-2 bg-paper-white px-3 py-1.5 text-xs xl:flex"
            title="Change Strategy (Currency, Risk Tier, Budget)"
          >
            <span className="h-2 w-2 rounded-full bg-sol-green" />
            <span className="font-medium capitalize text-ink">
              {riskTier} Tier
            </span>
            <span className="text-ink/40">•</span>
            <span className="font-mono text-xs font-bold tabular-nums text-ink">
              {remainingBudget} {currency}
            </span>
            <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-ink/60" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Strategy Button on mobile */}
        <button
          onClick={() => setIsStrategyWizardOpen(true)}
          className="ink-border-thin ink-shadow-sm ink-press cursor-pointer rounded-none px-2.5 py-1.5 text-xs font-semibold sm:hidden"
        >
          <span className="text-ink">Setup</span>
        </button>

        {/* Portfolio Drawer Button */}
        <button
          onClick={() => setIsPortfolioOpen(true)}
          className="ink-border ink-shadow-sm ink-press relative flex cursor-pointer items-center gap-2 bg-sol-pink px-3.5 py-1.5 text-xs font-medium text-white"
        >
          <Layers className="h-4 w-4 text-white" />
          <span className="hidden font-display text-xs sm:inline">Portfolio</span>
          {totalActive > 0 && (
            <span className="ink-border-thin flex h-4 min-w-4 items-center justify-center bg-paper-white px-1 font-mono text-[10px] font-bold text-ink">
              {totalActive}
            </span>
          )}
        </button>

        <ClusterSelect />
        <ThemeToggle />
        <WalletButton />
      </div>
    </header>
  );
}
