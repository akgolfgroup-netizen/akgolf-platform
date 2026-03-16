"use server";

import { requirePortalUser } from "@/lib/portal/auth";

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
  serviceType: { select: { name: true, category: true, color: true, duration: true } },
  instructor: {
    select: {
      user: { select: { name: true, image: true } },
      title: true,
    },
  },
  location: { select: { name: true } },
} as const;

export async function getUpcomingBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;

  return prisma.booking.findMany({
    where: {
      studentId: id,
      startTime: { gte: new Date() },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    include: bookingInclude,
    orderBy: { startTime: "asc" },
    take: 20,
  });
}

export async function getPastBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;

  return prisma.booking.findMany({
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
      serviceType: { select: { name: true } },
      instructor: { select: { user: { select: { name: true, email: true } } } },
      student: { select: { name: true, email: true } },
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
      console.error(
        `[cancelBooking] Refund failed for booking ${id}:`,
        refundResult.error
      );
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
      ? `kr ${(refundedAmount / 100).toLocaleString("nb-NO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : null;

  const refundInfo =
    policy.refundPercent === 100
      ? `Full refusjon (${refundAmountFormatted})`
      : policy.refundPercent > 0
        ? `Delvis refusjon: ${refundAmountFormatted} (${policy.refundPercent}%)`
        : "Ingen refusjon";

  sendCancellationEmail({
    studentEmail: booking.student.email ?? "",
    studentName: booking.student.name ?? "Kunde",
    serviceName: booking.serviceType.name,
    instructorName: booking.instructor.user.name ?? "Instruktør",
    date: dateStr,
    time: timeStr,
    refundInfo,
    policyReason: policy.reason,
  }).catch((err) =>
    console.error("[cancelBooking] Email send failed:", err)
  );

  // Notify next person on waitlist (non-blocking)
  notifyNextOnWaitlist(
    id,
    booking.serviceType.name,
    booking.instructor.user.name ?? "Instruktør",
    booking.startTime
  ).catch((err) =>
    console.error("[cancelBooking] Waitlist notification failed:", err)
  );

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
