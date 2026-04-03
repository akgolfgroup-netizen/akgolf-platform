"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { processRefund } from "@/lib/portal/booking/refund";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { BookingCancelledEmail } from "@/lib/portal/email/templates/booking-cancelled";
import { isStaff } from "@/lib/portal/rbac";
import { notifyNextOnWaitlist } from "@/lib/portal/booking/waitlist";

const bookingInclude = {
  ServiceType: { select: { name: true, category: true, color: true, duration: true } },
  Instructor: {
    select: {
      User: { select: { name: true, image: true } },
      title: true,
    },
  },
  Location: { select: { name: true } },
} as const;

export async function getUpcomingBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;

  const bookings = await prisma.booking.findMany({
    where: {
      studentId: id,
      startTime: { gte: new Date() },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    include: bookingInclude,
    orderBy: { startTime: "asc" },
    take: 20,
  });

  return bookings.map((b) => ({
    ...b,
    serviceType: { name: b.ServiceType.name, category: b.ServiceType.category, color: b.ServiceType.color, duration: b.ServiceType.duration },
    instructor: { user: { name: b.Instructor.User.name, image: b.Instructor.User.image }, title: b.Instructor.title },
    location: b.Location ? { name: b.Location.name } : null,
  }));
}

export async function getPastBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;

  const bookings = await prisma.booking.findMany({
    where: {
      studentId: id,
      OR: [
        { startTime: { lt: new Date() } },
        { status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] } },
      ],
    },
    include: bookingInclude,
    orderBy: { startTime: "desc" },
    take: 30,
  });

  return bookings.map((b) => ({
    ...b,
    serviceType: { name: b.ServiceType.name, category: b.ServiceType.category, color: b.ServiceType.color, duration: b.ServiceType.duration },
    instructor: { user: { name: b.Instructor.User.name, image: b.Instructor.User.image }, title: b.Instructor.title },
    location: b.Location ? { name: b.Location.name } : null,
  }));
}

export interface CancelBookingResult {
  success: boolean;
  refundedAmount: number;
  policyReason: string;
  error?: string;
}

export async function cancelBooking(
  id: string,
  reason?: string
): Promise<CancelBookingResult> {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      ServiceType: { select: { name: true } },
      Instructor: { select: { User: { select: { name: true, email: true } } } },
      User: { select: { name: true, email: true } },
    },
  });
  if (!booking) throw new Error("Booking ikke funnet");

  // Allow student to cancel own booking, or staff to cancel any
  const userRole = user.role as string;
  if (booking.studentId !== user.id && !isStaff(userRole)) {
    throw new Error("Ikke autorisert");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new Error("Bookingen er allerede avbestilt");
  }

  // Evaluate cancellation policy
  const policy = evaluateCancellationPolicy(booking.startTime);
  if (!policy.allowed) {
    return {
      success: false,
      refundedAmount: 0,
      policyReason: policy.reason,
      error: policy.reason,
    };
  }

  // Process refund if payment was made
  let refundedAmount = 0;
  if (
    booking.paymentStatus === PaymentStatus.PAID &&
    policy.refundPercent > 0
  ) {
    const providerPaymentId =
      booking.stripePaymentId ?? booking.vippsOrderId ?? null;

    const refundResult = await processRefund(
      booking.paymentMethod,
      providerPaymentId,
      booking.amount,
      policy.refundPercent
    );

    refundedAmount = refundResult.refundedAmount;

    if (!refundResult.success) {
      logger.error(`[cancelBooking] Refund failed for booking ${id}`, refundResult.error);
    }
  }

  // Update booking status
  const refundPaymentStatus =
    policy.refundPercent === 100
      ? PaymentStatus.REFUNDED
      : policy.refundPercent > 0
        ? PaymentStatus.PARTIALLY_REFUNDED
        : booking.paymentStatus;

  await prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: reason,
      paymentStatus:
        booking.paymentStatus === PaymentStatus.PAID
          ? refundPaymentStatus
          : booking.paymentStatus,
    },
  });

  // Send cancellation email (non-blocking)
  const dateStr = format(booking.startTime, "EEEE d. MMMM yyyy", {
    locale: nb,
  });
  const timeStr = format(booking.startTime, "HH:mm");

  const refundAmountFormatted =
    refundedAmount > 0
      ? `kr ${refundedAmount.toLocaleString("nb-NO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : null;

  const refundInfo =
    policy.refundPercent === 100
      ? `Full refusjon (${refundAmountFormatted})`
      : policy.refundPercent > 0
        ? `Delvis refusjon: ${refundAmountFormatted} (${policy.refundPercent}%)`
        : "Ingen refusjon";

  sendCancellationEmail({
    studentEmail: booking.User.email ?? "",
    studentName: booking.User.name ?? "Kunde",
    serviceName: booking.ServiceType.name,
    instructorName: booking.Instructor.User.name ?? "Instruktør",
    date: dateStr,
    time: timeStr,
    refundInfo,
    policyReason: policy.reason,
  }).catch((err) => logger.error("[cancelBooking] Email send failed", err));

  // Notify next person on waitlist (non-blocking)
  notifyNextOnWaitlist(
    id,
    booking.ServiceType.name,
    booking.Instructor.User.name ?? "Instruktør",
    booking.startTime
  ).catch((err) => logger.error("[cancelBooking] Waitlist notification failed", err));

  revalidatePath("/bookinger");

  return {
    success: true,
    refundedAmount,
    policyReason: policy.reason,
  };
}

async function sendCancellationEmail(data: {
  studentEmail: string;
  studentName: string;
  serviceName: string;
  instructorName: string;
  date: string;
  time: string;
  refundInfo: string;
  policyReason: string;
}) {
  const resend = getResend();
  if (!resend || !data.studentEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.studentEmail,
    subject: `Avbestillingsbekreftelse — ${data.serviceName}`,
    react: BookingCancelledEmail({
      studentName: data.studentName,
      serviceName: data.serviceName,
      instructorName: data.instructorName,
      date: data.date,
      time: data.time,
      refundInfo: data.refundInfo,
      policyReason: data.policyReason,
    }),
  });
}
