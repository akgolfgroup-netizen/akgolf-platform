import { addMinutes, addHours, isBefore, isAfter, startOfDay } from "date-fns";
import { createServiceClient } from "@/lib/supabase/server";
import { BookingStatus } from "@prisma/client";

export function generateSlots({
  availStart,
  availEnd,
  duration,
  bufferAfter,
  bufferBefore = 0,
  date,
  existingBookings,
  blockedTimes,
  minNoticeHours,
}: {
  availStart: string; // "HH:MM"
  availEnd: string; // "HH:MM"
  duration: number; // minutter
  bufferAfter: number; // minutter
  bufferBefore?: number; // minutter
  date: Date; // midnatt UTC for valgt dato
  existingBookings: { startTime: Date; endTime: Date }[];
  blockedTimes: { startTime: Date; endTime: Date }[];
  minNoticeHours: number;
}): string[] {
  const slots: string[] = [];
  const step = duration + bufferAfter;
  const earliest = addHours(new Date(), minNoticeHours);

  const [startH, startM] = availStart.split(":").map(Number);
  const [endH, endM] = availEnd.split(":").map(Number);

  const current = new Date(date);
  current.setUTCHours(startH, startM, 0, 0);
  const windowEnd = new Date(date);
  windowEnd.setUTCHours(endH, endM, 0, 0);

  while (isBefore(current, windowEnd)) {
    const slotEnd = addMinutes(current, duration);

    if (isAfter(slotEnd, windowEnd)) break;

    if (!isBefore(current, earliest)) {
      const slotStartWithBuffer = addMinutes(current, -bufferBefore);
      const hasBookingConflict = existingBookings.some(
        (b) => isBefore(slotStartWithBuffer, b.endTime) && isAfter(slotEnd, b.startTime)
      );
      const hasBlockedConflict = blockedTimes.some(
        (b) => isBefore(slotStartWithBuffer, b.endTime) && isAfter(slotEnd, b.startTime)
      );
      if (!hasBookingConflict && !hasBlockedConflict) {
        slots.push(new Date(current).toISOString());
      }
    }

    current.setMinutes(current.getMinutes() + step);
  }

  return slots;
}

// ─────────────────────────────────────────────────────────────────
// Smart slot-pakking — minimerer "døde gap" i kalenderen
// Aktiveres via strategy: "compact" på generateSlotsWithOverrides.
// Per vindu: pakker fra ankerpunkter (start + slutten av eksisterende
// bookinger/blokkeringer), bruker kontekstuell buffer (0 hvis nabo har
// samme service), og filtrerer bort orphan-skapende kandidater.
// ─────────────────────────────────────────────────────────────────

interface TimeRange {
  startTime: Date;
  endTime: Date;
  serviceTypeId?: string | null;
}

export interface ServiceDuration {
  duration: number; // minutter
  bufferAfter: number; // minutter
}

interface SmartWindowOptions {
  availStart: string;
  availEnd: string;
  date: Date;
  request: {
    duration: number;
    bufferBefore: number;
    bufferAfter: number;
    serviceTypeId: string;
  };
  existingBookings: TimeRange[];
  blockedTimes: TimeRange[];
  minNoticeHours: number;
  /** Alle aktive ServiceTypes — brukes for orphan-sjekk. */
  allDurations: ServiceDuration[];
}

/** Lavest mulig "useful" varighet som kan fylle et gap (ingen buffer etter — siste i rad). */
function smallestUsefulFill(allDurations: ServiceDuration[]): number {
  if (allDurations.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...allDurations.map((d) => d.duration));
}

/** Et gap er orphan hvis ingen aktiv ServiceType får plass i det. */
function isOrphanGap(gapMinutes: number, allDurations: ServiceDuration[]): boolean {
  if (gapMinutes <= 0) return false;
  return gapMinutes < smallestUsefulFill(allDurations);
}

/** Buffer etter denne økten: 0 hvis nabo-booking har samme serviceTypeId, ellers request.bufferAfter. */
function contextualBufferAfter(
  slotEnd: Date,
  request: SmartWindowOptions["request"],
  bookingsAfter: TimeRange[]
): number {
  // Finn første booking som starter på eller etter slotEnd
  const next = bookingsAfter
    .filter((b) => !isBefore(b.startTime, slotEnd))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
  if (!next) return request.bufferAfter;
  if (next.serviceTypeId && next.serviceTypeId === request.serviceTypeId) return 0;
  return request.bufferAfter;
}

/** Finn neste blokkering (booking/blocked) etter slotEnd, returner startTime eller null. */
function nextBlockAfter(slotEnd: Date, bookings: TimeRange[], blocked: TimeRange[]): Date | null {
  const all = [...bookings, ...blocked]
    .filter((b) => !isBefore(b.startTime, slotEnd))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return all[0]?.startTime ?? null;
}

/** Finn forrige blokkering før slotStart, returner endTime eller null. */
function prevBlockBefore(slotStart: Date, bookings: TimeRange[], blocked: TimeRange[]): Date | null {
  const all = [...bookings, ...blocked]
    .filter((b) => !isAfter(b.endTime, slotStart))
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime());
  return all[0]?.endTime ?? null;
}

/** Sjekk om kandidat-slot ville etterlate orphan-gap mot nabo (ikke mot vindu-grensene). */
function createsOrphanInWindow(
  slotStart: Date,
  slotEnd: Date,
  windowStart: Date,
  windowEnd: Date,
  bookings: TimeRange[],
  blocked: TimeRange[],
  allDurations: ServiceDuration[]
): boolean {
  const next = nextBlockAfter(slotEnd, bookings, blocked);
  const prev = prevBlockBefore(slotStart, bookings, blocked);
  // Bare reell nabo-booking gir orphan. Mot vindu-slutt/start: gap er en naturlig pause.
  if (next) {
    const gapAfter = (next.getTime() - slotEnd.getTime()) / 60_000;
    if (isOrphanGap(gapAfter, allDurations)) return true;
  } else if (windowEnd) {
    // Ingen booking etter — gap mot windowEnd er ikke orphan, men sjekk likevel for safety
    // Hvis gap er positivt og under smallestUsefulFill, og det er bookinger TIDLIGERE i vinduet
    // (= dagen er aktiv), behandle som orphan også. Tom dag = ingen orphan.
    const gapAfter = (windowEnd.getTime() - slotEnd.getTime()) / 60_000;
    const hasEarlierBookings = bookings.some((b) => !isAfter(b.startTime, slotStart));
    if (hasEarlierBookings && isOrphanGap(gapAfter, allDurations)) return true;
  }
  if (prev) {
    const gapBefore = (slotStart.getTime() - prev.getTime()) / 60_000;
    if (isOrphanGap(gapBefore, allDurations)) return true;
  } else if (windowStart) {
    const gapBefore = (slotStart.getTime() - windowStart.getTime()) / 60_000;
    const hasLaterBookings = bookings.some((b) => !isBefore(b.startTime, slotStart));
    if (hasLaterBookings && isOrphanGap(gapBefore, allDurations)) return true;
  }
  return false;
}

/**
 * Smart slot-generering for ETT tilgjengelighetsvindu.
 * Kallere må iterere over availability-windows og kalle denne per vindu.
 */
export function generateSmartSlotsForWindow(opts: SmartWindowOptions): string[] {
  const { availStart, availEnd, date, request, existingBookings, blockedTimes, minNoticeHours, allDurations } = opts;
  const earliest = addHours(new Date(), minNoticeHours);

  const [startH, startM] = availStart.split(":").map(Number);
  const [endH, endM] = availEnd.split(":").map(Number);
  const windowStart = new Date(date);
  windowStart.setUTCHours(startH, startM, 0, 0);
  const windowEnd = new Date(date);
  windowEnd.setUTCHours(endH, endM, 0, 0);

  // Bookinger og blokkeringer som overlapper dette vinduet
  const bookingsInWindow = existingBookings.filter(
    (b) => isBefore(b.startTime, windowEnd) && isAfter(b.endTime, windowStart)
  );
  const blockedInWindow = blockedTimes.filter(
    (b) => isBefore(b.startTime, windowEnd) && isAfter(b.endTime, windowStart)
  );

  // Ankerpunkter: vindu-start + slutten av hver booking/blokkering i vinduet
  const anchors: Date[] = [windowStart];
  for (const b of bookingsInWindow) anchors.push(b.endTime);
  for (const b of blockedInWindow) anchors.push(b.endTime);

  const candidates = new Map<number, Date>(); // dedupe på timestamp

  for (const anchor of anchors) {
    let t = new Date(Math.max(anchor.getTime(), windowStart.getTime()));
    while (true) {
      const slotEnd = addMinutes(t, request.duration);
      if (isAfter(slotEnd, windowEnd)) break;

      if (!isBefore(t, earliest)) {
        // Konflikt-sjekk (samme regel som generateSlots, respekterer bufferBefore på request-siden)
        const slotStartWithBuffer = addMinutes(t, -request.bufferBefore);
        const hasBookingConflict = bookingsInWindow.some(
          (b) => isBefore(slotStartWithBuffer, b.endTime) && isAfter(slotEnd, b.startTime)
        );
        const hasBlockedConflict = blockedInWindow.some(
          (b) => isBefore(slotStartWithBuffer, b.endTime) && isAfter(slotEnd, b.startTime)
        );
        if (!hasBookingConflict && !hasBlockedConflict) {
          candidates.set(t.getTime(), new Date(t));
        }
      }

      const buffer = contextualBufferAfter(slotEnd, request, bookingsInWindow);
      t = addMinutes(t, request.duration + buffer);
    }
  }

  // Filtrer orphan-skapende slots
  const filtered: Date[] = [];
  for (const t of candidates.values()) {
    const slotEnd = addMinutes(t, request.duration);
    const isOrphan = createsOrphanInWindow(
      t,
      slotEnd,
      windowStart,
      windowEnd,
      bookingsInWindow,
      blockedInWindow,
      allDurations
    );
    if (!isOrphan) filtered.push(t);
  }

  return filtered.sort((a, b) => a.getTime() - b.getTime()).map((d) => d.toISOString());
}

// Eksporter helpere for testing
export const __smartSlotsInternals = {
  isOrphanGap,
  contextualBufferAfter,
  nextBlockAfter,
  prevBlockBefore,
  createsOrphanInWindow,
  smallestUsefulFill,
};

/**
 * Henter tilgjengelighet for en instruktør på en gitt dato.
 * Prioritet:
 * 1. InstructorDateAvailability (dato-spesifikk override)
 * 2. InstructorAvailability (fast ukeplan)
 */
export async function getAvailabilityForDate(
  instructorId: string,
  date: Date
): Promise<{ startTime: string; endTime: string }[]> {
  const supabase = createServiceClient();
  const dayStart = startOfDay(date);
  const dayOfWeek = date.getUTCDay();

  // Sjekk for dato-spesifikk override først
  const { data: override } = await supabase
    .from("InstructorDateAvailability")
    .select("startTime, endTime")
    .eq("instructorId", instructorId)
    .eq("date", dayStart.toISOString())
    .single();

  if (override) {
    return [{ startTime: override.startTime, endTime: override.endTime }];
  }

  // Fall tilbake til fast tilgjengelighet
  const { data: regularAvailability } = await supabase
    .from("InstructorAvailability")
    .select("startTime, endTime")
    .eq("instructorId", instructorId)
    .eq("dayOfWeek", dayOfWeek);

  return (regularAvailability || []).map((a) => ({
    startTime: a.startTime,
    endTime: a.endTime,
  }));
}

/**
 * Genererer slots med støtte for dato-overrides.
 * Brukes av booking-API for å vise korrekte ledige tider.
 */
export type SlotStrategy = "all" | "compact";

export async function generateSlotsWithOverrides({
  instructorId,
  date,
  duration,
  bufferAfter,
  bufferBefore = 0,
  minNoticeHours,
  strategy = "all",
  serviceTypeId,
  allDurations,
}: {
  instructorId: string;
  date: Date;
  duration: number;
  bufferAfter: number;
  bufferBefore?: number;
  minNoticeHours: number;
  /** "compact" = smart packing, kontekstuell buffer, orphan-filter. "all" = legacy. */
  strategy?: SlotStrategy;
  /** Påkrevd for compact-strategi for å gjenkjenne back-to-back samme service. */
  serviceTypeId?: string;
  /** Påkrevd for compact-strategi for orphan-sjekk. Hvis utelatt, hentes fra Prisma. */
  allDurations?: ServiceDuration[];
}): Promise<string[]> {
  const supabase = createServiceClient();
  const nextDay = new Date(date);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // Hent tilgjengelighet (override eller fast)
  const availabilityWindows = await getAvailabilityForDate(instructorId, date);

  if (availabilityWindows.length === 0) {
    return [];
  }

  // Hent eksisterende bookinger og blokkerte tider
  const [bookingsResult, blockedResult] = await Promise.all([
    supabase
      .from("Booking")
      .select("startTime, endTime, serviceTypeId")
      .eq("instructorId", instructorId)
      .gte("startTime", date.toISOString())
      .lt("startTime", nextDay.toISOString())
      .in("status", ["PENDING", "CONFIRMED"] as BookingStatus[]),
    supabase
      .from("BlockedTime")
      .select("startTime, endTime")
      .or(`instructorId.eq.${instructorId},instructorId.is.null`)
      .lt("startTime", nextDay.toISOString())
      .gt("endTime", date.toISOString()),
  ]);

  const existingBookings = (bookingsResult.data || []).map((b) => ({
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
    serviceTypeId: (b as { serviceTypeId?: string | null }).serviceTypeId ?? null,
  }));

  const blockedTimes = (blockedResult.data || []).map((b) => ({
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
  }));

  // Compact-strategi: hent ServiceType-varigheter for orphan-sjekk hvis ikke gitt
  let durationsForOrphanCheck: ServiceDuration[] = allDurations ?? [];
  if (strategy === "compact" && !allDurations) {
    const { data: durationsResult } = await supabase
      .from("ServiceType")
      .select("duration, bufferAfter")
      .eq("isActive", true);
    durationsForOrphanCheck = (durationsResult || []).map((d) => ({
      duration: d.duration as number,
      bufferAfter: d.bufferAfter as number,
    }));
  }

  const allSlots: string[] = [];
  for (const window of availabilityWindows) {
    if (strategy === "compact") {
      const windowSlots = generateSmartSlotsForWindow({
        availStart: window.startTime,
        availEnd: window.endTime,
        date,
        request: {
          duration,
          bufferBefore,
          bufferAfter,
          serviceTypeId: serviceTypeId ?? "",
        },
        existingBookings,
        blockedTimes,
        minNoticeHours,
        allDurations: durationsForOrphanCheck,
      });
      allSlots.push(...windowSlots);
    } else {
      const windowSlots = generateSlots({
        availStart: window.startTime,
        availEnd: window.endTime,
        duration,
        bufferAfter,
        bufferBefore,
        date,
        existingBookings,
        blockedTimes,
        minNoticeHours,
      });
      allSlots.push(...windowSlots);
    }
  }

  return allSlots.sort();
}
