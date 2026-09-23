import { NextResponse } from "next/server";

export const revalidate = 86400; // Cache for 24 hours since metadata rarely changes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const list = searchParams.get("list");

  if (!list) {
    return NextResponse.json({ error: "Missing list parameter" }, { status: 400 });
  }

  try {
    const apiKey = process.env.TOKENS_API_KEY || "";
    const response = await fetch(`https://api.tokens.xyz/api/v2/lists/${list}`, {
      headers: apiKey ? { 
        "x-api-key": apiKey 
      } : {}
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
