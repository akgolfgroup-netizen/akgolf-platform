"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { processRefund } from "@/lib/portal/booking/refund";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { BookingCancelledEmail } from "@/lib/portal/email/templates/booking-cancelled";
import { isStaff } from "@/lib/portal/rbac";
import { notifyNextOnWaitlist } from "@/lib/portal/booking/waitlist";

const bookingInclude = `
  ServiceType (name, category, color, duration),
  Instructor (
    User (name, image),
    title
  ),
  Location (name)
`;

export async function getUpcomingBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;

  const { data: bookings } = await supabase
    .from("Booking")
    .select(bookingInclude)
    .eq("studentId", id)
    .gte("startTime", new Date().toISOString())
    .in("status", ["PENDING", "CONFIRMED"])
    .order("startTime", { ascending: true })
    .limit(20);

  return (bookings || []).map((b) => ({
    id: b.id,
    serviceName: (b.ServiceType as { name: string }).name,
    instructorName: ((b.Instructor as { User: { name: string | null } }).User?.name) ?? "Coach",
    startTime: new Date(b.startTime),
    duration: (b.ServiceType as { duration: number }).duration,
    location: (b.Location as { name: string } | null)?.name,
    status: "upcoming" as const,
    type: ((b.ServiceType as { category: string }).category === "INDIVIDUAL" ? "coaching" : "training") as "coaching" | "training" | "tournament" | "booking",
  }));
}

export async function getPastBookings(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;

  const { data: bookings } = await supabase
    .from("Booking")
    .select(bookingInclude)
    .eq("studentId", id)
    .or(`startTime.lt.${new Date().toISOString()},status.in.(COMPLETED,CANCELLED)`)
    .order("startTime", { ascending: false })
    .limit(30);

  return (bookings || []).map((b) => ({
    id: b.id,
    serviceName: (b.ServiceType as { name: string }).name,
    instructorName: ((b.Instructor as { User: { name: string | null } }).User?.name) ?? "Coach",
    startTime: new Date(b.startTime),
    duration: (b.ServiceType as { duration: number }).duration,
    location: (b.Location as { name: string } | null)?.name,
    status: (b.status === "CANCELLED" ? "cancelled" : "completed") as "upcoming" | "completed" | "cancelled",
    type: ((b.ServiceType as { category: string }).category === "INDIVIDUAL" ? "coaching" : "training") as "coaching" | "training" | "tournament" | "booking",
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

  const supabase = await createServerSupabase();

  const { data: booking } = await supabase
    .from("Booking")
    .select(`
      *,
      ServiceType (name),
      Instructor (User (name, email)),
      User (name, email)
    `)
    .eq("id", id)
    .single();

  if (!booking) throw new Error("Booking ikke funnet");

  // Allow student to cancel own booking, or staff to cancel any
  const userRole = user.role as string;
  if (booking.studentId !== user.id && !isStaff(userRole)) {
    throw new Error("Ikke autorisert");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Bookingen er allerede avbestilt");
  }

  // Evaluate cancellation policy
  const policy = evaluateCancellationPolicy(new Date(booking.startTime));
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
    booking.paymentStatus === "PAID" &&
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
      ? "REFUNDED"
      : policy.refundPercent > 0
        ? "PARTIALLY_REFUNDED"
        : booking.paymentStatus;

  await supabase
    .from("Booking")
    .update({
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancelReason: reason,
      paymentStatus:
        booking.paymentStatus === "PAID"
          ? refundPaymentStatus
          : booking.paymentStatus,
    })
    .eq("id", id);

  // Send cancellation email (non-blocking)
  const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM yyyy", {
    locale: nb,
  });
  const timeStr = format(new Date(booking.startTime), "HH:mm");

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

  const userEmail = (booking.User as { email: string | null }).email;
  if (userEmail) {
    sendCancellationEmail({
      studentEmail: userEmail,
      studentName: (booking.User as { name: string | null }).name ?? "Kunde",
      serviceName: (booking.ServiceType as { name: string }).name,
      instructorName: ((booking.Instructor as { User: { name: string | null } }).User?.name) ?? "Instruktør",
      date: dateStr,
      time: timeStr,
      refundInfo,
      policyReason: policy.reason,
    }).catch((err) => logger.error("[cancelBooking] Email send failed", err));
  }

  // Notify next person on waitlist (non-blocking)
  notifyNextOnWaitlist(
    id,
    (booking.ServiceType as { name: string }).name,
    ((booking.Instructor as { User: { name: string | null } }).User?.name) ?? "Instruktør",
    new Date(booking.startTime)
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
