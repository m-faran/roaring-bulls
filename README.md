# ROARING BULLS

- Traditional trading is boring. Roaring bulls makes trading fun. Roaring bulls offers a fixed-budget, swipe-based basket curation as a trading experience across tokenized equities on Solana (xstocks, pre-ipo stocks, t-stocks and stonkfun memestocks). Roaring bulls motto is that portfolio allocation should be fun, DCA should be fun, limit orders should be fun, inshort whole trading experience should be fun. Built on Next.js and powered by @solana/kit and Privy for a seamless, scalable, and frictionless user experience.

## DESCRIPTION

Roaring Bulls is a basket-curation trading application. To get started, users follow these steps:

1. Connect an existing wallet or sign in/sign up with email or Google via Privy. For non-Web3 users, Privy provides frictionless onboarding.
2. Add funds.
3. Start the swipe-based portfolio allocation flow. This has three substeps:
   1. Choose a currency to trade in: $USDC vs $SOL.
   2. Select a risk tier: conservative (blue-chip xstocks), balanced (pre-IPO stocks, t-stocks), or degen (stonkfun memes).
   3. Set a total session budget and allocation per swipe.
4. Begin swiping: skip, check, or pass on stocks.
5. If a user wants assets outside the swipe deck, they can use the search page to browse 100+ stocks (a mix of xstocks, pre-IPO stocks, and stonkfun memes) and add them to the basket.
6. Once the basket is finalized, the user can review it and execute the entire basket.

- The tokens are fetched from the api.tokens.xyz and stonkfun endpoints. Their prices are continuously polled via Jupiter price APIs to ensure the latest prices are reflected during trading, while settlements are mocked for the demo. In a mainnet-ready app, settlement would happen via Jupiter's quote and swap APIs.

### BUSINESS MODEL & PRODUCT MARKET FIT

Since Roaring Bulls aggregates liquidity and tokens from various protocols (tokens.xyz, stonkfun, xstocks, jupiter), the platform is positioned to generate revenue through the follwing streams:

1. **Transaction Fees:** A flat 0.1% platform fee applied on top of all executions (swaps, limit orders, DCA). Given the gamified, high-frequency nature of swipe-based trading, this micro-fee scales rapidly with volume.
2. **Protocol Partnerships:** B2B partnerships with token issuers and underlying protocols for featured placements, sponsored decks, or shared liquidity incentives.
3. **Platform-Native Offerings:** Launching or incubating exclusive, high-demand assets (like verified community memestocks or themed index baskets) directly on the platform to drive exclusive volume and capture primary market fees.

### TECHNICAL ARCHITECTURE

- **Scalable Backend:** Built on Next.js App Router deployed on Vercel, utilizing serverless API routes to ensure high availability and scale.
- **Smart Data Caching:** To handle continuous token price polling and respect Jupiter API rate limits (like the 50 tokens per request and strict rate limits), the backend employs Next.js Data Caching with Stale-While-Revalidate (ISR). Requests are batched, spaced out, and cached at the edge, drastically reducing API load and ensuring rapid price delivery to clients.
- **Streamlined Solana Integration:** Built using the modern `@solana/kit` and `@solana/react` packages for a robust, future-proof interaction with the Solana blockchain.

### LIMITATIONS

- The stock prices are real but the executions are simulation mocks (not even executed on devnet they are total simulation mocks). No jupiter quote and swap apis are used.
- The claims of atomic execution cant work for more than 2-3 stocks in a basket due to bytes limit of jupiter in that case the whole basket operation will be performed in queue. (None of this is implemented yet, the app uses mock simulations for transactions.)
- Despite the claim by the UI the current version only supports $SOL for trading currency.
- The swipe deck page only shows 26 stocks in conservative tier, 8 stocks in balanced tier and 20 stocks in degen tier.
- The search page only shows 136 stocks (78 xstocks, 6 pre-ipo + 2 t-stocks, and 50 stonkfun memestocks).


## Getting Started

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

You can also just use the demo at [https://roaring-bulls.vercel.app/](https://roaring-bulls.vercel.app/)

## Directory Structure

- `app/` - Next.js application code, including UI components, pages, and data hooks.
- `assets/` - Static assets like images and icons.
- `public/` - Public assets served by Next.js.
- `tests/` - Unit tests for the application's core logic.
- `plans/` & `prompts/` - Agent configuration and AI-related metadata.

---

**Warning:** All rights reserved. This code may not be copied, modified, or distributed without explicit permission.
