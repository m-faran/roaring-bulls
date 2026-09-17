"use client";

import React, { useState, useMemo } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { OrderType } from "@/app/lib/store/portfolio-context";
import { generateBasketQuote, SOL_USD_PRICE } from "@/app/lib/execution/mock-quotes";

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
    sessionBudget,
  } = useBasket();

  const [orderType, setOrderType] = useState<OrderType>("buy-now");
  const [dcaFrequency, setDcaFrequency] = useState<"daily" | "weekly" | "bi-weekly">("daily");
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0B0F19] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Investment Basket</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">
              {basket.length} {basket.length === 1 ? "asset" : "assets"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {basket.length > 0 && (
              <button
                onClick={clearBasket}
                className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsBasketOpen(false)}
              className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Order Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Execution Strategy</label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-950/80 border border-white/5">
              {[
                { id: "buy-now", label: "⚡ Buy Now", desc: "Instant Swap" },
                { id: "recurring-dca", label: "🔄 Recurring", desc: "SIP DCA" },
                { id: "limit-order", label: "🎯 Limit Order", desc: "Dip Trigger" },
              ].map((tab) => {
                const isActive = orderType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderType(tab.id as OrderType)}
                    className={`cursor-pointer py-2 px-2 rounded-xl flex flex-col items-center transition ${
                      isActive
                        ? "bg-slate-800 text-white shadow border border-white/10"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold">{tab.label}</span>
                    <span className="text-[10px] text-slate-400">{tab.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DCA Frequency & Cycles Config */}
          {orderType === "recurring-dca" && (
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-400">DCA Interval:</span>
                <div className="flex gap-1">
                  {(["daily", "weekly", "bi-weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDcaFrequency(freq)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        dcaFrequency === freq
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-400">Total Cycles:</span>
                <div className="flex gap-1">
                  {[3, 5, 10, 30].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDcaCycles(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        dcaCycles === c
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {c}x
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Splits total basket budget into {dcaCycles} scheduled automated buys ({dcaFrequency}).
              </p>
            </div>
          )}

          {/* Limit Order Target Dip Config */}
          {orderType === "limit-order" && (
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-950/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-blue-400">Buy On Dip Target:</span>
                <div className="flex gap-1">
                  {[2, 3, 5, 8].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setLimitDipPct(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        limitDipPct === pct
                          ? "bg-blue-500 text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Orders will be deployed and trigger automatically when market prices pull back {limitDipPct}%.
              </p>
            </div>
          )}

          {/* Selected Assets List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Selected Assets ({basket.length})</span>
              <span>Allocations</span>
            </div>

            {basket.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 p-6 space-y-2">
                <p className="text-sm font-semibold text-slate-300">Your basket is empty</p>
                <p className="text-xs text-slate-500">
                  Swipe right on stock cards in the deck to add them to your investment basket.
                </p>
              </div>
            ) : (
              basket.map((item) => {
                const quoteItem = quote.items.find((q) => q.stock.id === item.stock.id);
                return (
                  <div
                    key={item.stock.id}
                    className="p-3.5 rounded-2xl border border-white/5 bg-slate-950/50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                          {item.stock.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{item.stock.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({item.stock.ticker})</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            ${item.stock.price.toFixed(2)} USD
                          </p>
                        </div>
                      </div>

                      {/* Allocation Input & Remove */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-900 rounded-xl px-2 py-1 border border-white/10">
                          <input
                            type="number"
                            step="any"
                            value={item.allocation}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) updateAllocation(item.stock.id, val);
                            }}
                            className="w-14 text-right text-xs font-semibold text-white bg-transparent outline-none tabular-nums"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">{currency}</span>
                        </div>

                        <button
                          onClick={() => removeFromBasket(item.stock.id)}
                          className="cursor-pointer text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition"
                          title="Remove from basket"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Routing Details */}
                    {quoteItem && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1 border-t border-white/5">
                        <span className="truncate max-w-[200px] text-slate-400">
                          {quoteItem.route}
                        </span>
                        <span className="font-mono text-emerald-400 tabular-nums">
                          ≈ {quoteItem.estimatedTokensOut} {item.stock.ticker}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Routing & Execution Summary */}
          {basket.length > 0 && (
            <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/70 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Total Budget Allocation:</span>
                <span className="tabular-nums text-white">
                  {quote.totalSol} SOL (≈ ${quote.totalUsd} USD)
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Slippage Tolerance:</span>
                <span className="tabular-nums">0.5%</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Estimated Network Fee:</span>
                <span className="tabular-nums font-mono">~{quote.estimatedNetworkFeeSol} SOL</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Routing Engine:</span>
                <span className="text-emerald-400">Devnet On-Chain Verified (Memo + Lamports)</span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-white/10 bg-slate-950/80 space-y-3">
          <button
            onClick={() =>
              onExecute(orderType, {
                dcaFrequency,
                dcaCycles,
                limitDipPct,
              })
            }
            disabled={basket.length === 0}
            className="w-full cursor-pointer py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>
              {orderType === "buy-now"
                ? "Execute Basket Now"
                : orderType === "recurring-dca"
                ? `Initialize DCA (${dcaCycles} Cycles)`
                : `Deploy Limit Orders (-${limitDipPct}%)`}
            </span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
