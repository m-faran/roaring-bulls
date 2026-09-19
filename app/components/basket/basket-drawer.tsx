"use client";

import React, { useState, useMemo } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { OrderType } from "@/app/lib/store/portfolio-context";
import {
  generateBasketQuote,
  SOL_USD_PRICE,
} from "@/app/lib/execution/mock-quotes";
import { Zap, RefreshCw, Target, Trash2, X, ArrowRight } from "lucide-react";

interface BasketDrawerProps {
  onExecute: (orderType: OrderType, config?: any) => void;
}

export function BasketDrawer({ onExecute }: BasketDrawerProps) {
  const {
    isBasketOpen,
    setIsBasketOpen,
    basket,
    removeFromBasket,
    updateAllocation,
    clearBasket,
    currency,
  } = useBasket();

  const [orderType, setOrderType] = useState<OrderType>("buy-now");
  const [dcaFrequency, setDcaFrequency] = useState<
    "daily" | "weekly" | "bi-weekly"
  >("daily");
  const [dcaCycles, setDcaCycles] = useState<number>(5);
  const [limitDipPct, setLimitDipPct] = useState<number>(3);

  // Prepare quote items in SOL
  const quoteItems = useMemo(() => {
    return basket.map((item) => {
      const allocationSol =
        currency === "SOL" ? item.allocation : item.allocation / SOL_USD_PRICE;
      return { stock: item.stock, allocationSol };
    });
  }, [basket, currency]);

  const quote = useMemo(() => {
    return generateBasketQuote(quoteItems);
  }, [quoteItems]);

  if (!isBasketOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#111111]/60 animate-in fade-in duration-200">
      <div className="paper-texture flex h-full w-full max-w-lg flex-col justify-between border-l-[3px] border-[#111111] shadow-[-8px_0_0_0_rgba(17,17,17,0.15)]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b-[3px] border-[#111111] bg-[#111111] px-5 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">
            Investment Basket • {basket.length}{" "}
            {basket.length === 1 ? "asset" : "assets"}
          </span>

          <div className="flex items-center gap-2">
            {basket.length > 0 && (
              <button
                onClick={clearBasket}
                className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF5C8A] transition-opacity hover:opacity-70"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsBasketOpen(false)}
              className="cursor-pointer text-[#F5F1E8] transition-opacity hover:opacity-70"
              aria-label="Close basket"
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Order Type Selector */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              Execution Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "buy-now", label: "Buy Now", icon: Zap, desc: "Instant Swap" },
                { id: "recurring-dca", label: "Recurring", icon: RefreshCw, desc: "SIP DCA" },
                { id: "limit-order", label: "Limit", icon: Target, desc: "Dip Trigger" },
              ].map((tab) => {
                const isActive = orderType === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderType(tab.id as OrderType)}
                    className={`ink-border-thin flex cursor-pointer flex-col items-center py-2.5 px-2 transition-transform hover:-translate-y-0.5 ${
                      isActive
                        ? "ink-shadow-sm bg-[#14F195] text-[#111111]"
                        : "bg-white text-[#111111]/60"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      <TabIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      <span>{tab.label}</span>
                    </span>
                    <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wide opacity-70">
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DCA Frequency & Cycles Config */}
          {orderType === "recurring-dca" && (
            <div className="ink-border-thin space-y-3 bg-[#EAFBF2] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wide text-[#111111]">
                  DCA Interval:
                </span>
                <div className="flex gap-1.5">
                  {(["daily", "weekly", "bi-weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDcaFrequency(freq)}
                      className={`ink-border-thin cursor-pointer px-2.5 py-1 font-mono text-[11px] font-bold ${
                        dcaFrequency === freq
                          ? "bg-[#14F195] text-[#111111]"
                          : "bg-white text-[#111111]/60"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wide text-[#111111]">
                  Total Cycles:
                </span>
                <div className="flex gap-1.5">
                  {[3, 5, 10, 30].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDcaCycles(c)}
                      className={`ink-border-thin cursor-pointer px-2.5 py-1 font-mono text-[11px] font-bold ${
                        dcaCycles === c
                          ? "bg-[#14F195] text-[#111111]"
                          : "bg-white text-[#111111]/60"
                      }`}
                    >
                      {c}x
                    </button>
                  ))}
                </div>
              </div>
              <p className="border-t-2 border-dashed border-[#111111]/40 pt-2 font-mono text-[11px] text-[#111111]/70">
                Splits total basket budget into {dcaCycles} scheduled automated buys ({dcaFrequency}).
              </p>
            </div>
          )}

          {/* Limit Order Target Dip Config */}
          {orderType === "limit-order" && (
            <div className="ink-border-thin space-y-3 bg-[#F3EBFF] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wide text-[#111111]">
                  Buy On Dip Target:
                </span>
                <div className="flex gap-1.5">
                  {[2, 3, 5, 8].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setLimitDipPct(pct)}
                      className={`ink-border-thin cursor-pointer px-2.5 py-1 font-mono text-[11px] font-bold ${
                        limitDipPct === pct
                          ? "bg-[#9945FF] text-white"
                          : "bg-white text-[#111111]/60"
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>
              <p className="border-t-2 border-dashed border-[#111111]/40 pt-2 font-mono text-[11px] text-[#111111]/70">
                Orders will be deployed and trigger automatically when market prices pull back {limitDipPct}%.
              </p>
            </div>
          )}

          {/* Selected Assets List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#111111]/60">
              <span>Selected Assets ({basket.length})</span>
              <span>Allocations</span>
            </div>

            {basket.length === 0 ? (
              <div className="ink-border-thin border-dashed bg-white/60 p-6 text-center">
                <p className="text-sm font-bold text-[#111111]">
                  Your basket is empty
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#111111]/60">
                  Swipe right on stock cards in the deck to add them to your investment basket.
                </p>
              </div>
            ) : (
              basket.map((item) => {
                const quoteItem = quote.items.find(
                  (q) => q.stock.id === item.stock.id
                );
                return (
                  <div
                    key={item.stock.id}
                    className="ink-border-thin ink-shadow-sm bg-white"
                  >
                    <div className="flex items-center justify-between gap-2 p-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="ink-border-thin flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden bg-[#F5F1E8] font-mono text-[10px] font-bold text-[#111111]">
                          {item.stock.logoURI ? (
                            // eslint-disable-next-line @next/next/no-img-element -- remote token logos from catalog
                            <img
                              src={item.stock.logoURI}
                              alt={item.stock.name}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            item.stock.ticker.slice(0, 3)
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-bold text-[#111111]">
                              {item.stock.name}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] text-[#111111]/50">
                              ({item.stock.ticker})
                            </span>
                          </div>
                          <p className="font-mono text-[11px] tabular-nums text-[#111111]/60">
                            ${item.stock.price.toFixed(2)} USD
                          </p>
                        </div>
                      </div>

                      {/* Allocation Input & Remove */}
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="ink-border-thin flex items-center bg-[#F5F1E8]">
                          <input
                            type="number"
                            step="any"
                            value={item.allocation}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val))
                                updateAllocation(item.stock.id, val);
                            }}
                            className="w-14 bg-transparent px-2 py-1 text-right font-mono text-xs font-bold text-[#111111] outline-none tabular-nums"
                          />
                          <span className="border-l-[1.5px] border-[#111111]/20 px-1.5 font-mono text-[10px] text-[#111111]/50">
                            {currency}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromBasket(item.stock.id)}
                          className="cursor-pointer p-1 text-[#111111]/40 transition-colors hover:text-[#FF5C8A]"
                          title="Remove from basket"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Routing Details row */}
                    {quoteItem && (
                      <div className="flex items-center justify-between border-t-[1.5px] border-dashed border-[#111111]/40 px-3 py-1.5 font-mono text-[10px]">
                        <span className="max-w-[200px] truncate text-[#111111]/60">
                          {quoteItem.route}
                        </span>
                        <span className="font-bold tabular-nums text-[#111111]">
                          ≈ {quoteItem.estimatedTokensOut} {item.stock.ticker}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Routing & Execution Summary — fine-detail stat box */}
          {basket.length > 0 && (
            <div className="ink-border-thin divide-y-[1.5px] divide-[#111111]/15 bg-[#F5F1E8] font-mono text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="font-bold text-[#111111]">
                  Total Budget Allocation
                </span>
                <span className="font-bold tabular-nums">
                  {quote.totalSol} SOL (≈ ${quote.totalUsd} USD)
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-[11px]">
                <span className="text-[#111111]/60">Slippage Tolerance</span>
                <span className="tabular-nums text-[#111111]">0.5%</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-[11px]">
                <span className="text-[#111111]/60">Estimated Network Fee</span>
                <span className="tabular-nums text-[#111111]">
                  ~{quote.estimatedNetworkFeeSol} SOL
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-[11px]">
                <span className="text-[#111111]/60">Routing Engine</span>
                <span className="font-bold text-[#111111]">
                  Devnet On-Chain Verified (Memo + Lamports)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="border-t-[3px] border-[#111111] bg-[#EDE7D8] p-5">
          <button
            onClick={() =>
              onExecute(orderType, {
                dcaFrequency,
                dcaCycles,
                limitDipPct,
              })
            }
            disabled={basket.length === 0}
            className="ink-border ink-shadow ink-press flex w-full cursor-pointer items-center justify-center gap-2 bg-[#14F195] py-4 font-display text-sm font-black uppercase tracking-wide text-[#111111] disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>
              {orderType === "buy-now"
                ? "Execute Basket Now"
                : orderType === "recurring-dca"
                ? `Initialize DCA (${dcaCycles} Cycles)`
                : `Deploy Limit Orders (-${limitDipPct}%)`}
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
