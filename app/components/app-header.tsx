"use client";

import { ThemeToggle } from "./theme-toggle";
import { ClusterSelect } from "./cluster-select";
import { WalletButton } from "./wallet-button";
import { useBasket } from "../lib/store/basket-context";
import { usePortfolio } from "../lib/store/portfolio-context";

export function AppHeader() {
  const { riskTier, setIsPortfolioOpen, setIsSessionSetupOpen, remainingBudget, currency } = useBasket();
  const { positions, dcas, limitOrders } = usePortfolio();
  const totalActive = positions.length + dcas.length + limitOrders.length;

  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/5 bg-[#070A12]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
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
        </div>

        {/* Risk Tier Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 capitalize text-[11px] font-medium">
            {riskTier} Tier
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Session Setup Pill */}
        <button
          onClick={() => setIsSessionSetupOpen(true)}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 transition"
          title="Session Budget Setup"
        >
          <span className="text-slate-400">Budget:</span>
          <span className="font-semibold text-emerald-400 tabular-nums">
            {remainingBudget} {currency}
          </span>
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
