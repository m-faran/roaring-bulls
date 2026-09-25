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
import { usePrivy } from "@privy-io/react-auth";

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
    dispatchAsync: disconnectKit,
    error: disconnectError,
    isRunning: isDisconnecting,
  } = useDisconnect(client);

  const { login, logout, user, authenticated } = usePrivy();

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
  const activeAddress = walletAddress || user?.wallet?.address;
  const copied = copiedAddress === activeAddress;
  const balance = useBalance(
    activeAddress ? address(activeAddress) : undefined
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
    if (!activeAddress) return;
    try {
      await navigator.clipboard.writeText(activeAddress);
      setClipboardError(null);
      setCopiedAddress(activeAddress);
      setTimeout(
        () =>
          setCopiedAddress((current) =>
            current === activeAddress ? null : current
          ),
        2000
      );
    } catch {
      setClipboardError({
        address: activeAddress,
        message: "Unable to copy the address to the clipboard.",
      });
    }
  };

  if (!isHydrated || !isWalletReady) {
    return (
      <span className="ink-border-thin bg-paper-white px-3.5 py-1.5 font-mono text-xs text-ink/60 opacity-60">
        Restoring wallet...
      </span>
    );
  }

  if (!connected && !authenticated) {
    return (
      <div className="relative" ref={ref}>
        <button
          ref={triggerRef}
          onClick={login}
          className="ink-border ink-shadow-sm ink-press cursor-pointer bg-sol-green px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink"
        >
          Connect Wallet
        </button>
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
        aria-label={`Wallet ${activeAddress}`}
        className="ink-border-thin flex cursor-pointer items-center gap-2 bg-paper-white px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:bg-paper"
      >
        <span className="h-2 w-2 rounded-full bg-sol-green" />
        <span>{activeAddress ? ellipsify(activeAddress, 4) : user?.email?.address || "Connected"}</span>
      </button>

      {isOpen && (
        <div
          id="wallet-options"
          className="ink-border ink-shadow absolute right-0 top-full z-50 mt-2 w-72 bg-paper-white p-4 animate-in fade-in zoom-in-95 duration-150 space-y-3"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60">
              Balance
            </p>
            <p className="text-base font-bold tabular-nums text-ink">
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
              <p className="mt-1 font-mono text-xs text-sol-pink" role="alert">
                Unable to load the wallet balance.
              </p>
            )}
          </div>

          <div className="ink-border-thin bg-paper px-3 py-2">
            {user?.email?.address && (
              <p className="mb-1 font-mono text-[11px] font-bold text-ink">
                {user.email.address}
              </p>
            )}
            <p className="break-all font-mono text-[11px] text-ink/70">
              {activeAddress}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label={copied ? "Address copied" : "Copy address"}
              className="ink-border-thin ink-press flex-1 cursor-pointer bg-paper-white px-3 py-2 font-mono text-xs font-medium text-ink"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            {activeAddress && (
              <a
                href={getExplorerUrl(`/address/${activeAddress}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-border-thin ink-press flex-1 bg-paper-white px-3 py-2 text-center font-mono text-xs font-medium text-ink"
              >
                Explorer
              </a>
            )}
          </div>

          <button
            onClick={async () => {
              try {
                if (connected) await disconnectKit();
                await logout();
                closeAndRestoreFocus();
              } catch {
                // The hook exposes the disconnection error below.
              }
            }}
            disabled={isDisconnecting}
            className="ink-border-thin ink-press w-full cursor-pointer bg-paper-rose px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-sol-pink hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
          {accountMenuError != null && (
            <p
              className="mt-2 break-words font-mono text-xs text-sol-pink [overflow-wrap:anywhere]"
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
