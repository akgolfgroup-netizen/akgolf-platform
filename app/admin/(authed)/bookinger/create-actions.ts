"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { addMinutes, format } from "date-fns";
import { nb } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { sendReminderSms } from "@/lib/portal/sms/send-reminder-sms";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { logger } from "@/lib/logger";
import { chargeOffSession } from "@/lib/portal/stripe/off-session";
import { createBookingPaymentLink } from "@/lib/portal/stripe/payment-link";
import { sendPaymentLinkSms } from "@/lib/portal/sms/send-booking-sms";

// ── Types ──────────────────────────────────────────────────

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

export interface FacilityOption {
  id: string;
  name: string;
  locationName: string | null;
}

// ── Helpers ────────────────────────────────────────────────

function first<T>(val: unknown): T | null {
  if (Array.isArray(val)) return (val[0] as T) ?? null;
  return (val as T) ?? null;
}

async function requireStaffUser() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

// ── Create Booking ─────────────────────────────────────────

export async function adminCreateBooking(data: {
  studentEmail: string;
  studentName: string;
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
  facilityId?: string | null;
}) {
  await requireStaffUser();
  const supabase = await createServerSupabase();

  // Hvis fasilitet ikke spesifisert, bruk instruktørens default
  let facilityId = data.facilityId ?? null;
  if (!facilityId) {
    const { data: def } = await supabase
      .from("InstructorFacilityDefault")
      .select("facilityId")
      .eq("instructorId", data.instructorId)
      .or(`serviceTypeId.eq.${data.serviceTypeId},serviceTypeId.is.null`)
      .order("priority", { ascending: false })
      .limit(1)
      .maybeSingle();
    facilityId = (def?.facilityId as string | undefined) ?? null;
  }

  let { data: student } = await supabase.from("User").select("id").eq("email", data.studentEmail).single();
  if (!student) {
    const { data: newStudent } = await supabase
      .from("User")
      .insert({ id: nanoid(), updatedAt: new Date().toISOString(), email: data.studentEmail, name: data.studentName, role: "STUDENT" })
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
  const conflictStart = addMinutes(start, -(serviceType.bufferBefore ?? 0));
  const conflictEnd = addMinutes(end, serviceType.bufferAfter ?? 0);

  const [{ data: bookingConflict }, { data: blockedConflict }] = await Promise.all([
    supabase.from("Booking").select("id").eq("instructorId", data.instructorId)
      .in("status", ["PENDING", "CONFIRMED"]).lt("startTime", conflictEnd.toISOString()).gt("endTime", conflictStart.toISOString()).single(),
    supabase.from("BlockedTime").select("id").or(`instructorId.eq.${data.instructorId},instructorId.is.null`)
      .lt("startTime", conflictEnd.toISOString()).gt("endTime", conflictStart.toISOString()).single(),
  ]);

  if (bookingConflict) throw new Error("Instruktøren har allerede en booking på dette tidspunktet");
  if (blockedConflict) throw new Error("Instruktøren er blokkert på dette tidspunktet");

  const { data: booking } = await supabase
    .from("Booking")
    .insert({
      id: nanoid(), updatedAt: new Date().toISOString(), studentId: student!.id,
      instructorId: data.instructorId, serviceTypeId: data.serviceTypeId,
      startTime: start.toISOString(), endTime: end.toISOString(),
      status: "CONFIRMED", paymentMethod: "NONE", paymentStatus: "PENDING",
      amount: serviceType.price, vatAmount,
      facilityId,
    })
    .select("id")
    .single();

  revalidatePath("/admin/bookinger");
  return booking!.id;
}

// ── Manuell booking med betaling (Fase E) ─────────────────

export type ManualBookingPaymentMode = "off-session" | "payment-link" | "none";

export interface ManualBookingPaymentResult {
  bookingId: string;
  paymentMode: ManualBookingPaymentMode;
  /** off-session: status fra Stripe ('succeeded' / 'requires_action' / 'failed') */
  chargeStatus?: "succeeded" | "requires_action" | "failed";
  /** payment-link: URL kunden mottok via SMS/e-post */
  paymentUrl?: string;
  /** payment-link: ble SMS sendt? */
  smsSent?: boolean;
  /** payment-link: ble e-post sendt? */
  emailSent?: boolean;
  /** Hvorfor off-session ikke fungerte (ingen kort lagret etc.) */
  fallbackReason?: string;
}

/**
 * adminCreateBookingWithPayment — manuell booking med Stripe-trekk eller Payment Link.
 *
 * Tre moduser:
 *   - off-session: Forsøk å trekke lagret kort. Faller tilbake til payment-link
 *     hvis kunden mangler stripeCustomerId eller default payment method.
 *   - payment-link: Lager Stripe Payment Link og sender via SMS + e-post.
 *   - none: Lager booking uten betaling (typisk for abo-dekt eller intern).
 */
export async function adminCreateBookingWithPayment(input: {
  studentEmail: string;
  studentName: string;
  studentPhone?: string;
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
  facilityId?: string | null;
  paymentMode: ManualBookingPaymentMode;
}): Promise<ManualBookingPaymentResult> {
  // 1. Opprett bookingen via eksisterende helper
  const bookingId = await adminCreateBooking({
    studentEmail: input.studentEmail,
    studentName: input.studentName,
    serviceTypeId: input.serviceTypeId,
    instructorId: input.instructorId,
    startTime: input.startTime,
    facilityId: input.facilityId,
  });

  if (input.paymentMode === "none") {
    return { bookingId, paymentMode: "none" };
  }

  // 2. Hent oppdatert booking + service for Payment Link/off-session
  const supabase = await createServerSupabase();
  const { data: booking } = await supabase
    .from("Booking")
    .select(
      "id, amount, startTime, ServiceType (id, name, stripePriceId), User (id, email, name, phone, stripeCustomerId)",
    )
    .eq("id", bookingId)
    .single();
  if (!booking) {
    throw new Error("Kunne ikke hente nyopprettet booking");
  }

  const service = first<{
    id: string;
    name: string;
    stripePriceId: string | null;
  }>(booking.ServiceType);
  const user = first<{
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    stripeCustomerId: string | null;
  }>(booking.User);

  // 3. Off-session: forsøk å trekke lagret kort. Fall tilbake til payment-link ved feil.
  if (input.paymentMode === "off-session") {
    if (user?.stripeCustomerId) {
      try {
        const result = await chargeOffSession(bookingId);
        if (result?.status === "succeeded") {
          return {
            bookingId,
            paymentMode: "off-session",
            chargeStatus: "succeeded",
          };
        }
        // Hvis chargeOffSession returnerer null eller annen status → fallback til payment-link
        logger.info(
          `[adminCreateBookingWithPayment] off-session skipped/failed (${result?.status ?? "null"}), falling back to payment-link`,
        );
      } catch (err) {
        logger.warn(
          "[adminCreateBookingWithPayment] off-session error",
          err instanceof Error ? { message: err.message } : { err: String(err) },
        );
      }
    } else {
      logger.info(
        `[adminCreateBookingWithPayment] no stripeCustomerId for ${user?.email}, falling back to payment-link`,
      );
    }
    // Fall through til payment-link
  }

  // 4. Payment Link: lag Stripe Payment Link + send SMS/e-post
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";
  const paymentLink = await createBookingPaymentLink({
    bookingId,
    serviceName: service?.name ?? "Coaching",
    amountKr: booking.amount as number,
    stripePriceId: service?.stripePriceId ?? null,
    successUrl: `${baseUrl}/booking/${bookingId}/confirmation`,
  });

  // Send via SMS + e-post (best effort, ikke-blokkerende for resultat)
  let smsSent = false;
  let emailSent = false;

  if (input.studentPhone) {
    try {
      const result = await sendPaymentLinkSms({
        customerPhone: input.studentPhone,
        customerName: input.studentName,
        serviceName: service?.name ?? "Coaching",
        startTime: new Date(booking.startTime as string),
        paymentUrl: paymentLink.url,
      });
      smsSent = result.sent;
    } catch (err) {
      logger.error("[adminCreateBookingWithPayment] SMS failed", err);
    }
  }

  const resend = getResend();
  if (resend && input.studentEmail) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: input.studentEmail,
        subject: `Bekreft betaling for ${service?.name ?? "coaching"}`,
        html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px"><h2 style="color:#0A1F18;font-size:24px;font-weight:700;margin:0 0 24px">Hei ${input.studentName}!</h2><p style="color:#333;font-size:16px;margin:0 0 16px">Vi har reservert <strong>${service?.name ?? "coaching"}</strong> for deg ${format(new Date(booking.startTime as string), "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}.</p><p style="color:#333;font-size:16px;margin:0 0 24px">For å bekrefte plassen din, fullfør betalingen via lenken under:</p><a href="${paymentLink.url}" style="display:inline-block;padding:14px 28px;background:#005840;color:white;text-decoration:none;border-radius:8px;font-weight:600">Bekreft og betal →</a><p style="color:#999;font-size:12px;margin:32px 0 0">AK Golf Academy</p></div>`,
      });
      emailSent = true;
    } catch (err) {
      logger.error("[adminCreateBookingWithPayment] e-post failed", err);
    }
  }

  return {
    bookingId,
    paymentMode: "payment-link",
    paymentUrl: paymentLink.url,
    smsSent,
    emailSent,
    ...(input.paymentMode === "off-session"
      ? { fallbackReason: "no-saved-card" }
      : {}),
  };
}

// ── Bulk Send Reminder ─────────────────────────────────────

export async function bulkSendReminder(bookingIds: string[]) {
  await requireStaffUser();
  if (bookingIds.length === 0) return { sent: 0, failed: 0 };

  const supabase = await createServerSupabase();
  const { data: bookings } = await supabase
    .from("Booking")
    .select("id, startTime, User (name, email, phone), ServiceType (name), Instructor (User (name))")
    .in("id", bookingIds)
    .in("status", ["CONFIRMED", "PENDING"]);

  if (!bookings?.length) return { sent: 0, failed: 0 };

  let sent = 0, failed = 0;
  const resend = getResend();

  for (const booking of bookings) {
    const student = first<{ name: string | null; email: string | null; phone: string | null }>(booking.User);
    const serviceType = first<{ name: string }>(booking.ServiceType);
    const rawInst = first<{ User: unknown }>(booking.Instructor);
    const instUser = rawInst ? first<{ name: string | null }>(rawInst.User) : null;
    if (!student) { failed++; continue; }

    const studentName = student.name ?? "Golfer";
    const serviceName = serviceType?.name ?? "Time";
    const instructorName = instUser?.name ?? "AK Golf";
    const startTime = new Date(booking.startTime);
    const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });

    let emailSent = false, smsSent = false;

    if (resend && student.email) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL, to: student.email,
          subject: `Påminnelse: ${serviceName} ${format(startTime, "d. MMM", { locale: nb })}`,
          html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px"><h2 style="color:#0A1F18;font-size:24px;font-weight:700;margin:0 0 24px">Påminnelse</h2><p style="color:#333;font-size:16px;margin:0 0 8px">Hei ${studentName},</p><p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">Du har en booking for <strong>${serviceName}</strong> med ${instructorName}.</p><div style="background:#f9fafb;border-radius:6px;padding:16px;margin:0 0 16px"><p style="color:#333;font-size:14px;margin:0"><strong>${dateStr}</strong></p></div><p style="color:#999;font-size:12px;margin:24px 0 0">AK Golf Academy</p></div>`,
        });
        emailSent = true;
      } catch (error) {
        logger.error(`[bulkSendReminder] E-post feilet for ${booking.id}:`, error);
      }
    }

    if (student.phone) {
      try {
        smsSent = await sendReminderSms({ phone: student.phone, studentName, serviceName, startTime, instructorName });
      } catch (error) {
        logger.error(`[bulkSendReminder] SMS feilet for ${booking.id}:`, error);
      }
    }

    if (emailSent || smsSent) {
      await supabase.from("Booking").update({
        ...(emailSent ? { reminderSentAt: new Date().toISOString() } : {}),
        ...(smsSent ? { smsReminderSentAt: new Date().toISOString() } : {}),
      }).eq("id", booking.id);
      sent++;
    } else { failed++; }
  }

  revalidatePath("/admin/bookinger");
  return { sent, failed };
}

// ── Lookup helpers ─────────────────────────────────────────

export async function getServiceTypes(): Promise<ServiceTypeOption[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("ServiceType").select("id, name, duration, price").eq("isActive", true).order("name");
  return (data ?? []).map((s) => ({ id: s.id as string, name: s.name as string, duration: s.duration as number, price: s.price as number }));
}

export async function getInstructors(): Promise<InstructorOption[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("Instructor").select("id, title, User (name)");
  return (data ?? []).map((inst) => {
    const userArr = inst.User as unknown as { name: string | null }[] | null;
    const name = Array.isArray(userArr) ? userArr[0]?.name : (userArr as { name: string | null } | null)?.name;
    return { id: inst.id as string, name: name ?? "Ukjent", title: (inst.title as string | null) ?? null };
  });
}

export async function getFacilities(): Promise<FacilityOption[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("Facility")
    .select("id, name, sortOrder, isActive, Location (name)")
    .eq("isActive", true)
    .order("sortOrder", { ascending: true });
  return (data ?? []).map((f) => {
    const loc = Array.isArray(f.Location) ? f.Location[0] : f.Location;
    return {
      id: f.id as string,
      name: f.name as string,
      locationName: (loc as { name: string | null } | null)?.name ?? null,
    };
  });
}

export async function getInstructorDefaultFacility(
  instructorId: string,
  serviceTypeId?: string
): Promise<string | null> {
  const supabase = await createServerSupabase();
  let query = supabase
    .from("InstructorFacilityDefault")
    .select("facilityId, priority, serviceTypeId")
    .eq("instructorId", instructorId);
  if (serviceTypeId) {
    query = query.or(`serviceTypeId.eq.${serviceTypeId},serviceTypeId.is.null`);
  }
  const { data } = await query
    .order("priority", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.facilityId as string | undefined) ?? null;
}

export async function searchStudentsForBooking(query: string): Promise<StudentOption[]> {
  await requireStaffUser();
  const supabase = await createServerSupabase();
  let q = supabase.from("User").select("id, name, email").eq("role", "STUDENT").order("name").limit(20);
  if (query) q = q.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  const { data } = await q;
  return (data ?? []).map((u) => ({ id: u.id as string, name: (u.name as string | null) ?? null, email: u.email as string }));
}
