import { NextResponse } from "next/server";
import { runBirthday } from "@/lib/portal/agents/birthday";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * CRON: birthday-agent.
 *
 * Schedule: daglig 08:00.
 * Sender personlig melding fra coach pa elevens bursdag.
 * NB: Bursdag-felt mangler pa User i dag (Sprint 6) - agenten kjorer som no-op
 * inntil feltet er pa plass, men logger fortsatt til AgentLog.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runBirthday();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
