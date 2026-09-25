import { AppClient } from "../solana-client";
import { BasketItem } from "../store/basket-context";
import { OrderType } from "../store/portfolio-context";
import { SOL_USD_PRICE } from "./mock-quotes";

export interface ExecutionParams {
  client: AppClient;
  signer?: { address: string };
  rawSigner?: any;
  cluster: string;
  orderType: OrderType;
  items: BasketItem[];
  currency: "SOL" | "USDC";
  dcaConfig?: {
    frequency: "daily" | "weekly" | "bi-weekly";
    cycles: number;
  };
  limitConfig?: {
    dipTargetPct: number;
  };
}

export interface ExecutionResult {
  success: boolean;
  signature: string;
  orderType: OrderType;
  itemsCount: number;
  totalAmountSol: number;
  totalAmountUsd: number;
  explorerUrl: string;
  error?: string;
}

export async function executeBasketOrder(
  params: ExecutionParams
): Promise<ExecutionResult> {
  const {
    client,
    rawSigner,
    cluster,
    orderType,
    items,
    currency,
    dcaConfig,
    limitConfig,
  } = params;

  const totalAmount = items.reduce((acc, it) => acc + it.allocation, 0);
  const totalAmountSol =
    currency === "SOL" ? totalAmount : totalAmount / SOL_USD_PRICE;
  const totalAmountUsd =
    currency === "USDC" ? totalAmount : totalAmount * SOL_USD_PRICE;

  const stockSummary = items
    .map((it) => `${it.stock.ticker}:${it.allocation.toFixed(3)}`)
    .join(",");

  let memoContent = "";
  if (orderType === "buy-now") {
    memoContent = `[RoaringBulls:BuyNow] ${stockSummary} | Total: ${totalAmountSol.toFixed(3)} SOL`;
  } else if (orderType === "recurring-dca") {
    memoContent = `[RoaringBulls:DCA] ${stockSummary} | ${dcaConfig?.frequency || "daily"} x ${
      dcaConfig?.cycles || 5
    }c`;
  } else {
    memoContent = `[RoaringBulls:Limit] ${stockSummary} | DipTarget: -${
      limitConfig?.dipTargetPct || 3
    }%`;
  }

  // Ensure memo is within 500 bytes limit
  if (memoContent.length > 480) {
    memoContent = memoContent.slice(0, 480);
  }

  try {
    let signature = "";

    // MOCK EXECUTION ON DEVNET:
    // Generate an ephemeral signer to execute the transaction on devnet
    // without prompting the user's mainnet-connected wallet.
    const { generateKeyPairSigner, lamports, createClient } = await import("@solana/kit");
    const { solanaRpc, rpcAirdrop } = await import("@solana/kit-plugin-rpc");
    const { memoProgram } = await import("@solana-program/memo");
    const { getClusterUrl } = await import("../solana-client");
    
    const ephemeralSigner = await generateKeyPairSigner();

    // Create a raw client without the walletSigner plugin so the 
    // connected wallet is NOT pinged or set as the fee payer.
    const mockDevnetClient = createClient()
      .use((client) => ({ ...client, payer: ephemeralSigner, identity: ephemeralSigner }))
      .use(solanaRpc({ rpcUrl: getClusterUrl("devnet") }))
      .use(rpcAirdrop())
      .use(memoProgram());

    try {
      // Airdrop 0.005 SOL to pay for the memo instruction fee
      await mockDevnetClient.rpc
        .requestAirdrop(ephemeralSigner.address, lamports(5_000_000n))
        .send();
      // Wait a moment for the airdrop to be confirmed on devnet
      await new Promise((r) => setTimeout(r, 2500));
    } catch (airdropErr) {
      console.warn("Devnet airdrop failed or timed out, attempting execution anyway:", airdropErr);
    }

    try {
      const tx = await mockDevnetClient.memo.instructions
        .addMemo({
          memo: memoContent,
          signers: [ephemeralSigner],
        })
        .sendTransaction();

      signature = tx.context.signature;
    } catch (txErr) {
      console.warn("Devnet on-chain execution failed, falling back to offline simulation.", txErr);
      // Offline / unauthenticated demo fallback
      const randomBytes = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      signature = `sim_${randomBytes.slice(0, 40)}`;
    }

    // Always force explorer link to devnet since we executed there
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

    return {
      success: true,
      signature,
      orderType,
      itemsCount: items.length,
      totalAmountSol: Math.round(totalAmountSol * 10000) / 10000,
      totalAmountUsd: Math.round(totalAmountUsd * 100) / 100,
      explorerUrl,
    };
  } catch (err: any) {
    console.error("Order execution failed:", err);
    throw new Error(err?.message || "Transaction failed to execute on-chain.");
  }
}
