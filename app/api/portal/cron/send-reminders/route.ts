import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { BookingReminderEmail } from "@/lib/portal/email/templates/booking-reminder";
import { sendReminderSms } from "@/lib/portal/sms/send-reminder-sms";
import { format, addHours } from "date-fns";
import { nb } from "date-fns/locale";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs every hour.
 * - 24h before: sends email reminder
 * - 1h before: sends SMS reminder
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  let emailsSent = 0;
  let smsSent = 0;

  // --- Email reminders: bookings 23-25 hours from now (catches hourly cron window) ---
  const emailWindowStart = addHours(now, 23);
  const emailWindowEnd = addHours(now, 25);

  const { data: emailBookings, error: emailBookingsError } = await supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      reminderSentAt,
      User (name, email),
      ServiceType (name, duration),
      Instructor (User (name)),
      Location (name)
    `)
    .in("status", ["CONFIRMED"])
    .gte("startTime", emailWindowStart.toISOString())
    .lte("startTime", emailWindowEnd.toISOString())
    .is("reminderSentAt", null);

  if (emailBookingsError) {
    logger.error("[Cron] Error fetching email bookings:", emailBookingsError);
  }

  const resend = getResend();

  for (const booking of (emailBookings ?? [])) {
    const user = booking.User as { name?: string; email?: string } | null;
    const serviceType = (booking.ServiceType as { name: string; duration: number }[] | null)?.[0] ?? null;
    const instructor = booking.Instructor as { User?: { name?: string } } | null;
    const location = booking.Location as { name?: string } | null;

    if (!user?.email || !resend || !serviceType) continue;

    const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM yyyy", {
      locale: nb,
    });
    const timeStr = format(new Date(booking.startTime), "HH:mm");

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Påminnelse: ${serviceType.name} — ${dateStr}`,
        react: BookingReminderEmail({
          studentName: user.name ?? "Hei",
          serviceName: serviceType.name,
          instructorName: instructor?.User?.name ?? "Instruktør",
          date: dateStr,
          time: timeStr,
          duration: serviceType.duration,
          location: location?.name ?? "Gamle Fredrikstad Golfklubb",
        }),
      });

      await supabase
        .from("Booking")
        .update({ reminderSentAt: now.toISOString() })
        .eq("id", booking.id);

      emailsSent++;
    } catch (error) {
      logger.error(`[Cron] Email reminder failed for booking ${booking.id}`, error);
    }
  }

  // --- SMS reminders: bookings 0.5-1.5 hours from now ---
  const smsWindowStart = addHours(now, 0.5);
  const smsWindowEnd = addHours(now, 1.5);

  const { data: smsBookings, error: smsBookingsError } = await supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      smsReminderSentAt,
      User (name, phone),
      ServiceType (name),
      Instructor (User (name))
    `)
    .in("status", ["CONFIRMED"])
    .gte("startTime", smsWindowStart.toISOString())
    .lte("startTime", smsWindowEnd.toISOString())
    .is("smsReminderSentAt", null);

  if (smsBookingsError) {
    logger.error("[Cron] Error fetching SMS bookings:", smsBookingsError);
  }

  for (const booking of (smsBookings ?? [])) {
    const user = booking.User as { name?: string; phone?: string } | null;
    const serviceType = (booking.ServiceType as { name: string }[] | null)?.[0] ?? null;
    const instructor = booking.Instructor as { User?: { name?: string } } | null;

    if (!user?.phone || !serviceType) continue;

    try {
      const sent = await sendReminderSms({
        phone: user.phone,
        studentName: user.name ?? "Hei",
        serviceName: serviceType.name,
        startTime: new Date(booking.startTime),
        instructorName: instructor?.User?.name ?? "Instruktør",
      });

      if (sent) {
        await supabase
          .from("Booking")
          .update({ smsReminderSentAt: now.toISOString() })
          .eq("id", booking.id);
        smsSent++;
      }
    } catch (error) {
      logger.error(
        `[Cron] SMS reminder failed for booking ${booking.id}:`,
        error
      );
    }
  }

  logger.info(
    `[Cron] Reminders sent: ${emailsSent} emails, ${smsSent} SMS`
  );

  return NextResponse.json({
    ok: true,
    emailsSent,
    smsSent,
    timestamp: now.toISOString(),
  });
}
