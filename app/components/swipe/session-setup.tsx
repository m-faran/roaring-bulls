"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-white/10 text-emerald-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Session Setup</h3>
              <p className="text-xs text-slate-400">Configure your investment budget & swipe sizes</p>
            </div>
          </div>

          <button
            onClick={() => setIsSessionSetupOpen(false)}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Quote Currency</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCurrencyChange("SOL")}
              className={`cursor-pointer p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                currency === "SOL"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-white/5 bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <span>SOL (Native Gas & StonkFun)</span>
            </button>
            <button
              onClick={() => handleCurrencyChange("USDC")}
              className={`cursor-pointer p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                currency === "USDC"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-white/5 bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <span>USDC (Fixed Dollar)</span>
            </button>
          </div>
        </div>

        {/* Total Session Budget */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300">Total Session Budget</label>
            <span className="text-slate-400 font-mono">Current: {sessionBudget} {currency}</span>
          </div>

          <div className="flex gap-2">
            {budgetPresets.map((val) => (
              <button
                key={val}
                onClick={() => setBudgetInput(val.toString())}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  budgetInput === val.toString()
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-white/5 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {val} {currency}
              </button>
            ))}
          </div>

          <input
            type="number"
            step="any"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:border-emerald-500 outline-none"
            placeholder="Custom budget..."
          />
        </div>

        {/* Allocation per Swipe */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300">Allocation per Swipe</label>
            <span className="text-slate-400 font-mono">Current: {allocationPerSwipe} {currency}</span>
          </div>

          <div className="flex gap-2">
            {allocPresets.map((val) => (
              <button
                key={val}
                onClick={() => setAllocInput(val.toString())}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  allocInput === val.toString()
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-white/5 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {val} {currency}
              </button>
            ))}
          </div>

          <input
            type="number"
            step="any"
            value={allocInput}
            onChange={(e) => setAllocInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:border-emerald-500 outline-none"
            placeholder="Custom allocation..."
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => setIsSessionSetupOpen(false)}
            className="flex-1 cursor-pointer py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 cursor-pointer py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
