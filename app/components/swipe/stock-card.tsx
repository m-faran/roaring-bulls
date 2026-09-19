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

  // Sector icon Lucide mapping (paper palette accents)
  const renderSectorIcon = () => {
    switch (stock.sector) {
      case "Tech & AI":
        return <Cpu className="h-5 w-5 text-[#14F195]" />;
      case "Defense & Aerospace":
        return <Rocket className="h-5 w-5 text-[#9945FF]" />;
      case "Fintech & Crypto":
        return <Coins className="h-5 w-5 text-[#FFD23F]" />;
      case "Pre-IPO Unicorn":
        return <Sparkles className="h-5 w-5 text-[#FF5C8A]" />;
      case "Bonding Curve Meme":
        return <Flame className="h-5 w-5 text-[#111111]" />;
      default:
        return <TrendingUp className="h-5 w-5 text-[#14F195]" />;
    }
  };

  return (
    <div className="ink-border ink-shadow-lg relative flex h-[560px] w-full max-w-[460px] select-none flex-col overflow-hidden bg-white transition-transform duration-300">
      {/* Ticket stub header — receipt detailing */}
      <div className="flex shrink-0 items-center justify-between border-b-[3px] border-[#111111] bg-[#111111] px-4 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">
          Swpper • Equity Receipt
        </span>
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5C8A]" />
          <span className="h-2 w-2 rounded-full bg-[#FFD23F]" />
          <span className="h-2 w-2 rounded-full bg-[#14F195]" />
        </span>
      </div>

      {/* Swipe Feedback Stamp (Right = Add) */}
      {isFront && isSwipingRight && (
        <div
          style={{ opacity: swipeOpacity }}
          className="ink-border-thin pointer-events-none absolute right-6 top-10 z-30 rotate-12 bg-[#14F195] px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-[#111111]"
        >
          ADD TO BASKET
        </div>
      )}

      {/* Swipe Feedback Stamp (Left = Skip) */}
      {isFront && isSwipingLeft && (
        <div
          style={{ opacity: swipeOpacity }}
          className="ink-border-thin pointer-events-none absolute left-6 top-10 z-30 -rotate-12 bg-[#FF5C8A] px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-white"
        >
          SKIP
        </div>
      )}

      {/* Receipt body with hairline inner keyline */}
      <div className="ink-frame flex flex-1 flex-col space-y-3 p-4">
        {/* Asset identity box — clean label/value rows */}
        <div className="ink-border-thin divide-y-[1.5px] divide-[#111111]/15 bg-[#F5F1E8]">
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* Logo badge with real image and graceful fallback */}
              <div className="ink-border-thin flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden bg-white p-1.5">
                {stock.logoURI && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
                  <img
                    src={stock.logoURI}
                    alt={stock.name}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-contain"
                    loading="eager"
                  />
                ) : (
                  renderSectorIcon()
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="max-w-[150px] truncate text-sm font-bold tracking-tight text-[#111111] sm:max-w-[180px]">
                    {stock.name}
                  </h3>
                  <span className="ink-border-thin shrink-0 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#111111]">
                    {stock.ticker}
                  </span>
                </div>
                <p className="max-w-[210px] truncate font-mono text-[10px] uppercase tracking-wide text-[#111111]/60">
                  {stock.subtitle}
                </p>
              </div>
            </div>

            {/* Allocation sticker */}
            <div className="ink-border-thin flex shrink-0 items-center gap-1.5 bg-[#14F195] px-2.5 py-1 font-mono text-xs font-bold text-[#111111]">
              <span className="tabular-nums">
                {currency === "SOL"
                  ? `${allocationPerSwipe} SOL`
                  : `$${allocationPerSwipe}`}
              </span>
              <Link2 className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Return & meta row */}
          <div className="flex h-9 items-center gap-2 overflow-hidden px-3">
            <span
              className={`ink-border-thin px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                isPositive
                  ? "bg-[#14F195] text-[#111111]"
                  : "bg-[#FF5C8A] text-white"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.change3m}% • 3M
            </span>

            {stock.marketCap && (
              <span className="truncate font-mono text-[11px] text-[#111111]/60">
                Cap:{" "}
                <span className="font-bold text-[#111111]">
                  {stock.marketCap}
                </span>
              </span>
            )}

            {stock.isPreIPO && (
              <span className="ink-border-thin shrink-0 bg-[#FFD23F] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#111111]">
                Pre-IPO
              </span>
            )}
            {stock.isStonkFun && (
              <span className="ink-border-thin shrink-0 bg-[#FF5C8A] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                StonkFun
              </span>
            )}
          </div>
        </div>

        {/* Interactive chart */}
        <div className="my-auto py-0.5">
          <StockChart
            chartData={stock.chartData}
            benchmarkTicker={stock.benchmarkTicker}
            isPositive={isPositive}
          />
        </div>

        {/* Exposure breakdown — fine-detail footer box */}
        <div className="ink-border-thin shrink-0 space-y-2 bg-[#F5F1E8] p-3">
          <p className="line-clamp-2 h-[34px] font-mono text-[11px] leading-snug text-[#111111]/80">
            {stock.description}
          </p>

          <div className="border-t-2 border-dashed border-[#111111]/50 pt-2">
            {/* Multi-segment allocation bar (flat, no glow) */}
            <div className="ink-border-thin flex h-2 w-full overflow-hidden bg-white">
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

            {/* Single-row allocation legend */}
            <div className="mt-1.5 flex h-4 items-center gap-x-3 overflow-hidden font-mono text-[10px] text-[#111111]/70">
              {stock.allocationSegments.slice(0, 3).map((seg, idx) => (
                <div key={idx} className="flex shrink-0 items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="max-w-[95px] truncate font-semibold text-[#111111]">
                    {seg.label}
                  </span>
                  <span className="font-bold">{seg.weight}%</span>
                </div>
              ))}
              {stock.allocationSegments.length > 3 && (
                <span className="shrink-0 font-medium">
                  +{stock.allocationSegments.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
