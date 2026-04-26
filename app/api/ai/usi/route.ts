// API: POST /api/ai/usi
// Beregn USI for spilleren

import { NextResponse } from "next/server";
import { calculateUSI, McpError } from "@/lib/mcp-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await calculateUSI(body.playerId, body.save !== false);

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
