"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { addMinutes, format } from "date-fns";
import { nb } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { processRefund } from "@/lib/portal/booking/refund";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { sendReminderSms } from "@/lib/portal/sms/send-reminder-sms";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { logger } from "@/lib/logger";
import { BookingStatus, Prisma } from "@prisma/client";

// Helper to safely extract first element from Supabase nested relation (returned as array)
function first<T>(val: unknown): T | null {
  if (Array.isArray(val)) return (val[0] as T) ?? null;
  return (val as T) ?? null;
}

// ---------------------------------------------------------------------------
// Types exported for client components
// ---------------------------------------------------------------------------

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

export interface ServiceTypeOption {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface InstructorOption {
  id: string;
  name: string;
  title: string | null;
}

export interface StudentOption {
  id: string;
  name: string | null;
  email: string;
}

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

export async function bulkSendReminder(bookingIds: string[]) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (bookingIds.length === 0) return { sent: 0, failed: 0 };

  const supabase = await createServerSupabase();

  const { data: bookings } = await supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      reminderSentAt,
      smsReminderSentAt,
      User (name, email, phone),
      ServiceType (name),
      Instructor (User (name))
    `)
    .in("id", bookingIds)
    .in("status", ["CONFIRMED", "PENDING"]);

  if (!bookings || bookings.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  const resend = getResend();

  for (const booking of bookings) {
    const student = first<{ name: string | null; email: string | null; phone: string | null }>(booking.User);
    const serviceType = first<{ name: string }>(booking.ServiceType);
    const rawInstructor = first<{ User: unknown }>(booking.Instructor);
    const instructorUser = rawInstructor ? first<{ name: string | null }>(rawInstructor.User) : null;
    const instructor = rawInstructor ? { User: { name: instructorUser?.name ?? null } } : null;

    if (!student) {
      failed++;
      continue;
    }

    const studentName = student.name ?? "Golfer";
    const serviceName = serviceType?.name ?? "Time";
    const instructorName = instructor?.User?.name ?? "AK Golf";
    const startTime = new Date(booking.startTime);
    const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });

    let emailSent = false;
    let smsSent = false;

    // Send e-post
    if (resend && student.email) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: student.email,
          subject: `Påminnelse: ${serviceName} ${format(startTime, "d. MMM", { locale: nb })}`,
          html: `
            <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
              <h2 style="color: #0A1F18; font-size: 24px; font-weight: 700; margin: 0 0 24px;">Påminnelse</h2>
              <p style="color: #333; font-size: 16px; margin: 0 0 8px;">Hei ${studentName},</p>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                Du har en booking for <strong>${serviceName}</strong> med ${instructorName}.
              </p>
              <div style="background: #f9fafb; border-radius: 6px; padding: 16px; margin: 0 0 16px;">
                <p style="color: #333; font-size: 14px; margin: 0;"><strong>${dateStr}</strong></p>
              </div>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">Vi ser frem til å se deg!</p>
              <p style="color: #999; font-size: 12px; margin: 24px 0 0;">AK Golf Academy — Gamle Fredrikstad Golfklubb</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (error) {
        logger.error(`[bulkSendReminder] E-post feilet for booking ${booking.id}:`, error);
      }
    }

    // Send SMS
    if (student.phone) {
      try {
        smsSent = await sendReminderSms({
          phone: student.phone,
          studentName,
          serviceName,
          startTime,
          instructorName,
        });
      } catch (error) {
        logger.error(`[bulkSendReminder] SMS feilet for booking ${booking.id}:`, error);
      }
    }

    if (emailSent || smsSent) {
      // Marker at påminnelse er sendt
      await supabase
        .from("Booking")
        .update({
          ...(emailSent ? { reminderSentAt: new Date().toISOString() } : {}),
          ...(smsSent ? { smsReminderSentAt: new Date().toISOString() } : {}),
        })
        .eq("id", booking.id);
      sent++;
    } else {
      failed++;
    }
  }

  revalidatePath("/admin/bookinger");
  return { sent, failed };
}

export async function bulkCancelBookings(
  bookingIds: string[],
  reason?: string
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (bookingIds.length === 0) return { cancelled: 0, failed: 0 };

  let cancelled = 0;
  let failed = 0;

  for (const bookingId of bookingIds) {
    try {
      await adminCancelBooking(
        bookingId,
        reason ?? "Avbestilt av admin (bulk)",
        true
      );
      cancelled++;
    } catch (error) {
      logger.error(`[bulkCancelBookings] Feilet for booking ${bookingId}:`, error);
      failed++;
    }
  }

  revalidatePath("/admin/bookinger");
  return { cancelled, failed };
}

// ---------------------------------------------------------------------------
// Admin reschedule
// ---------------------------------------------------------------------------

export async function adminRescheduleBooking(
  bookingId: string,
  newStartTime: string
): Promise<{ success: boolean; newBookingId?: string; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ikke autorisert" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      ServiceType: {
        select: { duration: true, bufferBefore: true, bufferAfter: true },
      },
    },
  });

  if (!booking) {
    return { success: false, error: "Booking ikke funnet" };
  }

  if (
    booking.status !== BookingStatus.CONFIRMED &&
    booking.status !== BookingStatus.PENDING
  ) {
    return { success: false, error: "Kan kun endre aktive bookinger" };
  }

  const serviceType = booking.ServiceType;
  if (!serviceType) {
    return { success: false, error: "Tjenestetype ikke funnet" };
  }

  const start = new Date(newStartTime);
  if (start <= new Date()) {
    return { success: false, error: "Nytt tidspunkt ma vaere i fremtiden" };
  }

  const end = addMinutes(start, serviceType.duration);
  const conflictStart = addMinutes(start, -(serviceType.bufferBefore ?? 0));
  const conflictEnd = addMinutes(end, serviceType.bufferAfter ?? 0);
  const newBookingId = nanoid();

  try {
    await prisma.$transaction(async (tx) => {
      // Sjekk konflikter
      const conflict = await tx.booking.findFirst({
        where: {
          id: { not: bookingId },
          instructorId: booking.instructorId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          startTime: { lt: conflictEnd },
          endTime: { gt: conflictStart },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new Error("Tidspunktet er opptatt");
      }

      // Sjekk blokkerte tider
      const blockedCount = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "BlockedTime"
        WHERE ("instructorId" = ${booking.instructorId} OR "instructorId" IS NULL)
          AND "startTime" < ${conflictEnd}
          AND "endTime" > ${conflictStart}
      `;

      if (Number(blockedCount[0].count) > 0) {
        throw new Error("Tidspunktet er blokkert");
      }

      // Opprett ny booking
      await tx.booking.create({
        data: {
          id: newBookingId,
          studentId: booking.studentId,
          instructorId: booking.instructorId,
          serviceTypeId: booking.serviceTypeId,
          locationId: booking.locationId,
          resourceId: booking.resourceId,
          startTime: start,
          endTime: end,
          status: booking.status,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          amount: booking.amount,
          vatAmount: booking.vatAmount,
          stripePaymentId: booking.stripePaymentId,
          vippsOrderId: booking.vippsOrderId,
          updatedAt: new Date(),
        },
      });

      // Kanseller gammel
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelReason: "Ombestilt av admin",
        },
      });
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    revalidatePath("/admin/bookinger");
    return { success: true, newBookingId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Kunne ikke ombestille";
    logger.error(`[adminRescheduleBooking] ${msg}`, error);
    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Helpers for ny-booking page
// ---------------------------------------------------------------------------

export async function getServiceTypes(): Promise<ServiceTypeOption[]> {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("ServiceType")
    .select("id, name, duration, price")
    .eq("isActive", true)
    .order("name");

  return (data || []).map((st) => ({
    id: st.id as string,
    name: st.name as string,
    duration: st.duration as number,
    price: st.price as number,
  }));
}

export async function getInstructors(): Promise<InstructorOption[]> {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("Instructor")
    .select("id, title, User (name)");

  return (data || []).map((inst) => {
    const userArr = inst.User as unknown as { name: string | null }[] | null;
    const userName = Array.isArray(userArr) ? userArr[0]?.name : (userArr as { name: string | null } | null)?.name;
    return {
      id: inst.id as string,
      name: userName ?? "Ukjent",
      title: (inst.title as string | null) ?? null,
    };
  });
}

export async function searchStudentsForBooking(query: string): Promise<StudentOption[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = await createServerSupabase();

  let baseQuery = supabase
    .from("User")
    .select("id, name, email")
    .eq("role", "STUDENT")
    .order("name")
    .limit(20);

  if (query) {
    baseQuery = baseQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data } = await baseQuery;

  return (data || []).map((u) => ({
    id: u.id as string,
    name: (u.name as string | null) ?? null,
    email: u.email as string,
  }));
}
