"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { Check, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

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
      setDemoBasket((prev) =>
        prev.includes(asset.ticker) ? prev : [...prev, asset.ticker]
      );
    }
    setDemoCardIndex((i) => i + 1);
  };

  const handleLaunchApp = () => {
    setActiveTab("app");
  };

  const currentDemoAsset = demoAssets[demoCardIndex % demoAssets.length];

  return (
    <div className="w-full bg-transparent text-[#F0F6FC] selection:bg-[#00FF88] selection:text-[#05080E]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00FF88]/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-[#00F0FF]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-[#0A111F]/90 text-[#00FF88] text-xs font-mono font-bold backdrop-blur-md shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
            <span>SOLANA TOKENIZED EQUITIES • SWIPE-BASED DCA RITUAL</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-[1.06]">
              Invest in Global Equities.{" "}
              <span className="bg-gradient-to-r from-[#00FF88] via-[#00F0FF] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                One Swipe at a Time.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              In many developing markets, access to global stocks is fragmented, expensive, or entirely unavailable. Traditional tools make investing rigid and boring.{" "}
              <strong className="text-white font-semibold">Swpper</strong> offers a fixed-budget, swipe-based DCA ritual across tokenized equities on Solana.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchApp}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] font-display font-black text-sm shadow-[0_0_30px_rgba(0,255,136,0.45)] transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <span>Launch Swpper App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="cursor-pointer w-full sm:w-auto px-6 py-4 rounded-2xl border border-cyan-500/20 bg-[#0A111F] hover:bg-[#101A2E] text-slate-300 hover:text-white font-display font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:border-cyan-500/40"
            >
              <span>How the Ritual Works</span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </a>
          </div>

          {/* Live Micro-Features Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl border border-cyan-500/15 bg-[#0A111F]/80 backdrop-blur-md shadow-inner hover:border-cyan-500/30 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Non-Custodial
              </span>
              <p className="text-xs font-display font-bold text-white mt-1">
                Email Login via Privy
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-cyan-500/15 bg-[#0A111F]/80 backdrop-blur-md shadow-inner hover:border-cyan-500/30 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Execution
              </span>
              <p className="text-xs font-display font-bold text-[#00FF88] mt-1">
                Atomic Jupiter Swaps
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-cyan-500/15 bg-[#0A111F]/80 backdrop-blur-md shadow-inner hover:border-cyan-500/30 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Asset Universe
              </span>
              <p className="text-xs font-display font-bold text-white mt-1">
                3 Curated Risk Tiers
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-cyan-500/15 bg-[#0A111F]/80 backdrop-blur-md shadow-inner hover:border-cyan-500/30 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Guardrails
              </span>
              <p className="text-xs font-display font-bold text-[#00F0FF] mt-1">
                Auto Compliance Filter
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TEASER PREVIEW SECTION */}
      <section className="py-16 border-y border-cyan-500/20 bg-[#0A111F]/35 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Teaser description */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00FF88] font-bold">
                Interactive Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
                No complex order books. Just set a budget and swipe.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Define the boundaries of your investment session: your budget (e.g. 1 SOL or $50), your amount per swipe (e.g. 0.1 SOL or $5), and your risk tier. Then start swiping.
              </p>
              <div className="space-y-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-bold items-center justify-center text-[11px] shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>
                    <strong className="text-white font-semibold">Swipe Right:</strong> Allocates a fixed amount and locks into basket
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 rounded-full bg-[#FF1B6B]/20 text-[#FF1B6B] font-bold items-center justify-center text-[11px] shadow-[0_0_8px_rgba(255,27,107,0.3)]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>
                    <strong className="text-white font-semibold">Swipe Left:</strong> Skips to the next token in the curated deck
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] font-bold items-center justify-center text-[11px] shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>
                    <strong className="text-white font-semibold">Budget Lock:</strong> You can never exceed your pre-set session boundary
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLaunchApp}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-display font-bold text-[#00FF88] hover:text-[#00FF88]/80 transition group"
                >
                  <span>Open Full Investing Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Card Widget */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-cyan-500/30 bg-[#0A111F] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-4 relative overflow-hidden">
                {/* Corner HUD markers */}
                <span className="absolute top-2.5 left-2.5 text-[8px] font-mono text-cyan-500/30">
                  ┌
                </span>
                <span className="absolute top-2.5 right-2.5 text-[8px] font-mono text-cyan-500/30">
                  ┐
                </span>

                {/* Live Demo Header */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-cyan-500/15">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
                    <span className="text-slate-400">Session Budget:</span>
                  </div>
                  <span className="font-mono font-bold text-[#00FF88] tabular-nums">
                    {demoBudget.toFixed(2)} SOL Remaining
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 rounded-2xl border border-cyan-500/20 bg-[#05080E] space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-[#101A2E] p-1 flex items-center justify-center border border-cyan-500/20 overflow-hidden">
                        <img
                          src={currentDemoAsset.logo}
                          alt={currentDemoAsset.name}
                          className="h-full w-full object-contain rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">
                          {currentDemoAsset.name}
                        </h4>
                        <p className="text-[10px] text-cyan-400 font-mono">
                          {currentDemoAsset.ticker}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-mono font-bold shadow-[0_0_8px_rgba(0,255,136,0.2)]">
                      0.1 SOL
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 font-mono">
                    <span className="text-slate-400">{currentDemoAsset.tier}</span>
                    <span className="font-bold text-[#00FF88]">
                      {currentDemoAsset.change} (3M)
                    </span>
                  </div>
                </div>

                {/* Interactive Taps */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDemoSwipe("left")}
                    className="cursor-pointer py-2.5 rounded-xl border border-[#FF1B6B]/40 bg-[#FF1B6B]/10 hover:bg-[#FF1B6B]/20 text-[#FF1B6B] text-xs font-display font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,27,107,0.2)]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Skip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSwipe("right")}
                    className="cursor-pointer py-2.5 rounded-xl border border-[#00FF88]/50 bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] text-xs font-display font-black transition flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:scale-105"
                  >
                    <span>Add (0.1 SOL)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Demo Basket status */}
                <div className="text-center text-[11px] text-slate-400 font-mono">
                  <span>Basket: </span>
                  <strong className="text-white font-mono">
                    {demoBasket.length > 0
                      ? demoBasket.join(", ")
                      : "Empty (Tap Add)"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 3-STEP RITUAL SECTION */}
      <section
        id="how-it-works"
        className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12"
      >
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00FF88] font-bold">
            The Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            How the Swpper Ritual Works
          </h2>
          <p className="text-sm text-slate-400">
            A frictionless investing ritual engineered from the ground up for modern retail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 hover:border-[#00FF88]/50 hover:shadow-[0_0_25px_rgba(0,255,136,0.15)] transition-all duration-300 relative group">
            <div className="h-12 w-12 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] font-display font-black text-base shadow-[0_0_12px_rgba(0,255,136,0.25)]">
              01
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              Set Your Boundaries
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start by choosing your quote currency (SOL or USDC), total session budget, allocation per swipe, and risk tier (Conservative, Balanced, or Degen). Your parameters define the guardrails and automatically curate the deck.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 hover:border-[#00F0FF]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300 relative group">
            <div className="h-12 w-12 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] font-display font-black text-base shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              02
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              The Swipe Discovery
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Swipe right to allocate your fixed slice to an asset. Swipe left to skip it. Every decision stays safely within your budget while remaining capital updates live. Zero math anxiety, zero spreadsheet friction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 hover:border-[#A855F7]/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 relative group">
            <div className="h-12 w-12 rounded-2xl bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7] font-display font-black text-base shadow-[0_0_12px_rgba(168,85,247,0.25)]">
              03
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              1-Click Atomic Execution
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your execution method: **Buy Now** (instant basket execution), **Recurring SIP** (Jupiter DCA program), or **Limit Order** (dip trigger). All required swaps are packaged into a single atomic transaction routed through Jupiter.
            </p>
          </div>
        </div>
      </section>

      {/* 3 RISK-TIERED ASSET MODES SHOWCASE */}
      <section className="py-20 border-t border-cyan-500/20 bg-[#0A111F]/35 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00FF88] font-bold">
              Curated Universes
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              Three Risk-Tiered Asset Modes
            </h2>
            <p className="text-sm text-slate-400">
              Seamlessly switch between public blue chips, pre-IPO unicorns, and equity-paired memecoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conservative Card */}
            <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:border-[#00FF88]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-[11px] font-display font-bold">
                    Conservative Tier
                  </span>
                  <span className="text-xs font-mono text-cyan-400/70">
                    Backed xStocks
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Public Blue Chips & ETFs
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1:1 tokenized tracker certificates for public equities held in Swiss custody with 24/7 DeFi composability.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    TSLAx
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    NVDAx
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    AAPLx
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    SPYx
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    COINx
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/15 text-[11px] text-slate-500 font-mono">
                Low volatility • Audited custodial backing
              </div>
            </div>

            {/* Balanced Card */}
            <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:border-[#00F0FF]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-display font-bold">
                    Balanced Tier
                  </span>
                  <span className="text-xs font-mono text-cyan-400/70">
                    PreStocks & Tessera
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Pre-IPO Unicorns
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Private equity exposure via Cayman SPVs backed by on-chain Chainlink Proof-of-Reserve.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    SpaceX
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    OpenAI
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    Anthropic
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    Kalshi
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    Stripe
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/15 text-[11px] text-slate-500 font-mono">
                Moderate volatility • Chainlink PoR verified
              </div>
            </div>

            {/* Degen Card */}
            <div className="rounded-3xl border border-cyan-500/20 bg-[#0A111F] p-6 space-y-4 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:border-[#FF1B6B]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#FF1B6B]/15 border border-[#FF1B6B]/30 text-[#FF1B6B] text-[11px] font-display font-bold">
                    Degen Tier
                  </span>
                  <span className="text-xs font-mono text-cyan-400/70">
                    StonkFun LaunchLab
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Equity-Paired Memecoins
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Raydium bonding curves pairing meme liquidity directly against stocks, with 60% fee buyback & burn flywheels.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    STONK
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    TSLADOGE
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    NVDAAPE
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#05080E] border border-cyan-500/20 text-slate-300">
                    ELONX
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/15 text-[11px] text-slate-500 font-mono">
                High volatility • Automated fee buybacks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILT: 8 ARCHITECTURE PILLARS */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00FF88] font-bold">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            What We Built
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive, non-custodial Web3 equity wrapper designed for universal wallet compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(0,255,136,0.2)]">
              01
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Zero-Friction Onboarding
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Email login via Privy embedded wallets ensures users never see a seed phrase or wallet popup.
            </p>
          </div>

          {/* 2 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              02
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Swipe-Based Discovery
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time tokenized stock decks powered by metadata from tokens.xyz, PreStocks, Tessera, and StonkFun.
            </p>
          </div>

          {/* 3 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(168,85,247,0.2)]">
              03
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Risk-Tiered Asset Modes
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly switch between Conservative (blue chips), Balanced (pre-IPO), and Degen (equity memes).
            </p>
          </div>

          {/* 4 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(255,184,0,0.2)]">
              04
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              User-Bounded DCA Plans
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configurable per-swipe investment amounts with real-time live session budget tracking.
            </p>
          </div>

          {/* 5 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(99,102,241,0.2)]">
              05
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Native Solana Composability
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Buy-now swaps, recurring DCA schedules, and limit orders built on Jupiter’s Swap, Recurring, and Trigger APIs.
            </p>
          </div>

          {/* 6 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(0,255,136,0.2)]">
              06
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              1-Confirmation Atomic Execution
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate baskets bundle every swap into a single Solana signature—either all succeed, or all revert.
            </p>
          </div>

          {/* 7 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(20,184,166,0.2)]">
              07
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Automated Compliance Filtering
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backend sanitization layer that strips institutional KYC-restricted transfer hooks to guarantee non-reverting trades.
            </p>
          </div>

          {/* 8 */}
          <div className="p-5 rounded-3xl border border-cyan-500/20 bg-[#0A111F] space-y-2.5 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#FF1B6B]/15 border border-[#FF1B6B]/30 text-[#FF1B6B] flex items-center justify-center font-display font-bold text-xs shadow-[0_0_8px_rgba(255,27,107,0.2)]">
              08
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Sustainable Wrapper Economics
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent non-custodial order flow monetization aligned natively with the Jupiter Referral Program.
            </p>
          </div>
        </div>
      </section>

      {/* MANIFESTO / PHILOSOPHY QUOTE */}
      <section className="py-20 border-t border-cyan-500/20 bg-gradient-to-b from-[#0A111F]/30 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-block text-4xl sm:text-5xl text-[#00FF88] font-serif">
            “
          </div>
          <h3 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-snug">
            Investing should be accessible.<br />
            Portfolio building should feel simple.<br />
            <span className="bg-gradient-to-r from-[#00FF88] via-[#00F0FF] to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              DCA should be fun.
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto pt-2 leading-relaxed font-mono">
            We built Swpper to bridge developing markets and global equities without the friction of legacy brokerages, wire fees, or intimidating trading terminals.
          </p>
        </div>
      </section>

      {/* FINAL CLIMAX CALL TO ACTION */}
      <section className="py-20 border-t border-cyan-500/20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              Ready to assemble your equity basket?
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Launch Swpper on Solana Devnet. Configure your strategy in 30 seconds and start swiping.
            </p>
          </div>

          <div>
            <button
              onClick={handleLaunchApp}
              className="cursor-pointer px-10 py-4 rounded-2xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#05080E] font-display font-black text-base shadow-[0_0_35px_rgba(0,255,136,0.5)] transition-all duration-200 hover:scale-105 inline-flex items-center gap-2.5"
            >
              <span>Launch Swpper App & Start Swiping</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cyan-500/15 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white">Swpper</span>
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
