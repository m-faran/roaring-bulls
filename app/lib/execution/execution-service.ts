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

    // If connected wallet signer is available, build and send real on-chain transaction
    if (rawSigner && client) {
      const tx = await client.memo.instructions
        .addMemo({
          memo: memoContent,
          signers: [rawSigner],
        })
        .sendTransaction();

      signature = tx.context.signature;
    } else {
      // Offline / unauthenticated demo fallback
      const randomBytes = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      signature = `sim_${randomBytes.slice(0, 40)}`;
    }

    const clusterSuffix =
      cluster === "mainnet" ? "" : `?cluster=${cluster}`;
    const explorerUrl = `https://explorer.solana.com/tx/${signature}${clusterSuffix}`;

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
