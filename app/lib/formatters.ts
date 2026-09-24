/**
 * formatters.ts
 * Shared formatting utilities
 */

export function formatUsdPrice(price: number | undefined): string {
  if (price === undefined || price <= 0) return "---";

  // For extremely small meme coins (e.g., 0.00000345), use exponential notation
  // Or show up to 6 significant digits to avoid $0.0000
  if (price < 0.0001) {
    // If it's absurdly small, use scientific notation, otherwise just pad the decimals
    if (price < 0.000001) {
      return `$${price.toExponential(2)}`;
    }
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    })}`;
  }

  // Standard formatting for normal coins
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: price >= 100 ? 2 : price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 1 ? 2 : 4,
  })}`;
}
