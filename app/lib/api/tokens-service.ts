import { StockToken } from "../data/stocks-catalog";

// Map Stonkfun token format to our StockToken interface
function mapStonkfunToStockToken(raw: any, isNewest: boolean): StockToken {
  return {
    id: raw.mint,
    name: raw.name,
    ticker: raw.symbol,
    mint: raw.mint,
    tier: "degen",
    sector: "Bonding Curve Meme",
    subtitle: raw.quote?.symbol ? `Paired Against ${raw.quote.symbol}` : "Stonkfun Meme",
    description: `Meme token launched on Stonkfun. ${isNewest ? "Recently launched." : "Highest market cap."
      }`,
    price: raw.market?.priceUsd || 0,
    change24h: 0, // Stonkfun doesn't provide 24h change directly here
    change3m: 0,
    marketCap: raw.market?.marketCapUsd ? `$${Math.round(raw.market.marketCapUsd).toLocaleString()}` : "Unknown",
    benchmarkTicker: raw.quote?.symbol || "SOL",
    benchmarkName: raw.quote?.name || "Solana",
    benchmarkCorrelation: 0.8,
    allocationSegments: [
      { label: "Community", weight: 60, color: "#F43F5E" },
      { label: "Liquidity", weight: 40, color: "#10B981" },
    ],
    // Keep synthetic charts for now
    chartData: {
      "1W": [],
      "1M": [],
      "3M": [],
      "1Y": [],
      All: [],
    },
    isStonkFun: true,
    logoURI: raw.imageUrl,
  };
}

// Map tokens.xyz token format to our StockToken interface
function mapTokensXyzToStockToken(raw: any, tier: "conservative" | "balanced" | "degen"): StockToken {
  return {
    id: raw.mint || raw.address,
    name: raw.name,
    ticker: raw.symbol,
    mint: raw.mint || raw.address,
    tier,
    sector: tier === "balanced" ? "Pre-IPO Unicorn" : "Equities",
    subtitle: raw.subtitle || `${raw.symbol} on-chain`,
    description: raw.description || `Tokenized asset for ${raw.name}.`,
    price: raw.price || raw.market?.priceUsd || 0,
    change24h: 0,
    change3m: 0,
    marketCap: "Unknown",
    benchmarkTicker: "SOL",
    benchmarkName: "Solana",
    benchmarkCorrelation: 0.7,
    allocationSegments: [
      { label: "Asset Reserve", weight: 100, color: "#3B82F6" },
    ],
    // Synthetic charts will be hydrated later
    chartData: {
      "1W": [],
      "1M": [],
      "3M": [],
      "1Y": [],
      All: [],
    },
    isPreIPO: tier === "balanced",
    logoURI: raw.logoURI || raw.logoUrl,
  };
}

export async function fetchRetailStocks(): Promise<StockToken[]> {
  try {
    const res = await fetch("/api/meta?list=retail-stocks");
    if (!res.ok) throw new Error("Failed to fetch retail stocks");
    const data = await res.json();
    return (Array.isArray(data) ? data : data.tokens || []).map((t: any) =>
      mapTokensXyzToStockToken(t, "conservative")
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchPreIpoStocks(): Promise<StockToken[]> {
  try {
    const res = await fetch("/api/meta?list=pre-ipo-t-tokens");
    if (!res.ok) throw new Error("Failed to fetch pre-ipo stocks");
    const data = await res.json();
    return (Array.isArray(data) ? data : data.tokens || []).map((t: any) =>
      mapTokensXyzToStockToken(t, "balanced")
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchSearchStocks(): Promise<StockToken[]> {
  try {
    const res = await fetch("/api/meta?list=x-stocks");
    if (!res.ok) throw new Error("Failed to fetch search stocks");
    const data = await res.json();
    return (Array.isArray(data) ? data : data.tokens || []).map((t: any) =>
      mapTokensXyzToStockToken(t, "conservative")
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchAllDegenStocks(): Promise<{ deck: StockToken[]; search: StockToken[] }> {
  try {
    const [mcRes, newRes] = await Promise.all([
      fetch("/api/meta?list=stonkfun-mc"),
      fetch("/api/meta?list=stonkfun-new"),
    ]);

    const mcData = mcRes.ok ? await mcRes.json() : { data: { tokens: [] } };
    const newData = newRes.ok ? await newRes.json() : { data: { tokens: [] } };

    const allMc = (mcData.data?.tokens || []).map((t: any) => mapStonkfunToStockToken(t, false));
    const allNew = (newData.data?.tokens || []).map((t: any) => mapStonkfunToStockToken(t, true));

    const deckCombined = [...allMc.slice(0, 10), ...allNew.slice(0, 10)];
    const deckUnique = Array.from(new Map(deckCombined.map((item) => [item.mint, item])).values());

    // Search gets all 50 Stonkfun coins (25 top + 25 newest)
    const searchCombined = [...allMc, ...allNew];
    const searchUnique = Array.from(new Map(searchCombined.map((item) => [item.mint, item])).values());

    return { deck: deckUnique, search: searchUnique };
  } catch (err) {
    console.error(err);
    return { deck: [], search: [] };
  }
}
