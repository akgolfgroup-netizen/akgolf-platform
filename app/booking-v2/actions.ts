"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateSlotsWithOverrides } from "@/lib/portal/slots";
import { prisma } from "@/lib/portal/prisma";
import {
  setDraft,
  clearDraft,
  getDraft,
  type BookingDraft,
} from "@/lib/booking-v2/draft";
import { createBookingV2 } from "@/lib/booking-v2/create-booking";
import { getPortalUser } from "@/lib/portal/auth";

/**
 * Booking V2 server actions.
 *
 * Disse er stubs som validerer input og returnerer mock-resultater.
 * Når Anders sier ifra, kobles de til ekte server-logikk:
 *
 * - holdSlot       → lib/portal/booking/locking.ts
 * - releaseSlot    → lib/portal/booking/locking.ts
 * - createBooking  → lib/portal/booking/conflict-check.ts + Stripe
 *                    (chargeOffSession for Flex, Checkout for ny abo,
 *                    createInvoiceForBooking for bedrift)
 * - joinWaitlist   → lib/portal/booking/waitlist.ts
 *
 * Aldri dupliser denne logikken her — importer den når wiring skjer.
 *
 * getAvailableSlots ER ferdig wired — bruker generateSlotsWithOverrides
 * med strategy="compact" for smart packing.
 */

/**
 * Henter ledige slots for et gitt service+trainer+date med smart packing.
 * Returnerer ISO-strings, sortert kronologisk.
 *
 * Hvis trainerId mangler, slår vi opp default-trener på ServiceType
 * (første aktive Instructor knyttet til ServiceType).
 */
export async function getAvailableSlots({
  serviceTypeId,
  instructorId,
  date,
}: {
  serviceTypeId: string;
  instructorId?: string;
  date: string; // YYYY-MM-DD
}): Promise<string[]> {
  if (!serviceTypeId || !date) return [];

  const [year, month, day] = date.split("-").map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  // Finn ServiceType for varighet/buffer
  const serviceType = await prisma.serviceType.findUnique({
    where: { id: serviceTypeId },
    select: {
      id: true,
      duration: true,
      bufferAfter: true,
      bufferBefore: true,
      minNoticeHours: true,
      maxAdvanceDays: true,
      isActive: true,
    },
  });

  if (!serviceType || !serviceType.isActive) return [];

  // Server-side håndhevelse av booking-vinduet (klient er disabled, men actions er
  // direkte kallbare — bekreft her at dato er innenfor service-spesifikt vindu).
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const daysFromNow = Math.floor(
    (targetDate.getTime() - todayUtc.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (daysFromNow < 0 || daysFromNow > serviceType.maxAdvanceDays) return [];

  // Hvis ingen trener spesifisert, finn første tilknyttet
  let resolvedInstructorId = instructorId;
  if (!resolvedInstructorId) {
    const trainerResult = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      select: { Instructor: { select: { id: true }, take: 1 } },
    });
    resolvedInstructorId = trainerResult?.Instructor?.[0]?.id;
  }
  if (!resolvedInstructorId) return [];

  return generateSlotsWithOverrides({
    instructorId: resolvedInstructorId,
    date: targetDate,
    duration: serviceType.duration,
    bufferAfter: serviceType.bufferAfter,
    bufferBefore: serviceType.bufferBefore,
    minNoticeHours: serviceType.minNoticeHours,
    strategy: "compact",
    serviceTypeId,
  });
}

/**
 * createBooking — form action fra betal/page.tsx.
 *
 * Leser BookingDraft fra signert cookie, kobler eventuell innlogget bruker,
 * delegerer all logikk til lib/booking-v2/create-booking.ts og redirecter til
 * paymentUrl ved suksess (Stripe Checkout for engangs, /booking/{id}/confirmation
 * for abo-dekkede økter). Ved feil: redirect til /booking-v2/betal?error=...
 *
 * Cookien clearDraft kalles IKKE her — webhook (Stripe) bekrefter betaling.
 * Vi rydder cookien på `/booking/{id}/confirmation` (steg 7).
 */
export async function createBooking(): Promise<void> {
  const draft = await getDraft();
  if (!draft) {
    redirect("/booking-v2/dine-detaljer?error=missing-draft");
  }

  const portalUser = await getPortalUser();
  const loggedInUser = portalUser
    ? {
        id: portalUser.id,
        email: portalUser.email,
        name: portalUser.name,
        stripeCustomerId: portalUser.stripeCustomerId,
      }
    : null;

  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const host = headerStore.get("host") ?? "akgolf.no";
  const origin = `${proto}://${host}`;

  const result = await createBookingV2({ draft, loggedInUser, origin });

  if (!result.ok) {
    redirect(`/booking-v2/betal?error=${encodeURIComponent(result.reason)}`);
  }

  // Suksess — bruker går til Stripe (engangs) eller direkte til bekreftelse (abo)
  redirect(result.paymentUrl);
}

export async function holdSlot(_serviceId: string, _date: string, _time: string): Promise<{ ok: boolean; expiresAt?: string }> {
  // TODO: kall lib/portal/booking/locking.ts → reserver slot i 10 min
  return { ok: true, expiresAt: new Date(Date.now() + 10 * 60_000).toISOString() };
}

export async function releaseSlot(_holdId: string): Promise<{ ok: boolean }> {
  // TODO: kall lib/portal/booking/locking.ts → frigi reservasjon
  return { ok: true };
}

export interface WaitlistPayload {
  email: string;
  phone?: string;
  preferredDay?: "any" | "weekday" | "weekend";
  preferredWindow?: "any" | "morning" | "afternoon" | "evening";
  trainerId?: "anders" | "markus" | "any";
}

export async function joinWaitlist(
  payload: WaitlistPayload
): Promise<{ ok: boolean; position?: number }> {
  if (!payload.email) {
    return { ok: false };
  }
  // TODO: kall lib/portal/booking/waitlist.ts → opprett WaitlistEntry
  return { ok: true, position: 3 };
}

/**
 * submitDetails — leser FormData fra dine-detaljer/page.tsx, validerer og lagrer
 * draft i signert cookie, deretter redirect til betal/page.tsx.
 *
 * Validerer minimumskrav (epost, navn, telefon, samtykke). Det er server-action
 * lest direkte fra <form action={submitDetails}>, så vi kan ikke returnere errors
 * inline — vi redirecter tilbake med ?error=... ved feil.
 */
export async function submitDetails(formData: FormData): Promise<void> {
  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

  const serviceTypeId = get("serviceTypeId");
  const instructorIdRaw = get("instructorId");
  const serviceSlug = get("service") || "performance";
  const trainerSlug = get("trainer") || "anders";
  const date = get("date");
  const time = get("time");

  const firstName = get("firstName");
  const lastName = get("lastName");
  const email = get("email");
  const phone = get("phone");
  const handicap = get("handicap");
  const note = get("note");
  const consent = formData.get("consent") === "on";

  // Bevar wizard-params i URL ved feil-redirect så bruker ikke mister fremdrift.
  const carry = new URLSearchParams();
  if (serviceTypeId) carry.set("serviceTypeId", serviceTypeId);
  if (instructorIdRaw) carry.set("instructorId", instructorIdRaw);
  carry.set("service", serviceSlug);
  carry.set("trainer", trainerSlug);
  if (date) carry.set("date", date);
  if (time) carry.set("time", time);

  function failTo(reason: string): never {
    carry.set("error", reason);
    redirect(`/booking-v2/dine-detaljer?${carry.toString()}`);
  }

  if (!serviceTypeId) failTo("missing-service");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) failTo("invalid-date");
  if (!time || !/^\d{2}:\d{2}$/.test(time)) failTo("invalid-time");
  if (!firstName || !lastName) failTo("missing-name");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) failTo("invalid-email");
  if (!phone || phone.length < 6) failTo("invalid-phone");
  if (!consent) failTo("missing-consent");

  const draft: BookingDraft = {
    serviceTypeId,
    instructorId: instructorIdRaw || undefined,
    serviceSlug,
    trainerSlug,
    date,
    time,
    customer: {
      firstName,
      lastName,
      email,
      phone,
      handicap: handicap || undefined,
      note: note || undefined,
      consent,
    },
  };

  await setDraft(draft);
  redirect("/booking-v2/betal");
}

/**
 * Brukes av betal/page når brukeren går tilbake — eller etter at booking er fullført
 * for å forhindre at en ny faneåpning gjenbruker draften.
 */
export async function abandonDraft(): Promise<void> {
  await clearDraft();
}
