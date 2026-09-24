import { NextResponse } from "next/server";

// Next.js ISR: Revalidate this route and its fetches every 10 seconds
export const revalidate = 10;
export const dynamic = 'force-dynamic'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  try {
    const idArray = ids.split(",").filter(Boolean);
    const chunkSize = 50;
    let finalPrices: Record<string, number> = {};
    const apiKey = process.env.JUPITER_API_KEY || "";

    // 1. Chunk the requested IDs to respect Jupiter's 50 tokens per request limit
    for (let i = 0; i < idArray.length; i += chunkSize) {
      const chunk = idArray.slice(i, i + chunkSize);
      const chunkIds = chunk.join(",");

      // 2. Fetch chunk from Jupiter with native Next.js Data Cache
      // Vercel handles the Stale-While-Revalidate pattern automatically in the background
      const res = await fetch(`https://api.jup.ag/price/v3?ids=${chunkIds}`, {
        headers: apiKey ? { "x-api-key": apiKey } : {},
        next: { revalidate: 10 }
      });

      if (res.ok) {
        const data = await res.json();
        const priceObjects = data.data ? data.data : data;

        if (priceObjects && typeof priceObjects === 'object') {
          for (const [mint, info] of Object.entries(priceObjects) as any) {
            const priceVal = info?.usdPrice ?? info?.price;
            if (priceVal !== undefined) {
              finalPrices[mint] = typeof priceVal === "string" ? parseFloat(priceVal) : priceVal;
            }
          }
        }
      }

      // 3. Strict 2.1s delay between batches to respect free tier limits (1 req / 2s)
      if (i + chunkSize < idArray.length) {
        await new Promise(r => setTimeout(r, 2100));
      }
    }

    console.log(`[Backend Proxy] Served prices for ${Object.keys(finalPrices).length} out of ${idArray.length} requested IDs`);

    return NextResponse.json({ data: finalPrices });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
