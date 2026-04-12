import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Rydder opp i NOTIFIED waitlist-entries med utlopt expiresAt.
 *
 * Kjores hver 6. time. Setter status til EXPIRED slik at
 * neste person i koen kan fa tilbud om plassen.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    const { data: result, error } = await supabase
      .from("WaitlistEntry")
      .update({
        status: "EXPIRED",
        updatedAt: new Date().toISOString(),
      })
      .eq("status", "NOTIFIED")
      .lt("expiresAt", new Date().toISOString())
      .select();

    if (error) {
      throw error;
    }

    const expiredCount = result?.length ?? 0;

    logger.info(
      `[cleanup-waitlist] Expired ${expiredCount} notified waitlist entries`
    );

    return NextResponse.json({
      success: true,
      expired: expiredCount,
    });
  } catch (error) {
    logger.error("[cleanup-waitlist] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
