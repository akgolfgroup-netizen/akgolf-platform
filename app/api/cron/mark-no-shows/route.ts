import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Markerer påmeldte bookinger som NO_SHOW.
 *
 * Kjøres hvert time. Finner CONFIRMED bookinger der endTime + 2 timer
 * har passert uten at sesjonen er markert som COMPLETED av instruktør.
 * Oppdaterer brukerens noShowCount og blokkerer ved 3+ no-shows (7 dager).
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // 2 timers nåde etter sesjonens sluttid
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);

  try {
    const { data: bookings, error } = await supabase
      .from("Booking")
      .select("id, studentId")
      .eq("status", "CONFIRMED")
      .lt("endTime", cutoff.toISOString())
      .limit(100);

    if (error) {
      throw error;
    }

    if (!bookings?.length) {
      logger.info("[mark-no-shows] Ingen bookinger å markere");
      return NextResponse.json({ marked: 0, total: 0 });
    }

    let marked = 0;

    for (const booking of bookings) {
      // Marker booking som NO_SHOW
      const { error: updateError } = await supabase
        .from("Booking")
        .update({
          status: "NO_SHOW",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (updateError) {
        logger.error(
          `[mark-no-shows] Kunne ikke oppdatere booking ${booking.id}:`,
          updateError
        );
        continue;
      }

      // Oppdater brukerens no-show-teller
      if (booking.studentId) {
        const { data: user, error: userError } = await supabase
          .from("User")
          .select("noShowCount")
          .eq("id", booking.studentId)
          .single();

        if (userError) {
          logger.error(
            `[mark-no-shows] Kunne ikke hente bruker ${booking.studentId}:`,
            userError
          );
        } else {
          const newCount = (user?.noShowCount ?? 0) + 1;
          const blockUntil =
            newCount >= 3
              ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              : undefined;

          const updateData: Record<string, unknown> = {
            noShowCount: newCount,
            updatedAt: new Date().toISOString(),
          };

          if (blockUntil !== undefined) {
            updateData.noShowBlockedUntil = blockUntil;
          }

          const { error: countError } = await supabase
            .from("User")
            .update(updateData)
            .eq("id", booking.studentId);

          if (countError) {
            logger.error(
              `[mark-no-shows] Kunne ikke oppdatere noShowCount for bruker ${booking.studentId}:`,
              countError
            );
          } else if (newCount >= 3) {
            logger.info(
              `[mark-no-shows] Bruker ${booking.studentId} blokkert til ${blockUntil} etter ${newCount} no-shows`
            );
          }
        }
      }

      marked++;
    }

    logger.info(
      `[mark-no-shows] Markerte ${marked} av ${bookings.length} bookinger som NO_SHOW`
    );

    return NextResponse.json({ marked, total: bookings.length });
  } catch (error) {
    logger.error("[mark-no-shows] Feil:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
