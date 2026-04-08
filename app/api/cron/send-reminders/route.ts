/**
 * GET /api/cron/send-reminders
 * Cron-job for å sende booking-påminnelser
 * Kjøres daglig kl 08:00
 */

import { NextRequest, NextResponse } from "next/server";
import { sendBookingReminders } from "@/lib/portal/notifications/triggers";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifiser cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendBookingReminders();

    if (!result.success) {
      logger.error("[Cron] Failed to send reminders:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    logger.info(`[Cron] Sent ${result.count} booking reminders`);

    return NextResponse.json({
      ok: true,
      count: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("[Cron] Unexpected error in send-reminders:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
