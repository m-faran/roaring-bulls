import { StockToken } from "../data/stocks-catalog";

export const SOL_USD_PRICE = 150.0; // Benchmark price: 1 SOL = $150 USD

export interface BasketQuoteItem {
  stock: StockToken;
  allocationSol: number;
  allocationUsd: number;
  estimatedTokensOut: number;
  priceImpactPct: number;
  route: string;
}

export interface BasketQuote {
  items: BasketQuoteItem[];
  totalSol: number;
  totalUsd: number;
  estimatedNetworkFeeSol: number;
  slippagePct: number;
  createdAt: number;
}

export function generateBasketQuote(
  items: { stock: StockToken; allocationSol: number }[],
  slippagePct = 0.5
): BasketQuote {
  const quoteItems: BasketQuoteItem[] = items.map(({ stock, allocationSol }) => {
    const allocationUsd = allocationSol * SOL_USD_PRICE;
    const estimatedTokensOut = stock.price > 0 ? allocationUsd / stock.price : 0;
    const priceImpactPct = Math.min(0.02 + (allocationUsd / 10000) * 0.1, 0.5);

    const pool = stock.isStonkFun
      ? "Raydium LaunchLab CPMM"
      : stock.isPreIPO
        ? "Meteora DLMM Pre-Market"
        : "Orca Whirlpool xStock";

    return {
      stock,
      allocationSol,
      allocationUsd,
      estimatedTokensOut: Math.round(estimatedTokensOut * 10000) / 10000,
      priceImpactPct: Math.round(priceImpactPct * 100) / 100,
      route: `SOL → ${pool} → ${stock.ticker}`,
    };
  });

  const totalSol = quoteItems.reduce((acc, it) => acc + it.allocationSol, 0);
  const totalUsd = totalSol * SOL_USD_PRICE;

  return {
    items: quoteItems,
    totalSol: Math.round(totalSol * 10000) / 10000,
    totalUsd: Math.round(totalUsd * 100) / 100,
    estimatedNetworkFeeSol: 0.000005 * items.length,
    slippagePct,
    createdAt: Date.now(),
  };
}
