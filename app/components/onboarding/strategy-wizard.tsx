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
          ? "fixed inset-0 z-50 bg-black/60 animate-in fade-in"
          : "min-h-[85vh] py-8"
      }`}
    >
      <div className="ink-border ink-shadow-lg w-full max-w-xl bg-paper-white text-left">
        {/* Stub header */}
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
            Roaring Bulls • Strategy Form
          </span>
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sol-pink" />
            <span className="h-2 w-2 rounded-full bg-sol-yellow" />
            <span className="h-2 w-2 rounded-full bg-sol-green" />
          </span>
        </div>

        <div className="ink-frame space-y-5 p-5 sm:p-6">
          {/* Step counter + close */}
          <div className="flex items-center justify-between">
            <span className="ink-border-thin inline-block -rotate-1 bg-sol-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
              Step {step} of 3 • Portfolio Strategy
            </span>

            {isModal && (
              <button
                onClick={onClose}
                className="ink-border-thin ink-press cursor-pointer p-1.5 text-ink"
                aria-label="Close strategy setup"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Step Progress: numbered boxes */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`ink-border-thin flex h-8 items-center justify-center gap-1.5 font-mono text-[11px] font-bold ${
                  s < step
                    ? "bg-sol-green text-ink"
                    : s === step
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink/40"
                }`}
              >
                {s < step ? (
                  <Check className="h-3 w-3" strokeWidth={4} />
                ) : null}
                {s < step ? "DONE" : `STEP ${s}`}
              </div>
            ))}
          </div>

          {/* STEP 1: Quote Currency */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Choose your Quote Currency
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  How would you like your swipe budget and order execution to be denominated?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* SOL Option */}
                <button
                  type="button"
                  onClick={() => handleCurrencySelect("SOL")}
                  className={`ink-border cursor-pointer p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selectedCurrency === "SOL"
                      ? "ink-shadow bg-paper-mint"
                      : "ink-shadow-sm bg-paper-white"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="ink-border-thin flex h-9 w-9 items-center justify-center bg-sol-violet text-base font-bold text-white">
                      ◎
                    </span>
                    {selectedCurrency === "SOL" && (
                      <span className="ink-border-thin flex h-6 w-6 items-center justify-center bg-sol-green text-ink">
                        <Check className="h-4 w-4" strokeWidth={4} />
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-ink">
                    SOL (Native Gas)
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/70">
                    Recommended for Devnet airdrops. Zero swap friction and native pairing with StonkFun.
                  </p>
                  <span className="ink-border-thin mt-3 inline-block bg-sol-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">
                    Devnet Recommended
                  </span>
                </button>

                {/* USDC Option */}
                <button
                  type="button"
                  onClick={() => handleCurrencySelect("USDC")}
                  className={`ink-border cursor-pointer p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selectedCurrency === "USDC"
                      ? "ink-shadow bg-paper-mint"
                      : "ink-shadow-sm bg-paper-white"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="ink-border-thin flex h-9 w-9 items-center justify-center bg-sol-green text-base font-black text-ink">
                      $
                    </span>
                    {selectedCurrency === "USDC" && (
                      <span className="ink-border-thin flex h-6 w-6 items-center justify-center bg-sol-green text-ink">
                        <Check className="h-4 w-4" strokeWidth={4} />
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-ink">
                    USDC (Stable Dollar)
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/70">
                    Fixed $1.00 USD peg. Stable accounting with exact dollar budgets and prices.
                  </p>
                  <span className="ink-border-thin mt-3 inline-block bg-paper-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">
                    Fixed Dollar Peg
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Risk Appetite */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Select your Risk Appetite
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  Your chosen tier filters the swipe deck to the asset class matching your strategy.
                </p>
              </div>

              <div className="space-y-3">
                {/* Conservative */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("conservative")}
                  className={`ink-border flex w-full cursor-pointer items-start gap-3.5 p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selectedTier === "conservative"
                      ? "ink-shadow bg-paper-mint"
                      : "ink-shadow-sm bg-paper-white"
                  }`}
                >
                  <span className="ink-border-thin flex h-10 w-10 shrink-0 items-center justify-center bg-sol-green text-ink">
                    <Shield className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink">
                        Conservative • Public Blue Chips
                      </span>
                      {selectedTier === "conservative" && (
                        <span className="ink-border-thin flex h-5 w-5 items-center justify-center bg-sol-green text-ink">
                          <Check className="h-3.5 w-3.5" strokeWidth={4} />
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink/70">
                      Backed 1:1 tokenized equities (TSLAx, NVDAx, AAPLx, SPYx, COINx) with regulated custody and low volatility.
                    </span>
                  </span>
                </button>

                {/* Balanced */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("balanced")}
                  className={`ink-border flex w-full cursor-pointer items-start gap-3.5 p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selectedTier === "balanced"
                      ? "ink-shadow bg-paper-violet"
                      : "ink-shadow-sm bg-paper-white"
                  }`}
                >
                  <span className="ink-border-thin flex h-10 w-10 shrink-0 items-center justify-center bg-sol-violet text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink">
                        Balanced • Pre-IPO Unicorns
                      </span>
                      {selectedTier === "balanced" && (
                        <span className="ink-border-thin flex h-5 w-5 items-center justify-center bg-sol-violet text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={4} />
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink/70">
                      PreStocks & Tessera T-Tokens (SpaceX, OpenAI, Anthropic, Kalshi, Stripe) backed by Cayman SPVs with Proof of Reserve.
                    </span>
                  </span>
                </button>

                {/* Degen */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("degen")}
                  className={`ink-border flex w-full cursor-pointer items-start gap-3.5 p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selectedTier === "degen"
                      ? "ink-shadow bg-paper-rose"
                      : "ink-shadow-sm bg-paper-white"
                  }`}
                >
                  <span className="ink-border-thin flex h-10 w-10 shrink-0 items-center justify-center bg-sol-pink text-white">
                    <Flame className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink">
                        Degen • Equity-Paired Memecoins
                      </span>
                      {selectedTier === "degen" && (
                        <span className="ink-border-thin flex h-5 w-5 items-center justify-center bg-sol-pink text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={4} />
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink/70">
                      StonkFun LaunchLab bonding curves (TSLADOGE, NVDAAPE, ELONX, STONK) paired directly against tokenized equities.
                    </span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Swipe Sizing */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Set Session Budget & Swipe Size
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  Decide how much you want to allocate in this session and each time you swipe right.
                </p>
              </div>

              {/* Total Budget */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                  Total Session Budget ({selectedCurrency})
                </label>
                <div className="flex gap-2">
                  {budgetPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBudgetInput(val.toString())}
                      className={`ink-border-thin flex-1 cursor-pointer py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                        budgetInput === val.toString()
                          ? "bg-sol-green text-ink"
                          : "bg-paper-white text-ink/60"
                      }`}
                    >
                      {val} {selectedCurrency}
                    </button>
                  ))}
                </div>
                <div className="ink-border-thin flex items-center bg-paper">
                  <span className="border-r-[1.5px] border-ink/20 px-3 font-mono text-xs font-bold text-ink/50">
                    {selectedCurrency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 font-mono text-sm font-bold text-ink outline-none tabular-nums"
                    placeholder="Custom budget..."
                  />
                </div>
              </div>

              {/* Swipe Allocation */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                  Allocation per Swipe ({selectedCurrency})
                </label>
                <div className="flex gap-2">
                  {allocPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAllocInput(val.toString())}
                      className={`ink-border-thin flex-1 cursor-pointer py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                        allocInput === val.toString()
                          ? "bg-sol-green text-ink"
                          : "bg-paper-white text-ink/60"
                      }`}
                    >
                      {val} {selectedCurrency}
                    </button>
                  ))}
                </div>
                <div className="ink-border-thin flex items-center bg-paper">
                  <span className="border-r-[1.5px] border-ink/20 px-3 font-mono text-xs font-bold text-ink/50">
                    {selectedCurrency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={allocInput}
                    onChange={(e) => setAllocInput(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 font-mono text-sm font-bold text-ink outline-none tabular-nums"
                    placeholder="Custom swipe allocation..."
                  />
                </div>
              </div>

              {/* Quick Strategy Summary — clean stat box */}
              <div className="ink-border-thin grid grid-cols-2 divide-x-[1.5px] divide-ink/20 bg-paper">
                <div className="space-y-0.5 p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Estimated Swipes
                  </span>
                  <p className="text-lg font-bold tabular-nums text-ink">
                    ~
                    {Math.max(
                      1,
                      Math.floor(
                        (parseFloat(budgetInput) || 1) /
                          (parseFloat(allocInput) || 1)
                      )
                    )}{" "}
                    assets
                  </p>
                </div>
                <div className="space-y-0.5 p-3.5 text-right">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Target Universe
                  </span>
                  <p className="text-lg font-bold capitalize text-ink">
                    {selectedTier} Tier
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between border-t-2 border-dashed border-ink/50 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="ink-border-thin ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-paper-white px-4 py-2.5 text-xs font-bold text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={3} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-sol-green px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink"
              >
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="ink-border ink-shadow ink-press flex cursor-pointer items-center gap-2 bg-sol-green px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink"
              >
                <span>Start Swiping & Investing</span>
                <ArrowRight className="h-4 w-4" strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
