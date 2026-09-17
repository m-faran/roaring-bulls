"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";

export function LandingPage() {
  const { setActiveTab, setIsStrategyWizardOpen } = useBasket();

  // Mini interactive demo state on the landing page
  const [demoBudget, setDemoBudget] = useState(1.0);
  const [demoBasket, setDemoBasket] = useState<string[]>([]);
  const [demoCardIndex, setDemoCardIndex] = useState(0);

  const demoAssets = [
    {
      ticker: "SPACEX",
      name: "SpaceX (T-SpaceX)",
      tier: "Balanced • Pre-IPO",
      price: "$112.50",
      change: "+22.4%",
      color: "from-cyan-500 to-blue-600",
      logo: "https://unavatar.io/spacex.com",
    },
    {
      ticker: "TSLAx",
      name: "Tesla, Inc.",
      tier: "Conservative • Blue Chip",
      price: "$242.84",
      change: "+14.8%",
      color: "from-emerald-500 to-teal-600",
      logo: "https://unavatar.io/tesla.com",
    },
    {
      ticker: "OPENAI",
      name: "OpenAI (T-OpenAI)",
      tier: "Balanced • Pre-IPO",
      price: "$157.00",
      change: "+35.8%",
      color: "from-purple-500 to-indigo-600",
      logo: "https://unavatar.io/openai.com",
    },
    {
      ticker: "NVDAAPE",
      name: "Nvidia Ape (StonkFun)",
      tier: "Degen • Meme Paired",
      price: "$0.0145",
      change: "+98.4%",
      color: "from-rose-500 to-amber-600",
      logo: "https://unavatar.io/nvidia.com",
    },
  ];

  const handleDemoSwipe = (dir: "left" | "right") => {
    const asset = demoAssets[demoCardIndex % demoAssets.length];
    if (dir === "right" && demoBudget >= 0.1) {
      setDemoBudget((b) => Math.max(0, Math.round((b - 0.1) * 100) / 100));
      setDemoBasket((prev) => (prev.includes(asset.ticker) ? prev : [...prev, asset.ticker]));
    }
    setDemoCardIndex((i) => i + 1);
  };

  const handleLaunchApp = () => {
    setActiveTab("app");
  };

  const currentDemoAsset = demoAssets[demoCardIndex % demoAssets.length];

  return (
    <div className="w-full bg-[#070A12] text-white selection:bg-emerald-500 selection:text-slate-950">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOLANA TOKENIZED EQUITIES • SWIPE-BASED DCA RITUAL</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Invest in Global Equities.{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                One Swipe at a Time.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              In many developing markets, access to global stocks is fragmented, expensive, or entirely unavailable. Traditional tools make investing rigid and boring.{" "}
              <strong className="text-white font-semibold">Swpper</strong> offers a fixed-budget, swipe-based DCA ritual across tokenized equities on Solana.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchApp}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <span>Launch Swpper App</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <a
              href="#how-it-works"
              className="cursor-pointer w-full sm:w-auto px-6 py-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>How the Ritual Works</span>
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>

          {/* Live Micro-Features Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Non-Custodial</span>
              <p className="text-xs font-bold text-white mt-0.5">Email Login via Privy</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Execution</span>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">Atomic Jupiter Swaps</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Asset Universe</span>
              <p className="text-xs font-bold text-white mt-0.5">3 Curated Risk Tiers</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Guardrails</span>
              <p className="text-xs font-bold text-cyan-400 mt-0.5">Auto Compliance Filter</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TEASER PREVIEW SECTION */}
      <section className="py-12 border-y border-white/5 bg-[#090E1A]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Teaser description */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Interactive Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                No complex order books. Just set a budget and swipe.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Define the boundaries of your investment session: your budget (e.g. 1 SOL or $50), your amount per swipe (e.g. 0.1 SOL or $5), and your risk tier. Then start swiping.
              </p>
              <div className="space-y-2.5 pt-1 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span><strong className="text-white">Swipe Right:</strong> Allocates a fixed amount and locks into basket</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 font-bold items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span><strong className="text-white">Swipe Left:</strong> Skips to the next token in the curated deck</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span><strong className="text-white">Budget Lock:</strong> You can never exceed your pre-set session boundary</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLaunchApp}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  <span>Open Full Investing Terminal</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Card Widget */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0D1322] p-5 shadow-2xl space-y-4">
                {/* Live Demo Header */}
                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-400 font-medium">Session Budget:</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {demoBudget.toFixed(2)} SOL Remaining
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-slate-800 p-1 flex items-center justify-center border border-white/10 overflow-hidden">
                        <img src={currentDemoAsset.logo} alt={currentDemoAsset.name} className="h-full w-full object-contain rounded" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{currentDemoAsset.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{currentDemoAsset.ticker}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                      0.1 SOL
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">{currentDemoAsset.tier}</span>
                    <span className="font-bold text-emerald-400">{currentDemoAsset.change} (3M)</span>
                  </div>
                </div>

                {/* Interactive Taps */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDemoSwipe("left")}
                    className="cursor-pointer py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>← Skip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSwipe("right")}
                    className="cursor-pointer py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <span>Add (0.1 SOL) →</span>
                  </button>
                </div>

                {/* Demo Basket status */}
                <div className="text-center text-[11px] text-slate-400">
                  <span>Basket: </span>
                  <strong className="text-white font-mono">
                    {demoBasket.length > 0 ? demoBasket.join(", ") : "Empty (Tap Add)"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 3-STEP RITUAL SECTION */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            The Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How the Swpper Ritual Works
          </h2>
          <p className="text-sm text-slate-400">
            A frictionless investing ritual engineered from the ground up for modern retail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4 hover:border-emerald-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Set Your Boundaries</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start by choosing your quote currency (SOL or USDC), total session budget, allocation per swipe, and risk tier (Conservative, Balanced, or Degen). Your parameters define the guardrails and automatically curate the deck.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-base">
              02
            </div>
            <h3 className="text-lg font-bold text-white">The Swipe Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Swipe right to allocate your fixed slice to an asset. Swipe left to skip it. Every decision stays safely within your budget while remaining capital updates live. Zero math anxiety, zero spreadsheet friction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4 hover:border-purple-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-base">
              03
            </div>
            <h3 className="text-lg font-bold text-white">1-Click Atomic Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your execution method: **Buy Now** (instant basket execution), **Recurring SIP** (Jupiter DCA program), or **Limit Order** (dip trigger). All required swaps are packaged into a single atomic transaction routed through Jupiter.
            </p>
          </div>
        </div>
      </section>

      {/* 3 RISK-TIERED ASSET MODES SHOWCASE */}
      <section className="py-20 border-t border-white/5 bg-[#090E1A]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Curated Universes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Three Risk-Tiered Asset Modes
            </h2>
            <p className="text-sm text-slate-400">
              Seamlessly switch between public blue chips, pre-IPO unicorns, and equity-paired memecoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conservative Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0D1322] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                    Conservative Tier
                  </span>
                  <span className="text-xs font-mono text-slate-400">Backed xStocks</span>
                </div>
                <h3 className="text-lg font-bold text-white">Public Blue Chips & ETFs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1:1 tokenized tracker certificates for public equities held in Swiss custody with 24/7 DeFi composability.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">TSLAx</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">NVDAx</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">AAPLx</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">SPYx</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">COINx</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500">
                Low volatility • Audited custodial backing
              </div>
            </div>

            {/* Balanced Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0D1322] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-[11px] font-bold">
                    Balanced Tier
                  </span>
                  <span className="text-xs font-mono text-slate-400">PreStocks & Tessera</span>
                </div>
                <h3 className="text-lg font-bold text-white">Pre-IPO Unicorns</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Private equity exposure via Cayman SPVs backed by on-chain Chainlink Proof-of-Reserve.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">SpaceX</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">OpenAI</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Anthropic</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Kalshi</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Stripe</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500">
                Moderate volatility • Chainlink PoR verified
              </div>
            </div>

            {/* Degen Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0D1322] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 text-[11px] font-bold">
                    Degen Tier
                  </span>
                  <span className="text-xs font-mono text-slate-400">StonkFun LaunchLab</span>
                </div>
                <h3 className="text-lg font-bold text-white">Equity-Paired Memecoins</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Raydium bonding curves pairing meme liquidity directly against stocks, with 60% fee buyback & burn flywheels.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">STONK</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">TSLADOGE</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">NVDAAPE</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">ELONX</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500">
                High volatility • Automated fee buybacks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILT: 8 ARCHITECTURE PILLARS */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What We Built
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive, non-custodial Web3 equity wrapper designed for universal wallet compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-sm text-white">Zero-Friction Onboarding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Email login via Privy embedded wallets ensures users never see a seed phrase or wallet popup.
            </p>
          </div>

          {/* 2 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-sm text-white">Swipe-Based Discovery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time tokenized stock decks powered by metadata from tokens.xyz, PreStocks, Tessera, and StonkFun.
            </p>
          </div>

          {/* 3 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-sm text-white">Risk-Tiered Asset Modes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly switch between Conservative (blue chips), Balanced (pre-IPO), and Degen (equity memes).
            </p>
          </div>

          {/* 4 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="font-bold text-sm text-white">User-Bounded DCA Plans</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configurable per-swipe investment amounts with real-time live session budget tracking.
            </p>
          </div>

          {/* 5 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h4 className="font-bold text-sm text-white">Native Solana Composability</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Buy-now swaps, recurring DCA schedules, and limit orders built on Jupiter’s Swap, Recurring, and Trigger APIs.
            </p>
          </div>

          {/* 6 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              06
            </div>
            <h4 className="font-bold text-sm text-white">1-Confirmation Atomic Execution</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate baskets bundle every swap into a single Solana signature—either all succeed, or all revert.
            </p>
          </div>

          {/* 7 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
              07
            </div>
            <h4 className="font-bold text-sm text-white">Automated Compliance Filtering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backend sanitization layer that strips institutional KYC-restricted transfer hooks to guarantee non-reverting trades.
            </p>
          </div>

          {/* 8 */}
          <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/60 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
              08
            </div>
            <h4 className="font-bold text-sm text-white">Sustainable Wrapper Economics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent non-custodial order flow monetization aligned natively with the Jupiter Referral Program.
            </p>
          </div>
        </div>
      </section>

      {/* MANIFESTO / PHILOSOPHY QUOTE */}
      <section className="py-20 border-t border-white/5 bg-gradient-to-b from-[#0B0F19] to-[#070A12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-block text-4xl sm:text-5xl text-emerald-400 font-serif">“</div>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            Investing should be accessible.<br />
            Portfolio building should feel simple.<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              DCA should be fun.
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto pt-2 leading-relaxed">
            We built Swpper to bridge developing markets and global equities without the friction of legacy brokerages, wire fees, or intimidating trading terminals.
          </p>
        </div>
      </section>

      {/* FINAL CLIMAX CALL TO ACTION */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to assemble your equity basket?
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Launch Swpper on Solana Devnet. Configure your strategy in 30 seconds and start swiping.
            </p>
          </div>

          <div>
            <button
              onClick={handleLaunchApp}
              className="cursor-pointer px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-base shadow-2xl shadow-emerald-500/30 transition-all duration-200 hover:scale-105 inline-flex items-center gap-2.5"
            >
              <span>Launch Swpper App & Start Swiping</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="pt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Swpper</span>
              <span>• Swipe DCA for Tokenized Equities</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Solana Devnet Locked</span>
              <span>Jupiter DEX Route Simulation</span>
              <span>Zero Custody</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
