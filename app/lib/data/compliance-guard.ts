import { StockToken } from "./stocks-catalog";

export interface ComplianceResult {
  isPermitted: boolean;
  reason?: string;
}

/**
 * Compliance Guardrail for Roaring Bulls Universal Wallet Compatibility
 *
 * Excludes institutional permissioned tokens utilizing Token-2022 Transfer Hooks
 * or identity registries (e.g., any token ending in '...ondo' or Securitize assets),
 * which cause immediate on-chain transaction reverts for non-KYC / embedded wallets.
 *
 * NOTE: As per design, StonkFun tokens bypass this filter entirely as they are
 * permissionless bonding curve / AMM pairs with zero KYC requirements.
 */
export function checkCompliance(token: Partial<StockToken>): ComplianceResult {
  // StonkFun tokens are permissionless meme bonding curves with zero KYC
  if (token.isStonkFun || token.tier === "degen") {
    return {
      isPermitted: true,
      reason: "StonkFun token: 100% permissionless Raydium bonding curve.",
    };
  }

  const mint = token.mint?.toLowerCase() || "";
  const name = token.name?.toLowerCase() || "";
  const ticker = token.ticker?.toLowerCase() || "";

  // 1. Exclude institutional Ondo tokenized equities / treasuries
  if (
    mint.endsWith("ondo") ||
    mint.includes(".ondo") ||
    name.includes("ondo") ||
    ticker.endsWith("on") // e.g. ABTon, ABBVon, ACNon, ADBEon
  ) {
    return {
      isPermitted: false,
      reason:
        "Excluded: Ondo tokenized asset requires institutional KYC transfer hook whitelist.",
    };
  }

  // 2. Exclude tokens flagged with active transfer hooks
  if (token.hasTransferHook) {
    return {
      isPermitted: false,
      reason:
        "Excluded: Token-2022 Transfer Hook detected with restrictive identity registry.",
    };
  }

  // 3. Explicitly allow Backed xStocks (starts with 'Xs' or has ticker ending in 'x')
  if (token.mint?.startsWith("Xs") || token.ticker?.endsWith("x")) {
    return {
      isPermitted: true,
      reason: "Permitted: Backed xStock certificate with permissionless DeFi transferability.",
    };
  }

  // 4. Explicitly allow PreStocks and Tessera T-Tokens
  if (token.isPreIPO || token.tier === "balanced") {
    return {
      isPermitted: true,
      reason: "Permitted: Private equity SPL / T-Token with permissionless wallet access.",
    };
  }

  // Default to permitted if no red flags are found
  return {
    isPermitted: true,
    reason: "Permitted: Pure SPL or non-restricted Token-2022 asset.",
  };
}

/**
 * Filter an array of stock tokens through the compliance guardrail
 */
export function filterCompliantStocks(tokens: StockToken[]): StockToken[] {
  return tokens.filter((token) => checkCompliance(token).isPermitted);
}
