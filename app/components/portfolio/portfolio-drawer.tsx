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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#111111]/60 animate-in fade-in duration-200">
      <div className="paper-texture flex h-full w-full max-w-lg flex-col justify-between border-l-[3px] border-[#111111] shadow-[-8px_0_0_0_rgba(17,17,17,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-[#111111] bg-[#111111] px-5 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">
            Your Portfolio • {positions.length + dcas.length + limitOrders.length}{" "}
            active
          </span>

          <button
            onClick={() => setIsPortfolioOpen(false)}
            className="cursor-pointer text-[#F5F1E8] transition-opacity hover:opacity-70"
            aria-label="Close portfolio"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>

        {/* Tab Navigation — file-folder tabs */}
        <div className="flex gap-2 border-b-[3px] border-[#111111] bg-[#EDE7D8] px-5 pt-3">
          {[
            { id: "positions", label: `Holdings (${positions.length})` },
            {
              id: "dca",
              label: `DCAs (${
                dcas.filter((d) => d.status === "active").length
              })`,
            },
            {
              id: "limit",
              label: `Limit (${limitOrders.filter((l) => l.status === "open").length})`,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer border-t-[2px] border-x-[2px] px-3 pb-2 pt-1.5 font-mono text-[11px] font-bold uppercase tracking-wide transition-all ${
                  isActive
                    ? "-mb-[3px] border-[#111111] bg-white text-[#111111]"
                    : "border-transparent bg-[#F5F1E8] text-[#111111]/50 hover:text-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Holdings Tab */}
          {activeTab === "positions" && (
            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="ink-border-thin border-dashed bg-white/60 py-12 text-center font-mono text-xs text-[#111111]/60">
                  No stock positions acquired yet. Execute a basket swap to start!
                </div>
              ) : (
                positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="ink-border-thin ink-shadow-sm flex items-center justify-between bg-white p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111111]">
                          {pos.stock.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#111111]/50">
                          ({pos.stock.ticker})
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] font-bold tabular-nums text-[#111111]">
                        {pos.amountTokens} tokens • {pos.totalInvestedSol} SOL
                      </p>
                    </div>

                    <a
                      href={`https://explorer.solana.com/tx/${pos.txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-border-thin ink-press flex items-center gap-1 bg-[#F5F1E8] px-2 py-1 font-mono text-[10px] font-bold text-[#111111]"
                    >
                      <span>Tx</span>
                      <ExternalLink className="h-3 w-3" />
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
                <div className="ink-border-thin border-dashed bg-white/60 py-12 text-center font-mono text-xs text-[#111111]/60">
                  No active DCA schedules running.
                </div>
              ) : (
                dcas.map((d) => (
                  <div
                    key={d.id}
                    className="ink-border-thin ink-shadow-sm space-y-2.5 bg-white p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111111]">
                          {d.stock.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#111111]/50">
                          ({d.stock.ticker})
                        </span>
                      </div>
                      <span
                        className={`ink-border-thin px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          d.status === "active"
                            ? "bg-[#14F195] text-[#111111]"
                            : "bg-[#F5F1E8] text-[#111111]/50"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t-[1.5px] border-dashed border-[#111111]/40 pt-2 font-mono text-[11px]">
                      <span className="text-[#111111]/60">
                        Schedule: {d.frequency} ({d.totalCycles} cycles)
                      </span>
                      <span className="font-bold tabular-nums text-[#111111]">
                        {d.amountPerCycleSol} SOL/cycle
                      </span>
                    </div>

                    {d.status === "active" && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => cancelDCA(d.id)}
                          className="ink-border-thin cursor-pointer bg-[#FFEDF3] px-2.5 py-1 font-mono text-[11px] font-bold text-[#111111] transition-colors hover:bg-[#FF5C8A] hover:text-white"
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
                <div className="ink-border-thin border-dashed bg-white/60 py-12 text-center font-mono text-xs text-[#111111]/60">
                  No open limit orders placed.
                </div>
              ) : (
                limitOrders.map((l) => (
                  <div
                    key={l.id}
                    className="ink-border-thin ink-shadow-sm space-y-2.5 bg-white p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111111]">
                          {l.stock.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#111111]/50">
                          ({l.stock.ticker})
                        </span>
                      </div>
                      <span
                        className={`ink-border-thin px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          l.status === "open"
                            ? "bg-[#9945FF] text-white"
                            : "bg-[#F5F1E8] text-[#111111]/50"
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t-[1.5px] border-dashed border-[#111111]/40 pt-2 font-mono text-[11px]">
                      <span className="text-[#111111]/60">Target Dip Price</span>
                      <span className="font-bold tabular-nums text-[#111111]">
                        ${l.targetPriceUsd.toFixed(2)} USD
                      </span>
                    </div>

                    {l.status === "open" && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => cancelLimitOrder(l.id)}
                          className="ink-border-thin cursor-pointer bg-[#FFEDF3] px-2.5 py-1 font-mono text-[11px] font-bold text-[#111111] transition-colors hover:bg-[#FF5C8A] hover:text-white"
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
