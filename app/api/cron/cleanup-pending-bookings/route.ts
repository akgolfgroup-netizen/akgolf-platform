import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

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

  const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 minutter

  try {
    const result = await prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: { lt: cutoff },
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: "Betaling ikke mottatt innen tidsfristen",
      },
    });

    logger.info(
      `[cleanup-pending-bookings] Cancelled ${result.count} stale pending bookings`
    );

    return NextResponse.json({
      success: true,
      cancelled: result.count,
    });
  } catch (error) {
    logger.error("[cleanup-pending-bookings] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
