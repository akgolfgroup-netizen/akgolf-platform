import { NextResponse } from "next/server";
import { runDunning } from "@/lib/portal/agents/dunning";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * CRON: dunning-agent (purrelogikk).
 *
 * Schedule: daglig 10:00.
 * 3-trinns purring pa forfalt faktura (7d, 14d, 21d).
 * Logger til AgentLog (synlig i /admin/agenter).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runDunning();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
