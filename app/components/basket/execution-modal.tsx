"use client";

import React from "react";
import { ExecutionResult } from "@/app/lib/execution/execution-service";
import { useBasket } from "@/app/lib/store/basket-context";
import { Loader2, AlertCircle, Check, ExternalLink } from "lucide-react";

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
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#0A111F] p-6 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden">
        {/* Decorative corner markers */}
        <span className="absolute top-2.5 left-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none">
          ┌
        </span>
        <span className="absolute top-2.5 right-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none">
          ┐
        </span>
        <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none">
          └
        </span>
        <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-cyan-500/30 pointer-events-none">
          ┘
        </span>

        {/* Executing State */}
        {isExecuting && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] shadow-[0_0_25px_rgba(0,255,136,0.3)]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white tracking-tight">
                Submitting On-Chain Order
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed font-mono">
                Signing transaction with your connected Solana wallet and recording order parameters on-chain...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isExecuting && error && (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF1B6B]/15 border border-[#FF1B6B]/40 flex items-center justify-center text-[#FF1B6B] shadow-[0_0_15px_rgba(255,27,107,0.3)]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white">
                  Transaction Failed
                </h3>
                <p className="text-xs text-slate-400">Unable to confirm on-chain</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#05080E] border border-[#FF1B6B]/30 text-xs text-[#FF1B6B] font-mono break-words shadow-inner">
              {error}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={onClose}
                className="flex-1 cursor-pointer py-2.5 rounded-xl border border-cyan-500/20 text-xs font-display font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Dismiss
              </button>
              <button
                onClick={onRetry}
                className="flex-1 cursor-pointer py-2.5 rounded-xl bg-[#FF1B6B] hover:bg-[#FF1B6B]/90 text-white text-xs font-display font-bold shadow-[0_0_15px_rgba(255,27,107,0.3)] transition"
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
              <div className="relative w-16 h-16 rounded-2xl bg-[#00FF88]/20 border border-[#00FF88]/50 flex items-center justify-center text-[#00FF88] shadow-[0_0_25px_rgba(0,255,136,0.45)]">
                <Check className="w-8 h-8" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-white tracking-tight">
                  {result.orderType === "buy-now"
                    ? "Basket Swap Executed!"
                    : result.orderType === "recurring-dca"
                    ? "Recurring DCA Activated!"
                    : "Limit Orders Deployed!"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Successfully signed and confirmed on Solana Devnet.
                </p>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E] space-y-2.5 text-xs font-mono shadow-inner">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="font-display">Assets in Basket:</span>
                <span className="text-white">{result.itemsCount} stocks</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="font-display">Total Invested:</span>
                <span className="tabular-nums text-[#00FF88] font-bold">
                  {result.totalAmountSol} SOL (≈ ${result.totalAmountUsd} USD)
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-display">Execution Mode:</span>
                <span className="capitalize text-cyan-400">
                  {result.orderType.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-cyan-500/15">
                <span>Signature:</span>
                <span className="font-mono text-cyan-400/70 truncate max-w-[150px]">
                  {result.signature}
                </span>
              </div>
            </div>

            {/* Clickable Solana Explorer Link */}
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-xs font-display font-semibold text-cyan-300 transition shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              <span>View On Solana Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onClose}
                className="flex-1 cursor-pointer py-2.5 rounded-xl border border-cyan-500/20 text-xs font-display font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  setIsPortfolioOpen(true);
                }}
                className="flex-1 cursor-pointer py-2.5 rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] text-xs font-display font-black shadow-[0_0_20px_rgba(0,255,136,0.35)] transition hover:scale-105"
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
