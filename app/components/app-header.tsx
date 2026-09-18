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
  const paper = activeTab === "landing";

  return (
    <header
      className={`mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sticky top-0 z-30 transition-all ${
        paper
          ? "paper-texture border-b-[3px] border-[#111111]"
          : "border-b border-cyan-500/15 bg-[#05080E]/90 backdrop-blur-xl"
      }`}
    >
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className="cursor-pointer flex items-center gap-2.5 text-left group"
        >
          {/* Logo Badge: paper sticker on landing, cyber badge in app */}
          <div
            className={`relative h-9 w-9 flex items-center justify-center ${
              paper
                ? "ink-border ink-shadow-sm bg-[#14F195] text-[#111111] group-hover:rotate-6"
                : "rounded-xl bg-gradient-to-br from-[#00FF88] via-[#00F0FF] to-[#0A111F] p-[1.5px] shadow-[0_0_15px_rgba(0,255,136,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.5)]"
            } transition-all duration-300`}
          >
            <div
              className={`h-full w-full flex items-center justify-center font-display font-black text-base transition-transform ${
                paper
                  ? "text-[#111111] group-hover:scale-105"
                  : "rounded-[10px] bg-[#05080E] text-[#00FF88] group-hover:scale-105"
              }`}
            >
              S
            </div>
            {!paper && (
              /* Corner cyber accent */
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping opacity-75" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-display font-black tracking-tight transition-colors ${
                  paper
                    ? "text-[#111111]"
                    : "text-white group-hover:text-[#00FF88]"
                }`}
              >
                Swpper
              </span>
              <span
                className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 ${
                  paper
                    ? "ink-border-thin bg-[#FFD23F] text-[#111111]"
                    : "rounded-md bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_10px_rgba(0,255,136,0.15)]"
                }`}
              >
                Stocks
              </span>
            </div>
            <p
              className={`text-[10px] hidden sm:block font-mono tracking-tight ${
                paper ? "text-[#111111]/70" : "text-slate-400"
              }`}
            >
              Swipe DCA for Tokenized Equities
            </p>
          </div>
        </button>

        {/* View Switcher: Overview vs Swipe Deck */}
        <div
          className={`flex items-center p-1 text-xs font-semibold ${
            paper
              ? "ink-border-thin bg-white text-[#111111]"
              : "rounded-xl bg-[#0A111F] border border-cyan-500/20 shadow-inner"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("landing")}
            className={`cursor-pointer px-3.5 py-1.5 font-display transition-all duration-200 text-xs ${
              paper
                ? "bg-[#FFD23F] ink-border-thin font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("app")}
            className={`cursor-pointer px-3.5 py-1.5 font-display transition-all duration-200 flex items-center gap-2 text-xs ${
              paper
                ? "opacity-60 hover:opacity-100"
                : activeTab === "app"
                  ? "bg-[#00FF88] text-[#05080E] font-bold shadow-[0_0_16px_rgba(0,255,136,0.4)] rounded-lg"
                  : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Swipe Deck</span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                paper
                  ? "bg-[#111111]"
                  : activeTab === "app"
                    ? "bg-[#05080E] animate-pulse"
                    : "bg-[#00FF88]"
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
          className={`cursor-pointer sm:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium ${
            paper
              ? "ink-border-thin bg-white text-[#111111]"
              : "rounded-lg border border-cyan-500/20 bg-[#0A111F] text-slate-300 active:bg-cyan-500/10"
          }`}
        >
          <span>Setup</span>
        </button>

        {/* Portfolio Drawer Button */}
        <button
          onClick={() => setIsPortfolioOpen(true)}
          className={`cursor-pointer relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium transition-all ${
            paper
              ? "ink-border ink-shadow-sm ink-press bg-[#FF5C8A] text-white"
              : "rounded-xl border border-cyan-500/20 bg-[#0A111F] hover:bg-[#101A2E] hover:border-cyan-500/40 text-white shadow-[0_0_10px_rgba(0,240,255,0.1)]"
          }`}
        >
          <Layers className={`w-4 h-4 ${paper ? "text-white" : "text-[#00FF88]"}`} />
          <span className="hidden sm:inline font-display text-xs">Portfolio</span>
          {totalActive > 0 && (
            <span
              className={`flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-mono font-bold ${
                paper
                  ? "ink-border-thin bg-white text-[#111111]"
                  : "rounded-full bg-[#00FF88] text-[#05080E] shadow-[0_0_8px_rgba(0,255,136,0.6)]"
              }`}
            >
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
