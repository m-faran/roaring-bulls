import { describe, it, expect } from "vitest";
import { generateBasketQuote, SOL_USD_PRICE } from "../app/lib/execution/mock-quotes";
import { StockToken } from "../app/lib/data/stocks-catalog";

describe("Basket Math & Quote Engine", () => {
  it("calculates basket totals, routes, and output quantities correctly", () => {
    const tsla = {
      id: "tsla",
      ticker: "TSLAx",
      price: 245.5,
    } as StockToken;
    const openai = {
      id: "openai",
      ticker: "OPENAI",
      price: 102.4,
    } as StockToken;

    const basketItems = [
      { stock: tsla, allocationSol: 0.1 },
      { stock: openai, allocationSol: 0.05 },
    ];

    const quote = generateBasketQuote(basketItems, 0.5);

    expect(quote.items.length).toBe(2);
    expect(quote.totalSol).toBe(0.15);
    expect(quote.totalUsd).toBe(0.15 * SOL_USD_PRICE);

    // Verify TSLAx output
    const tslaQuote = quote.items.find((i) => i.stock.ticker === "TSLAx")!;
    expect(tslaQuote.allocationUsd).toBe(0.1 * SOL_USD_PRICE);
    expect(tslaQuote.estimatedTokensOut).toBeCloseTo(
      (0.1 * SOL_USD_PRICE) / tsla.price,
      3
    );
    expect(tslaQuote.route).toContain("TSLAx");

    // Verify network fee scaling
    expect(quote.estimatedNetworkFeeSol).toBe(0.00001);
  });
});
