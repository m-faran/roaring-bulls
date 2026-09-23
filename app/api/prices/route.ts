import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  try {
    const apiKey = process.env.JUPITER_API_KEY || "";
    
    const response = await fetch(`https://api.jup.ag/price/v3?ids=${ids}`, {
      headers: apiKey ? { 
        "x-api-key": apiKey 
      } : {},
      // Do not cache aggressively, these are live prices
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Jupiter: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Jupiter Response Keys:", Object.keys(data));
    console.log("Jupiter Response Preview:", JSON.stringify(data).substring(0, 200));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Jupiter prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch Jupiter prices" },
      { status: 500 }
    );
  }
}
