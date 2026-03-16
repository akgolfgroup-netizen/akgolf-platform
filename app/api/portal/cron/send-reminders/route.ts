import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
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

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let emailsSent = 0;
  let smsSent = 0;

  // --- Email reminders: bookings 23-25 hours from now (catches hourly cron window) ---
  const emailWindowStart = addHours(now, 23);
  const emailWindowEnd = addHours(now, 25);

  const emailBookings = await prisma.booking.findMany({
    where: {
      status: { in: [BookingStatus.CONFIRMED] },
      startTime: { gte: emailWindowStart, lte: emailWindowEnd },
      reminderSentAt: null,
    },
    include: {
      student: { select: { name: true, email: true } },
      serviceType: { select: { name: true, duration: true } },
      instructor: { select: { user: { select: { name: true } } } },
      location: { select: { name: true } },
    },
  });

  const resend = getResend();

  for (const booking of emailBookings) {
    if (!booking.student.email || !resend) continue;

    const dateStr = format(booking.startTime, "EEEE d. MMMM yyyy", {
      locale: nb,
    });
    const timeStr = format(booking.startTime, "HH:mm");

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.student.email,
        subject: `Påminnelse: ${booking.serviceType.name} — ${dateStr}`,
        react: BookingReminderEmail({
          studentName: booking.student.name ?? "Hei",
          serviceName: booking.serviceType.name,
          instructorName: booking.instructor.user.name ?? "Instruktør",
          date: dateStr,
          time: timeStr,
          duration: booking.serviceType.duration,
          location: booking.location?.name ?? "Gamle Fredrikstad Golfklubb",
        }),
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSentAt: now },
      });

      emailsSent++;
    } catch (error) {
      console.error(
        `[Cron] Email reminder failed for booking ${booking.id}:`,
        error
      );
    }
  }

  // --- SMS reminders: bookings 0.5-1.5 hours from now ---
  const smsWindowStart = addHours(now, 0.5);
  const smsWindowEnd = addHours(now, 1.5);

  const smsBookings = await prisma.booking.findMany({
    where: {
      status: { in: [BookingStatus.CONFIRMED] },
      startTime: { gte: smsWindowStart, lte: smsWindowEnd },
      smsReminderSentAt: null,
    },
    include: {
      student: { select: { name: true, phone: true } },
      serviceType: { select: { name: true } },
      instructor: { select: { user: { select: { name: true } } } },
    },
  });

  for (const booking of smsBookings) {
    if (!booking.student.phone) continue;

    try {
      const sent = await sendReminderSms({
        phone: booking.student.phone,
        studentName: booking.student.name ?? "Hei",
        serviceName: booking.serviceType.name,
        startTime: booking.startTime,
        instructorName: booking.instructor.user.name ?? "Instruktør",
      });

      if (sent) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { smsReminderSentAt: now },
        });
        smsSent++;
      }
    } catch (error) {
      console.error(
        `[Cron] SMS reminder failed for booking ${booking.id}:`,
        error
      );
    }
  }

  console.log(
    `[Cron] Reminders sent: ${emailsSent} emails, ${smsSent} SMS`
  );

  return NextResponse.json({
    ok: true,
    emailsSent,
    smsSent,
    timestamp: now.toISOString(),
  });
}
