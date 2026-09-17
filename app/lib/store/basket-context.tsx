"use client";

import React, { createContext, useContext, useState } from "react";
import { StockToken, RiskTier } from "../data/stocks-catalog";
import { SOL_USD_PRICE } from "../execution/mock-quotes";

export interface BasketItem {
  stock: StockToken;
  allocation: number; // in current currency (SOL or USDC)
}

interface BasketContextType {
  riskTier: RiskTier;
  setRiskTier: (tier: RiskTier) => void;
  currency: "SOL" | "USDC";
  setCurrency: (currency: "SOL" | "USDC") => void;
  sessionBudget: number;
  setSessionBudget: (amount: number) => void;
  allocationPerSwipe: number;
  setAllocationPerSwipe: (amount: number) => void;
  basket: BasketItem[];
  addToBasket: (stock: StockToken, customAmount?: number) => boolean;
  removeFromBasket: (stockId: string) => void;
  updateAllocation: (stockId: string, amount: number) => void;
  clearBasket: () => void;
  totalAllocated: number;
  remainingBudget: number;
  budgetUtilizationPct: number;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  isSessionSetupOpen: boolean;
  setIsSessionSetupOpen: (open: boolean) => void;
  isPortfolioOpen: boolean;
  setIsPortfolioOpen: (open: boolean) => void;
  formatCurrency: (amount: number) => string;
}

const BasketContext = createContext<BasketContextType | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [riskTier, setRiskTier] = useState<RiskTier>("conservative");
  const [currency, setCurrency] = useState<"SOL" | "USDC">("SOL");

  // Default: 0.25 SOL (~$37.50 USD), $0.05 SOL per swipe (~$7.50 USD)
  const [sessionBudget, setSessionBudget] = useState<number>(0.25);
  const [allocationPerSwipe, setAllocationPerSwipe] = useState<number>(0.05);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  // Modals & Drawer states
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isSessionSetupOpen, setIsSessionSetupOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  const totalAllocated = basket.reduce((sum, item) => sum + item.allocation, 0);
  const remainingBudget = Math.max(0, sessionBudget - totalAllocated);
  const budgetUtilizationPct =
    sessionBudget > 0 ? Math.min(100, (totalAllocated / sessionBudget) * 100) : 0;

  const addToBasket = (stock: StockToken, customAmount?: number): boolean => {
    const amount = customAmount ?? allocationPerSwipe;
    if (remainingBudget <= 0.00001) {
      return false; // Budget fully allocated
    }

    const actualAmount = Math.min(amount, remainingBudget);

    setBasket((prev) => {
      const existingIdx = prev.findIndex((it) => it.stock.id === stock.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].allocation =
          Math.round((updated[existingIdx].allocation + actualAmount) * 10000) /
          10000;
        return updated;
      }
      return [...prev, { stock, allocation: actualAmount }];
    });

    return true;
  };

  const removeFromBasket = (stockId: string) => {
    setBasket((prev) => prev.filter((it) => it.stock.id !== stockId));
  };

  const updateAllocation = (stockId: string, amount: number) => {
    setBasket((prev) =>
      prev.map((it) =>
        it.stock.id === stockId
          ? { ...it, allocation: Math.max(0, Math.round(amount * 10000) / 10000) }
          : it
      )
    );
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const formatCurrency = (amount: number): string => {
    if (currency === "SOL") {
      const usdEquiv = (amount * SOL_USD_PRICE).toFixed(2);
      return `${amount} SOL (≈$${usdEquiv})`;
    }
    return `$${amount.toFixed(2)} USDC`;
  };

  return (
    <BasketContext.Provider
      value={{
        riskTier,
        setRiskTier,
        currency,
        setCurrency,
        sessionBudget,
        setSessionBudget,
        allocationPerSwipe,
        setAllocationPerSwipe,
        basket,
        addToBasket,
        removeFromBasket,
        updateAllocation,
        clearBasket,
        totalAllocated: Math.round(totalAllocated * 10000) / 10000,
        remainingBudget: Math.round(remainingBudget * 10000) / 10000,
        budgetUtilizationPct: Math.round(budgetUtilizationPct),
        isBasketOpen,
        setIsBasketOpen,
        isSessionSetupOpen,
        setIsSessionSetupOpen,
        isPortfolioOpen,
        setIsPortfolioOpen,
        formatCurrency,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error("useBasket must be used within BasketProvider");
  }
  return ctx;
}
