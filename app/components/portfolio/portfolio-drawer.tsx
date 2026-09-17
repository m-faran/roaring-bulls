"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/app/lib/store/portfolio-context";
import { useBasket } from "@/app/lib/store/basket-context";

export function PortfolioDrawer() {
  const { isPortfolioOpen, setIsPortfolioOpen } = useBasket();
  const { positions, dcas, limitOrders, cancelDCA, cancelLimitOrder } =
    usePortfolio();

  const [activeTab, setActiveTab] = useState<"positions" | "dca" | "limit">(
    "positions"
  );

  if (!isPortfolioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0B0F19] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Your Portfolio</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
              {positions.length + dcas.length + limitOrders.length} active
            </span>
          </div>

          <button
            onClick={() => setIsPortfolioOpen(false)}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-1 border-b border-white/5 flex gap-2">
          {[
            { id: "positions", label: `Holdings (${positions.length})` },
            { id: "dca", label: `Active DCAs (${dcas.filter((d) => d.status === "active").length})` },
            { id: "limit", label: `Limit Orders (${limitOrders.filter((l) => l.status === "open").length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer pb-2 px-1 text-xs font-semibold border-b-2 transition ${
                  isActive
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Holdings Tab */}
          {activeTab === "positions" && (
            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No stock positions acquired yet. Execute a basket swap to start!
                </div>
              ) : (
                positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="p-4 rounded-2xl border border-white/5 bg-slate-950/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{pos.stock.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({pos.stock.ticker})</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        {pos.amountTokens} tokens • {pos.totalInvestedSol} SOL
                      </p>
                    </div>

                    <a
                      href={`https://explorer.solana.com/tx/${pos.txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-400 hover:text-emerald-400 underline flex items-center gap-1"
                    >
                      <span>Tx</span>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                      </svg>
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DCA Tab */}
          {activeTab === "dca" && (
            <div className="space-y-3">
              {dcas.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No active DCA schedules running.
                </div>
              ) : (
                dcas.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl border border-white/5 bg-slate-950/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{d.stock.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({d.stock.ticker})</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          d.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-300">
                      <span>Schedule: {d.frequency} ({d.totalCycles} cycles)</span>
                      <span className="font-mono text-emerald-400">{d.amountPerCycleSol} SOL/cycle</span>
                    </div>

                    {d.status === "active" && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelDCA(d.id)}
                          className="cursor-pointer text-[11px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition"
                        >
                          Cancel Schedule
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Limit Orders Tab */}
          {activeTab === "limit" && (
            <div className="space-y-3">
              {limitOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No open limit orders deployed.
                </div>
              ) : (
                limitOrders.map((lo) => (
                  <div
                    key={lo.id}
                    className="p-4 rounded-2xl border border-white/5 bg-slate-950/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{lo.stock.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({lo.stock.ticker})</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          lo.status === "open"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {lo.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-300">
                      <span>Target Price: ${lo.targetPriceUsd.toFixed(2)}</span>
                      <span className="font-mono text-blue-400">{lo.allocationSol} SOL</span>
                    </div>

                    {lo.status === "open" && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelLimitOrder(lo.id)}
                          className="cursor-pointer text-[11px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
