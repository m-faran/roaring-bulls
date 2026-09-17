"use client";

import React from "react";
import { StockToken } from "@/app/lib/data/stocks-catalog";
import { StockChart } from "./stock-chart";
import { useBasket } from "@/app/lib/store/basket-context";

interface StockCardProps {
  stock: StockToken;
  isFront?: boolean;
  dragOffset?: { x: number; y: number };
}

export function StockCard({ stock, isFront = false, dragOffset = { x: 0, y: 0 } }: StockCardProps) {
  const { allocationPerSwipe, currency, formatCurrency } = useBasket();

  const isSwipingRight = dragOffset.x > 40;
  const isSwipingLeft = dragOffset.x < -40;
  const swipeOpacity = Math.min(1, Math.abs(dragOffset.x) / 120);

  const isPositive = stock.change3m >= 0;

  // Sector icon SVG mapping
  const renderSectorIcon = () => {
    switch (stock.sector) {
      case "Tech & AI":
        return (
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "Defense & Aerospace":
        return (
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      case "Fintech & Crypto":
        return (
          <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        );
      case "Pre-IPO Unicorn":
        return (
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case "Bonding Curve Meme":
        return (
          <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full max-w-[440px] rounded-3xl border border-slate-800/80 bg-[#0D1322] p-5 shadow-2xl transition-shadow hover:border-slate-700 select-none overflow-hidden">
      {/* Swipe Feedback Stamp (Right = Add) */}
      {isFront && isSwipingRight && (
        <div
          style={{ opacity: swipeOpacity }}
          className="absolute top-6 right-6 z-30 pointer-events-none rounded-xl border-2 border-emerald-400 bg-emerald-950/80 px-4 py-1.5 text-xs font-black tracking-widest text-emerald-300 uppercase shadow-lg shadow-emerald-500/20 rotate-12"
        >
          ADD TO BASKET
        </div>
      )}

      {/* Swipe Feedback Stamp (Left = Skip) */}
      {isFront && isSwipingLeft && (
        <div
          style={{ opacity: swipeOpacity }}
          className="absolute top-6 left-6 z-30 pointer-events-none rounded-xl border-2 border-rose-500 bg-rose-950/80 px-4 py-1.5 text-xs font-black tracking-widest text-rose-300 uppercase shadow-lg shadow-rose-500/20 -rotate-12"
        >
          SKIP
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 shadow-inner">
            {renderSectorIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight text-white line-clamp-1">
                {stock.name}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                {stock.ticker}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{stock.subtitle}</p>
          </div>
        </div>

        {/* Allocation Pill ($ or SOL per swipe) */}
        <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white shadow-xs">
          <span className="tabular-nums">
            {currency === "SOL" ? `${allocationPerSwipe} SOL` : `$${allocationPerSwipe}`}
          </span>
          <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
      </div>

      {/* Return Pill */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
            isPositive
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
          }`}
        >
          <span>{isPositive ? "+" : ""}{stock.change3m}%</span>
          <span className="text-slate-400 font-normal">• 3M</span>
        </div>

        {stock.marketCap && (
          <span className="text-[11px] text-slate-400">
            Cap: <span className="text-slate-300 font-medium">{stock.marketCap}</span>
          </span>
        )}

        {stock.isPreIPO && (
          <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
            Pre-IPO
          </span>
        )}
        {stock.isStonkFun && (
          <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
            StonkFun
          </span>
        )}
      </div>

      {/* Interactive Chart */}
      <div className="mb-4">
        <StockChart
          chartData={stock.chartData}
          benchmarkTicker={stock.benchmarkTicker}
          isPositive={isPositive}
        />
      </div>

      {/* Sector Exposure Description Callout */}
      <div className="rounded-2xl border border-slate-800 bg-[#070A12] p-3.5 space-y-2.5">
        <p className="text-xs leading-relaxed text-slate-300 line-clamp-2">
          {stock.description}
        </p>

        {/* Multi-Segment Allocation Bar */}
        <div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            {stock.allocationSegments.map((seg, idx) => (
              <div
                key={idx}
                style={{
                  width: `${seg.weight}%`,
                  backgroundColor: seg.color,
                }}
                className="h-full transition-all duration-300"
                title={`${seg.label}: ${seg.weight}%`}
              />
            ))}
          </div>

          {/* Allocation Legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-400">
            {stock.allocationSegments.slice(0, 3).map((seg, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="truncate max-w-[110px]">{seg.label}</span>
                <span className="text-slate-500">{seg.weight}%</span>
              </div>
            ))}
            {stock.allocationSegments.length > 3 && (
              <span className="text-slate-500">+{stock.allocationSegments.length - 3} more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
