import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Rydder opp i PENDING bookinger som aldri ble betalt.
 *
 * Kjøres hvert 15. minutt. Kansellerer bookinger som har vært
 * PENDING i mer enn 30 minutter, slik at tidsluken frigjøres
 * for andre kunder.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 minutter

  try {
    const { data: result, error } = await supabase
      .from("Booking")
      .update({
        status: "CANCELLED",
        cancelledAt: new Date().toISOString(),
        cancelReason: "Betaling ikke mottatt innen tidsfristen",
      })
      .eq("status", "PENDING")
      .eq("paymentStatus", "PENDING")
      .lt("createdAt", cutoff.toISOString())
      .select();

    if (error) {
      throw error;
    }

    const cancelledCount = result?.length ?? 0;

    logger.info(
      `[cleanup-pending-bookings] Cancelled ${cancelledCount} stale pending bookings`
    );

    return NextResponse.json({
      success: true,
      cancelled: cancelledCount,
    });
  } catch (error) {
    logger.error("[cleanup-pending-bookings] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
