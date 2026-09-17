"use client";

import React from "react";
import { useBasket } from "@/app/lib/store/basket-context";

interface BottomActionBarProps {
  onSkip?: () => void;
}

export function BottomActionBar({ onSkip }: BottomActionBarProps) {
  const { basket, totalAllocated, currency, setIsBasketOpen } = useBasket();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070A12]/95 backdrop-blur-2xl py-3 px-4 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="cursor-pointer flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/20 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Skip</span>
        </button>

        {/* Review Basket Button */}
        <button
          onClick={() => setIsBasketOpen(true)}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-white transition-all duration-200 shadow-inner"
        >
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Review basket</span>
          <span className="flex items-center justify-center px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
            {basket.length}
          </span>
          {basket.length > 0 && (
            <span className="text-slate-400 text-[11px] hidden sm:inline tabular-nums">
              ({totalAllocated} {currency})
            </span>
          )}
        </button>

        {/* Check Routes Primary CTA */}
        <button
          onClick={() => setIsBasketOpen(true)}
          disabled={basket.length === 0}
          className="cursor-pointer flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
        >
          <span>Check routes</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
