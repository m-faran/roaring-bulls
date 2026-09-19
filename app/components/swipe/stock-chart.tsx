"use client";

import React, { useState, useMemo } from "react";
import { ChartPoint } from "@/app/lib/data/stocks-catalog";
import { Info } from "lucide-react";

interface StockChartProps {
  chartData: {
    "1W": ChartPoint[];
    "1M": ChartPoint[];
    "3M": ChartPoint[];
    "1Y": ChartPoint[];
    All: ChartPoint[];
  };
  benchmarkTicker: string;
  isPositive?: boolean;
}

type Timeframe = "1W" | "1M" | "3M" | "1Y" | "All";

export function StockChart({
  chartData,
  benchmarkTicker,
  isPositive = true,
}: StockChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("3M");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    return chartData[timeframe] || chartData["3M"];
  }, [chartData, timeframe]);

  // Compute bounding box
  const { minPrice, maxPrice, minBench, maxBench } = useMemo(() => {
    if (!points || points.length === 0) {
      return { minPrice: 0, maxPrice: 100, minBench: 0, maxBench: 100 };
    }
    const prices = points.map((p) => p.price);
    const benches = points.map((p) => p.benchmarkPrice);

    const pMin = Math.min(...prices);
    const pMax = Math.max(...prices);
    const bMin = Math.min(...benches);
    const bMax = Math.max(...benches);

    const pad = (pMax - pMin) * 0.1 || pMax * 0.05;
    const bPad = (bMax - bMin) * 0.1 || bMax * 0.05;

    return {
      minPrice: pMin - pad,
      maxPrice: pMax + pad,
      minBench: bMin - bPad,
      maxBench: bMax + bPad,
    };
  }, [points]);

  // Generate smooth cubic Bezier curve
  const width = 500;
  const height = 180;
  const paddingRight = 65;
  const chartW = width - paddingRight;

  const { pathD, areaD, benchPathD, coords } = useMemo(() => {
    if (!points || points.length === 0) {
      return { pathD: "", areaD: "", benchPathD: "", coords: [] };
    }

    const priceRange = maxPrice - minPrice || 1;
    const benchRange = maxBench - minBench || 1;

    const cList = points.map((pt, i) => {
      const rawX = (i / (points.length - 1)) * chartW;
      const rawY =
        height - ((pt.price - minPrice) / priceRange) * (height - 20) - 10;
      const rawBy =
        height - ((pt.benchmarkPrice - minBench) / benchRange) * (height - 20) - 10;
      return {
        x: Math.round(rawX * 10) / 10,
        y: Math.round(rawY * 10) / 10,
        by: Math.round(rawBy * 10) / 10,
        price: pt.price,
        bench: pt.benchmarkPrice,
        time: pt.time,
      };
    });

    if (cList.length < 2) {
      return { pathD: "", areaD: "", benchPathD: "", coords: cList };
    }

    let p = `M ${cList[0].x.toFixed(1)},${cList[0].y.toFixed(1)}`;
    for (let i = 0; i < cList.length - 1; i++) {
      const p0 = cList[i === 0 ? 0 : i - 1];
      const p1 = cList[i];
      const p2 = cList[i + 1];
      const p3 = cList[i + 2 >= cList.length ? cList.length - 1 : i + 2];

      const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(1);
      const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(1);
      const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(1);
      const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(1);

      p += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const a = `${p} L ${cList[cList.length - 1].x.toFixed(1)},${height} L 0,${height} Z`;

    let bp = `M ${cList[0].x.toFixed(1)},${cList[0].by.toFixed(1)}`;
    for (let i = 0; i < cList.length - 1; i++) {
      const cp1x = (cList[i].x + (cList[i + 1].x - cList[i].x) / 2).toFixed(1);
      bp += ` Q ${cp1x},${cList[i].by.toFixed(1)} ${cList[i + 1].x.toFixed(1)},${cList[i + 1].by.toFixed(1)}`;
    }

    return { pathD: p, areaD: a, benchPathD: bp, coords: cList };
  }, [points, minPrice, maxPrice, minBench, maxBench, chartW]);

  const activePoint =
    hoveredIndex !== null && coords[hoveredIndex]
      ? coords[hoveredIndex]
      : coords[coords.length - 1];

  const strokeColor = isPositive ? "var(--sol-green)" : "var(--sol-pink)";
  const gradientId = `chart-grad-${isPositive ? "lime" : "rose"}-${timeframe}`;

  return (
    <div className="w-full select-none">
      {/* Chart Header Meta */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tabular-nums text-ink">
            ${activePoint?.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-ink/60 flex items-center gap-1 font-mono">
            <span className="inline-block w-2.5 h-0.5 border-t border-dashed border-ink/60"></span>
            vs {benchmarkTicker}
          </span>
        </div>

        <div className="text-[10px] text-ink/60 font-mono tabular-nums">
          {timeframe === "1W"
            ? "Last 7 Days"
            : timeframe === "1M"
            ? "Last 30 Days"
            : timeframe === "3M"
            ? "Jun 2026 – Sep 2026"
            : "Historical"}
        </div>
      </div>

      {/* SVG Canvas Container — fine-detail chart box */}
      <div className="ink-border-thin relative w-full h-[180px] overflow-hidden bg-paper-white p-2">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="85%" stopColor={strokeColor} stopOpacity="0.03" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>

          </defs>

          {/* Horizontal Grid lines */}
          <line
            x1="0"
            y1="30"
            x2={chartW}
            y2="30"
            stroke="var(--ink-line)"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="85"
            x2={chartW}
            y2="85"
            stroke="var(--ink-line)"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="140"
            x2={chartW}
            y2="140"
            stroke="var(--ink-line)"
            strokeDasharray="3 3"
          />

          {/* Gradient Fill Under Main Line */}
          {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

          {/* Benchmark Dashed Line */}
          {benchPathD && (
            <path
              d={benchPathD}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.45"
            />
          )}

          {/* Main Price Line — clean ink stroke, no glow */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Price Axis Labels on the Right */}
          <text
            x={chartW + 8}
            y="33"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontSize="9"
            className="font-mono tabular-nums font-medium"
          >
            ${Math.round(maxPrice * 0.95)}
          </text>
          <text
            x={chartW + 8}
            y="88"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontSize="9"
            className="font-mono tabular-nums font-medium"
          >
            ${Math.round((maxPrice + minPrice) / 2)}
          </text>
          <text
            x={chartW + 8}
            y="143"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontSize="9"
            className="font-mono tabular-nums font-medium"
          >
            ${Math.round(minPrice * 1.05)}
          </text>

          {/* Active Hover Marker */}
          {activePoint && (
            <g>
              <line
                x1={Math.round(activePoint.x * 10) / 10}
                y1="0"
                x2={Math.round(activePoint.x * 10) / 10}
                y2={height}
                stroke="var(--ink)"
                strokeDasharray="2 2"
              />
              <circle
                cx={Math.round(activePoint.x * 10) / 10}
                cy={Math.round(activePoint.y * 10) / 10}
                r="5"
                fill={strokeColor}
                stroke="var(--paper-white)"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible hover capture slices */}
          {coords.map((c, i) => (
            <rect
              key={i}
              x={c.x - chartW / coords.length / 2}
              y="0"
              width={chartW / coords.length}
              height={height}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}
        </svg>
      </div>

      {/* Timeframe Control Tabs */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="ink-border-thin flex items-center gap-0 bg-paper-white p-1">
          {(["1W", "1M", "3M", "1Y", "All"] as Timeframe[]).map((tf, i) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`cursor-pointer px-3 py-1 text-[11px] font-mono font-bold transition-all duration-200 ${
                  i > 0 ? "border-l-[1.5px] border-ink/15" : ""
                } ${
                  isActive
                    ? "bg-sol-green text-ink"
                    : "text-ink/50 hover:bg-paper hover:text-ink"
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Info / Benchmark Indicator */}
        <div className="ink-border-thin flex items-center gap-1.5 text-[11px] text-ink/70 px-2.5 py-1.5 bg-paper font-mono">
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Benchmark: {benchmarkTicker}</span>
        </div>
      </div>
    </div>
  );
}
