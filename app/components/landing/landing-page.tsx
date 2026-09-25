"use client";

import React, { useState } from "react";
import { useBasket } from "@/app/lib/store/basket-context";
import { Check, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

const TICKER_ITEMS = [
  "TSLAx +14.85%",
  "NVDAx +28.40%",
  "SPACEX +22.40%",
  "OPENAI +35.80%",
  "NVDAAPE +98.40%",
  "AAPLx +6.12%",
  "SPYx +9.77%",
  "STONK +41.03%",
];

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
      accent: "bg-sol-violet",
      logo: "https://unavatar.io/spacex.com",
    },
    {
      ticker: "TSLAx",
      name: "Tesla, Inc.",
      tier: "Conservative • Blue Chip",
      price: "$242.84",
      change: "+14.8%",
      accent: "bg-sol-green",
      logo: "https://unavatar.io/tesla.com",
    },
    {
      ticker: "OPENAI",
      name: "OpenAI (T-OpenAI)",
      tier: "Balanced • Pre-IPO",
      price: "$157.00",
      change: "+35.8%",
      accent: "bg-sol-violet",
      logo: "https://unavatar.io/openai.com",
    },
    {
      ticker: "NVDAAPE",
      name: "Nvidia Ape (StonkFun)",
      tier: "Degen • Meme Paired",
      price: "$0.0145",
      change: "+98.4%",
      accent: "bg-sol-pink",
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
    <div className="paper-texture w-full text-ink selection:bg-sol-yellow selection:text-ink">
      {/* ============ TICKER MARQUEE ============ */}
      <div className="overflow-hidden border-b-[3px] border-ink bg-ink py-2">
        <div className="ticker-track font-mono text-xs font-bold uppercase tracking-wider text-paper">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {TICKER_ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="mx-6 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-sol-green" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ HERO: asymmetric desk ============ */}
      <section className="relative overflow-hidden">
        {/* halftone patch, top right */}
        <div className="halftone pointer-events-none absolute -right-10 -top-10 h-72 w-72 rotate-12 opacity-20" />
        {/* green blob sticker, left */}
        <div className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rotate-6 rounded-full bg-sol-green opacity-20" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Headline block */}
            <div className="space-y-8 lg:col-span-7">
              <span className="ink-border-thin ink-shadow-sm inline-block -rotate-2 bg-sol-yellow px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest">
                Solana tokenized equities • swipe-based DCA ritual
              </span>

              <h1 className="text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                INVEST IN
                <br />
                GLOBAL EQUITIES.
                <br />
                <span className="ink-border ink-shadow inline-block rotate-1 bg-sol-green px-3 pb-1">
                  ONE BASKET
                </span>{" "}
                AT A TIME.
              </h1>

              <p className="max-w-xl text-base leading-relaxed sm:text-lg">
                Traditional trading makes investing rigid and boring.
                <strong>Roaring Bulls makes trading fun</strong> by offering a fixed-budget,
                swipe-based basket curation for onchain solana stocks.
              </p>

              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <button
                  onClick={handleLaunchApp}
                  className="ink-border ink-shadow ink-press inline-flex w-full cursor-pointer items-center justify-center gap-2.5 bg-sol-green px-8 py-4 text-sm font-bold uppercase tracking-wide sm:w-auto"
                >
                  <span>Launch Roaring Bulls App</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </button>

                <a
                  href="#how-it-works"
                  className="ink-border-thin ink-press inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-paper-white px-6 py-4 text-sm font-bold sm:w-auto"
                >
                  <span>How the Ritual Works</span>
                  <ChevronDown className="h-4 w-4" strokeWidth={3} />
                </a>
              </div>
            </div>

            {/* Stamp sticker column */}
            <div className="flex items-center justify-center lg:col-span-5">
              <div className="ink-border ink-shadow-lg w-full max-w-[440px] -rotate-2 bg-paper-white p-6 sm:p-8">
                <div className="aspect-square w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
                  <img
                    src="/logo-light.png"
                    alt="Roaring Bulls logo"
                    className="h-full w-full object-contain dark:hidden"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
                  <img
                    src="/logo-dark.png"
                    alt=""
                    aria-hidden="true"
                    className="hidden h-full w-full object-contain dark:block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature stickers */}
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                label: "Non-Custodial",
                value: "Email Login via Privy",
                bg: "bg-paper-white",
                tilt: "-rotate-1",
              },
              {
                label: "Execution",
                value: "Atomic Jupiter Swaps",
                bg: "bg-sol-green",
                tilt: "rotate-1",
              },
              {
                label: "Asset Universe",
                value: "3 Curated Risk Tiers",
                bg: "bg-paper-white",
                tilt: "-rotate-1",
              },
              {
                label: "Guardrails",
                value: "Auto Compliance Filter",
                bg: "bg-sol-yellow",
                tilt: "rotate-1",
              },
            ].map((f) => (
              <div
                key={f.label}
                className={`ink-border ink-shadow-sm ${f.bg} ${f.tilt} p-4 transition-transform duration-200 hover:rotate-0`}
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">
                  {f.label}
                </span>
                <p className="mt-1 text-sm font-bold">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE DEMO: paper ticket ============ */}
      <section className="border-y-[3px] border-ink bg-paper-deep">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left: copy */}
            <div className="space-y-5 lg:col-span-6">
              <span className="ink-border-thin ink-shadow-sm inline-block rotate-1 bg-sol-pink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">
                Interactive Experience
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                No complex order books. Just set a budget and swipe.
              </h2>
              <p className="max-w-lg leading-relaxed">
                Define the boundaries of your investment session: your budget (e.g. 1
                SOL or $50), your amount per swipe (e.g. 0.1 SOL or $5), and your risk
                tier. Then start swiping.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  {
                    bg: "bg-sol-green",
                    label: "Swipe Right:",
                    text: "Allocates a fixed amount and locks into basket",
                  },
                  {
                    bg: "bg-sol-pink",
                    label: "Swipe Left:",
                    text: "Skips to the next token in the curated deck",
                  },
                  {
                    bg: "bg-sol-violet",
                    label: "Budget Lock:",
                    text: "You can never exceed your pre-set session boundary",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`ink-border-thin flex h-6 w-6 shrink-0 items-center justify-center ${row.bg}`}
                    >
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={4} />
                    </span>
                    <span>
                      <strong>{row.label}</strong> {row.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLaunchApp}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold underline decoration-sol-green decoration-4 underline-offset-4 hover:decoration-ink"
                >
                  <span>Open Full Investing Terminal</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Right: paper ticket demo */}
            <div className="flex flex-col items-center justify-center lg:col-span-6">
              <div className="ink-border ink-shadow-lg w-full max-w-sm bg-paper-white">
                {/* Ticket stub header */}
                <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                    Roaring Bulls • Demo Ticket
                  </span>
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-sol-pink" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sol-yellow" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sol-green" />
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  {/* Budget row */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-3 font-mono text-xs">
                    <span className="uppercase tracking-wider">Session Budget:</span>
                    <span className="font-bold tabular-nums">
                      {demoBudget.toFixed(2)} SOL LEFT
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="ink-border-thin ink-shadow-sm bg-paper p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`ink-border-thin ${currentDemoAsset.accent} flex h-10 w-10 items-center justify-center overflow-hidden p-1`}
                        >
                          <img
                            src={currentDemoAsset.logo}
                            alt={currentDemoAsset.name}
                            className="h-full w-full rounded-sm object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{currentDemoAsset.name}</h4>
                          <p className="font-mono text-[10px] font-bold uppercase opacity-60">
                            {currentDemoAsset.ticker}
                          </p>
                        </div>
                      </div>
                      <span className="ink-border-thin bg-sol-green px-2 py-0.5 font-mono text-xs font-bold">
                        0.1 SOL
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-ink pt-2 font-mono text-xs">
                      <span className="uppercase opacity-70">
                        {currentDemoAsset.tier}
                      </span>
                      <span className="font-bold">{currentDemoAsset.change} (3M)</span>
                    </div>
                  </div>

                  {/* Interactive taps */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleDemoSwipe("left")}
                      className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center justify-center gap-1.5 bg-sol-pink py-2.5 text-xs font-bold uppercase tracking-wide text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={3} />
                      <span>Skip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSwipe("right")}
                      className="ink-border ink-shadow-sm ink-press flex cursor-pointer items-center justify-center gap-1.5 bg-sol-green py-2.5 text-xs font-bold uppercase tracking-wide"
                    >
                      <span>Add (0.1 SOL)</span>
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Demo Basket status */}
                  <div className="text-center font-mono text-[11px] uppercase tracking-wide">
                    <span className="opacity-70">Basket: </span>
                    <strong>
                      {demoBasket.length > 0
                        ? demoBasket.join(", ")
                        : "Empty (Tap Add)"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE 3-STEP RITUAL ============ */}
      <section id="how-it-works" className="relative">
        <div className="halftone pointer-events-none absolute left-1/4 top-0 h-40 w-40 -rotate-6 opacity-15" />
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6">
          <div className="max-w-2xl space-y-3">
            <span className="ink-border-thin ink-shadow-sm inline-block -rotate-1 bg-paper-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest">
              The Flow
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How the Roaring Bulls Ritual Works
            </h2>
            <p>
              A frictionless investing ritual engineered from the ground up for modern
              retail.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                bg: "bg-sol-yellow",
                tilt: "md:-rotate-1",
                title: "Set Your Boundaries",
                body: (
                  <>
                    Start by choosing your quote currency (SOL or USDC), total session
                    budget, allocation per swipe, and risk tier (Conservative, Balanced,
                    or Degen). Your parameters define the guardrails and automatically
                    curate the deck.
                  </>
                ),
              },
              {
                num: "02",
                bg: "bg-sol-green",
                tilt: "md:rotate-1",
                title: "The Swipe Discovery",
                body: (
                  <>
                    Swipe right to allocate your fixed slice to an asset. Swipe left to
                    skip it. Every decision stays safely within your budget while
                    remaining capital updates live. Zero math anxiety, zero spreadsheet
                    friction.
                  </>
                ),
              },
              {
                num: "03",
                bg: "bg-sol-violet",
                tilt: "md:-rotate-1",
                title: "1-Click Atomic Execution",
                body: (
                  <>
                    Select your execution method: <strong>Buy Now</strong> (instant
                    basket execution), <strong>Recurring SIP</strong> (Jupiter DCA
                    program), or <strong>Limit Order</strong> (dip trigger). All
                    required swaps are packaged into a single atomic transaction routed
                    through Jupiter.
                  </>
                ),
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`ink-border ink-shadow ${step.tilt} space-y-4 bg-paper-white p-6 transition-transform duration-200 hover:rotate-0`}
              >
                <div
                  className={`ink-border-thin flex h-12 w-12 items-center justify-center ${step.bg} text-lg font-bold`}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed opacity-80">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3 RISK-TIERED ASSET MODES ============ */}
      <section className="border-y-[3px] border-ink bg-paper-deep">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6">
          <div className="max-w-2xl space-y-3">
            <span className="ink-border-thin ink-shadow-sm inline-block rotate-1 bg-sol-green px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest">
              Curated Universes
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three Risk-Tiered Asset Modes
            </h2>
            <p>
              Seamlessly switch between public blue chips, pre-IPO unicorns, and
              equity-paired memecoins.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                badge: "Conservative Tier",
                badgeBg: "bg-sol-green",
                source: "Backed xStocks",
                title: "Public Blue Chips & ETFs",
                body: "1:1 tokenized tracker certificates for public equities held in Swiss custody with 24/7 DeFi composability.",
                tickers: ["TSLAx", "NVDAx", "AAPLx", "SPYx", "COINx"],
                foot: "Low volatility • Audited custodial backing",
                tilt: "md:-rotate-2",
              },
              {
                badge: "Balanced Tier",
                badgeBg: "bg-sol-violet",
                source: "PreStocks & Tessera",
                title: "Pre-IPO Unicorns",
                body: "Private equity exposure via Cayman SPVs backed by on-chain Chainlink Proof-of-Reserve.",
                tickers: ["SpaceX", "OpenAI", "Anthropic", "Kalshi", "Stripe"],
                foot: "Moderate volatility • Chainlink PoR verified",
                tilt: "md:rotate-1",
              },
              {
                badge: "Degen Tier",
                badgeBg: "bg-sol-pink",
                source: "StonkFun LaunchLab",
                title: "Equity-Paired Memecoins",
                body: "Raydium bonding curves pairing meme liquidity directly against stocks, with 60% fee buyback & burn flywheels.",
                tickers: ["STONK", "TSLADOGE", "NVDAAPE", "ELONX"],
                foot: "High volatility • Automated fee buybacks",
                tilt: "md:rotate-2",
              },
            ].map((tier) => (
              <div
                key={tier.badge}
                className={`ink-border ink-shadow ${tier.tilt} flex flex-col justify-between bg-paper-white p-6 transition-transform duration-200 hover:rotate-0`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`ink-border-thin ${tier.badgeBg} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white`}
                    >
                      {tier.badge}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase opacity-60">
                      {tier.source}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{tier.title}</h3>
                  <p className="text-sm leading-relaxed opacity-80">{tier.body}</p>
                  <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px] font-bold">
                    {tier.tickers.map((t) => (
                      <span
                        key={t}
                        className="ink-border-thin bg-paper px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t-2 border-dashed border-ink pt-3 font-mono text-[11px] uppercase opacity-70">
                  {tier.foot}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO: taped poster ============ */}
      <section className="border-t-[3px] border-ink bg-paper-deep">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="ink-border ink-shadow-lg relative mx-auto max-w-2xl bg-paper-white px-8 py-16 sm:px-12 sm:py-20">
            {/* tape strips */}
            <span
              aria-hidden="true"
              className="absolute -top-3 left-10 h-7 w-24 -rotate-6 bg-sol-yellow opacity-80"
            />
            <span
              aria-hidden="true"
              className="absolute -top-3 right-10 h-7 w-24 rotate-6 bg-sol-green opacity-80"
            />
            <div className="space-y-6">
              <div className="font-mono text-4xl font-bold text-sol-green">“</div>
              <h3 className="text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
                Investing should be frictionless.
                <br />
                DCA n Limit Orders  should feel simple.
                <br />
                <span className="inline-block -rotate-1 bg-sol-yellow px-2">
                  Portfolio building should be fun.
                </span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-sol-violet">
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-20 text-center text-white sm:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to assemble your equity basket?
            </h2>
            <p className="mx-auto max-w-lg text-sm opacity-90 sm:text-base">
              Launch Roaring Bulls on Solana Devnet. Configure your strategy in 30 seconds and
              start swiping.
            </p>
          </div>

          <div>
            <button
              onClick={handleLaunchApp}
              className="ink-border ink-shadow-lg ink-press inline-flex cursor-pointer items-center gap-2.5 bg-sol-green px-10 py-4 text-base font-bold uppercase tracking-wide text-ink"
            >
              <span>Launch Roaring Bulls App & Start Swiping</span>
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-dashed border-white/40 pt-10 font-mono text-xs sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-bold">Roaring Bulls</span>
              <span className="opacity-70">
                • Basket curation based portfolio allocation for Tokenized Equities
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-wide opacity-80">
              <span>Solana Devnet Locked</span>
              <span>Jupiter DEX Route Simulation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
