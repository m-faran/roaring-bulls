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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#0A111F] p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#05080E] border border-cyan-500/20 text-[#00FF88] shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Session Setup
              </h3>
              <p className="text-xs text-slate-400">
                Configure your investment budget & swipe sizes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSessionSetupOpen(false)}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 font-display">
            Quote Currency
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleCurrencyChange("SOL")}
              className={`cursor-pointer p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                currency === "SOL"
                  ? "border-[#00FF88] bg-[#00FF88]/15 text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.2)]"
                  : "border-cyan-500/15 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/30"
              }`}
            >
              <span>SOL (Native Gas & StonkFun)</span>
            </button>
            <button
              onClick={() => handleCurrencyChange("USDC")}
              className={`cursor-pointer p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                currency === "USDC"
                  ? "border-[#00FF88] bg-[#00FF88]/15 text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.2)]"
                  : "border-cyan-500/15 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/30"
              }`}
            >
              <span>USDC (Fixed Dollar)</span>
            </button>
          </div>
        </div>

        {/* Total Session Budget */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300 font-display">
              Total Session Budget
            </label>
            <span className="text-slate-400 font-mono text-[11px]">
              Current: {sessionBudget} {currency}
            </span>
          </div>

          <div className="flex gap-2">
            {budgetPresets.map((val) => (
              <button
                key={val}
                onClick={() => setBudgetInput(val.toString())}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  budgetInput === val.toString()
                    ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.25)]"
                    : "border-cyan-500/15 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/30"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080E] border border-cyan-500/20 text-sm font-mono text-white focus:border-[#00FF88] outline-none shadow-inner transition-colors"
            placeholder="Custom budget..."
          />
        </div>

        {/* Allocation per Swipe */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300 font-display">
              Allocation per Swipe
            </label>
            <span className="text-slate-400 font-mono text-[11px]">
              Current: {allocationPerSwipe} {currency}
            </span>
          </div>

          <div className="flex gap-2">
            {allocPresets.map((val) => (
              <button
                key={val}
                onClick={() => setAllocInput(val.toString())}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  allocInput === val.toString()
                    ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.25)]"
                    : "border-cyan-500/15 bg-[#05080E] text-slate-400 hover:text-white hover:border-cyan-500/30"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080E] border border-cyan-500/20 text-sm font-mono text-white focus:border-[#00FF88] outline-none shadow-inner transition-colors"
            placeholder="Custom allocation..."
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => setIsSessionSetupOpen(false)}
            className="flex-1 cursor-pointer py-2.5 rounded-xl border border-cyan-500/20 text-xs font-display font-semibold text-slate-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 cursor-pointer py-2.5 rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition hover:scale-105"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
