/**
 * GET /api/cron/cleanup-notifications
 * Cron-job for å slette gamle notifikasjoner
 * Kjøres ukentlig (søndag kl 02:00)
 */

import { NextRequest, NextResponse } from "next/server";
import { cleanupOldNotifications } from "@/lib/portal/notifications/create";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifiser cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Slett notifikasjoner eldre enn 90 dager
    const result = await cleanupOldNotifications(90);

    if (!result.success) {
      logger.error("[Cron] Failed to cleanup notifications:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    logger.info(`[Cron] Cleaned up ${result.deletedCount} old notifications`);

    return NextResponse.json({
      ok: true,
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("[Cron] Unexpected error in cleanup-notifications:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
