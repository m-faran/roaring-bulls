import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const list = searchParams.get("list");

  if (!list) {
    return NextResponse.json({ error: "Missing list parameter" }, { status: 400 });
  }

  try {
    // 1-hour cache for Stonkfun dynamic lists
    if (list === "stonkfun-mc") {
      const res = await fetch("https://www.stonkfun.xyz/api/public/v1/tokens?sort=marketcap", { next: { revalidate: 3600 } });
      return NextResponse.json(await res.json());
    }
    if (list === "stonkfun-new") {
      const res = await fetch("https://www.stonkfun.xyz/api/public/v1/tokens?sort=newest", { next: { revalidate: 3600 } });
      return NextResponse.json(await res.json());
    }

    const apiKey = process.env.TOKENS_API_KEY || "";
    const response = await fetch(`https://api.tokens.xyz/api/v2/lists/${list}`, {
      headers: apiKey ? { 
        "x-api-key": apiKey 
      } : {},
      next: { revalidate: 86400 } // 24-hour cache for static lists
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from tokens.xyz: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tokens metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens metadata" },
      { status: 500 }
    );
  }
}
