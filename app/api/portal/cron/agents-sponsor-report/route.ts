import { NextResponse } from "next/server";
import { runSponsorReport } from "@/lib/portal/agents/sponsor-report";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * CRON: sponsor-report-agent.
 *
 * Schedule: 1. hver maned 09:00.
 * Genererer rapport per sponsor (antall okter, NPS, hoydepunkter).
 * NB: Sponsor-modell kommer i Sprint 5.2 - kjorer som no-op inntil videre.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runSponsorReport();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
