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
    <header className="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-cyan-500/15 bg-[#05080E]/90 backdrop-blur-xl sticky top-0 z-30 transition-all">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className="cursor-pointer flex items-center gap-2.5 text-left group"
        >
          {/* Cyber Arcade Logo Badge */}
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[#00FF88] via-[#00F0FF] to-[#0A111F] p-[1.5px] shadow-[0_0_15px_rgba(0,255,136,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] transition-all duration-300">
            <div className="h-full w-full rounded-[10px] bg-[#05080E] flex items-center justify-center text-[#00FF88] font-display font-black text-base group-hover:scale-105 transition-transform">
              S
            </div>
            {/* Corner cyber accent */}
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-display font-black tracking-tight text-white group-hover:text-[#00FF88] transition-colors">
                Swpper
              </span>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_10px_rgba(0,255,136,0.15)]">
                Stocks
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-mono tracking-tight">
              Swipe DCA for Tokenized Equities
            </p>
          </div>
        </button>

        {/* View Switcher: Overview vs Swipe Deck */}
        <div className="flex items-center p-1 rounded-xl bg-[#0A111F] border border-cyan-500/20 text-xs font-semibold shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("landing")}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg font-display transition-all duration-200 text-xs ${
              activeTab === "landing"
                ? "bg-[#101A2E] text-white shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("app")}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg font-display transition-all duration-200 flex items-center gap-2 text-xs ${
              activeTab === "app"
                ? "bg-[#00FF88] text-[#05080E] font-bold shadow-[0_0_16px_rgba(0,255,136,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Swipe Deck</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeTab === "app" ? "bg-[#05080E] animate-pulse" : "bg-[#00FF88]"
              }`}
            />
          </button>
        </div>

        {/* Strategy Reconfigure Pill (When in App) */}
        {activeTab === "app" && (
          <button
            type="button"
            onClick={() => setIsStrategyWizardOpen(true)}
            className="cursor-pointer hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A111F]/90 border border-cyan-500/20 hover:border-[#00FF88]/50 text-xs transition-all duration-200 group hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            title="Change Strategy (Currency, Risk Tier, Budget)"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] group-hover:scale-125 transition-transform" />
            <span className="text-slate-300 capitalize text-xs font-medium">
              {riskTier} Tier
            </span>
            <span className="text-cyan-500/40 font-mono">•</span>
            <span className="text-[#00FF88] font-mono text-xs font-semibold">
              {remainingBudget} {currency}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors ml-0.5" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Strategy Button on mobile */}
        <button
          onClick={() => setIsStrategyWizardOpen(true)}
          className="cursor-pointer sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-[#0A111F] text-xs font-medium text-slate-300 active:bg-cyan-500/10"
        >
          <span>Setup</span>
        </button>

        {/* Portfolio Drawer Button */}
        <button
          onClick={() => setIsPortfolioOpen(true)}
          className="cursor-pointer relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/20 bg-[#0A111F] hover:bg-[#101A2E] hover:border-cyan-500/40 text-xs font-medium text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)]"
        >
          <Layers className="w-4 h-4 text-[#00FF88]" />
          <span className="hidden sm:inline font-display text-xs">Portfolio</span>
          {totalActive > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00FF88] px-1 text-[10px] font-mono font-bold text-[#05080E] shadow-[0_0_8px_rgba(0,255,136,0.6)]">
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
