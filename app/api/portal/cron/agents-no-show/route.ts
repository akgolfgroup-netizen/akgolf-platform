import { NextResponse } from "next/server";
import { runNoShow } from "@/lib/portal/agents/no-show";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * CRON: no-show-agent.
 *
 * Schedule: hver 15. minutt.
 * Markerer bookinger som NO_SHOW hvis ikke checked-in 15 min etter start.
 * Logger til AgentLog (synlig i /admin/agenter).
 *
 * NB: Eksisterende /api/cron/mark-no-shows kjorer parallelt med egen logikk.
 * Denne agenten dekker observability-laget for CoachHQ.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runNoShow();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
