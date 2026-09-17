"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StockToken, RiskTier } from "@/app/lib/data/stocks-catalog";
import { StockCard } from "./stock-card";
import { useBasket } from "@/app/lib/store/basket-context";
import { toast } from "sonner";

interface SwipeDeckProps {
  stocks: StockToken[];
}

export function SwipeDeck({ stocks }: SwipeDeckProps) {
  const {
    riskTier,
    setRiskTier,
    addToBasket,
    remainingBudget,
    sessionBudget,
    allocationPerSwipe,
    currency,
    budgetUtilizationPct,
    setIsSessionSetupOpen,
    setIsBasketOpen,
  } = useBasket();

  // Filter stocks by current risk tier
  const tierStocks = stocks.filter((s) => s.tier === riskTier);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Drag gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [isAnimatingOut, setIsAnimatingOut] = useState<"left" | "right" | null>(
    null
  );

  // Reset index on risk tier change
  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setIsAnimatingOut(null);
  }, [riskTier]);

  const currentStock = tierStocks[currentIndex];
  const nextStock = tierStocks[currentIndex + 1];

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentStock || isAnimatingOut) return;

      setIsAnimatingOut(direction);

      if (direction === "right") {
        const added = addToBasket(currentStock);
        if (added) {
          toast.success(`Added ${currentStock.ticker} to basket`, {
            description: `Allocated ${allocationPerSwipe} ${currency}`,
            duration: 1800,
          });
        } else {
          toast.warning("Session budget reached!", {
            description: "Review your basket or adjust budget in session setup.",
          });
        }
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimatingOut(null);
        setDragOffset({ x: 0, y: 0 });
      }, 250);
    },
    [currentStock, isAnimatingOut, addToBasket, allocationPerSwipe, currency]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!currentStock || isAnimatingOut) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = (clientY - dragStartRef.current.y) * 0.2; // constrain vertical drag
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 100) {
      handleSwipe("right");
    } else if (dragOffset.x < -100) {
      handleSwipe("left");
    } else {
      // Spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const rotation = dragOffset.x / 14;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto px-4 pb-28 pt-2">
      {/* Risk Tier Selector Tabs */}
      <div className="w-full flex items-center justify-center p-1 mb-4 rounded-2xl bg-slate-950/60 border border-white/5 backdrop-blur-md">
        {(
          [
            { id: "conservative", label: "Conservative", sub: "Blue Chips" },
            { id: "balanced", label: "Balanced", sub: "Pre-IPO" },
            { id: "degen", label: "Degen", sub: "StonkFun" },
          ] as { id: RiskTier; label: string; sub: string }[]
        ).map((t) => {
          const isActive = riskTier === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setRiskTier(t.id)}
              className={`flex-1 flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 text-white shadow-md border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xs font-semibold">{t.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">{t.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Budget Progress Meter */}
      <div className="w-full max-w-[440px] flex items-center justify-between px-3 py-2 mb-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted">Budget Allocated:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {budgetUtilizationPct}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted">Remaining:</span>
          <span className="font-semibold text-emerald-400 tabular-nums">
            {remainingBudget} {currency}
          </span>
          <button
            onClick={() => setIsSessionSetupOpen(true)}
            className="cursor-pointer text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
            title="Configure session budget & allocation"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swipe Deck Container */}
      <div className="relative w-full max-w-[440px] h-[580px] flex items-center justify-center">
        {currentStock ? (
          <>
            {/* Card Underneath (Preview) */}
            {nextStock && (
              <div className="absolute top-2 w-full max-w-[440px] scale-[0.95] translate-y-3 opacity-50 pointer-events-none transition-all duration-300">
                <StockCard stock={nextStock} />
              </div>
            )}

            {/* Front Card (Draggable) */}
            <div
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onTouchStart={(e) =>
                handlePointerDown(
                  e.touches[0].clientX,
                  e.touches[0].clientY
                )
              }
              onTouchMove={(e) =>
                handlePointerMove(
                  e.touches[0].clientX,
                  e.touches[0].clientY
                )
              }
              onTouchEnd={handlePointerUp}
              style={{
                transform: isAnimatingOut
                  ? `translate3d(${
                      isAnimatingOut === "right" ? "600px" : "-600px"
                    }, 0, 0) rotate(${
                      isAnimatingOut === "right" ? "25deg" : "-25deg"
                    })`
                  : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
                transition: isDragging
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
              className="absolute top-0 w-full max-w-[440px] cursor-grab active:cursor-grabbing z-20"
            >
              <StockCard
                stock={currentStock}
                isFront={true}
                dragOffset={dragOffset}
              />
            </div>
          </>
        ) : (
          /* Empty Deck State */
          <div className="w-full max-w-[440px] h-[520px] rounded-3xl border border-white/10 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center space-y-4 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deck Completed!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                You have reviewed all assets in the {riskTier} tier. Review your assembled basket or reset the deck to review again.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentIndex(0)}
                className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition"
              >
                Reset Deck
              </button>
              <button
                onClick={() => setIsBasketOpen(true)}
                className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition"
              >
                Review Basket
              </button>
            </div>
          </div>
        )}

        {/* Floating Side Action Triggers (Desktop / Quick Tap) */}
        {currentStock && (
          <>
            {/* Left Skip Trigger */}
            <button
              onClick={() => handleSwipe("left")}
              className="cursor-pointer absolute -left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1 group"
              title="Skip (Left Arrow)"
            >
              <div className="w-12 h-12 rounded-full border border-rose-500/30 bg-rose-950/40 group-hover:bg-rose-950/80 group-hover:scale-110 flex items-center justify-center text-rose-400 transition-all shadow-lg shadow-rose-950/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </div>
              <span className="text-[10px] text-rose-400/80 font-medium tracking-wide">
                Skip
              </span>
            </button>

            {/* Right Add Trigger */}
            <button
              onClick={() => handleSwipe("right")}
              className="cursor-pointer absolute -right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1 group"
              title="Add (Right Arrow)"
            >
              <div className="w-12 h-12 rounded-full border border-emerald-500/40 bg-emerald-500 group-hover:bg-emerald-400 group-hover:scale-110 flex items-center justify-center text-slate-950 transition-all shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide">
                Check
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
