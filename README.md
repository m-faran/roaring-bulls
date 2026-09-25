# ROARING BULLS

- Traditional trading is boring. Roaring bulls makes trading fun. Roaring bulls offers a fixed-budget, swipe-based basket curation as a trading experience across tokenized equities on Solana (xstocks, pre-ipo stocks, t-stocks and stonkfun memestocks). Roaring bulls motto is that portfolio allocation should be fun, DCA should be fun, limit orders should be fun, inshort whole trading experience should be fun. Built on Next.js and powered by @solana/kit and Privy for a seamless, scalable, and frictionless user experience.

## DESCRIPTION

- Roaring bulls is a basket curation based trading application. Users have to do the following steps to start
- 1. Connect an existing wallet or signin/signup with email/google via Privy. For non web3 users, privy provisions frictionless onboarding.
- 2. Add funds.
- 3. Swipe based portfolio allocation starts it has 3 substeps
- *3.1* Users choose a currency to trade in $USDC vs $SOL.
- *3.2* Select a risk tier between conservative (blue chip xstocks), balanced (pre-ipo stocks, t-stocks) and degen (stonkfun memes).
- *3.3* Set a total session budget, and allocation per swipe.
- 4. And boom swiping starts, skip or check stocks.
- 5. If user wants stocks other than the swipe deck, user can use the search page where user can search from 100+ stocks (consisting of a mix of xstocks, pre-ipo stocks and stonkfun memes) and add them to the basket.
- 6. Once the basket is finalized. User can review the basket and execute the whole basket.

- The tokens are fetched from the api.tokens.xyz and stonkfun endpoints. The prices of the tokens are continously polled via jupiter price apis to make sure latest prices are reflected when trading and settlments are mocked for the demo in mainnet ready app settlement will happen via Jupiters quote and swap api.

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

Requires Node.js 24 or newer.

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/swpper
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet, and (on devnet) click **Airdrop 1 SOL** to fund it. Then try the actions. Need devnet SOL another way? [faucet.solana.com](https://faucet.solana.com/).

To use localnet, start a local validator in another terminal before selecting
**localnet**:

```shell
solana-test-validator
```

## What's Included

- **Wallet connection** via [`@solana/kit-plugin-wallet`](https://www.npmjs.com/package/@solana/kit-plugin-wallet) (wallet-standard discovery, auto-reconnect)
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Transfer SOL** with the [`@solana-program/system`](https://www.npmjs.com/package/@solana-program/system) kit plugin
- **Token actions** — create a mint, mint tokens, and transfer them with the [`@solana-program/token`](https://www.npmjs.com/package/@solana-program/token) kit plugin (associated token accounts created for you)
- **Add memo** with the [`@solana-program/memo`](https://www.npmjs.com/package/@solana-program/memo) kit plugin
- **Live balance** and **toast notifications** with explorer links
- **Tailwind CSS v4** with light/dark mode

## How it works

The app builds one kit client per selected cluster in [`app/lib/solana-client.ts`](app/lib/solana-client.ts) and provides it through `@solana/react`'s `ClientProvider`:

```ts
createClient()
  .use(walletSigner({ chain })) // wallet as payer + identity; must precede rpc
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl })) // rpc, subscriptions, getMinimumBalance, sendTransaction
  .use(rpcAirdrop()) // client.airdrop (non-mainnet)
  .use(systemProgram()) // client.system.instructions.transferSol
  .use(tokenProgram()) // client.token.instructions.{createMint,mintToATA,transferToATA}
  .use(memoProgram()); // client.memo.instructions.addMemo
```

Components read the client with `useClient()` and the connected wallet with the `@solana/kit-plugin-wallet/react` hooks (`useWallets`, `useConnect`, `useConnectedWallet`, `useDisconnect`). Sending is a single call — `client.sendTransaction([instruction])` for raw instructions, or `client.token.instructions.createMint({...}).sendTransaction()` for the token plugin's built-in instruction plans.

### Switching networks

A kit client is bound to one chain and RPC endpoint. The cluster dropdown rebuilds the client in a `useMemo` keyed on the cluster and hands the new instance to `ClientProvider`, which reprovisions the subtree. See [`app/lib/client-provider.tsx`](app/lib/client-provider.tsx).

## Testing

```shell
npm run test
```

The tests in [`tests/`](tests/) drive the real UI — click **Connect Wallet**, pick a wallet, fill in the transfer form, press **Send SOL** — and assert on-chain state before and after each click. Three pieces make that work without a browser or a wallet extension:

- **[`@solana/surfpool`](https://www.npmjs.com/package/@solana/surfpool)** embeds a [Surfpool](https://surfpool.run) Solana runtime in-process. Each test file boots its own surfnet on dynamic ports in well under a second, with cheatcodes to fund accounts (`surfnet.fundSol`), set token balances, deploy programs, and time travel. It's a native addon with prebuilt binaries for macOS (x64/arm64) and Linux x64.
- **A mock wallet-standard wallet** ([`tests/mock-wallet.ts`](tests/mock-wallet.ts)) registers itself like any browser extension would, so the app's real wallet discovery, connect flow, and transaction signing run unmodified — signatures come from an in-memory keypair.
- **[Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** render the actual app components in jsdom and interact with them by role and label, the same way a user would.

The tests point the app's client factory at the surfnet via the optional URL override on `createAppClient` — everything else (plugins, signing, subscriptions, live balance updates) is the production code path.
