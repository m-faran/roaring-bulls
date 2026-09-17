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

function buildChartData(basePrice: number, change3m: number) {
  return {
    "1W": generateChartSeries(basePrice, 14, change3m * 0.2, 0.5, "1W"),
    "1M": generateChartSeries(basePrice, 20, change3m * 0.5, 0.7, "1M"),
    "3M": generateChartSeries(basePrice, 28, change3m, 0.9, "3M"),
    "1Y": generateChartSeries(basePrice, 32, change3m * 1.8, 1.2, "1Y"),
    All: generateChartSeries(basePrice, 40, change3m * 2.5, 1.4, "All"),
  };
}

export const STOCKS_CATALOG: StockToken[] = [
  // ==========================================
  // CONSERVATIVE TIER: Public Blue Chips (Backed xStocks)
  // ==========================================
  {
    id: "tslax",
    name: "Tesla, Inc.",
    ticker: "TSLAx",
    mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    tier: "conservative",
    sector: "Tech & AI",
    subtitle: "Electric Vehicles & Clean Energy",
    description: "Backed 1:1 tokenized tracker certificate for Tesla Inc. common stock, held in Swiss custody with 24/7 DeFi composability.",
    price: 242.84,
    change24h: 3.42,
    change3m: 14.85,
    marketCap: "$770B",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Index",
    benchmarkCorrelation: 0.72,
    allocationSegments: [
      { label: "Automotive & FSD", weight: 45, color: "#10B981" },
      { label: "Energy Storage", weight: 25, color: "#3B82F6" },
      { label: "Optimus & AI", weight: 20, color: "#8B5CF6" },
      { label: "Charging Network", weight: 10, color: "#F59E0B" },
    ],
    chartData: buildChartData(242.84, 14.85),
    isToken2022: true,
    hasTransferHook: false,
  },
  {
    id: "nvdax",
    name: "NVIDIA Corporation",
    ticker: "NVDAx",
    mint: "XsNvdAgA3kL9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yU8eF",
    tier: "conservative",
    sector: "Tech & AI",
    subtitle: "Accelerated Computing & AI Silicon",
    description: "Backed xStock for NVIDIA. World leader in GPU silicon, Blackwell architecture, and hyperscaler AI datacenters.",
    price: 138.25,
    change24h: 4.88,
    change3m: 28.4,
    marketCap: "$3.4T",
    benchmarkTicker: "QQQ",
    benchmarkName: "Invesco Nasdaq 100",
    benchmarkCorrelation: 0.88,
    allocationSegments: [
      { label: "Datacenter AI", weight: 75, color: "#10B981" },
      { label: "Gaming & RTX", weight: 15, color: "#06B6D4" },
      { label: "Automotive & Omniverse", weight: 10, color: "#A855F7" },
    ],
    chartData: buildChartData(138.25, 28.4),
    isToken2022: true,
    hasTransferHook: false,
  },
  {
    id: "aaplx",
    name: "Apple Inc.",
    ticker: "AAPLx",
    mint: "XsDZ2tDk4pL9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yU8eF",
    tier: "conservative",
    sector: "Equities",
    subtitle: "Consumer Tech & Apple Intelligence",
    description: "Backed xStock for Apple. Global ecosystem spanning iPhone, Mac, Wearables, and consumer privacy-first AI.",
    price: 232.15,
    change24h: 1.12,
    change3m: 8.65,
    marketCap: "$3.5T",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Index",
    benchmarkCorrelation: 0.82,
    allocationSegments: [
      { label: "iPhone Hardware", weight: 52, color: "#3B82F6" },
      { label: "Services & Subscriptions", weight: 26, color: "#10B981" },
      { label: "Wearables & Macs", weight: 22, color: "#EC4899" },
    ],
    chartData: buildChartData(232.15, 8.65),
    isToken2022: true,
    hasTransferHook: false,
  },
  {
    id: "spyx",
    name: "S&P 500 ETF xStock",
    ticker: "SPYx",
    mint: "XsSpyB4kL9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yU8eF11",
    tier: "conservative",
    sector: "ETFs & Indices",
    subtitle: "Broad US Large-Cap Benchmark",
    description: "Tracks the 500 largest publicly traded companies in the United States. Core foundation for passive wealth building.",
    price: 588.4,
    change24h: 0.65,
    change3m: 6.82,
    marketCap: "$550B AUM",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Baseline",
    benchmarkCorrelation: 1.0,
    allocationSegments: [
      { label: "Information Tech", weight: 31, color: "#3B82F6" },
      { label: "Financials", weight: 14, color: "#10B981" },
      { label: "Healthcare", weight: 12, color: "#EC4899" },
      { label: "Consumer Discretionary", weight: 11, color: "#F59E0B" },
      { label: "Communication Services", weight: 9, color: "#8B5CF6" },
      { label: "Industrials & Other", weight: 23, color: "#06B6D4" },
    ],
    chartData: buildChartData(588.4, 6.82),
    isToken2022: true,
    hasTransferHook: false,
  },
  {
    id: "coinx",
    name: "Coinbase Global",
    ticker: "COINx",
    mint: "XsCoin9pL9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yU8eF22",
    tier: "conservative",
    sector: "Fintech & Crypto",
    subtitle: "US Digital Asset Infrastructure",
    description: "Backed xStock for Coinbase. Leading US regulated exchange, custodian for Bitcoin & Ethereum ETFs, and operator of Base.",
    price: 218.6,
    change24h: 5.4,
    change3m: 19.3,
    marketCap: "$54B",
    benchmarkTicker: "SOL",
    benchmarkName: "Solana Network",
    benchmarkCorrelation: 0.76,
    allocationSegments: [
      { label: "Transaction Trading", weight: 48, color: "#3B82F6" },
      { label: "Subscription & Services", weight: 38, color: "#10B981" },
      { label: "Custodial Staking", weight: 14, color: "#F59E0B" },
    ],
    chartData: buildChartData(218.6, 19.3),
    isToken2022: true,
    hasTransferHook: false,
  },

  // ==========================================
  // BALANCED TIER: Pre-IPO Equities (PreStocks & Tessera)
  // ==========================================
  {
    id: "spacex",
    name: "SpaceX (T-SpaceX)",
    ticker: "SPACEX",
    mint: "TessSpaceX998k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "balanced",
    sector: "Defense & Aerospace",
    subtitle: "Orbital Launch & Starlink Broadband",
    description: "Tessera T-Token backed 1:1 by private shares in Cayman SPV with on-chain Chainlink Proof of Reserve. Dominant orbital launch provider.",
    price: 112.5,
    change24h: 1.8,
    change3m: 22.4,
    marketCap: "$210B (Private)",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Index",
    benchmarkCorrelation: 0.45,
    allocationSegments: [
      { label: "Starlink Constellation", weight: 58, color: "#06B6D4" },
      { label: "Falcon 9 Commercial Launch", weight: 24, color: "#3B82F6" },
      { label: "Starship Program", weight: 18, color: "#8B5CF6" },
    ],
    chartData: buildChartData(112.5, 22.4),
    isPreIPO: true,
  },
  {
    id: "openai",
    name: "OpenAI (T-OpenAI)",
    ticker: "OPENAI",
    mint: "TessOpenAI443k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "balanced",
    sector: "Pre-IPO Unicorn",
    subtitle: "Frontier Foundation Models & ChatGPT",
    description: "Tokenized pre-IPO exposure to OpenAI. Creator of GPT-4o, o1 reasoning models, Sora, and leading enterprise AI APIs.",
    price: 157.0,
    change24h: 3.2,
    change3m: 35.8,
    marketCap: "$157B (Private)",
    benchmarkTicker: "QQQ",
    benchmarkName: "Invesco Nasdaq 100",
    benchmarkCorrelation: 0.65,
    allocationSegments: [
      { label: "ChatGPT Consumer Subscriptions", weight: 44, color: "#10B981" },
      { label: "Enterprise API Tokens", weight: 38, color: "#3B82F6" },
      { label: "Strategic Licenses (Microsoft)", weight: 18, color: "#F59E0B" },
    ],
    chartData: buildChartData(157.0, 35.8),
    isPreIPO: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    ticker: "CLAUDE",
    mint: "PreAnthropic883k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU",
    tier: "balanced",
    sector: "Pre-IPO Unicorn",
    subtitle: "AI Safety & Claude 3.5 Sonnet",
    description: "PreStocks SPV token representing beneficial ownership in Anthropic PBC, the creator of Claude 3.5 Sonnet and Constitutional AI.",
    price: 78.4,
    change24h: 2.7,
    change3m: 29.1,
    marketCap: "$40B (Private)",
    benchmarkTicker: "QQQ",
    benchmarkName: "Invesco Nasdaq 100",
    benchmarkCorrelation: 0.62,
    allocationSegments: [
      { label: "Claude Pro & Team", weight: 40, color: "#F97316" },
      { label: "Developer APIs", weight: 35, color: "#10B981" },
      { label: "Amazon & GCP Cloud", weight: 25, color: "#3B82F6" },
    ],
    chartData: buildChartData(78.4, 29.1),
    isPreIPO: true,
  },
  {
    id: "kalshi",
    name: "Kalshi (T-Kalshi)",
    ticker: "KALSHI",
    mint: "TessKalshi112k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "balanced",
    sector: "Fintech & Crypto",
    subtitle: "CFTC-Regulated Prediction Exchange",
    description: "Tessera T-Token tracking Kalshi, the premier federally regulated event contracts platform and prediction market.",
    price: 34.2,
    change24h: 6.5,
    change3m: 48.2,
    marketCap: "$1.5B (Private)",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Index",
    benchmarkCorrelation: 0.38,
    allocationSegments: [
      { label: "Macro & Fed Contracts", weight: 45, color: "#10B981" },
      { label: "Elections & Politics", weight: 35, color: "#8B5CF6" },
      { label: "Institutional Clearing", weight: 20, color: "#F59E0B" },
    ],
    chartData: buildChartData(34.2, 48.2),
    isPreIPO: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    ticker: "STRIPE",
    mint: "PreStripe994k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8e",
    tier: "balanced",
    sector: "Fintech & Crypto",
    subtitle: "Global Financial Infrastructure & Stablecoins",
    description: "PreStocks private equity allocation in Stripe. Processing over $1T annually and pioneering Pay with Crypto on Solana.",
    price: 94.6,
    change24h: 1.4,
    change3m: 16.5,
    marketCap: "$70B (Private)",
    benchmarkTicker: "SPY",
    benchmarkName: "S&P 500 Index",
    benchmarkCorrelation: 0.7,
    allocationSegments: [
      { label: "Merchant Payments", weight: 60, color: "#6366F1" },
      { label: "Banking-as-a-Service", weight: 25, color: "#10B981" },
      { label: "Crypto & Stablecoin Rail", weight: 15, color: "#F59E0B" },
    ],
    chartData: buildChartData(94.6, 16.5),
    isPreIPO: true,
  },

  // ==========================================
  // DEGEN TIER: Equity-Paired Memes & Bonding Curves (StonkFun)
  // ==========================================
  {
    id: "stonk",
    name: "StonkFun Native",
    ticker: "STONK",
    mint: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx",
    tier: "degen",
    sector: "Bonding Curve Meme",
    subtitle: "LaunchLab Fee Flywheel & Buyback",
    description: "The core platform token of StonkFun. 60% of all protocol swap and launch fees are automatically market-bought and burned.",
    price: 0.048,
    change24h: 18.4,
    change3m: 142.5,
    marketCap: "$48M",
    benchmarkTicker: "SOL",
    benchmarkName: "Solana Network",
    benchmarkCorrelation: 0.85,
    allocationSegments: [
      { label: "Treasury Buyback Pool", weight: 60, color: "#F43F5E" },
      { label: "Bonding Curve Liquidity", weight: 25, color: "#10B981" },
      { label: "Community Rewards", weight: 15, color: "#F59E0B" },
    ],
    chartData: buildChartData(0.048, 142.5),
    isStonkFun: true,
  },
  {
    id: "tsladoge",
    name: "Tesla Doge Paired",
    ticker: "TSLADOGE",
    mint: "StkTslaDog779k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "degen",
    sector: "Bonding Curve Meme",
    subtitle: "Paired Directly Against TSLAx",
    description: "Raydium LaunchLab pool pairing meme liquidity directly against Tesla xStock. Moves with Cybercab headlines and TSLA volatility.",
    price: 0.0089,
    change24h: 31.2,
    change3m: 215.0,
    marketCap: "$8.9M",
    benchmarkTicker: "TSLAx",
    benchmarkName: "Tesla xStock",
    benchmarkCorrelation: 0.91,
    allocationSegments: [
      { label: "TSLAx Quote Pairing", weight: 50, color: "#E11D48" },
      { label: "Community Viral Meme", weight: 35, color: "#F59E0B" },
      { label: "Raydium CPMM Pool", weight: 15, color: "#3B82F6" },
    ],
    chartData: buildChartData(0.0089, 215.0),
    isStonkFun: true,
  },
  {
    id: "nvdaape",
    name: "Nvidia Ape",
    ticker: "NVDAAPE",
    mint: "StkNvdaAp332k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "degen",
    sector: "Bonding Curve Meme",
    subtitle: "Paired Directly Against NVDAx",
    description: "StonkFun equity-meme paired with NVDAx. Amplifies compute supply narrative with 24/7 degen trading mechanics.",
    price: 0.0145,
    change24h: -4.8,
    change3m: 98.4,
    marketCap: "$14.5M",
    benchmarkTicker: "NVDAx",
    benchmarkName: "NVIDIA xStock",
    benchmarkCorrelation: 0.82,
    allocationSegments: [
      { label: "NVDAx Quote Reserve", weight: 55, color: "#10B981" },
      { label: "Speculative Float", weight: 45, color: "#8B5CF6" },
    ],
    chartData: buildChartData(0.0145, 98.4),
    isStonkFun: true,
  },
  {
    id: "elonx",
    name: "Elon Everything",
    ticker: "ELONX",
    mint: "StkElonX442k1J2M1K6X8wR5qP7Z4vC2bN0mQ9yU8",
    tier: "degen",
    sector: "Bonding Curve Meme",
    subtitle: "SpaceX, Tesla, xAI Composite Meme",
    description: "Community index meme tracking sentiment across all Elon Musk ventures. Launches on Raydium with auto-liquidity graduation.",
    price: 0.032,
    change24h: 12.8,
    change3m: 168.0,
    marketCap: "$32M",
    benchmarkTicker: "SOL",
    benchmarkName: "Solana Network",
    benchmarkCorrelation: 0.78,
    allocationSegments: [
      { label: "SpaceX Starship Narrative", weight: 40, color: "#06B6D4" },
      { label: "Tesla FSD Narrative", weight: 35, color: "#E11D48" },
      { label: "xAI / Grok Catalyst", weight: 25, color: "#8B5CF6" },
    ],
    chartData: buildChartData(0.032, 168.0),
    isStonkFun: true,
  },
];
