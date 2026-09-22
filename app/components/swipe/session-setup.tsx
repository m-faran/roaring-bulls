"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { Sliders, X } from "lucide-react";

export function SessionSetupModal() {
  const {
    isSessionSetupOpen,
    setIsSessionSetupOpen,
    sessionBudget,
    setSessionBudget,
    allocationPerSwipe,
    setAllocationPerSwipe,
    currency,
    setCurrency,
  } = useBasket();

  const [budgetInput, setBudgetInput] = useState(sessionBudget.toString());
  const [allocInput, setAllocInput] = useState(allocationPerSwipe.toString());

  if (!isSessionSetupOpen) return null;

  const solBudgetPresets = [0.1, 0.25, 0.5, 1.0];
  const usdcBudgetPresets = [15, 30, 50, 100];
  const budgetPresets = currency === "SOL" ? solBudgetPresets : usdcBudgetPresets;

  const solAllocPresets = [0.02, 0.05, 0.1];
  const usdcAllocPresets = [3, 6, 10];
  const allocPresets = currency === "SOL" ? solAllocPresets : usdcAllocPresets;

  const handleSave = () => {
    const bVal = parseFloat(budgetInput);
    const aVal = parseFloat(allocInput);
    if (!isNaN(bVal) && bVal > 0) {
      setSessionBudget(bVal);
    }
    if (!isNaN(aVal) && aVal > 0) {
      setAllocationPerSwipe(aVal);
    }
    setIsSessionSetupOpen(false);
  };

  const handleCurrencyChange = (newCurr: "SOL" | "USDC") => {
    setCurrency(newCurr);
    if (newCurr === "SOL") {
      setBudgetInput("0.25");
      setAllocInput("0.05");
    } else {
      setBudgetInput("35");
      setAllocInput("7");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="ink-border ink-shadow-lg w-full max-w-md bg-paper-white">
        {/* Stub header */}
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
            Roaring Bulls • Session Setup
          </span>
          <button
            onClick={() => setIsSessionSetupOpen(false)}
            className="cursor-pointer text-paper transition-opacity hover:opacity-70"
            aria-label="Close session setup"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>

        <div className="ink-frame space-y-5 p-5">
          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <span className="ink-border-thin flex h-10 w-10 items-center justify-center bg-sol-yellow text-ink">
              <Sliders className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">
                Session Setup
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink/60">
                Configure your investment budget & swipe sizes
              </p>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
              Quote Currency
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleCurrencyChange("SOL")}
                className={`ink-border-thin cursor-pointer p-3 text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                  currency === "SOL"
                    ? "bg-paper-mint text-ink"
                    : "bg-paper-white text-ink/60"
                }`}
              >
                SOL (Native Gas)
              </button>
              <button
                onClick={() => handleCurrencyChange("USDC")}
                className={`ink-border-thin cursor-pointer p-3 text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                  currency === "USDC"
                    ? "bg-paper-mint text-ink"
                    : "bg-paper-white text-ink/60"
                }`}
              >
                USDC (Fixed Dollar)
              </button>
            </div>
          </div>

          {/* Total Session Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                Total Session Budget
              </label>
              <span className="font-mono text-[10px] tabular-nums text-ink/60">
                Current: {sessionBudget} {currency}
              </span>
            </div>

            <div className="flex gap-2">
              {budgetPresets.map((val) => (
                <button
                  key={val}
                  onClick={() => setBudgetInput(val.toString())}
                  className={`ink-border-thin flex-1 cursor-pointer py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                    budgetInput === val.toString()
                      ? "bg-sol-green text-ink"
                      : "bg-paper-white text-ink/60"
                  }`}
                >
                  {val} {currency}
                </button>
              ))}
            </div>

            <div className="ink-border-thin flex items-center bg-paper">
              <span className="border-r-[1.5px] border-ink/20 px-3 font-mono text-xs font-bold text-ink/50">
                {currency}
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

          {/* Allocation per Swipe */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                Allocation per Swipe
              </label>
              <span className="font-mono text-[10px] tabular-nums text-ink/60">
                Current: {allocationPerSwipe} {currency}
              </span>
            </div>

            <div className="flex gap-2">
              {allocPresets.map((val) => (
                <button
                  key={val}
                  onClick={() => setAllocInput(val.toString())}
                  className={`ink-border-thin flex-1 cursor-pointer py-2 font-mono text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                    allocInput === val.toString()
                      ? "bg-sol-green text-ink"
                      : "bg-paper-white text-ink/60"
                  }`}
                >
                  {val} {currency}
                </button>
              ))}
            </div>

            <div className="ink-border-thin flex items-center bg-paper">
              <span className="border-r-[1.5px] border-ink/20 px-3 font-mono text-xs font-bold text-ink/50">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                value={allocInput}
                onChange={(e) => setAllocInput(e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 font-mono text-sm font-bold text-ink outline-none tabular-nums"
                placeholder="Custom allocation..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 border-t-2 border-dashed border-ink/50 pt-4">
            <button
              onClick={() => setIsSessionSetupOpen(false)}
              className="ink-border-thin ink-shadow-sm ink-press flex-1 cursor-pointer py-2.5 text-xs font-bold text-ink"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ink-border ink-shadow-sm ink-press flex-1 cursor-pointer bg-sol-green py-2.5 text-xs font-bold uppercase tracking-wide text-ink"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
