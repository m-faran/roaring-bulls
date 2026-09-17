"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { RiskTier } from "@/app/lib/data/stocks-catalog";

interface StrategyWizardProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function StrategyWizard({ isModal = false, onClose }: StrategyWizardProps) {
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
  const [selectedCurrency, setSelectedCurrency] = useState<"SOL" | "USDC">(currency);
  const [selectedTier, setSelectedTier] = useState<RiskTier>(riskTier);
  const [budgetInput, setBudgetInput] = useState<string>(sessionBudget.toString());
  const [allocInput, setAllocInput] = useState<string>(allocationPerSwipe.toString());

  const solBudgetPresets = [0.1, 0.25, 0.5, 1.0];
  const usdcBudgetPresets = [25, 50, 100, 250];
  const budgetPresets = selectedCurrency === "SOL" ? solBudgetPresets : usdcBudgetPresets;

  const solAllocPresets = [0.02, 0.05, 0.1];
  const usdcAllocPresets = [5, 10, 20];
  const allocPresets = selectedCurrency === "SOL" ? solAllocPresets : usdcAllocPresets;

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
          ? "fixed inset-0 z-50 bg-black/80 backdrop-blur-xl animate-in fade-in"
          : "min-h-[85vh] py-8"
      }`}
    >
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0B0F19]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        {/* Wizard Header with Steps Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {step}
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Step {step} of 3 • Portfolio Strategy
              </span>
            </div>

            {isModal && (
              <button
                onClick={onClose}
                className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-emerald-400" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Quote Currency */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Choose your Quote Currency
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                How would you like your swipe budget and order execution to be denominated?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* SOL Option */}
              <button
                type="button"
                onClick={() => handleCurrencySelect("SOL")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                  selectedCurrency === "SOL"
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
                    ◎
                  </div>
                  {selectedCurrency === "SOL" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">SOL (Native Gas)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Recommended for Devnet airdrops. Zero swap friction and native pairing with StonkFun.
                </p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                  Devnet Recommended
                </div>
              </button>

              {/* USDC Option */}
              <button
                type="button"
                onClick={() => handleCurrencySelect("USDC")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                  selectedCurrency === "USDC"
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow">
                    $
                  </div>
                  {selectedCurrency === "USDC" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">USDC (Stable Dollar)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fixed $1.00 USD peg. Stable accounting with exact dollar budgets and prices.
                </p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
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
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
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
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Conservative • Public Blue Chips</h3>
                    {selectedTier === "conservative" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
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
                    ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Balanced • Pre-IPO Unicorns</h3>
                    {selectedTier === "balanced" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
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
                    ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Degen • Equity-Paired Memecoins</h3>
                    {selectedTier === "degen" && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
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
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Set Session Budget & Swipe Size
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Decide how much you want to allocate in this session and each time you swipe right.
              </p>
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Total Session Budget ({selectedCurrency})
              </label>
              <div className="flex gap-2">
                {budgetPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudgetInput(val.toString())}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      budgetInput === val.toString()
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow"
                        : "border-white/10 bg-slate-900/80 text-slate-400 hover:text-white"
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:border-emerald-500 outline-none tabular-nums"
                placeholder="Custom budget..."
              />
            </div>

            {/* Swipe Allocation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Allocation per Swipe ({selectedCurrency})
              </label>
              <div className="flex gap-2">
                {allocPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAllocInput(val.toString())}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      allocInput === val.toString()
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow"
                        : "border-white/10 bg-slate-900/80 text-slate-400 hover:text-white"
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:border-emerald-500 outline-none tabular-nums"
                placeholder="Custom swipe allocation..."
              />
            </div>

            {/* Quick Strategy Summary Box */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400">Estimated Swipes:</span>
                <p className="font-bold text-white">
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
              <div className="text-right space-y-0.5">
                <span className="text-slate-400">Target Universe:</span>
                <p className="font-bold text-emerald-400 capitalize">{selectedTier} Tier</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:opacity-90 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
            >
              <span>Start Swiping & Investing</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
