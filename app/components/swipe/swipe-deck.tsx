"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StockToken, RiskTier } from "@/app/lib/data/stocks-catalog";
import { StockCard } from "./stock-card";
import { useBasket } from "@/app/lib/store/basket-context";
import { toast } from "sonner";
import { Settings2, Check, ChevronLeft, ChevronRight, RotateCcw, ArrowRight } from "lucide-react";

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
    <div className="flex w-full max-w-xl flex-col items-center px-4 pb-28 pt-1 mx-auto">
      {/* Risk Tier Selector Tabs — segmented ink control */}
      <div className="ink-border-thin ink-shadow-sm mb-4 flex w-full items-center bg-white p-1.5">
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
              className={`flex flex-1 cursor-pointer flex-col items-center px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "ink-border-thin bg-[#14F195] text-[#111111]"
                  : "text-[#111111]/50 hover:bg-[#F5F1E8] hover:text-[#111111]"
              }`}
            >
              <span className="text-xs font-bold tracking-tight">
                {t.label}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wide ${
                  isActive ? "text-[#111111]/70" : "text-[#111111]/40"
                }`}
              >
                {t.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Budget Progress Meter — clean label/value strip */}
      <div className="ink-border-thin ink-shadow-sm mb-4 flex w-full max-w-[460px] items-center justify-between bg-white px-3 py-2 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[11px] text-[#111111]/60">Allocated:</span>
          <span className="font-bold tabular-nums text-[#111111]">
            {budgetUtilizationPct}%
          </span>
        </div>

        {/* Mini progress track */}
        <div className="ink-border-thin mx-3 h-2 flex-1 overflow-hidden bg-[#F5F1E8]">
          <div
            className="h-full bg-[#14F195] transition-all duration-300"
            style={{ width: `${budgetUtilizationPct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-[11px] text-[#111111]/60">Remaining:</span>
          <span className="font-bold tabular-nums text-[#111111]">
            {remainingBudget} {currency}
          </span>
          <button
            onClick={() => setIsSessionSetupOpen(true)}
            className="ink-border-thin ink-press cursor-pointer bg-[#FFD23F] p-1"
            title="Configure session budget & allocation"
          >
            <Settings2 className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Swipe Deck Container */}
      <div className="relative flex h-[570px] w-full max-w-[460px] items-center justify-center">
        {currentStock ? (
          <>
            {/* Card Underneath (Preview) */}
            {nextStock && (
              <div className="pointer-events-none absolute top-0 h-[560px] w-full max-w-[460px] translate-y-3 scale-[0.96] opacity-50 transition-all duration-300">
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
              className="absolute top-0 z-20 h-[560px] w-full max-w-[460px] cursor-grab active:cursor-grabbing"
            >
              <StockCard
                stock={currentStock}
                isFront={true}
                dragOffset={dragOffset}
              />
            </div>
          </>
        ) : (
          /* Empty Deck State — paper postcard */
          <div className="ink-border ink-shadow-lg flex h-[560px] w-full max-w-[460px] flex-col items-center justify-center space-y-5 bg-white p-8 text-center">
            <span className="ink-border ink-shadow-sm flex h-16 w-16 items-center justify-center bg-[#14F195] text-[#111111]">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-[#111111]">
                Deck Completed!
              </h3>
              <p className="mx-auto mt-1 max-w-xs border-t-2 border-dashed border-[#111111]/40 pt-2 font-mono text-[11px] leading-relaxed text-[#111111]/60">
                You have reviewed all assets in the {riskTier} tier. Review your
                assembled basket or reset the deck to review again.
              </p>
            </div>
            <div className="flex w-full max-w-xs justify-center gap-3 pt-3">
              <button
                onClick={() => setCurrentIndex(0)}
                className="ink-border-thin ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-white px-4 py-2.5 text-xs font-bold text-[#111111]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={3} />
                <span>Reset Deck</span>
              </button>
              <button
                onClick={() => setIsBasketOpen(true)}
                className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center gap-1.5 bg-[#14F195] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#111111]"
              >
                <span>Review Basket</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
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
              className="group absolute -left-16 top-1/2 hidden -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 md:flex"
              title="Skip (Left Arrow)"
            >
              <span className="ink-border ink-shadow-sm ink-press flex h-12 w-12 items-center justify-center bg-[#FF5C8A] text-white group-hover:rotate-6">
                <ChevronLeft className="h-5 w-5" strokeWidth={3} />
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                Skip
              </span>
            </button>

            {/* Right Add Trigger */}
            <button
              onClick={() => handleSwipe("right")}
              className="group absolute -right-16 top-1/2 hidden -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 md:flex"
              title="Add (Right Arrow)"
            >
              <span className="ink-border ink-shadow-sm ink-press flex h-12 w-12 items-center justify-center bg-[#14F195] text-[#111111] group-hover:-rotate-6">
                <ChevronRight className="h-5 w-5" strokeWidth={3} />
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                Check
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
