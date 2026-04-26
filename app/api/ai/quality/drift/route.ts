import { NextResponse } from "next/server";
import { callMcpTool, McpError } from "@/lib/mcp-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await callMcpTool("check_performance_drift", body);
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
