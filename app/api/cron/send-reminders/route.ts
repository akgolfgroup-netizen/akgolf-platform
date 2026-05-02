/**
 * GET /api/cron/send-reminders
 * Cron-job for å sende booking-påminnelser
 * Kjøres daglig kl 08:00
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBookingReminders } from "@/lib/portal/notifications/triggers";
import { logger } from "@/lib/logger";
import { addDays, startOfDay, endOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifiser cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const tomorrow = addDays(new Date(), 1);
    
    // Hent bookinger for i morgen
    const { data: bookings } = await supabase
      .from("Booking")
      .select(`
        *,
        User(name),
        ServiceType(name, duration),
        Instructor(User(name)),
        Location(name)
      `)
      .gte("startTime", startOfDay(tomorrow).toISOString())
      .lte("startTime", endOfDay(tomorrow).toISOString())
      .in("status", ["PENDING", "CONFIRMED"]);

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "Ingen bookinger å sende påminnelser for" });
    }

    const result = await sendBookingReminders(bookings);

    if (!result.success) {
      logger.error("[Cron] Failed to send reminders:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    logger.info(`[Cron] Sent ${result.count} booking reminders`);

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Sendt ${result.count} påminnelser`,
    });
  } catch (error) {
    logger.error("[Cron] Error sending reminders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
