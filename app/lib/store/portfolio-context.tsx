"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StockToken } from "../data/stocks-catalog";

export type OrderType = "buy-now" | "recurring-dca" | "limit-order";

export interface ActivePosition {
  id: string;
  stock: StockToken;
  amountTokens: number;
  totalInvestedSol: number;
  totalInvestedUsd: number;
  acquiredAt: number;
  txSignature: string;
}

export interface ActiveDCA {
  id: string;
  stock: StockToken;
  totalBudgetSol: number;
  frequency: "daily" | "weekly" | "bi-weekly";
  totalCycles: number;
  completedCycles: number;
  amountPerCycleSol: number;
  nextExecutionAt: number;
  status: "active" | "completed" | "cancelled";
  txSignature: string;
}

export interface ActiveLimitOrder {
  id: string;
  stock: StockToken;
  allocationSol: number;
  targetPriceUsd: number;
  currentPriceUsd: number;
  status: "open" | "filled" | "cancelled";
  createdAt: number;
  txSignature: string;
}

interface PortfolioContextType {
  positions: ActivePosition[];
  dcas: ActiveDCA[];
  limitOrders: ActiveLimitOrder[];
  addPosition: (pos: ActivePosition) => void;
  addDCA: (dca: ActiveDCA) => void;
  addLimitOrder: (lo: ActiveLimitOrder) => void;
  cancelDCA: (id: string) => void;
  cancelLimitOrder: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const STORAGE_KEY = "roaring_bulls_portfolio_v1";

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [positions, setPositions] = useState<ActivePosition[]>([]);
  const [dcas, setDcas] = useState<ActiveDCA[]>([]);
  const [limitOrders, setLimitOrders] = useState<ActiveLimitOrder[]>([]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.positions) setPositions(parsed.positions);
        if (parsed.dcas) setDcas(parsed.dcas);
        if (parsed.limitOrders) setLimitOrders(parsed.limitOrders);
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ positions, dcas, limitOrders })
      );
    } catch {
      // Ignore storage errors
    }
  }, [positions, dcas, limitOrders]);

  const addPosition = (pos: ActivePosition) => {
    setPositions((prev) => [pos, ...prev]);
  };

  const addDCA = (dca: ActiveDCA) => {
    setDcas((prev) => [dca, ...prev]);
  };

  const addLimitOrder = (lo: ActiveLimitOrder) => {
    setLimitOrders((prev) => [lo, ...prev]);
  };

  const cancelDCA = (id: string) => {
    setDcas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "cancelled" } : d))
    );
  };

  const cancelLimitOrder = (id: string) => {
    setLimitOrders((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "cancelled" } : l))
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        positions,
        dcas,
        limitOrders,
        addPosition,
        addDCA,
        addLimitOrder,
        cancelDCA,
        cancelLimitOrder,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return ctx;
}
