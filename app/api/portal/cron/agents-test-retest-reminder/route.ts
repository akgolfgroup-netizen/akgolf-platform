import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { runTestRetestReminder } from "@/lib/portal/agents/test-retest-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * CRON: test-retest-reminder-agent.
 *
 * Schedule: daglig 06:00 UTC.
 * Sender Notification til spillere som har tester forfalt for retest
 * (>56 dager siden siste utforing). Cooldown 14 dager mellom hver
 * paminnelse for a unnga spam.
 *
 * Logger til AgentLog (synlig i /admin/agenter).
 */
export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runTestRetestReminder();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
