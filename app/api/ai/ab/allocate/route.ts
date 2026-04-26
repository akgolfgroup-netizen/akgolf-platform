import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await callMcpTool("ab_get_variant", body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
