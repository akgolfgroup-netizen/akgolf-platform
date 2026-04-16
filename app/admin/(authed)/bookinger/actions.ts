"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import { processRefund } from "@/lib/portal/booking/refund";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { rescheduleBooking } from "@/lib/portal/booking/reschedule";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

// ── Types ──────────────────────────────────────────────────

export interface AdminBooking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number | null;
  paymentMethod: string;
  paymentStatus: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  focusArea: string | null;
  playerNotes: string | null;
  User: { name: string | null; email: string | null; phone: string | null } | null;
  ServiceType: { name: string; color: string | null; duration: number } | null;
  Instructor: { User: { name: string | null } } | null;
  Location: { name: string } | null;
}

export interface SearchBookingsResult {
  bookings: AdminBooking[];
  total: number;
}

// ── Helpers ────────────────────────────────────────────────

async function requireStaffUser() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

// ── Search ─────────────────────────────────────────────────

export async function searchBookings(
  query: string,
  status?: string,
  page = 1,
): Promise<SearchBookingsResult> {
  await requireStaffUser();
  const supabase = await createServerSupabase();
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  let baseQuery = supabase.from("Booking").select("*, User:studentId(name, email, phone), ServiceType:serviceTypeId(name, color, duration), Instructor:instructorId(User(name)), Location:locationId(name)", { count: "exact" });
  if (status && status !== "ALL") baseQuery = baseQuery.eq("status", status);
  if (query) {
    baseQuery = baseQuery.or(
      `User.name.ilike.%${query}%,User.email.ilike.%${query}%,ServiceType.name.ilike.%${query}%`,
    );
  }

  const { data: bookings, count: total } = await baseQuery
    .order("createdAt", { ascending: false })
    .range(skip, skip + pageSize - 1);

  return { bookings: bookings ?? [], total: total ?? 0 };
}

// ── Cancel ─────────────────────────────────────────────────

export async function adminCancelBooking(
  bookingId: string,
  reason?: string,
  fullRefund?: boolean,
) {
  await requireStaffUser();
  const supabase = await createServerSupabase();

  const { data: booking } = await supabase
    .from("Booking")
    .select("startTime, paymentMethod, stripePaymentId, amount, paymentStatus")
    .eq("id", bookingId)
    .single();

  if (!booking) throw new Error("Booking ikke funnet");

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
      refundResult = await processRefund({
        bookingId,
        paymentMethod: booking.paymentMethod,
        providerPaymentId: booking.stripePaymentId,
        totalAmount: booking.amount,
        refundPercent: policy.refundPercent,
      });
      if (!refundResult.success) {
        logger.error(`[adminCancelBooking] Refund failed for ${bookingId}:`, refundResult.error);
      } else if (refundResult.alreadyProcessed) {
        logger.info(`[adminCancelBooking] Refund already processed for booking ${bookingId}`);
      }
    }
  }

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

  if (refundResult?.success && refundResult.refundedAmount > 0) {
    await supabase
      .from("PaymentTransaction")
      .update({ refundedAt: new Date().toISOString() })
      .eq("bookingId", bookingId);
  }

  revalidatePath("/admin/bookinger");
  return { refundResult };
}

// ── Reschedule ─────────────────────────────────────────────

export async function adminRescheduleBooking(
  bookingId: string,
  newStartTime: string,
) {
  await requireStaffUser();

  // Hent studentId for å passere eiersjekken i rescheduleBooking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { studentId: true, status: true },
  });
  if (!booking) throw new Error("Booking ikke funnet");
  if (booking.status === "CANCELLED") throw new Error("Kan ikke endre avbestilt booking");

  const result = await rescheduleBooking(bookingId, new Date(newStartTime), booking.studentId);
  if (!result.success) throw new Error(result.error ?? "Kunne ikke ombestille");

  revalidatePath("/admin/bookinger");
  return { newBookingId: result.newBookingId };
}

// ── Bulk Cancel ────────────────────────────────────────────

export async function bulkCancelBookings(bookingIds: string[], reason?: string) {
  await requireStaffUser();
  if (bookingIds.length === 0) return { cancelled: 0, failed: 0 };

  let cancelled = 0;
  let failed = 0;

  for (const bookingId of bookingIds) {
    try {
      await adminCancelBooking(bookingId, reason ?? "Avbestilt av admin (bulk)", true);
      cancelled++;
    } catch (error) {
      logger.error(`[bulkCancelBookings] Feilet for ${bookingId}:`, error);
      failed++;
    }
  }

  revalidatePath("/admin/bookinger");
  return { cancelled, failed };
}
