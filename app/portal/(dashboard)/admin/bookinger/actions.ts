"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { processRefund } from "@/lib/portal/booking/refund";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { logger } from "@/lib/logger";

const bookingSelect = `
  id,
  startTime,
  endTime,
  status,
  amount,
  paymentMethod,
  paymentStatus,
  cancelledAt,
  cancelReason,
  adminNotes,
  createdAt,
  User (id, name, email, phone),
  ServiceType (name, color, duration),
  Instructor (id, User (name)),
  Location (name)
`;

export async function searchBookings(query: string, status?: string, page = 1) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return { bookings: [], total: 0 };

  const supabase = await createServerSupabase();
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  let baseQuery = supabase.from("Booking").select("*", { count: "exact" });

  if (status && status !== "ALL") {
    baseQuery = baseQuery.eq("status", status);
  }

  if (query) {
    baseQuery = baseQuery.or(`User.name.ilike.%${query}%,User.email.ilike.%${query}%,ServiceType.name.ilike.%${query}%`);
  }

  const { data: bookings, count: total } = await baseQuery
    .order("createdAt", { ascending: false })
    .range(skip, skip + pageSize - 1);

  return { bookings: bookings || [], total: total ?? 0 };
}

export async function adminCancelBooking(
  bookingId: string,
  reason?: string,
  fullRefund?: boolean
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  const { data: booking } = await supabase
    .from("Booking")
    .select("startTime, paymentMethod, stripePaymentId, amount, paymentStatus")
    .eq("id", bookingId)
    .single();

  if (!booking) throw new Error("Booking ikke funnet");

  // Prosesser refund hvis bookingen er betalt via Stripe
  let refundResult = null;
  if (
    booking.paymentStatus === "PAID" &&
    booking.stripePaymentId &&
    booking.paymentMethod === "STRIPE"
  ) {
    const policy = fullRefund
      ? { refundPercent: 100 }
      : evaluateCancellationPolicy(new Date(booking.startTime));

    if (policy.refundPercent > 0) {
      refundResult = await processRefund(
        booking.paymentMethod,
        booking.stripePaymentId,
        booking.amount * 100, // konverter til øre for Stripe
        policy.refundPercent
      );

      if (!refundResult.success) {
        logger.error(`[adminCancelBooking] Refund failed for ${bookingId}:`, refundResult.error);
      }
    }
  }

  // Bestem ny paymentStatus basert på refund-resultat
  const newPaymentStatus =
    refundResult?.success && refundResult.refundedAmount > 0
      ? refundResult.refundedAmount >= booking.amount * 100
        ? "REFUNDED"
        : "PARTIALLY_REFUNDED"
      : booking.paymentStatus;

  await supabase
    .from("Booking")
    .update({
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancelReason: reason ?? "Avbestilt av admin",
      paymentStatus: newPaymentStatus,
    })
    .eq("id", bookingId);

  // Oppdater PaymentTransaction med refund-tidspunkt
  if (refundResult?.success && refundResult.refundedAmount > 0) {
    await supabase
      .from("PaymentTransaction")
      .update({ refundedAt: new Date().toISOString() })
      .eq("bookingId", bookingId);
  }

  revalidatePath("/admin/bookinger");
  return { refundResult };
}

export async function adminCreateBooking(data: {
  studentEmail: string;
  studentName: string;
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  // Find or create student
  let { data: student } = await supabase
    .from("User")
    .select("id")
    .eq("email", data.studentEmail)
    .single();

  if (!student) {
    const { data: newStudent } = await supabase
      .from("User")
      .insert({
        id: nanoid(),
        updatedAt: new Date().toISOString(),
        email: data.studentEmail,
        name: data.studentName,
        role: "STUDENT",
      })
      .select("id")
      .single();
    student = newStudent;
  }

  const { data: serviceType } = await supabase
    .from("ServiceType")
    .select("duration, price, vatRate, bufferBefore, bufferAfter")
    .eq("id", data.serviceTypeId)
    .single();

  if (!serviceType) throw new Error("Tjeneste ikke funnet");

  const start = new Date(data.startTime);
  const end = addMinutes(start, serviceType.duration);
  const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);

  // Beregn konfliktvindu med buffertider
  const conflictStart = addMinutes(start, -(serviceType.bufferBefore ?? 0));
  const conflictEnd = addMinutes(end, serviceType.bufferAfter ?? 0);

  // Sjekk for konflikter
  const [{ data: bookingConflict }, { data: blockedConflict }] = await Promise.all([
    supabase
      .from("Booking")
      .select("id")
      .eq("instructorId", data.instructorId)
      .in("status", ["PENDING", "CONFIRMED"])
      .lt("startTime", conflictEnd.toISOString())
      .gt("endTime", conflictStart.toISOString())
      .single(),
    supabase
      .from("BlockedTime")
      .select("id")
      .or(`instructorId.eq.${data.instructorId},instructorId.is.null`)
      .lt("startTime", conflictEnd.toISOString())
      .gt("endTime", conflictStart.toISOString())
      .single(),
  ]);

  if (bookingConflict) {
    throw new Error("Instruktøren har allerede en booking på dette tidspunktet");
  }
  if (blockedConflict) {
    throw new Error("Instruktøren er blokkert på dette tidspunktet");
  }

  const { data: booking } = await supabase
    .from("Booking")
    .insert({
      id: nanoid(),
      updatedAt: new Date().toISOString(),
      studentId: student!.id,
      instructorId: data.instructorId,
      serviceTypeId: data.serviceTypeId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: "CONFIRMED",
      paymentMethod: "NONE",
      paymentStatus: "PENDING",
      amount: serviceType.price,
      vatAmount,
    })
    .select("id")
    .single();

  revalidatePath("/admin/bookinger");
  return booking!.id;
}
