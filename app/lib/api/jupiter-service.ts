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
    // Jupiter Price API v3 explicitly limits requests to a maximum of 50 token IDs per call
    const chunkSize = 50;
    const priceMap: JupiterPriceMap = {};
    const promises = [];

    for (let i = 0; i < mints.length; i += chunkSize) {
      const chunk = mints.slice(i, i + chunkSize);
      const ids = chunk.join(",");
      
      const p = fetch(`/api/prices?ids=${ids}`)
        .then(res => {
          if (!res.ok) throw new Error(`Jupiter API error: ${res.status}`);
          return res.json();
        })
        .then(data => {
          // Jupiter v3 returns a direct map of mints to objects, NOT wrapped in { data: ... }
          const priceObjects = data.data ? data.data : data;
          if (priceObjects && typeof priceObjects === 'object') {
            for (const [mint, info] of Object.entries(priceObjects) as any) {
              const priceVal = info?.usdPrice ?? info?.price;
              if (priceVal !== undefined) {
                priceMap[mint] = typeof priceVal === "string" ? parseFloat(priceVal) : priceVal;
              }
            }
          }
        });
      
      promises.push(p);
    }

    await Promise.all(promises);

    return priceMap;
  } catch (err) {
    console.error("Error fetching Jupiter prices:", err);
    return {};
  }
}
