export interface JupiterPriceMap {
  [mint: string]: number;
}

/**
 * Fetch live prices from Jupiter Price API v2
 * @param mints Array of mint addresses to fetch prices for
 * @returns Map of mint address to price in USD
 */
export async function fetchJupiterPrices(mints: string[]): Promise<JupiterPriceMap> {
  if (!mints || mints.length === 0) return {};

  try {
    // We can chunk at 100 to avoid URL length limits. 
    // The backend handles the actual Jupiter limits (50) and rate limits (2s).
    const chunkSize = 100;
    const priceMap: JupiterPriceMap = {};

    for (let i = 0; i < mints.length; i += chunkSize) {
      const chunk = mints.slice(i, i + chunkSize);
      const ids = chunk.join(",");
      
      try {
        const res = await fetch(`/api/prices?ids=${ids}`);
        if (!res.ok) throw new Error(`Jupiter API error: ${res.status}`);
        
        const data = await res.json();
        const priceObjects = data.data ? data.data : data;
        
        if (priceObjects && typeof priceObjects === 'object') {
          for (const [mint, priceVal] of Object.entries(priceObjects) as any) {
            if (priceVal !== undefined && priceVal !== null) {
              priceMap[mint] = typeof priceVal === "string" ? parseFloat(priceVal) : priceVal;
            }
          }
        }
      } catch (err) {
        console.error("Jupiter API proxy chunk error:", err);
      }
    }

    return priceMap;
  } catch (err) {
    console.error("Error fetching Jupiter prices:", err);
    return {};
  }
}
