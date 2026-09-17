"use client";

import React from "react";

export function ClusterSelect() {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-inner select-none"
      title="Solana Devnet (Safe Execution Environment)"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span className="font-semibold text-slate-200">Devnet</span>
      <span className="text-[10px] text-cyan-400/90 font-mono hidden md:inline">
        (Locked)
      </span>
    </div>
  );
}
