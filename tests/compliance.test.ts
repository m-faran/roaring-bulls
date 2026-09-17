import { describe, it, expect } from "vitest";
import { checkCompliance, filterCompliantStocks } from "../app/lib/data/compliance-guard";
import { STOCKS_CATALOG, StockToken } from "../app/lib/data/stocks-catalog";

describe("Compliance Guardrail", () => {
  it("strictly excludes institutional Ondo tokenized equities with transfer hooks", () => {
    const ondoTokens: Partial<StockToken>[] = [
      {
        id: "abton",
        name: "Abbott (Ondo Tokenized)",
        ticker: "ABTon",
        mint: "129gM3YwZkR9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yUondo",
        tier: "conservative",
      },
      {
        id: "abbvon",
        name: "AbbVie (Ondo Tokenized)",
        ticker: "ABBVon",
        mint: "MFerM3YwZkR9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yUondo",
        tier: "conservative",
      },
      {
        id: "usdy",
        name: "Ondo US Dollar Yield",
        ticker: "USDY",
        mint: "A1KxZkR9jT2M1K6X8wR5qP7Z4vC2bN0mQ9yUondo",
        hasTransferHook: true,
        tier: "conservative",
      },
    ];

    for (const token of ondoTokens) {
      const result = checkCompliance(token);
      expect(result.isPermitted).toBe(false);
      expect(result.reason).toContain("Excluded");
    }
  });

  it("permits Backed xStocks without restrictive transfer hooks", () => {
    const xStock = {
      id: "tslax",
      name: "Tesla xStock",
      ticker: "TSLAx",
      mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
      tier: "conservative" as const,
      hasTransferHook: false,
    };

    const result = checkCompliance(xStock);
    expect(result.isPermitted).toBe(true);
  });

  it("bypasses compliance check for StonkFun meme tokens per design requirement", () => {
    const stonkToken = {
      id: "stonk",
      name: "StonkFun Native",
      ticker: "STONK",
      mint: "6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx",
      tier: "degen" as const,
      isStonkFun: true,
    };

    const result = checkCompliance(stonkToken);
    expect(result.isPermitted).toBe(true);
    expect(result.reason).toContain("StonkFun");
  });

  it("correctly filters the catalog and retains all compliant assets", () => {
    const compliant = filterCompliantStocks(STOCKS_CATALOG);
    expect(compliant.length).toBeGreaterThanOrEqual(10);
    expect(compliant.some((s) => s.ticker === "TSLAx")).toBe(true);
    expect(compliant.some((s) => s.ticker === "OPENAI")).toBe(true);
    expect(compliant.some((s) => s.ticker === "STONK")).toBe(true);
    expect(compliant.some((s) => s.ticker.endsWith("on"))).toBe(false);
  });
});
