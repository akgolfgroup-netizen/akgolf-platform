import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp-client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const experimentId = url.searchParams.get("experimentId");
    const metric = url.searchParams.get("metric");

    if (!experimentId || !metric) {
      return NextResponse.json(
        { error: "experimentId og metric er påkrevd" },
        { status: 400 }
      );
    }

    const result = await callMcpTool("ab_get_results", { experimentId, metric });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
