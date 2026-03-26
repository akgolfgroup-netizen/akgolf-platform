import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Logger tilgjengelige drop-in-plasser innen 48 timer.
 *
 * Selve slot-tilgangen styres av /api/coaching/slots som filtrerer
 * basert på bookingType og tidsvinduer. Denne cron-en er en
 * placeholder for fremtidig push-varsling eller cache-oppdatering.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  try {
    // Finn alle aktive slots som IKKE er reservert for junior_elite
    const { data: openSlots, error: slotsError } = await supabase
      .from("CoachingAvailability")
      .select("id, dayOfWeek, startTime, endTime, reservedFor")
      .eq("isActive", true)
      .or("reservedFor.is.null,reservedFor.neq.junior_elite");

    if (slotsError) {
      console.error(
        "[cron/dropin] Feil ved henting av tilgjengelige slots:",
        slotsError
      );
      return NextResponse.json(
        { error: "Feil ved henting av slots" },
        { status: 500 }
      );
    }

    // Finn bookinger innen de neste 48 timene
    const { data: upcomingBookings, error: bookingsError } = await supabase
      .from("Booking")
      .select("id, startTime, endTime")
      .in("status", ["PENDING", "CONFIRMED"])
      .gte("startTime", now.toISOString())
      .lte("startTime", in48h.toISOString());

    if (bookingsError) {
      console.error(
        "[cron/dropin] Feil ved henting av bookinger:",
        bookingsError
      );
      return NextResponse.json(
        { error: "Feil ved henting av bookinger" },
        { status: 500 }
      );
    }

    const totalOpenSlots = openSlots?.length ?? 0;
    const totalBookings = upcomingBookings?.length ?? 0;

    console.log(
      `[cron/dropin] Status: ${totalOpenSlots} åpne slots totalt, ${totalBookings} bookinger neste 48t`
    );

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      message: "Drop-in slot-sjekk fullført (placeholder)",
      openSlotsTotal: totalOpenSlots,
      bookingsNext48h: totalBookings,
    });
  } catch (error) {
    console.error("[cron/dropin] Uventet feil:", error);
    return NextResponse.json(
      { error: "Intern feil i drop-in-cron" },
      { status: 500 }
    );
  }
}
