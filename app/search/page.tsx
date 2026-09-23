"use client";

import { useState, useMemo, useEffect } from "react";
import { useData } from "../lib/store/data-context";
import { fetchJupiterPrices } from "../lib/api/jupiter-service";
import { StockToken } from "../lib/data/stocks-catalog";

export default function SearchPage() {
  const { searchStocks, isLoading: isDataLoading } = useData();
  const [query, setQuery] = useState("");
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  
  // Instant in-memory filter
  const filteredStocks = useMemo(() => {
    if (!query) return searchStocks;
    const lowerQ = query.toLowerCase();
    return searchStocks.filter(
      (s) => s.name.toLowerCase().includes(lowerQ) || s.ticker.toLowerCase().includes(lowerQ)
    );
  }, [searchStocks, query]);

  // JIT Pricing Logic
  // Fetch prices only for the filtered results (e.g. up to a certain limit or all filtered if small)
  useEffect(() => {
    if (filteredStocks.length === 0 || filteredStocks.length > 50) return; // Wait until narrowed down for JIT, or use IntersectionObserver for virtualization

    const mintsToFetch = filteredStocks.map(s => s.mint);
    let isActive = true;

    async function fetchJITPrices() {
      try {
        const freshPrices = await fetchJupiterPrices(mintsToFetch);
        if (isActive) {
          setLivePrices(prev => ({ ...prev, ...freshPrices }));
        }
      } catch (err) {
        console.error("JIT Price Fetch Error:", err);
      }
    }

    fetchJITPrices();
    
    // Optional: setup short-lived polling for these active results
    const interval = setInterval(fetchJITPrices, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [filteredStocks]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Assets</h1>
      <input
        type="text"
        placeholder="Search ticker or name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full max-w-md mb-6"
      />

      {isDataLoading ? (
        <p>Loading metadata...</p>
      ) : (
        <div className="space-y-2">
          {filteredStocks.slice(0, 50).map((stock) => {
            const currentPrice = livePrices[stock.mint] ?? stock.price;
            return (
              <div key={stock.id} className="border p-3 flex justify-between">
                <div className="flex gap-2 items-center">
                  {stock.logoURI && <img src={stock.logoURI} className="w-8 h-8 rounded-full" alt="" />}
                  <div>
                    <p className="font-bold">{stock.name}</p>
                    <p className="text-sm text-gray-500">{stock.ticker}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono">${currentPrice > 0 ? currentPrice.toFixed(4) : "---"}</p>
                </div>
              </div>
            );
          })}
          {filteredStocks.length > 50 && (
            <p className="text-gray-400 text-sm mt-4">Showing 50 of {filteredStocks.length} results. Keep typing to narrow down.</p>
          )}
        </div>
      )}
    </div>
  );
}
