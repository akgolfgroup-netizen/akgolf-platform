import { NextResponse } from "next/server";
import { callMcpTool, McpError } from "@/lib/mcp-client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date") ?? undefined;
    const result = await callMcpTool("daily_cost_report", { date });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof McpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
