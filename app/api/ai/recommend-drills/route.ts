// API: POST /api/ai/recommend-drills
// Wrapper rundt MCP-server tool

import { NextResponse } from "next/server";
import { recommendDrills, McpError } from "@/lib/mcp-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Auth-sjekk skjer i parent-layout (admin/auth-middleware)
    // TODO: legg til server-side session-validering

    const result = await recommendDrills({
      playerId: body.playerId,
      sessionDuration: body.sessionDuration ?? 60,
      environment: body.environment ?? "M2",
      focusOverride: body.focusOverride,
    });

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
