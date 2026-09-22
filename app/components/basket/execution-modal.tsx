"use client";

import React from "react";
import { ExecutionResult } from "@/app/lib/execution/execution-service";
import { useBasket } from "@/app/lib/store/basket-context";
import { Loader2, AlertCircle, Check, ExternalLink, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="ink-border ink-shadow-lg w-full max-w-md bg-paper-white">
        {/* Stub header */}
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
            Roaring Bulls • Order Confirmation
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer text-paper transition-opacity hover:opacity-70"
            aria-label="Close confirmation"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>

        <div className="ink-frame p-5 sm:p-6">
          {/* Executing State */}
          {isExecuting && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
              <span className="ink-border ink-shadow-sm flex h-16 w-16 items-center justify-center bg-sol-yellow text-ink">
                <Loader2 className="h-8 w-8 animate-spin" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  Submitting On-Chain Order
                </h3>
                <p className="mx-auto mt-1.5 max-w-xs font-mono text-[11px] leading-relaxed text-ink/60">
                  Signing transaction with your connected Solana wallet and recording order parameters on-chain...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isExecuting && error && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="ink-border-thin flex h-12 w-12 items-center justify-center bg-sol-pink text-white">
                  <AlertCircle className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    Transaction Failed
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
                    Unable to confirm on-chain
                  </p>
                </div>
              </div>

              <div className="ink-border-thin bg-paper-rose p-3 font-mono text-xs break-words text-ink">
                {error}
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="ink-border-thin ink-shadow-sm ink-press flex-1 cursor-pointer bg-paper-white py-2.5 text-xs font-bold text-ink"
                >
                  Dismiss
                </button>
                <button
                  onClick={onRetry}
                  className="ink-border-thin ink-shadow-sm ink-press flex-1 cursor-pointer bg-sol-pink py-2.5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {!isExecuting && result && !error && (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <span className="ink-border ink-shadow-sm flex h-16 w-16 items-center justify-center bg-sol-green text-ink">
                  <Check className="h-8 w-8" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-ink">
                    {result.orderType === "buy-now"
                      ? "Basket Swap Executed!"
                      : result.orderType === "recurring-dca"
                      ? "Recurring DCA Activated!"
                      : "Limit Orders Deployed!"}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/60">
                    Successfully signed and confirmed on Solana Devnet.
                  </p>
                </div>
              </div>

              {/* Order Details — fine-detail stat receipt */}
              <div className="ink-border-thin divide-y-[1.5px] divide-ink/15 bg-paper font-mono text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-ink/60">Assets in Basket</span>
                  <span className="font-bold text-ink">
                    {result.itemsCount} stocks
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-ink/60">Total Invested</span>
                  <span className="font-bold tabular-nums text-ink">
                    {result.totalAmountSol} SOL (≈ ${result.totalAmountUsd} USD)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-ink/60">Execution Mode</span>
                  <span className="font-bold capitalize text-ink">
                    {result.orderType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-ink/60">Signature</span>
                  <span className="max-w-[150px] truncate text-ink/60">
                    {result.signature}
                  </span>
                </div>
              </div>

              {/* Clickable Solana Explorer Link */}
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-border-thin ink-press flex w-full items-center justify-center gap-2 bg-paper-white py-3 text-xs font-bold text-ink"
              >
                <span>View On Solana Explorer</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="ink-border-thin ink-shadow-sm ink-press flex-1 cursor-pointer bg-paper-white py-2.5 text-xs font-bold text-ink"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setIsPortfolioOpen(true);
                  }}
                  className="ink-border ink-shadow-sm ink-press flex-1 cursor-pointer bg-sol-green py-2.5 text-xs font-bold uppercase tracking-wide text-ink"
                >
                  View Portfolio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
