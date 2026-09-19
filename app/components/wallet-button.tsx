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
      <span className="ink-border-thin bg-white px-3.5 py-1.5 font-mono text-xs text-[#111111]/60 opacity-60">
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
          className="ink-border ink-shadow-sm ink-press cursor-pointer bg-[#14F195] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#111111]"
        >
          Connect Wallet
        </button>

        {isOpen && (
          <div
            id="wallet-options"
            className="ink-border ink-shadow absolute right-0 top-full z-50 mt-2 w-64 bg-white p-3.5 animate-in fade-in zoom-in-95 duration-150"
          >
            <p className="mb-2 border-b-[1.5px] border-dashed border-[#111111]/40 pb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
              Choose a wallet
            </p>
            {wallets.length === 0 ? (
              <p className="font-mono text-xs text-[#111111]/60">
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
                    className="ink-border-thin flex w-full cursor-pointer items-center gap-3 bg-white px-3 py-2 text-left text-xs font-bold text-[#111111] transition-colors hover:bg-[#F5F1E8] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {wallet.icon && (
                      // eslint-disable-next-line @next/next/no-img-element -- wallet-standard icons are data URIs
                      <img
                        src={wallet.icon}
                        alt=""
                        className="h-5 w-5"
                      />
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))}
              </div>
            )}
            {isConnecting && (
              <p className="mt-2 font-mono text-xs text-[#111111]/60" role="status">
                Connecting...
              </p>
            )}
            {connectMenuError != null && (
              <p
                className="mt-2 break-words font-mono text-xs text-[#FF5C8A] [overflow-wrap:anywhere]"
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
        className="ink-border-thin flex cursor-pointer items-center gap-2 bg-white px-3 py-1.5 font-mono text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F1E8]"
      >
        <span className="h-2 w-2 rounded-full bg-[#14F195]" />
        <span>{ellipsify(walletAddress!, 4)}</span>
      </button>

      {isOpen && (
        <div
          id="wallet-options"
          className="ink-border ink-shadow absolute right-0 top-full z-50 mt-2 w-72 bg-white p-4 animate-in fade-in zoom-in-95 duration-150 space-y-3"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/60">
              Balance
            </p>
            <p className="text-base font-bold tabular-nums text-[#111111]">
              {balance.lamports != null
                ? formatDecimalFixedPoint(
                    solFormatter,
                    lamportsToSol(balance.lamports)
                  )
                : balance.isLoading
                  ? "Loading..."
                  : "Unavailable"}{" "}
              {balance.lamports != null && (
                <span className="font-mono text-xs">SOL</span>
              )}
            </p>
            {balance.error != null && (
              <p className="mt-1 font-mono text-xs text-[#FF5C8A]" role="alert">
                Unable to load the wallet balance.
              </p>
            )}
          </div>

          <div className="ink-border-thin bg-[#F5F1E8] px-3 py-2">
            <p className="break-all font-mono text-[11px] text-[#111111]">
              {walletAddress}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label={copied ? "Address copied" : "Copy address"}
              className="ink-border-thin ink-press flex-1 cursor-pointer bg-white px-3 py-2 font-mono text-xs font-medium text-[#111111]"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            <a
              href={getExplorerUrl(`/address/${walletAddress}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="ink-border-thin ink-press flex-1 bg-white px-3 py-2 text-center font-mono text-xs font-medium text-[#111111]"
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
            className="ink-border-thin ink-press w-full cursor-pointer bg-[#FFEDF3] px-3 py-2 text-xs font-bold text-[#111111] transition-colors hover:bg-[#FF5C8A] hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
          {accountMenuError != null && (
            <p
              className="mt-2 break-words font-mono text-xs text-[#FF5C8A] [overflow-wrap:anywhere]"
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
