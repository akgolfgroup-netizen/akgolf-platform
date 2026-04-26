import { NextResponse } from "next/server";
import { runCoachPayout } from "@/lib/portal/agents/coach-payout";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * CRON: Månedlig trener-payout-kalkulering.
 *
 * Schedule: Siste dag i måneden 23:55.
 * Kjører forrige måned (eller den som nå holder på å avsluttes).
 *
 * Verifiserer CRON_SECRET-header.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runCoachPayout();

  return NextResponse.json({
    ok: result.ran,
    totalKr: result.totalKr,
    lineCount: result.lineCount,
    timestamp: new Date().toISOString(),
  });
}
