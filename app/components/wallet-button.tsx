"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { address, formatDecimalFixedPoint, lamportsToSol } from "@solana/kit";
import {
  useWallets,
  useConnect,
  useDisconnect,
  useConnectedWallet,
  useIsWalletReady,
} from "@solana/kit-plugin-wallet/react";
import { useBalance } from "../lib/hooks/use-balance";
import { ellipsify } from "../lib/explorer";
import { useCluster } from "./cluster-context";
import { useAppClient } from "../lib/client-provider";

const solFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 9,
});
const subscribeToHydration = () => () => {};

export function WalletButton() {
  const client = useAppClient();
  const wallets = useWallets(client);
  const connected = useConnectedWallet(client);
  const isWalletReady = useIsWalletReady(client);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
  const {
    dispatchAsync: connect,
    error: connectError,
    isRunning: isConnecting,
  } = useConnect(client);
  const {
    dispatchAsync: disconnect,
    error: disconnectError,
    isRunning: isDisconnecting,
  } = useDisconnect(client);

  const { getExplorerUrl } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [clipboardError, setClipboardError] = useState<{
    address: string;
    message: string;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const walletAddress = connected?.account.address;
  const copied = copiedAddress === walletAddress;
  const balance = useBalance(
    walletAddress ? address(walletAddress) : undefined
  );
  const connectMenuError = connectError;
  const accountMenuError =
    disconnectError ??
    (clipboardError && clipboardError.address === walletAddress
      ? clipboardError.message
      : null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setClipboardError(null);
      setCopiedAddress(walletAddress);
      setTimeout(
        () =>
          setCopiedAddress((current) =>
            current === walletAddress ? null : current
          ),
        2000
      );
    } catch {
      setClipboardError({
        address: walletAddress,
        message: "Unable to copy the address to the clipboard.",
      });
    }
  };

  if (!isHydrated || !isWalletReady) {
    return (
      <span className="rounded-xl bg-[#0A111F] border border-cyan-500/20 px-3.5 py-1.5 text-xs font-mono text-cyan-400 opacity-60">
        Restoring wallet...
      </span>
    );
  }

  if (!connected) {
    return (
      <div className="relative" ref={ref}>
        <button
          ref={triggerRef}
          onClick={() => (isOpen ? close() : open())}
          aria-expanded={isOpen}
          aria-controls={isOpen ? "wallet-options" : undefined}
          className="cursor-pointer rounded-xl bg-[#00FF88] px-3.5 py-1.5 text-xs font-display font-black text-[#05080E] shadow-[0_0_15px_rgba(0,255,136,0.35)] transition-all hover:bg-[#00FF88]/90 hover:scale-105"
        >
          Connect Wallet
        </button>

        {isOpen && (
          <div
            id="wallet-options"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-cyan-500/30 bg-[#0A111F] p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150"
          >
            <p className="mb-2 text-xs font-display font-bold text-slate-300">
              Choose a wallet
            </p>
            {wallets.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono">
                No wallets detected. Install a Solana wallet extension.
              </p>
            ) : (
              <div className="space-y-1">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={async () => {
                      try {
                        await connect(wallet);
                        closeAndRestoreFocus();
                      } catch {
                        // The hook exposes the connection error below.
                      }
                    }}
                    disabled={isConnecting}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-display font-bold text-white transition hover:bg-[#101A2E] hover:text-[#00FF88] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {wallet.icon && (
                      // eslint-disable-next-line @next/next/no-img-element -- wallet-standard icons are data URIs
                      <img
                        src={wallet.icon}
                        alt=""
                        className="h-5 w-5 rounded-md"
                      />
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))}
              </div>
            )}
            {isConnecting && (
              <p className="mt-2 text-xs text-cyan-400 font-mono" role="status">
                Connecting...
              </p>
            )}
            {connectMenuError != null && (
              <p
                className="mt-2 break-words text-xs text-[#FF1B6B] font-mono [overflow-wrap:anywhere]"
                role="alert"
              >
                {connectMenuError instanceof Error
                  ? connectMenuError.message
                  : String(connectMenuError)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        onClick={() => (isOpen ? close() : open())}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "wallet-options" : undefined}
        aria-label={`Wallet ${walletAddress}`}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-500/25 bg-[#0A111F] px-3 py-1.5 text-xs font-mono font-medium text-slate-200 transition-all hover:border-[#00FF88]/40 hover:bg-[#101A2E] shadow-inner"
      >
        <span className="h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
        <span className="font-mono text-xs">{ellipsify(walletAddress!, 4)}</span>
      </button>

      {isOpen && (
        <div
          id="wallet-options"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-cyan-500/30 bg-[#0A111F] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 space-y-3"
        >
          <div>
            <p className="text-[11px] text-slate-400 font-mono">Balance</p>
            <p className="text-base font-display font-black text-white tabular-nums">
              {balance.lamports != null
                ? formatDecimalFixedPoint(
                    solFormatter,
                    lamportsToSol(balance.lamports)
                  )
                : balance.isLoading
                  ? "Loading..."
                  : "Unavailable"}{" "}
              {balance.lamports != null && (
                <span className="text-xs font-mono text-[#00FF88]">SOL</span>
              )}
            </p>
            {balance.error != null && (
              <p className="mt-1 text-xs text-[#FF1B6B] font-mono" role="alert">
                Unable to load the wallet balance.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-cyan-500/15 bg-[#05080E] px-3 py-2 shadow-inner">
            <p className="break-all font-mono text-[11px] text-slate-300">
              {walletAddress}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label={copied ? "Address copied" : "Copy address"}
              className="flex-1 cursor-pointer rounded-xl border border-cyan-500/20 bg-[#05080E] hover:bg-[#101A2E] px-3 py-2 text-xs font-mono font-medium text-slate-300 transition"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            <a
              href={getExplorerUrl(`/address/${walletAddress}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-cyan-500/20 bg-[#05080E] hover:bg-[#101A2E] px-3 py-2 text-center text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              Explorer
            </a>
          </div>

          <button
            onClick={async () => {
              try {
                await disconnect();
                closeAndRestoreFocus();
              } catch {
                // The hook exposes the disconnection error below.
              }
            }}
            disabled={isDisconnecting}
            className="w-full cursor-pointer rounded-xl border border-[#FF1B6B]/30 bg-[#FF1B6B]/10 px-3 py-2 text-xs font-display font-bold text-[#FF1B6B] transition hover:bg-[#FF1B6B]/20 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
          {accountMenuError != null && (
            <p
              className="mt-2 break-words text-xs text-[#FF1B6B] font-mono [overflow-wrap:anywhere]"
              role="alert"
            >
              {accountMenuError instanceof Error
                ? accountMenuError.message
                : String(accountMenuError)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
