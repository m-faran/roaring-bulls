"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StockToken, RiskTier } from "@/app/lib/data/stocks-catalog";
import { StockCard } from "./stock-card";
import { useBasket } from "@/app/lib/store/basket-context";
import { toast } from "sonner";
import { Settings2, Check, ChevronLeft, ChevronRight } from "lucide-react";

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
    registerSwipeHandler,
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

  // Register swipe handler with context so bottom bar or external controls trigger swipes
  useEffect(() => {
    return registerSwipeHandler(handleSwipe);
  }, [registerSwipeHandler, handleSwipe]);

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
    <div className="flex flex-col items-center w-full max-w-xl mx-auto px-4 pb-28 pt-1">
      {/* Risk Tier Selector Tabs — Cyber Arcade Segmented Style */}
      <div className="w-full flex items-center justify-center p-1.5 mb-4 rounded-2xl bg-[#0A111F] border border-cyan-500/20 backdrop-blur-md shadow-inner">
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
                  ? "bg-[#101A2E] text-white shadow-[0_0_15px_rgba(0,240,255,0.25)] border border-cyan-500/40 font-display"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xs font-display font-bold tracking-tight">
                {t.label}
              </span>
              <span
                className={`text-[10px] font-mono transition-colors ${
                  isActive ? "text-[#00F0FF]" : "text-slate-500"
                }`}
              >
                {t.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Budget Progress Meter */}
      <div className="w-full max-w-[460px] flex items-center justify-between px-4 py-2.5 mb-4 rounded-2xl bg-[#0A111F] border border-cyan-500/20 text-xs shadow-inner">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 text-[11px]">Allocated:</span>
          <span className="font-bold text-white tabular-nums">
            {budgetUtilizationPct}%
          </span>
        </div>

        {/* Mini progress track */}
        <div className="flex-1 mx-3 h-1.5 rounded-full bg-[#05080E] overflow-hidden border border-cyan-500/10">
          <div
            className="h-full bg-gradient-to-r from-[#00FF88] to-[#00F0FF] shadow-[0_0_10px_#00FF88] transition-all duration-300"
            style={{ width: `${budgetUtilizationPct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 text-[11px]">Remaining:</span>
          <span className="font-bold text-[#00FF88] tabular-nums">
            {remainingBudget} {currency}
          </span>
          <button
            onClick={() => setIsSessionSetupOpen(true)}
            className="cursor-pointer text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            title="Configure session budget & allocation"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Swipe Deck Container */}
      <div className="relative w-full max-w-[460px] h-[570px] flex items-center justify-center">
        {currentStock ? (
          <>
            {/* Card Underneath (Preview) */}
            {nextStock && (
              <div className="absolute top-0 w-full max-w-[460px] h-[560px] scale-[0.96] translate-y-3 opacity-40 pointer-events-none transition-all duration-300">
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
              className="absolute top-0 w-full max-w-[460px] h-[560px] cursor-grab active:cursor-grabbing z-20"
            >
              <StockCard
                stock={currentStock}
                isFront={true}
                dragOffset={dragOffset}
              />
            </div>
          </>
        ) : (
          /* Empty Deck State — Cyber Pod */
          <div className="w-full max-w-[460px] h-[560px] rounded-3xl border border-cyan-500/30 bg-[#0A111F]/90 p-8 flex flex-col items-center justify-center text-center space-y-5 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="relative w-16 h-16 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <Check className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-white tracking-tight">
                Deck Completed!
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                You have reviewed all assets in the {riskTier} tier. Review your assembled basket or reset the deck to review again.
              </p>
            </div>
            <div className="flex gap-3 pt-3 w-full max-w-xs justify-center">
              <button
                onClick={() => setCurrentIndex(0)}
                className="cursor-pointer px-4 py-2.5 text-xs font-display font-bold rounded-xl bg-[#101A2E] hover:bg-[#16223B] text-white border border-cyan-500/30 transition shadow-sm"
              >
                Reset Deck
              </button>
              <button
                onClick={() => setIsBasketOpen(true)}
                className="cursor-pointer px-5 py-2.5 text-xs font-display font-black rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] shadow-[0_0_20px_rgba(0,255,136,0.4)] transition hover:scale-105"
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
              className="cursor-pointer absolute -left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1.5 group"
              title="Skip (Left Arrow)"
            >
              <div className="w-13 h-13 rounded-full border border-[#FF1B6B]/40 bg-[#0A111F] group-hover:bg-[#FF1B6B]/20 group-hover:scale-110 group-hover:border-[#FF1B6B] flex items-center justify-center text-[#FF1B6B] transition-all duration-200 shadow-[0_0_20px_rgba(255,27,107,0.25)]">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-[#FF1B6B] font-display font-bold tracking-wider uppercase">
                Skip
              </span>
            </button>

            {/* Right Add Trigger */}
            <button
              onClick={() => handleSwipe("right")}
              className="cursor-pointer absolute -right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1.5 group"
              title="Add (Right Arrow)"
            >
              <div className="w-13 h-13 rounded-full border border-[#00FF88]/50 bg-[#00FF88] group-hover:bg-[#00FF88]/90 group-hover:scale-110 flex items-center justify-center text-[#05080E] transition-all duration-200 shadow-[0_0_25px_rgba(0,255,136,0.5)]">
                <ChevronRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-[#00FF88] font-display font-bold tracking-wider uppercase">
                Check
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
