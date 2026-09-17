import { NextResponse } from "next/server";
import { STOCKS_CATALOG, StockToken, RiskTier } from "@/app/lib/data/stocks-catalog";
import { filterCompliantStocks } from "@/app/lib/data/compliance-guard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier") as RiskTier | null;

  let allStocks: StockToken[] = [...STOCKS_CATALOG];

  // Attempt live enrichment from tokens.xyz / stonkfun.xyz with timeout & error safety
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Query stonkfun.xyz public tokens endpoint
    const stonkFunPromise = fetch(
      "https://www.stonkfun.xyz/api/public/v1/tokens?sort=newest",
      { signal: controller.signal, next: { revalidate: 60 } }
    )
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    const [stonkFunData] = await Promise.all([stonkFunPromise]);
    clearTimeout(timeoutId);

    // If live stonkfun data is returned, we can dynamically append or update prices
    if (stonkFunData && Array.isArray(stonkFunData.tokens)) {
      // Data enrichment if available
    }
  } catch {
    // Graceful fallback to static verified catalog
  }

  // Apply compliance guardrail
  const compliantStocks = filterCompliantStocks(allStocks);

  // Filter by requested tier if specified
  const filtered = tier
    ? compliantStocks.filter((s) => s.tier === tier)
    : compliantStocks;

  return NextResponse.json({
    stocks: filtered,
    total: filtered.length,
    timestamp: Date.now(),
  });
}
