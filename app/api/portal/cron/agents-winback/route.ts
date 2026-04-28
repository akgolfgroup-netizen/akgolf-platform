import { NextResponse } from "next/server";
import { runWinback } from "@/lib/portal/agents/winback";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * CRON: winback-agent.
 *
 * Schedule: daglig 09:30 (kjorer 30 min etter eksisterende /win-back email-sekvens).
 * Sender in-app notification til elever inaktive 21+ dager.
 * Eksisterende /win-back sender e-post; denne dekker portal-varsel-laget.
 * Logger til AgentLog (synlig i /admin/agenter).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runWinback();

  return NextResponse.json({
    ok: result.ran,
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
}
