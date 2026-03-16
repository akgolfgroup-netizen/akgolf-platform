import { prisma } from "@/lib/portal/prisma";
import { WaitlistStatus } from "@prisma/client";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { WaitlistAvailableEmail } from "@/lib/portal/email/templates/waitlist-available";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

/**
 * Check waitlist entries when a booking is cancelled.
 * Notifies the next person on the waitlist that a slot is available.
 */
export async function notifyNextOnWaitlist(
  bookingId: string,
  serviceName: string,
  instructorName: string,
  startTime: Date
) {
  // Find the next WAITING entry for this booking
  const nextEntry = await prisma.waitlistEntry.findFirst({
    where: {
      bookingId,
      status: WaitlistStatus.WAITING,
    },
    orderBy: { position: "asc" },
    include: {
      student: { select: { name: true, email: true } },
    },
  });

  if (!nextEntry || !nextEntry.student.email) return;

  // Mark as notified with 24h expiry
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.waitlistEntry.update({
    where: { id: nextEntry.id },
    data: {
      status: WaitlistStatus.NOTIFIED,
      notifiedAt: new Date(),
      expiresAt,
    },
  });

  // Send notification email
  const resend = getResend();
  if (!resend) return;

  const dateStr = format(startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(startTime, "HH:mm");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: nextEntry.student.email,
      subject: `Plass ledig! ${serviceName} — ${dateStr}`,
      react: WaitlistAvailableEmail({
        studentName: nextEntry.student.name ?? "Hei",
        serviceName,
        instructorName,
        date: dateStr,
        time: timeStr,
        expiresAt: format(expiresAt, "EEEE d. MMMM HH:mm", { locale: nb }),
      }),
    });
    console.log(
      `[Waitlist] Notified ${nextEntry.student.email} for booking ${bookingId}`
    );
  } catch (error) {
    console.error("[Waitlist] Failed to send notification:", error);
  }
}

/**
 * Add a student to the waitlist for a specific booking slot.
 */
export async function addToWaitlist(
  bookingId: string,
  studentId: string
): Promise<{ success: boolean; position: number }> {
  // Check for existing entry
  const existing = await prisma.waitlistEntry.findUnique({
    where: {
      bookingId_studentId: { bookingId, studentId },
    },
  });

  if (existing) {
    return { success: false, position: existing.position };
  }

  // Get current max position
  const maxEntry = await prisma.waitlistEntry.findFirst({
    where: { bookingId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const position = (maxEntry?.position ?? 0) + 1;

  await prisma.waitlistEntry.create({
    data: {
      bookingId,
      studentId,
      position,
      status: WaitlistStatus.WAITING,
    },
  });

  return { success: true, position };
}
