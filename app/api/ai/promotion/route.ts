// API: GET /api/ai/promotion?playerId=...
// Vurder kategori-opprykk

import { NextResponse } from "next/server";
import { checkPromotion, McpError } from "@/lib/mcp-client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json(
        { error: "playerId er påkrevd" },
        { status: 400 }
      );
    }

    const result = await checkPromotion(playerId);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof McpError) {
      return NextResponse.json(
        { error: err.message, tool: err.toolName },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
