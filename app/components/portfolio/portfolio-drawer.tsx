"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/app/lib/store/portfolio-context";
import { useBasket } from "@/app/lib/store/basket-context";
import { X, ExternalLink } from "lucide-react";

export function PortfolioDrawer() {
  const { isPortfolioOpen, setIsPortfolioOpen } = useBasket();
  const { positions, dcas, limitOrders, cancelDCA, cancelLimitOrder } =
    usePortfolio();

  const [activeTab, setActiveTab] = useState<"positions" | "dca" | "limit">(
    "positions"
  );

  if (!isPortfolioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0A111F] border-l border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#05080E]/70">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-display font-black text-white tracking-tight">
              Your Portfolio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-mono font-bold shadow-[0_0_8px_rgba(0,255,136,0.2)]">
              {positions.length + dcas.length + limitOrders.length} active
            </span>
          </div>

          <button
            onClick={() => setIsPortfolioOpen(false)}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-1 border-b border-cyan-500/15 flex gap-3 bg-[#05080E]/40">
          {[
            { id: "positions", label: `Holdings (${positions.length})` },
            {
              id: "dca",
              label: `Active DCAs (${
                dcas.filter((d) => d.status === "active").length
              })`,
            },
            {
              id: "limit",
              label: `Limit Orders (${
                limitOrders.filter((l) => l.status === "open").length
              })`,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer pb-2.5 px-2 text-xs font-display font-semibold border-b-2 transition-all ${
                  isActive
                    ? "border-[#00FF88] text-[#00FF88] shadow-[0_2px_10px_rgba(0,255,136,0.3)]"
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
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  No stock positions acquired yet. Execute a basket swap to start!
                </div>
              ) : (
                positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E]/90 flex items-center justify-between shadow-inner"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-white">
                          {pos.stock.name}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          ({pos.stock.ticker})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#00FF88] font-mono mt-0.5 font-bold">
                        {pos.amountTokens} tokens • {pos.totalInvestedSol} SOL
                      </p>
                    </div>

                    <a
                      href={`https://explorer.solana.com/tx/${pos.txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:text-[#00FF88] underline flex items-center gap-1 font-mono transition"
                    >
                      <span>Tx</span>
                      <ExternalLink className="w-3 h-3" />
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
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  No active DCA schedules running.
                </div>
              ) : (
                dcas.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E]/90 space-y-2.5 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-white">
                          {d.stock.name}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          ({d.stock.ticker})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          d.status === "active"
                            ? "bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_8px_rgba(0,255,136,0.2)]"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
                      <span>Schedule: {d.frequency} ({d.totalCycles} cycles)</span>
                      <span className="font-mono text-[#00FF88] font-bold">
                        {d.amountPerCycleSol} SOL/cycle
                      </span>
                    </div>

                    {d.status === "active" && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelDCA(d.id)}
                          className="cursor-pointer text-[11px] text-[#FF1B6B] hover:text-[#FF1B6B]/80 font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#FF1B6B]/10 hover:bg-[#FF1B6B]/20 border border-[#FF1B6B]/20 transition"
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
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  No open limit orders placed.
                </div>
              ) : (
                limitOrders.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E]/90 space-y-2.5 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-white">
                          {l.stock.name}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          ({l.stock.ticker})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          l.status === "open"
                            ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
                      <span>Target Dip Price:</span>
                      <span className="font-mono text-[#00F0FF] font-bold">
                        ${l.targetPriceUsd.toFixed(2)} USD
                      </span>
                    </div>

                    {l.status === "open" && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelLimitOrder(l.id)}
                          className="cursor-pointer text-[11px] text-[#FF1B6B] hover:text-[#FF1B6B]/80 font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#FF1B6B]/10 hover:bg-[#FF1B6B]/20 border border-[#FF1B6B]/20 transition"
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
