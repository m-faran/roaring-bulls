"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { StockToken, buildChartData } from "../data/stocks-catalog";
import { fetchRetailStocks, fetchPreIpoStocks, fetchSearchStocks, fetchAllDegenStocks } from "../api/tokens-service";
import { fetchJupiterPrices } from "../api/jupiter-service";
import { filterCompliantStocks } from "../data/compliance-guard";

interface DataContextType {
  // Lists
  deckStocks: StockToken[]; // Retail + PreIPO + Degen (combined)
  searchStocks: StockToken[]; // All 140 for search page

  // Price map
  prices: Record<string, number>;
  
  // Loading state
  isLoading: boolean;
  
  // Registration
  setIsDeckActive: (active: boolean) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [deckStocks, setDeckStocks] = useState<StockToken[]>([]);
  const [searchStocks, setSearchStocks] = useState<StockToken[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDeckActive, setIsDeckActive] = useState(false);
  const isDeckActiveRef = useRef(isDeckActive);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  // Keep refs synced without re-triggering the main initData useEffect
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    isDeckActiveRef.current = isDeckActive;
  }, [isDeckActive]);

  useEffect(() => {
    let isActive = true;

    async function initData() {
      setIsLoading(true);
      try {
        const [retail, preIpo, search, degen] = await Promise.all([
          fetchRetailStocks(),
          fetchPreIpoStocks(),
          fetchSearchStocks(),
          fetchAllDegenStocks(),
        ]);

        // Combine for Deck (60 items max)
        const combinedDeck = filterCompliantStocks([...retail, ...preIpo, ...degen.deck]);
        
        // Combine for Search (140 items)
        const combinedSearch = filterCompliantStocks([...search, ...preIpo, ...degen.search]);

        if (!isActive) return;

        setDeckStocks(combinedDeck);
        setSearchStocks(combinedSearch);

        // Initial price fetch for all tokens (Deck + Search)
        // Since searchStocks contains the entire universe of 136 tokens, we use it to get all mints.
        // Because of the Active Background Worker engine, fetching 136 tokens from our proxy is instant and has no rate limits.
        const allMints = combinedSearch.map(s => s.mint);
        const initialPrices = await fetchJupiterPrices(allMints);
        setPrices(prev => ({ ...prev, ...initialPrices }));

        // Start polling for all prices every 10 seconds
        pollingRef.current = setInterval(async () => {
          // Poll if the user is on the Swipe Deck or the Search Page
          const activePaths = ["/", "/app", "/search"];
          if (!activePaths.includes(pathnameRef.current)) {
            return;
          }

          const freshPrices = await fetchJupiterPrices(allMints);
          setPrices(prev => ({ ...prev, ...freshPrices }));
        }, 10000);

      } catch (err) {
        console.error("Failed to initialize token data", err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();

    return () => {
      isActive = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const deckStocksWithPrices = useMemo(() => {
    return deckStocks.map(stock => {
      const livePrice = prices[stock.mint];
      let finalPrice = livePrice ?? stock.price;
      
      // If Jupiter didn't find the token, set to NaN so it's obvious and can be pruned
      if (!finalPrice || finalPrice <= 0) {
        finalPrice = NaN;
      }
      
      // Pass NaN to chart builder (chart will be blank, price will show $NaN)
      const chartData = buildChartData(finalPrice, 15);
      
      return {
        ...stock,
        price: finalPrice,
        chartData
      };
    });
  }, [deckStocks, prices]);

  const searchStocksWithPrices = useMemo(() => {
    return searchStocks.map(stock => {
      const livePrice = prices[stock.mint];
      let finalPrice = livePrice ?? stock.price;
      
      // If Jupiter didn't find the token, set to NaN so it's obvious and can be pruned
      if (!finalPrice || finalPrice <= 0) {
        finalPrice = NaN;
      }

      const chartData = buildChartData(finalPrice, 15);

      return {
        ...stock,
        price: finalPrice,
        chartData
      };
    });
  }, [searchStocks, prices]);

  return (
    <DataContext.Provider value={{ deckStocks: deckStocksWithPrices, searchStocks: searchStocksWithPrices, prices, isLoading, setIsDeckActive }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
