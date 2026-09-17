"use client";

import React from "react";
import { useBasket } from "@/app/lib/store/basket-context";

interface BottomActionBarProps {
  onSkip?: () => void;
}

export function BottomActionBar({ onSkip }: BottomActionBarProps) {
  const { basket, totalAllocated, currency, setIsBasketOpen, triggerSwipe } = useBasket();

  const handleSkip = () => {
    if (onSkip) onSkip();
    triggerSwipe("left");
  };

  const handleAdd = () => {
    triggerSwipe("right");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070A12]/95 backdrop-blur-2xl py-3 px-4 sm:px-6 shadow-2xl">
      <div className="max-w-6xl w-full mx-auto">
        {/* Mobile View: Single Row (< lg) */}
        <div className="flex lg:hidden items-center justify-between gap-3">
          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/20 transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Skip</span>
          </button>

          {/* Review Basket Button */}
          <button
            type="button"
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
            type="button"
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

        {/* Desktop View: Dual Pods Aligned with the 12-Column Grid (lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Left Pod: Under Swipe Deck (7 Columns) */}
          <div className="col-span-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-rose-500/20 bg-rose-950/30 hover:bg-rose-950/60 hover:border-rose-500/40 text-rose-300 text-xs font-bold transition shadow-sm hover:scale-105"
              title="Skip asset (or press Left Arrow)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Skip Asset (Left)</span>
            </button>

            <span className="text-[11px] text-slate-500 font-medium">
              or swipe card with touch / mouse
            </span>

            <button
              type="button"
              onClick={handleAdd}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition hover:scale-105"
              title="Add to basket (or press Right Arrow)"
            >
              <span>Add to Basket (Right)</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Right Pod: Under Basket Panel (5 Columns) */}
          <div className="col-span-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-white transition shadow-inner"
            >
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Review Basket</span>
              <span className="flex items-center justify-center px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                {basket.length}
              </span>
              {basket.length > 0 && (
                <span className="text-emerald-400 text-[11px] font-mono tabular-nums">
                  ({totalAllocated} {currency})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              disabled={basket.length === 0}
              className="cursor-pointer flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition"
            >
              <span>Check routes</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
