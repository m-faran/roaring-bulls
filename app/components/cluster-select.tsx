"use client";

import React from "react";

export function ClusterSelect() {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-[#0A111F] px-3 py-1.5 text-xs font-mono font-medium text-slate-300 shadow-inner select-none"
      title="Solana Devnet (Safe Execution Environment)"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"></span>
      </span>
      <span className="font-semibold text-slate-200">Devnet</span>
      <span className="text-[10px] text-[#00F0FF] font-mono hidden md:inline">
        (Locked)
      </span>
    </div>
  );
}
