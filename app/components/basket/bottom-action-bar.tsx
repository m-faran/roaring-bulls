"use client";

import React from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

interface BottomActionBarProps {
  onSkip?: () => void;
}

export function BottomActionBar({ onSkip }: BottomActionBarProps) {
  const { basket, totalAllocated, currency, setIsBasketOpen, triggerSwipe } =
    useBasket();

  const handleSkip = () => {
    if (onSkip) onSkip();
    triggerSwipe("left");
  };

  const handleAdd = () => {
    triggerSwipe("right");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-cyan-500/20 bg-[#05080E]/95 backdrop-blur-2xl py-3 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-6xl w-full mx-auto">
        {/* Mobile View: Single Row (< lg) */}
        <div className="flex lg:hidden items-center justify-between gap-2.5">
          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#FF1B6B]/40 bg-[#FF1B6B]/10 text-xs font-display font-bold text-[#FF1B6B] hover:bg-[#FF1B6B]/20 transition-all duration-200 shadow-[0_0_12px_rgba(255,27,107,0.2)]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>

          {/* Review Basket Button */}
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-cyan-500/20 bg-[#0A111F] hover:bg-[#101A2E] text-xs font-display font-semibold text-white transition-all duration-200 shadow-inner"
          >
            <ShoppingCart className="w-4 h-4 text-[#00FF88]" />
            <span>Review basket</span>
            <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-[#00FF88]/20 text-[#00FF88] text-[11px] font-mono font-bold shadow-[0_0_8px_rgba(0,255,136,0.3)]">
              {basket.length}
            </span>
            {basket.length > 0 && (
              <span className="text-cyan-400 text-[11px] hidden sm:inline tabular-nums font-mono">
                ({totalAllocated} {currency})
              </span>
            )}
          </button>

          {/* Check Routes Primary CTA */}
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            disabled={basket.length === 0}
            className="cursor-pointer flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#00FF88] hover:bg-[#00FF88]/90 disabled:opacity-30 disabled:pointer-events-none text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all duration-200"
          >
            <span>Check routes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop View: Dual Pods Aligned with the 12-Column Grid (lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Left Pod: Under Swipe Deck (7 Columns) */}
          <div className="col-span-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-[#FF1B6B]/40 bg-[#FF1B6B]/10 hover:bg-[#FF1B6B]/25 text-[#FF1B6B] text-xs font-display font-bold transition-all shadow-[0_0_15px_rgba(255,27,107,0.2)] hover:scale-105"
              title="Skip asset (or press Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Skip Asset (Left)</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono tracking-tight">
              or swipe card with touch / mouse
            </span>

            <button
              type="button"
              onClick={handleAdd}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-[#00FF88]/50 bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all hover:scale-105"
              title="Add to basket (or press Right Arrow)"
            >
              <span>Add to Basket (Right)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Pod: Under Basket Panel (5 Columns) */}
          <div className="col-span-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-cyan-500/20 bg-[#0A111F] hover:bg-[#101A2E] text-xs font-display font-semibold text-white transition shadow-inner"
            >
              <ShoppingCart className="w-4 h-4 text-[#00FF88]" />
              <span>Review Basket</span>
              <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-[#00FF88]/20 text-[#00FF88] text-[11px] font-mono font-bold shadow-[0_0_8px_rgba(0,255,136,0.25)]">
                {basket.length}
              </span>
              {basket.length > 0 && (
                <span className="text-[#00FF88] text-[11px] font-mono tabular-nums font-semibold">
                  ({totalAllocated} {currency})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              disabled={basket.length === 0}
              className="cursor-pointer flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00F0FF] hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition hover:scale-105"
            >
              <span>Check routes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
