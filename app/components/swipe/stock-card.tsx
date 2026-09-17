"use client";

import React, { useState } from "react";
import { StockToken } from "@/app/lib/data/stocks-catalog";
import { StockChart } from "./stock-chart";
import { useBasket } from "@/app/lib/store/basket-context";
import { Cpu, Rocket, Coins, Sparkles, Flame, TrendingUp, Link2 } from "lucide-react";

interface StockCardProps {
  stock: StockToken;
  isFront?: boolean;
  dragOffset?: { x: number; y: number };
}

export function StockCard({
  stock,
  isFront = false,
  dragOffset = { x: 0, y: 0 },
}: StockCardProps) {
  const { allocationPerSwipe, currency } = useBasket();
  const [imageError, setImageError] = useState(false);

  const isSwipingRight = dragOffset.x > 40;
  const isSwipingLeft = dragOffset.x < -40;
  const swipeOpacity = Math.min(1, Math.abs(dragOffset.x) / 120);

  const isPositive = stock.change3m >= 0;

  // Sector icon Lucide mapping
  const renderSectorIcon = () => {
    switch (stock.sector) {
      case "Tech & AI":
        return <Cpu className="w-5 h-5 text-[#00FF88]" />;
      case "Defense & Aerospace":
        return <Rocket className="w-5 h-5 text-[#00F0FF]" />;
      case "Fintech & Crypto":
        return <Coins className="w-5 h-5 text-[#A855F7]" />;
      case "Pre-IPO Unicorn":
        return <Sparkles className="w-5 h-5 text-[#FFB800]" />;
      case "Bonding Curve Meme":
        return <Flame className="w-5 h-5 text-[#FF1B6B]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-[#00F0FF]" />;
    }
  };

  return (
    <div className="relative w-full max-w-[460px] h-[560px] flex flex-col justify-between rounded-3xl border border-cyan-500/25 bg-[#0A111F] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#00FF88]/40 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] select-none overflow-hidden group">
      {/* Decorative HUD Corner Accents */}
      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none select-none">
        ┌
      </span>
      <span className="absolute top-2.5 right-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none select-none">
        ┐
      </span>
      <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none select-none">
        └
      </span>
      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none select-none">
        ┘
      </span>

      {/* Swipe Feedback Stamp (Right = Add) */}
      {isFront && isSwipingRight && (
        <div
          style={{ opacity: swipeOpacity }}
          className="absolute top-6 right-6 z-30 pointer-events-none rounded-2xl border-2 border-[#00FF88] bg-[#05080E]/95 px-5 py-2 text-xs font-display font-black tracking-widest text-[#00FF88] uppercase shadow-[0_0_30px_rgba(0,255,136,0.6)] rotate-12"
        >
          ADD TO BASKET
        </div>
      )}

      {/* Swipe Feedback Stamp (Left = Skip) */}
      {isFront && isSwipingLeft && (
        <div
          style={{ opacity: swipeOpacity }}
          className="absolute top-6 left-6 z-30 pointer-events-none rounded-2xl border-2 border-[#FF1B6B] bg-[#05080E]/95 px-5 py-2 text-xs font-display font-black tracking-widest text-[#FF1B6B] uppercase shadow-[0_0_30px_rgba(255,27,107,0.6)] -rotate-12"
        >
          SKIP
        </div>
      )}

      {/* Top Half: Header & Meta */}
      <div className="shrink-0 space-y-2.5">
        {/* Card Header */}
        <div className="h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Badge with real image and graceful fallback */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-[#05080E] p-1.5 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] overflow-hidden">
              {stock.logoURI && !imageError ? (
                <img
                  src={stock.logoURI}
                  alt={stock.name}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-contain rounded-xl"
                  loading="eager"
                />
              ) : (
                renderSectorIcon()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base tracking-tight text-white truncate max-w-[170px] sm:max-w-[200px]">
                  {stock.name}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shrink-0">
                  {stock.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">
                {stock.subtitle}
              </p>
            </div>
          </div>

          {/* Allocation Pill ($ or SOL per swipe) */}
          <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-[#00FF88]/30 bg-[#05080E] px-3.5 py-1.5 text-xs font-mono font-bold text-white shadow-[0_0_12px_rgba(0,255,136,0.15)]">
            <span className="tabular-nums text-[#00FF88]">
              {currency === "SOL"
                ? `${allocationPerSwipe} SOL`
                : `$${allocationPerSwipe}`}
            </span>
            <Link2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Return & Meta Row */}
        <div className="h-6 flex items-center gap-2 overflow-hidden text-xs">
          <div
            className={`flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
              isPositive
                ? "bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_8px_rgba(0,255,136,0.15)]"
                : "bg-[#FF1B6B]/15 text-[#FF1B6B] border border-[#FF1B6B]/30 shadow-[0_0_8px_rgba(255,27,107,0.15)]"
            }`}
          >
            <span>
              {isPositive ? "+" : ""}
              {stock.change3m}%
            </span>
            <span className="text-slate-400 font-normal">• 3M</span>
          </div>

          {stock.marketCap && (
            <span className="text-[11px] text-slate-400 truncate font-mono">
              Cap:{" "}
              <span className="text-slate-300 font-medium font-mono">
                {stock.marketCap}
              </span>
            </span>
          )}

          {stock.isPreIPO && (
            <span className="text-[10px] font-display font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.2)] shrink-0">
              Pre-IPO
            </span>
          )}
          {stock.isStonkFun && (
            <span className="text-[10px] font-display font-semibold text-[#FF1B6B] bg-[#FF1B6B]/15 border border-[#FF1B6B]/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,27,107,0.2)] shrink-0">
              StonkFun
            </span>
          )}
        </div>
      </div>

      {/* Middle: Interactive Chart */}
      <div className="my-auto py-1">
        <StockChart
          chartData={stock.chartData}
          benchmarkTicker={stock.benchmarkTicker}
          isPositive={isPositive}
        />
      </div>

      {/* Bottom: Exposure Breakdown Callout */}
      <div className="shrink-0 rounded-2xl border border-cyan-500/20 bg-[#05080E] p-3.5 space-y-2 shadow-inner">
        <p className="h-[34px] text-xs leading-snug text-slate-300 line-clamp-2">
          {stock.description}
        </p>

        {/* Multi-Segment Allocation Bar */}
        <div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#101A2E] shadow-inner">
            {stock.allocationSegments.map((seg, idx) => (
              <div
                key={idx}
                style={{
                  width: `${seg.weight}%`,
                  backgroundColor: seg.color,
                }}
                className="h-full transition-all duration-300 shadow-[0_0_6px_currentColor]"
                title={`${seg.label}: ${seg.weight}%`}
              />
            ))}
          </div>

          {/* Single-row Allocation Legend */}
          <div className="h-4 flex items-center gap-x-3 mt-1.5 text-[10px] text-slate-400 overflow-hidden font-mono">
            {stock.allocationSegments.slice(0, 3).map((seg, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_4px_currentColor]"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="truncate max-w-[95px] text-slate-300">
                  {seg.label}
                </span>
                <span className="text-cyan-400/80 font-semibold">{seg.weight}%</span>
              </div>
            ))}
            {stock.allocationSegments.length > 3 && (
              <span className="text-slate-500 shrink-0 font-medium">
                +{stock.allocationSegments.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
