"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { useData } from "../lib/store/data-context";
import { fetchJupiterPrices } from "../lib/api/jupiter-service";
import { StockToken, buildChartData } from "../lib/data/stocks-catalog";
import { useBasket } from "../lib/store/basket-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StockCard } from "../components/swipe/stock-card";
import { SessionSetupModal } from "../components/swipe/session-setup";
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  ScanSearch,
  ArrowLeft,
  ArrowRight,
  Settings2,
  ShoppingCart,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

/* ============================================================
   VIRTUALIZATION CONSTANTS — constant row height keeps the
   window math O(1) with zero measurement passes.
   ============================================================ */
const ROW_H = 68; // px — must match the row wrapper height exactly
const OVERSCAN = 5; // rows rendered above/below the viewport
const VIEWPORT_H = 560; // px — fixed-height scroll window
const PRICE_POLL_MS = 8000; // live refresh cadence for the visible window

/* ============================================================
   FORMATTERS
   ============================================================ */
function formatUsd(price: number): string {
  if (!price || price <= 0) return "---";
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: price >= 100 ? 2 : price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 1 ? 2 : 4,
  })}`;
}

/* ============================================================
   BACK BUTTON — shared chrome for the drill-down stages
   ============================================================ */
function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ink-border-thin ink-shadow-sm ink-press flex cursor-pointer items-center gap-2 self-start bg-paper-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-ink"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={3} />
      {label}
    </button>
  );
}

/* ============================================================
   RESULT ROW — memoized so scrolling re-renders nothing unless
   a row's own live price actually changed.
   ============================================================ */
interface ResultRowProps {
  stock: StockToken;
  index: number;
  livePrice: number | undefined;
  top: number;
  onIsolate: (id: string) => void;
}

const ResultRow = memo(function ResultRow({
  stock,
  index,
  livePrice,
  top,
  onIsolate,
}: ResultRowProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const price = livePrice !== undefined && livePrice > 0 ? livePrice : stock.price;
  const isPositive = (stock.change24h ?? 0) >= 0;
  // The catalog mapper ships change24h: 0 as "unknown" — show the muted
  // placeholder rather than a fake +0.00% reading.
  const hasChange =
    stock.change24h !== undefined &&
    stock.change24h !== null &&
    stock.change24h !== 0;

  return (
    <div
      className="absolute left-0 right-0 px-3"
      style={{ top, height: ROW_H }}
    >
      <button
        onClick={() => onIsolate(stock.id)}
        className="group ink-press ink-border-thin flex h-[56px] w-full cursor-pointer items-center gap-3 bg-paper-white px-3 text-left"
        title={`Isolate ${stock.ticker}`}
      >
        {/* Receipt line number */}
        <span className="w-8 shrink-0 font-mono text-[10px] font-bold tabular-nums text-ink-faint">
          {String(index + 1).padStart(3, "0")}
        </span>

        {/* Logo tile — falls back to ticker initial */}
        <span className="ink-border-thin flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-paper">
          {stock.logoURI && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
            <img
              src={stock.logoURI}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="font-display text-sm font-black text-ink">
              {stock.ticker.charAt(0)}
            </span>
          )}
        </span>

        {/* Ticker + name/sector */}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-display text-sm font-black tracking-tight text-ink">
              {stock.ticker}
            </span>
            <span className="hidden truncate font-mono text-[10px] uppercase tracking-widest text-ink-faint sm:inline">
              {stock.sector}
            </span>
          </span>
          <span className="block truncate font-mono text-[11px] text-ink-soft">
            {stock.name}
          </span>
        </span>

        {/* Live price + 24h change chip */}
        <span className="shrink-0 text-right">
          <span className="block font-mono text-sm font-bold tabular-nums text-ink">
            {formatUsd(price)}
          </span>
          <span
            className={`flex items-center justify-end gap-1 font-mono text-[10px] font-bold tabular-nums ${
              !hasChange
                ? "text-ink-faint"
                : isPositive
                  ? "text-status-green"
                  : "text-status-red"
            }`}
          >
            {hasChange &&
              (isPositive ? (
                <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
              ))}
            {hasChange
              ? `${isPositive ? "+" : ""}${stock.change24h!.toFixed(2)}%`
              : "24H ···"}
          </span>
        </span>
      </button>
    </div>
  );
});

/* ============================================================
   SEARCH PAGE — three stages:
   1. TAPE      — virtualized result list
   2. ISOLATED  — the single stock alone on its own ticket
   3. RECEIPT   — full equity receipt + basket allocation panel
   ============================================================ */
export default function SearchPage() {
  const { searchStocks, isLoading: isDataLoading } = useData();
  const {
    setActiveTab,
    basket,
    addToBasket,
    removeFromBasket,
    currency,
    riskTier,
    sessionBudget,
    totalAllocated,
    remainingBudget,
    budgetUtilizationPct,
    allocationPerSwipe,
    setIsSessionSetupOpen,
    setIsBasketOpen,
  } = useBasket();
  const router = useRouter();

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [scrollTop, setScrollTop] = useState(0);
  const [isolatedId, setIsolatedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef(0);
  const restoreOnBackRef = useRef(false);

  // Mark the Search tab active so the header switcher highlights it on
  // direct load / refresh of /search.
  useEffect(() => {
    setActiveTab("search");
  }, [setActiveTab]);

  // Debounce the query into the filter (~150ms) so typing stays instant
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery), 150);
    return () => clearTimeout(t);
  }, [rawQuery]);

  // Instant in-memory filter
  const filteredStocks = useMemo(() => {
    if (!query) return searchStocks;
    const lowerQ = query.toLowerCase();
    return searchStocks.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQ) ||
        s.ticker.toLowerCase().includes(lowerQ)
    );
  }, [searchStocks, query]);

  // New result set → rewind the scroll window + exit any drill-down
  useEffect(() => {
    setScrollTop(0);
    setIsolatedId(null);
    setShowDetail(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [query]);

  /* ---- Drill-down stock (stage 2 & 3) ---- */
  const isolatedStock = useMemo(
    () => filteredStocks.find((s) => s.id === isolatedId) ?? null,
    [filteredStocks, isolatedId]
  );

  const isolatedPrice =
    isolatedStock &&
    livePrices[isolatedStock.mint] !== undefined &&
    livePrices[isolatedStock.mint] > 0
      ? livePrices[isolatedStock.mint]
      : isolatedStock?.price ?? 0;

  /* StockCard renders price + chart from stock.price / stock.chartData.
     The data-context builds search catalog charts from a $1 fallback
     (deck prices never cover search-only mints), so for the drill-down
     we rehydrate the receipt with the stock's live JIT price and a
     chart re-scaled to it. */
  const detailStock = useMemo(() => {
    if (!isolatedStock) return null;
    return {
      ...isolatedStock,
      price: isolatedPrice,
      chartData: buildChartData(
        isolatedPrice > 0 ? isolatedPrice : 1,
        15
      ),
    };
  }, [isolatedStock, isolatedPrice]);

  /* ---- Window math (virtualization core) ---- */
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const endIdx = Math.min(
    filteredStocks.length,
    Math.ceil(scrollTop / ROW_H) + Math.ceil(VIEWPORT_H / ROW_H) + OVERSCAN
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  /* ---- Single-Token Jupiter Pricing ----
     To preserve Jupiter API credits and prevent 429 Too Many Requests,
     we strictly fetch live prices ONLY when the user isolates a single
     token (either via search filtering to 1, or clicking into the drill-down).
     We explicitly do NOT fetch on scroll based on startIdx/endIdx. */
  useEffect(() => {
    let mintToFetch: string | null = null;
    if (isolatedStock) {
      mintToFetch = isolatedStock.mint;
    } else if (filteredStocks.length === 1) {
      mintToFetch = filteredStocks[0].mint;
    }

    if (!mintToFetch) return; // Halt! Do not fetch massive chunks on scroll

    let isActive = true;

    async function fetchSinglePrice() {
      try {
        const freshPrices = await fetchJupiterPrices([mintToFetch!]);
        if (isActive && freshPrices) {
          setLivePrices((prev) => ({ ...prev, ...freshPrices }));
        }
      } catch (err) {
        console.error("Single Price Fetch Error:", err);
      }
    }

    fetchSinglePrice();
    const interval = setInterval(fetchSinglePrice, PRICE_POLL_MS);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [filteredStocks, isolatedStock]);

  /* ---- Drill-down handlers ---- */
  const isolateStock = useCallback((id: string) => {
    savedScrollRef.current = scrollRef.current?.scrollTop ?? 0;
    restoreOnBackRef.current = true;
    setIsolatedId(id);
    setShowDetail(false);
    window.scrollTo(0, 0);
  }, []);

  const backToIsolated = useCallback(() => {
    setShowDetail(false);
    window.scrollTo(0, 0);
  }, []);

  const backToTape = useCallback(() => {
    setIsolatedId(null);
    setShowDetail(false);
    window.scrollTo(0, 0);
  }, []);

  // Restore list scroll position when returning from isolation
  useEffect(() => {
    if (!isolatedId && restoreOnBackRef.current) {
      restoreOnBackRef.current = false;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = savedScrollRef.current;
        setScrollTop(savedScrollRef.current);
      }
    }
  }, [isolatedId]);

  // Escape backs out one drill-down level (unless typing in the search bar)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (showDetail) backToIsolated();
      else if (isolatedId) backToTape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDetail, isolatedId, backToIsolated, backToTape]);

  // Review & Execute → land on the deck tab with the basket drawer open
  const reviewBasket = useCallback(() => {
    setActiveTab("app");
    setIsBasketOpen(true);
    router.push("/");
  }, [setActiveTab, setIsBasketOpen, router]);

  /* ---- Add to basket — same flow as the swipe deck's right-swipe:
     allocates allocationPerSwipe (capped to remaining budget) and
     toasts the result. ---- */
  const handleAddToBasket = useCallback(() => {
    if (!isolatedStock) return;
    const added = addToBasket(isolatedStock);
    if (added) {
      toast.success(`Added ${isolatedStock.ticker} to basket`, {
        description: `Allocated ${allocationPerSwipe} ${currency}`,
        duration: 1800,
      });
    } else {
      toast.warning("Session budget reached!", {
        description: "Review your basket or adjust budget in session setup.",
      });
    }
  }, [isolatedStock, addToBasket, allocationPerSwipe, currency]);

  const visibleRows = filteredStocks.slice(startIdx, endIdx);

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-10 pt-8">
        {/* ---------- Page header ---------- */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-ink-soft">
            <span className="inline-block h-2.5 w-2.5 bg-sol-green" />
            Roaring Bulls · Tape Lookup
          </div>
          <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight text-ink sm:text-5xl">
            SEARCH THE
            <span className="ml-3 inline-block -rotate-1 bg-sol-green px-2 text-ink">
              TAPE.
            </span>
          </h1>
          <p className="mt-3 max-w-xl font-mono text-xs text-ink-soft">
            {searchStocks.length} TOKENIZED EQUITIES LISTED · QUOTES PRINTED
            LIVE VIA JUPITER AS ROWS ENTER VIEW
          </p>
        </div>

        {/* ---------- Search bar ---------- */}
        <div className="ink-border ink-shadow mb-3 flex items-center gap-2 bg-paper-white px-4 py-1">
          <Search className="h-5 w-5 shrink-0 text-ink-soft" strokeWidth={2.5} />
          <input
            type="text"
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setRawQuery("");
            }}
            placeholder='TYPE TICKER OR COMPANY · TRY "AAPL" OR "TESLA"'
            autoFocus
            className="paper-input w-full bg-transparent py-3 font-mono text-sm font-bold uppercase tracking-wide"
            aria-label="Search tokenized equities"
          />
          {rawQuery && (
            <button
              onClick={() => setRawQuery("")}
              className="ink-border-thin ink-press flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center bg-sol-pink text-white"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* ============================================================
            STAGE 3 — EQUITY RECEIPT + BASKET ALLOCATION
            ============================================================ */}
        {isolatedStock && showDetail ? (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left: budget strip + full equity receipt */}
            <div className="flex flex-col items-stretch lg:col-span-8">
              <BackButton label="Back to isolated" onClick={backToIsolated} />

              {/* Budget allocation meter — kept per the deck design */}
              <div className="ink-border-thin ink-shadow-sm mt-3 flex w-full items-center justify-between bg-paper-white px-3 py-2 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-ink/75">Allocated:</span>
                  <span className="font-bold tabular-nums text-ink">
                    {budgetUtilizationPct}%
                  </span>
                </div>

                {/* Mini progress track */}
                <div className="ink-border-thin mx-3 h-2 flex-1 overflow-hidden bg-paper">
                  <div
                    className="h-full bg-sol-green transition-all duration-300"
                    style={{ width: `${budgetUtilizationPct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-ink/75">Remaining:</span>
                  <span className="font-bold tabular-nums text-ink">
                    {remainingBudget} {currency}
                  </span>
                  <button
                    onClick={() => setIsSessionSetupOpen(true)}
                    className="ink-border-thin ink-press cursor-pointer bg-sol-yellow p-1"
                    title="Configure session budget & allocation"
                  >
                    <Settings2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Full equity receipt — no swipe stamps, no tier tabs */}
              <div className="mt-3 flex justify-center">
                {detailStock && <StockCard stock={detailStock} />}
              </div>

              {/* Add to basket — mirrors the deck's right-swipe check */}
              <button
                onClick={handleAddToBasket}
                className="ink-border-thin ink-shadow-sm ink-press mx-auto mt-3 flex cursor-pointer items-center justify-center gap-1.5 bg-sol-green px-5 py-2 font-display text-[11px] font-black uppercase tracking-wide text-ink"
                title={`Allocate ${allocationPerSwipe} ${currency} to ${isolatedStock.ticker}`}
              >
                {basket.some((item) => item.stock.id === isolatedStock.id) ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                )}
                <span>
                  Add {isolatedStock.ticker} to Basket ({allocationPerSwipe}{" "}
                  {currency})
                </span>
              </button>
            </div>

            {/* Right: Basket Allocation live preview */}
            <div className="flex flex-col gap-5 pt-1 lg:col-span-4">
              <div className="ink-border ink-shadow bg-paper-white">
                {/* Stub header */}
                <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                    Basket Allocation • Live Preview
                  </span>
                  <span className="ink-border-thin bg-sol-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">
                    {basket.length} {basket.length === 1 ? "asset" : "assets"}
                  </span>
                </div>

                <div className="ink-frame space-y-4 p-4">
                  {/* Budget progress meter */}
                  <div className="ink-border-thin divide-y-[1.5px] divide-ink/15 bg-paper">
                    <div className="flex items-center justify-between px-3 py-2 font-mono text-xs">
                      <span className="text-ink/60">Session Budget Deployed</span>
                      <span className="font-bold tabular-nums text-ink">
                        {totalAllocated} / {sessionBudget} {currency} (
                        {budgetUtilizationPct}%)
                      </span>
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="ink-border-thin h-2.5 w-full overflow-hidden bg-paper-white">
                        <div
                          className="h-full bg-sol-green transition-all duration-300"
                          style={{ width: `${budgetUtilizationPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 font-mono text-[11px]">
                      <span className="text-ink/60">
                        Remaining:{" "}
                        <strong className="font-bold tabular-nums text-ink">
                          {remainingBudget} {currency}
                        </strong>
                      </span>
                      <span className="font-bold capitalize text-ink">
                        {riskTier} tier
                      </span>
                    </div>
                  </div>

                  {/* Added assets list */}
                  <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                    {basket.length === 0 ? (
                      <div className="ink-border-thin border-dashed bg-paper-white/60 py-8 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center border-[1.5px] border-ink/30 text-ink/50">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <p className="mt-2 text-xs font-bold text-ink/70">
                          No assets in basket yet
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50">
                          Swipe right on the deck or add from the tape to
                          allocate budget.
                        </p>
                      </div>
                    ) : (
                      basket.map((item) => (
                        <div
                          key={item.stock.id}
                          className="ink-border-thin flex items-center justify-between gap-2 bg-paper p-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="ink-border-thin flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden bg-paper-white p-1">
                              {item.stock.logoURI ? (
                                // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
                                <img
                                  src={item.stock.logoURI}
                                  alt={item.stock.name}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <span className="font-mono text-[10px] font-bold">
                                  {item.stock.ticker.slice(0, 2)}
                                </span>
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="max-w-[140px] truncate text-xs font-bold text-ink">
                                {item.stock.name}
                              </p>
                              <p className="font-mono text-[10px] text-ink/50">
                                {item.stock.ticker}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2.5">
                            <span className="font-mono text-xs font-bold tabular-nums">
                              {item.allocation} {currency}
                            </span>
                            <button
                              onClick={() => removeFromBasket(item.stock.id)}
                              className="cursor-pointer p-1 text-ink/40 transition-colors hover:text-sol-pink"
                              title="Remove from basket"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Action trigger — jumps to the deck tab with drawer open */}
                  <button
                    onClick={reviewBasket}
                    disabled={basket.length === 0}
                    className="ink-border ink-shadow-sm ink-press flex w-full cursor-pointer items-center justify-center gap-2 bg-sol-green py-3.5 font-display text-xs font-black uppercase tracking-wide text-ink disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span>Review & Execute Basket ({basket.length})</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : isolatedStock ? (
          /* ============================================================
             STAGE 2 — ISOLATED TICKET
             ============================================================ */
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <BackButton label="Back to tape" onClick={backToTape} />

            <button
              onClick={() => {
                setShowDetail(true);
                window.scrollTo(0, 0);
              }}
              className="ink-border ink-shadow-lg ink-press mt-3 flex w-full cursor-pointer flex-col overflow-hidden bg-paper-white text-left"
              title="Open full equity receipt + basket allocation"
            >
              {/* Ticket stub header */}
              <div className="flex shrink-0 items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                  Roaring Bulls • Isolated Ticket
                </span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sol-pink" />
                  <span className="h-2 w-2 rounded-full bg-sol-yellow" />
                  <span className="h-2 w-2 rounded-full bg-sol-green" />
                </span>
              </div>

              <div className="ink-frame space-y-3 p-4">
                {/* Identity + live price */}
                <div className="ink-border-thin divide-y-[1.5px] divide-ink/15 bg-paper">
                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="ink-border-thin flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-paper-white p-1.5">
                        {isolatedStock.logoURI ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
                          <img
                            src={isolatedStock.logoURI}
                            alt={isolatedStock.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="font-display text-lg font-black text-ink">
                            {isolatedStock.ticker.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-xl font-black tracking-tight text-ink">
                            {isolatedStock.ticker}
                          </span>
                          <span className="hidden truncate font-mono text-[10px] uppercase tracking-widest text-ink-faint sm:inline">
                            {isolatedStock.sector}
                          </span>
                        </span>
                        <span className="block truncate font-mono text-xs text-ink-soft">
                          {isolatedStock.name}
                        </span>
                      </span>
                    </div>

                    <span className="shrink-0 text-right">
                      <span className="block font-mono text-2xl font-bold tabular-nums text-ink">
                        {formatUsd(isolatedPrice)}
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                        Live · Jupiter
                      </span>
                    </span>
                  </div>
                </div>

                {/* Exposure allocation bar — kept from the deck card */}
                <div className="ink-border-thin space-y-2 bg-paper p-3">
                  <div className="ink-border-thin flex h-2 w-full overflow-hidden bg-paper-white">
                    {isolatedStock.allocationSegments.map((seg, idx) => (
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
                  <div className="flex h-4 items-center gap-x-3 overflow-hidden font-mono text-[10px] text-ink/70">
                    {isolatedStock.allocationSegments.slice(0, 3).map((seg, idx) => (
                      <div key={idx} className="flex shrink-0 items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 shrink-0"
                          style={{ backgroundColor: seg.color }}
                        />
                        <span className="max-w-[95px] truncate font-semibold text-ink">
                          {seg.label}
                        </span>
                        <span className="font-bold">{seg.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>

            <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-ink-soft">
              Step 2 of 2 · Click the ticket to open the equity receipt +
              basket allocation
            </p>
          </div>
        ) : (
          /* ============================================================
             STAGE 1 — TAPE (virtualized results)
             ============================================================ */
          <>
            {/* Results meta line */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-ink-soft">
              <span>
                {filteredStocks.length} RESULT
                {filteredStocks.length === 1 ? "" : "S"}
                {query && ` · "${query.toUpperCase()}"`}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sol-green" />
                </span>
                Live pricing · rows {filteredStocks.length > 0 ? startIdx + 1 : 0}–
                {endIdx}
              </span>
            </div>

            {/* Results receipt */}
            <div className="ink-border ink-shadow-lg overflow-hidden bg-paper-white">
              {/* Ticket stub header — matches the equity receipt cards */}
              <div className="flex shrink-0 items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                  Roaring Bulls • Tape Receipt
                </span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sol-pink" />
                  <span className="h-2 w-2 rounded-full bg-sol-yellow" />
                  <span className="h-2 w-2 rounded-full bg-sol-green" />
                </span>
              </div>

              {isDataLoading ? (
                /* ---------- Loading skeleton ---------- */
                <div className="flex flex-col gap-2 p-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="ink-border-thin flex h-[56px] items-center gap-3 bg-paper px-3"
                    >
                      <div className="h-8 w-8 shrink-0 animate-pulse bg-paper-deep" />
                      <div className="flex-1">
                        <div className="mb-1.5 h-3 w-24 animate-pulse bg-paper-deep" />
                        <div className="h-2 w-40 animate-pulse bg-paper-deep" />
                      </div>
                      <div className="h-3 w-16 animate-pulse bg-paper-deep" />
                    </div>
                  ))}
                </div>
              ) : filteredStocks.length === 0 ? (
                /* ---------- Empty state ---------- */
                <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                  <div className="ink-border-thin halftone flex h-16 w-16 -rotate-3 items-center justify-center bg-sol-yellow">
                    <ScanSearch className="h-7 w-7 text-ink" strokeWidth={2.5} />
                  </div>
                  <p className="font-display text-2xl font-black tracking-tight text-ink">
                    NO BULLS FOUND.
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                    {query
                      ? `Nothing matches "${query.toUpperCase()}" · try "AAPL" or "TESLA"`
                      : "The tape is empty · pull to refresh or check the feed"}
                  </p>
                  {rawQuery !== query && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      Filtering…
                    </p>
                  )}
                </div>
              ) : (
                /* ---------- Virtualized rows ---------- */
                <>
                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative overflow-y-auto"
                    style={{
                      height: Math.min(
                        VIEWPORT_H,
                        filteredStocks.length * ROW_H
                      ),
                    }}
                  >
                    {/* Spacer = full list height; only the window is rendered */}
                    <div
                      style={{
                        height: filteredStocks.length * ROW_H,
                        position: "relative",
                      }}
                    >
                      {visibleRows.map((stock, i) => (
                        <ResultRow
                          key={stock.id}
                          stock={stock}
                          index={startIdx + i}
                          livePrice={livePrices[stock.mint]}
                          top={(startIdx + i) * ROW_H}
                          onIsolate={isolateStock}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Receipt footer — tear line + scroll hint */}
                  <div className="flex items-center justify-between border-t-2 border-dashed border-ink px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                    <span>
                      Showing {visibleRows.length} of {filteredStocks.length} ·
                      virtualized
                    </span>
                    <span>Click a row to isolate · scroll for more ↓</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Session setup modal (gear on the budget strip) */}
      <SessionSetupModal />
    </div>
  );
}
