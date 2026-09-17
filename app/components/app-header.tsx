"use client";

import { ThemeToggle } from "./theme-toggle";
import { ClusterSelect } from "./cluster-select";
import { WalletButton } from "./wallet-button";
import { useBasket } from "../lib/store/basket-context";
import { usePortfolio } from "../lib/store/portfolio-context";

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
    <header className="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/5 bg-[#070A12]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className="cursor-pointer flex items-center gap-2 text-left group"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white group-hover:text-emerald-300 transition">
                Swpper
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Stocks
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Swipe DCA for Tokenized Equities
            </p>
          </div>
        </button>

        {/* View Switcher: Overview vs Swipe Deck */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("landing")}
            className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
              activeTab === "landing"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("app")}
            className={`cursor-pointer px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "app"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Swipe Deck</span>
            {activeTab === "landing" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Strategy Reconfigure Pill (When in App) */}
        {activeTab === "app" && (
          <button
            type="button"
            onClick={() => setIsStrategyWizardOpen(true)}
            className="cursor-pointer hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 text-xs transition group"
            title="Change Strategy (Currency, Risk Tier, Budget)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition"></span>
            <span className="text-slate-300 capitalize text-[11px] font-semibold">
              {riskTier} Tier
            </span>
            <span className="text-slate-500 text-[10px]">•</span>
            <span className="text-emerald-400 font-mono text-[11px]">
              {remainingBudget} {currency}
            </span>
            <svg className="w-3 h-3 text-slate-400 group-hover:text-white transition ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Strategy Button on mobile */}
        <button
          onClick={() => setIsStrategyWizardOpen(true)}
          className="cursor-pointer sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 text-xs font-medium text-slate-300"
        >
          <span>Setup</span>
        </button>

        {/* Portfolio Drawer Button */}
        <button
          onClick={() => setIsPortfolioOpen(true)}
          className="cursor-pointer relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-white transition"
        >
          <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span className="hidden sm:inline">Portfolio</span>
          {totalActive > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-slate-950">
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
