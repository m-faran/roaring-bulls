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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0A111F] border-l border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#05080E]/70">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-display font-black text-white tracking-tight">
              Investment Basket
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-mono font-bold shadow-[0_0_10px_rgba(0,255,136,0.2)]">
              {basket.length} {basket.length === 1 ? "asset" : "assets"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {basket.length > 0 && (
              <button
                onClick={clearBasket}
                className="cursor-pointer text-xs font-mono text-[#FF1B6B] hover:text-[#FF1B6B]/80 px-2.5 py-1 rounded-lg hover:bg-[#FF1B6B]/10 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsBasketOpen(false)}
              className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Order Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-display font-bold text-slate-300">
              Execution Strategy
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#05080E] border border-cyan-500/20 shadow-inner">
              {[
                { id: "buy-now", label: "Buy Now", icon: Zap, desc: "Instant Swap" },
                { id: "recurring-dca", label: "Recurring", icon: RefreshCw, desc: "SIP DCA" },
                { id: "limit-order", label: "Limit Order", icon: Target, desc: "Dip Trigger" },
              ].map((tab) => {
                const isActive = orderType === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderType(tab.id as OrderType)}
                    className={`cursor-pointer py-2.5 px-2 rounded-xl flex flex-col items-center transition-all ${
                      isActive
                        ? "bg-[#101A2E] text-white shadow-[0_0_15px_rgba(0,240,255,0.25)] border border-cyan-500/40"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-display font-bold">
                      <TabIcon className={`w-3.5 h-3.5 ${isActive ? "text-[#00FF88]" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DCA Frequency & Cycles Config */}
          {orderType === "recurring-dca" && (
            <div className="p-4 rounded-2xl border border-[#00FF88]/30 bg-[#00FF88]/5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-bold text-[#00FF88]">
                  DCA Interval:
                </span>
                <div className="flex gap-1.5">
                  {(["daily", "weekly", "bi-weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDcaFrequency(freq)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold cursor-pointer transition ${
                        dcaFrequency === freq
                          ? "bg-[#00FF88] text-[#05080E] font-bold shadow-[0_0_10px_#00FF88]"
                          : "bg-[#05080E] text-slate-400 hover:text-white border border-cyan-500/10"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-bold text-[#00FF88]">
                  Total Cycles:
                </span>
                <div className="flex gap-1.5">
                  {[3, 5, 10, 30].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDcaCycles(c)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition ${
                        dcaCycles === c
                          ? "bg-[#00FF88] text-[#05080E] shadow-[0_0_10px_#00FF88]"
                          : "bg-[#05080E] text-slate-400 hover:text-white border border-cyan-500/10"
                      }`}
                    >
                      {c}x
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Splits total basket budget into {dcaCycles} scheduled automated buys ({dcaFrequency}).
              </p>
            </div>
          )}

          {/* Limit Order Target Dip Config */}
          {orderType === "limit-order" && (
            <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-bold text-[#00F0FF]">
                  Buy On Dip Target:
                </span>
                <div className="flex gap-1.5">
                  {[2, 3, 5, 8].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setLimitDipPct(pct)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition ${
                        limitDipPct === pct
                          ? "bg-[#00F0FF] text-[#05080E] shadow-[0_0_10px_#00F0FF]"
                          : "bg-[#05080E] text-slate-400 hover:text-white border border-cyan-500/10"
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Orders will be deployed and trigger automatically when market prices pull back {limitDipPct}%.
              </p>
            </div>
          )}

          {/* Selected Assets List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
              <span>Selected Assets ({basket.length})</span>
              <span>Allocations</span>
            </div>

            {basket.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-cyan-500/20 p-6 space-y-2 bg-[#05080E]/40">
                <p className="text-sm font-display font-bold text-slate-300">
                  Your basket is empty
                </p>
                <p className="text-xs text-slate-500">
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
                    className="p-3.5 rounded-2xl border border-cyan-500/20 bg-[#05080E]/90 flex flex-col gap-2.5 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#101A2E] border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-[#00FF88]">
                          {item.stock.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-xs text-white">
                              {item.stock.name}
                            </span>
                            <span className="text-[10px] text-cyan-400/80 font-mono">
                              ({item.stock.ticker})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ${item.stock.price.toFixed(2)} USD
                          </p>
                        </div>
                      </div>

                      {/* Allocation Input & Remove */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-[#101A2E] rounded-xl px-2.5 py-1 border border-cyan-500/20">
                          <input
                            type="number"
                            step="any"
                            value={item.allocation}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val))
                                updateAllocation(item.stock.id, val);
                            }}
                            className="w-14 text-right text-xs font-mono font-bold text-white bg-transparent outline-none tabular-nums"
                          />
                          <span className="text-[10px] text-cyan-400 font-mono">
                            {currency}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromBasket(item.stock.id)}
                          className="cursor-pointer text-slate-500 hover:text-[#FF1B6B] p-1 rounded hover:bg-[#FF1B6B]/10 transition"
                          title="Remove from basket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Routing Details */}
                    {quoteItem && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1.5 border-t border-cyan-500/10 font-mono">
                        <span className="truncate max-w-[200px] text-slate-400">
                          {quoteItem.route}
                        </span>
                        <span className="font-mono text-[#00FF88] tabular-nums font-semibold">
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
            <div className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E] space-y-2 text-xs font-mono shadow-inner">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="font-display">Total Budget Allocation:</span>
                <span className="tabular-nums text-[#00FF88] font-bold">
                  {quote.totalSol} SOL (≈ ${quote.totalUsd} USD)
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Slippage Tolerance:</span>
                <span className="tabular-nums">0.5%</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Estimated Network Fee:</span>
                <span className="tabular-nums font-mono text-cyan-400">
                  ~{quote.estimatedNetworkFeeSol} SOL
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Routing Engine:</span>
                <span className="text-[#00FF88]">
                  Devnet On-Chain Verified (Memo + Lamports)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-cyan-500/20 bg-[#05080E]/90 space-y-3">
          <button
            onClick={() =>
              onExecute(orderType, {
                dcaFrequency,
                dcaCycles,
                limitDipPct,
              })
            }
            disabled={basket.length === 0}
            className="w-full cursor-pointer py-4 rounded-2xl bg-[#00FF88] hover:bg-[#00FF88]/90 disabled:opacity-30 disabled:pointer-events-none text-[#05080E] font-display font-black text-sm shadow-[0_0_25px_rgba(0,255,136,0.45)] transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>
              {orderType === "buy-now"
                ? "Execute Basket Now"
                : orderType === "recurring-dca"
                ? `Initialize DCA (${dcaCycles} Cycles)`
                : `Deploy Limit Orders (-${limitDipPct}%)`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
