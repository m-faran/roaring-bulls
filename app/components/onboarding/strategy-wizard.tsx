"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { RiskTier } from "@/app/lib/data/stocks-catalog";
import { Check, ArrowLeft, ArrowRight, X, Shield, Sparkles, Flame } from "lucide-react";

interface StrategyWizardProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function StrategyWizard({
  isModal = false,
  onClose,
}: StrategyWizardProps) {
  const {
    riskTier,
    setRiskTier,
    currency,
    setCurrency,
    sessionBudget,
    setSessionBudget,
    allocationPerSwipe,
    setAllocationPerSwipe,
    setHasCompletedOnboarding,
  } = useBasket();

  const [step, setStep] = useState<number>(1);
  const [selectedCurrency, setSelectedCurrency] = useState<"SOL" | "USDC">(
    currency
  );
  const [selectedTier, setSelectedTier] = useState<RiskTier>(riskTier);
  const [budgetInput, setBudgetInput] = useState<string>(
    sessionBudget.toString()
  );
  const [allocInput, setAllocInput] = useState<string>(
    allocationPerSwipe.toString()
  );

  const solBudgetPresets = [0.1, 0.25, 0.5, 1.0];
  const usdcBudgetPresets = [25, 50, 100, 250];
  const budgetPresets =
    selectedCurrency === "SOL" ? solBudgetPresets : usdcBudgetPresets;

  const solAllocPresets = [0.02, 0.05, 0.1];
  const usdcAllocPresets = [5, 10, 20];
  const allocPresets =
    selectedCurrency === "SOL" ? solAllocPresets : usdcAllocPresets;

  const handleCurrencySelect = (curr: "SOL" | "USDC") => {
    setSelectedCurrency(curr);
    if (curr === "SOL") {
      setBudgetInput("0.25");
      setAllocInput("0.05");
    } else {
      setBudgetInput("50");
      setAllocInput("10");
    }
  };

  const handleFinish = () => {
    setCurrency(selectedCurrency);
    setRiskTier(selectedTier);
    const b = parseFloat(budgetInput);
    const a = parseFloat(allocInput);
    if (!isNaN(b) && b > 0) setSessionBudget(b);
    if (!isNaN(a) && a > 0) setAllocationPerSwipe(a);

    setHasCompletedOnboarding(true);
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full flex items-center justify-center p-4 ${
        isModal
          ? "fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl animate-in fade-in"
          : "min-h-[85vh] py-8"
      }`}
    >
      <div className="w-full max-w-xl rounded-3xl border border-cyan-500/30 bg-[#0A111F]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] space-y-6 text-left relative overflow-hidden">
        {/* Decorative corner HUD markers */}
        <span className="absolute top-3 left-3 text-[9px] font-mono text-cyan-500/40 pointer-events-none">
          ┌
        </span>
        <span className="absolute top-3 right-3 text-[9px] font-mono text-cyan-500/40 pointer-events-none">
          ┐
        </span>
        <span className="absolute bottom-3 left-3 text-[9px] font-mono text-cyan-500/40 pointer-events-none">
          └
        </span>
        <span className="absolute bottom-3 right-3 text-[9px] font-mono text-cyan-500/40 pointer-events-none">
          ┘
        </span>

        {/* Wizard Header with Steps Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] font-display font-black text-xs shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                {step}
              </div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400">
                Step {step} of 3 • Portfolio Strategy
              </span>
            </div>

            {isModal && (
              <button
                onClick={onClose}
                className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-gradient-to-r from-[#00FF88] to-[#00F0FF] shadow-[0_0_10px_#00FF88]"
                    : "bg-[#101A2E]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Quote Currency */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                Choose your Quote Currency
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                How would you like your swipe budget and order execution to be denominated?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* SOL Option */}
              <button
                type="button"
                onClick={() => handleCurrencySelect("SOL")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                  selectedCurrency === "SOL"
                    ? "border-[#00FF88] bg-[#00FF88]/10 shadow-[0_0_20px_rgba(0,255,136,0.2)] ring-1 ring-[#00FF88]/60"
                    : "border-cyan-500/20 bg-[#05080E] hover:bg-[#080E1C] hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
                    ◎
                  </div>
                  {selectedCurrency === "SOL" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF88] text-[#05080E] text-xs font-black shadow-[0_0_8px_#00FF88]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-white">
                  SOL (Native Gas)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Recommended for Devnet airdrops. Zero swap friction and native pairing with StonkFun.
                </p>
                <div className="mt-3 inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30">
                  Devnet Recommended
                </div>
              </button>

              {/* USDC Option */}
              <button
                type="button"
                onClick={() => handleCurrencySelect("USDC")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                  selectedCurrency === "USDC"
                    ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)] ring-1 ring-[#00F0FF]/60"
                    : "border-cyan-500/20 bg-[#05080E] hover:bg-[#080E1C] hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                    $
                  </div>
                  {selectedCurrency === "USDC" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[#05080E] text-xs font-black shadow-[0_0_8px_#00F0FF]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-white">
                  USDC (Stable Dollar)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fixed $1.00 USD peg. Stable accounting with exact dollar budgets and prices.
                </p>
                <div className="mt-3 inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                  Fixed Dollar Peg
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Risk Appetite */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                Select your Risk Appetite
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your chosen tier filters the swipe deck to the asset class matching your strategy.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Conservative */}
              <button
                type="button"
                onClick={() => setSelectedTier("conservative")}
                className={`cursor-pointer w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  selectedTier === "conservative"
                    ? "border-[#00FF88] bg-[#00FF88]/10 shadow-[0_0_20px_rgba(0,255,136,0.2)] ring-1 ring-[#00FF88]/50"
                    : "border-cyan-500/20 bg-[#05080E] hover:bg-[#080E1C] hover:border-cyan-500/40"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white">
                      Conservative • Public Blue Chips
                    </h3>
                    {selectedTier === "conservative" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF88] text-[#05080E] text-xs font-black shadow-[0_0_8px_#00FF88]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Backed 1:1 tokenized equities (TSLAx, NVDAx, AAPLx, SPYx, COINx) with regulated custody and low volatility.
                  </p>
                </div>
              </button>

              {/* Balanced */}
              <button
                type="button"
                onClick={() => setSelectedTier("balanced")}
                className={`cursor-pointer w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  selectedTier === "balanced"
                    ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)] ring-1 ring-[#00F0FF]/50"
                    : "border-cyan-500/20 bg-[#05080E] hover:bg-[#080E1C] hover:border-cyan-500/40"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white">
                      Balanced • Pre-IPO Unicorns
                    </h3>
                    {selectedTier === "balanced" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[#05080E] text-xs font-black shadow-[0_0_8px_#00F0FF]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    PreStocks & Tessera T-Tokens (SpaceX, OpenAI, Anthropic, Kalshi, Stripe) backed by Cayman SPVs with Proof of Reserve.
                  </p>
                </div>
              </button>

              {/* Degen */}
              <button
                type="button"
                onClick={() => setSelectedTier("degen")}
                className={`cursor-pointer w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  selectedTier === "degen"
                    ? "border-[#FF1B6B] bg-[#FF1B6B]/10 shadow-[0_0_20px_rgba(255,27,107,0.2)] ring-1 ring-[#FF1B6B]/50"
                    : "border-cyan-500/20 bg-[#05080E] hover:bg-[#080E1C] hover:border-cyan-500/40"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FF1B6B]/15 border border-[#FF1B6B]/40 flex items-center justify-center text-[#FF1B6B] shadow-[0_0_10px_rgba(255,27,107,0.2)]">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white">
                      Degen • Equity-Paired Memecoins
                    </h3>
                    {selectedTier === "degen" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF1B6B] text-white text-xs font-black shadow-[0_0_8px_#FF1B6B]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    StonkFun LaunchLab bonding curves (TSLADOGE, NVDAAPE, ELONX, STONK) paired directly against tokenized equities.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Budget & Swipe Sizing */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                Set Session Budget & Swipe Size
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Decide how much you want to allocate in this session and each time you swipe right.
              </p>
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 font-display">
                Total Session Budget ({selectedCurrency})
              </label>
              <div className="flex gap-2">
                {budgetPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudgetInput(val.toString())}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      budgetInput === val.toString()
                        ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.25)]"
                        : "border-cyan-500/20 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/40"
                    }`}
                  >
                    {val} {selectedCurrency}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="any"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080E] border border-cyan-500/20 text-sm font-mono text-white focus:border-[#00FF88] outline-none tabular-nums shadow-inner transition-colors"
                placeholder="Custom budget..."
              />
            </div>

            {/* Swipe Allocation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 font-display">
                Allocation per Swipe ({selectedCurrency})
              </label>
              <div className="flex gap-2">
                {allocPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAllocInput(val.toString())}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      allocInput === val.toString()
                        ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.25)]"
                        : "border-cyan-500/20 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/40"
                    }`}
                  >
                    {val} {selectedCurrency}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="any"
                value={allocInput}
                onChange={(e) => setAllocInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080E] border border-cyan-500/20 text-sm font-mono text-white focus:border-[#00FF88] outline-none tabular-nums shadow-inner transition-colors"
                placeholder="Custom swipe allocation..."
              />
            </div>

            {/* Quick Strategy Summary Box */}
            <div className="rounded-2xl border border-cyan-500/25 bg-[#05080E] p-4 flex items-center justify-between text-xs shadow-inner">
              <div className="space-y-0.5 font-mono">
                <span className="text-slate-400 text-[11px]">Estimated Swipes:</span>
                <p className="font-bold text-white text-sm">
                  ~
                  {Math.max(
                    1,
                    Math.floor(
                      (parseFloat(budgetInput) || 1) /
                        (parseFloat(allocInput) || 1)
                    )
                  )}{" "}
                  assets in basket
                </p>
              </div>
              <div className="text-right space-y-0.5 font-mono">
                <span className="text-slate-400 text-[11px]">Target Universe:</span>
                <p className="font-bold text-[#00FF88] capitalize text-sm font-display">
                  {selectedTier} Tier
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-cyan-500/20 bg-[#05080E] hover:bg-[#101A2E] text-xs font-display font-semibold text-slate-300 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.35)] transition flex items-center gap-1.5 hover:scale-105"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] via-[#00F0FF] to-[#00FF88] hover:opacity-95 text-[#05080E] text-xs font-display font-black shadow-[0_0_25px_rgba(0,255,136,0.45)] transition flex items-center gap-2 hover:scale-105"
            >
              <span>Start Swiping & Investing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
