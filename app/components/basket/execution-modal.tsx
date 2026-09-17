"use client";

import React from "react";
import { ExecutionResult } from "@/app/lib/execution/execution-service";
import { useBasket } from "@/app/lib/store/basket-context";

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isExecuting: boolean;
  result: ExecutionResult | null;
  error: string | null;
  onRetry: () => void;
}

export function ExecutionModal({
  isOpen,
  onClose,
  isExecuting,
  result,
  error,
  onRetry,
}: ExecutionModalProps) {
  const { setIsPortfolioOpen } = useBasket();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl space-y-6">
        {/* Executing State */}
        {isExecuting && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submitting On-Chain Order</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Signing transaction with your connected Solana wallet and recording order parameters on-chain...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isExecuting && error && (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Transaction Failed</h3>
                <p className="text-xs text-slate-400">Unable to confirm on-chain</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 font-mono break-words">
              {error}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 cursor-pointer py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Dismiss
              </button>
              <button
                onClick={onRetry}
                className="flex-1 cursor-pointer py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isExecuting && result && !error && (
          <div className="py-2 space-y-5">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {result.orderType === "buy-now"
                    ? "Basket Swap Executed!"
                    : result.orderType === "recurring-dca"
                    ? "Recurring DCA Activated!"
                    : "Limit Orders Deployed!"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Successfully signed and confirmed on Solana Devnet.
                </p>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Assets in Basket:</span>
                <span>{result.itemsCount} stocks</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Total Invested:</span>
                <span className="tabular-nums text-emerald-400 font-mono">
                  {result.totalAmountSol} SOL (≈ ${result.totalAmountUsd} USD)
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Execution Mode:</span>
                <span className="capitalize">{result.orderType.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-white/5">
                <span>Signature:</span>
                <span className="font-mono text-slate-500 truncate max-w-[150px]">
                  {result.signature}
                </span>
              </div>
            </div>

            {/* Clickable Solana Explorer Link */}
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-xs font-semibold text-emerald-300 transition"
            >
              <span>View On Solana Explorer</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 cursor-pointer py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  setIsPortfolioOpen(true);
                }}
                className="flex-1 cursor-pointer py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
              >
                View Portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
