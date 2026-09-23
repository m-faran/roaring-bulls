"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
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
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [deckStocks, setDeckStocks] = useState<StockToken[]>([]);
  const [searchStocks, setSearchStocks] = useState<StockToken[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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

        setDeckStocks(combinedDeck);
        setSearchStocks(combinedSearch);

        // Initial price fetch for Deck
        const deckMints = combinedDeck.map(s => s.mint);
        const initialPrices = await fetchJupiterPrices(deckMints);
        setPrices(prev => ({ ...prev, ...initialPrices }));

        // Start polling for Deck prices every 10 seconds
        pollingRef.current = setInterval(async () => {
          const freshPrices = await fetchJupiterPrices(deckMints);
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
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const deckStocksWithPrices = useMemo(() => {
    return deckStocks.map(stock => {
      const livePrice = prices[stock.mint];
      const finalPrice = livePrice ?? stock.price;
      // Default to 15% 3m change for synthetic chart generation
      const chartData = buildChartData(finalPrice > 0 ? finalPrice : 1, 15);
      
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
      const finalPrice = livePrice ?? stock.price;
      const chartData = buildChartData(finalPrice > 0 ? finalPrice : 1, 15);

      return {
        ...stock,
        price: finalPrice,
        chartData
      };
    });
  }, [searchStocks, prices]);

  return (
    <DataContext.Provider value={{ deckStocks: deckStocksWithPrices, searchStocks: searchStocksWithPrices, prices, isLoading }}>
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
