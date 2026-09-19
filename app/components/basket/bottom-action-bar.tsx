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
    <div className="paper-texture fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-[#111111] px-4 py-3 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Mobile View: Single Row (< lg) */}
        <div className="flex items-center justify-between gap-2.5 lg:hidden">
          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-[#FF5C8A] px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={3} />
            <span>Skip</span>
          </button>

          {/* Review Basket Button */}
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            className="ink-border-thin ink-shadow-sm ink-press flex flex-1 cursor-pointer items-center justify-center gap-2 bg-white px-3.5 py-2.5 text-xs font-bold text-[#111111]"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
            <span>Review basket</span>
            <span className="ink-border-thin flex items-center justify-center bg-[#FFD23F] px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums">
              {basket.length}
            </span>
            {basket.length > 0 && (
              <span className="hidden font-mono text-[11px] tabular-nums sm:inline">
                ({totalAllocated} {currency})
              </span>
            )}
          </button>

          {/* Check Routes Primary CTA */}
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            disabled={basket.length === 0}
            className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-[#14F195] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#111111] sm:px-5 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>Routes</span>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
        </div>

        {/* Desktop View: Dual Pods Aligned with the 12-Column Grid (lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Left Pod: Under Swipe Deck (7 Columns) */}
          <div className="col-span-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-2 bg-[#FF5C8A] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
              title="Skip asset (or press Left Arrow)"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={3} />
              <span>Skip Asset (Left)</span>
            </button>

            <span className="font-mono text-[11px] tracking-tight text-[#111111]/60">
              or swipe card with touch / mouse
            </span>

            <button
              type="button"
              onClick={handleAdd}
              className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-2 bg-[#14F195] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[#111111]"
              title="Add to basket (or press Right Arrow)"
            >
              <span>Add to Basket (Right)</span>
              <ChevronRight className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>

          {/* Right Pod: Under Basket Panel (5 Columns) */}
          <div className="col-span-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              className="ink-border-thin ink-shadow-sm ink-press flex flex-1 cursor-pointer items-center justify-center gap-2 bg-white px-4 py-2.5 text-xs font-bold text-[#111111]"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
              <span>Review Basket</span>
              <span className="ink-border-thin flex items-center justify-center bg-[#FFD23F] px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums">
                {basket.length}
              </span>
              {basket.length > 0 && (
                <span className="font-mono text-[11px] font-semibold tabular-nums">
                  ({totalAllocated} {currency})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              disabled={basket.length === 0}
              className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-[#14F195] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[#111111] disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>Check routes</span>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
