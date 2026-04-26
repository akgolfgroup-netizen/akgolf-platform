import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function GET() {
  try {
    const result = await callMcpTool("ab_list_experiments", {});
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
