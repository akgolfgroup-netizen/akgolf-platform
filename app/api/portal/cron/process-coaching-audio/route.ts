/**
 * CRON: Process completed bookings with uploaded audio but no AI summary.
 *
 * Scheduled every 15 minutes. Processes up to 3 pending sessions per run to
 * control Whisper/Claude cost.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { onBookingCompleted } from "@/lib/portal/agents/runner";
import { logger } from "@/lib/logger";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!expectedSecret || auth !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await prisma.coachingSession.findMany({
    where: {
      aiSummary: null,
      uploadedFilePath: { not: null },
      Booking: { status: "COMPLETED" },
    },
    orderBy: { sessionDate: "asc" },
    take: 3,
    select: { id: true, bookingId: true },
  });

  const results: Array<{ sessionId: string; ran: boolean; reason?: string }> = [];
  for (const c of candidates) {
    try {
      const result = await onBookingCompleted(c.bookingId);
      results.push({ sessionId: c.id, ...result });
    } catch (err) {
      logger.error("[cron/process-coaching-audio] failed", err);
      results.push({ sessionId: c.id, ran: false, reason: "error" });
    }
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
