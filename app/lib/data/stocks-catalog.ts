export type RiskTier = "conservative" | "balanced" | "degen";

export type AssetSector =
  | "Equities"
  | "Tech & AI"
  | "Defense & Aerospace"
  | "ETFs & Indices"
  | "Fintech & Crypto"
  | "Pre-IPO Unicorn"
  | "Bonding Curve Meme";

export interface StockToken {
  id: string;
  name: string;
  ticker: string;
  mint: string;
  tier: RiskTier;
  sector: AssetSector;
  subtitle: string;
  description: string;
  price: number; // in USD
  change24h: number; // percentage
  change3m: number; // 3-month performance
  marketCap?: string;
  benchmarkTicker: string;
  benchmarkName: string;
  benchmarkCorrelation: number; // 0 to 1
  allocationSegments: {
    label: string;
    weight: number; // percentage (sums to 100)
    color: string;
  }[];
  // Synthetic / historical chart price samples [timestamp, price, benchmarkPrice]
  chartData: {
    "1W": ChartPoint[];
    "1M": ChartPoint[];
    "3M": ChartPoint[];
    "1Y": ChartPoint[];
    All: ChartPoint[];
  };
  isPreIPO?: boolean;
  isStonkFun?: boolean;
  isToken2022?: boolean;
  hasTransferHook?: boolean; // Used by compliance filter
  logoURI?: string;
}

export interface ChartPoint {
  time: string;
  price: number;
  benchmarkPrice: number;
}

// Generate deterministic chart points with smooth variation and benchmark comparison
function generateChartSeries(
  basePrice: number,
  points: number,
  trendPct: number,
  volatility: number,
  timeframeLabel: string
): ChartPoint[] {
  const result: ChartPoint[] = [];
  let currentPrice = basePrice * (1 - trendPct / 100);
  let currentBench = 1000 * (1 - (trendPct * 0.6) / 100);

  for (let i = 0; i < points; i++) {
    // Deterministic pseudo-noise using trigonometric combinations (no Math.random to prevent SSR hydration mismatch)
    const seed = Math.sin(basePrice * 3.7 + i * 1.8);
    const noise = (Math.sin(i * 0.7) * 0.6 + seed * 0.4) * volatility;
    const benchNoise =
      (Math.cos(i * 0.5) * 0.4 + Math.cos(basePrice * 1.5 + i * 2.1) * 0.3) *
      (volatility * 0.7);

    currentPrice =
      currentPrice * (1 + trendPct / 100 / points + noise * 0.02);
    currentBench =
      currentBench * (1 + (trendPct * 0.6) / 100 / points + benchNoise * 0.015);

    result.push({
      time: `${timeframeLabel} P${i + 1}`,
      price: Math.round(currentPrice * 100) / 100,
      benchmarkPrice: Math.round(currentBench * 100) / 100,
    });
  }

  // Ensure last point aligns with basePrice
  if (result.length > 0) {
    result[result.length - 1].price = basePrice;
  }
  return result;
}

export function buildChartData(basePrice: number, change3m: number) {
  return {
    "1W": generateChartSeries(basePrice, 14, change3m * 0.2, 0.5, "1W"),
    "1M": generateChartSeries(basePrice, 20, change3m * 0.5, 0.7, "1M"),
    "3M": generateChartSeries(basePrice, 28, change3m, 0.9, "3M"),
    "1Y": generateChartSeries(basePrice, 32, change3m * 1.8, 1.2, "1Y"),
    All: generateChartSeries(basePrice, 40, change3m * 2.5, 1.4, "All"),
  };
}
