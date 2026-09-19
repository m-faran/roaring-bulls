"use client";

import React from "react";

export function ClusterSelect() {
  return (
    <div
      className="ink-border-thin flex select-none items-center gap-2 bg-white px-3 py-1.5 font-mono text-xs font-medium text-[#111111]"
      title="Solana Devnet (Safe Execution Environment)"
    >
      <span className="h-2 w-2 rounded-full bg-[#14F195]" />
      <span className="font-semibold">Devnet</span>
      <span className="hidden text-[10px] opacity-60 md:inline">(Locked)</span>
    </div>
  );
}
