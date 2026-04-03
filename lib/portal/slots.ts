import { addMinutes, addHours, isBefore, isAfter, startOfDay } from "date-fns";
import { prisma } from "@/lib/portal/prisma";

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
  const dayStart = startOfDay(date);
  const dayOfWeek = date.getUTCDay();

  // Sjekk for dato-spesifikk override først
  const override = await prisma.instructorDateAvailability.findFirst({
    where: {
      instructorId,
      date: dayStart,
    },
  });

  if (override) {
    return [{ startTime: override.startTime, endTime: override.endTime }];
  }

  // Fall tilbake til fast tilgjengelighet
  const regularAvailability = await prisma.instructorAvailability.findMany({
    where: {
      instructorId,
      dayOfWeek,
    },
  });

  return regularAvailability.map((a) => ({
    startTime: a.startTime,
    endTime: a.endTime,
  }));
}

/**
 * Genererer slots med støtte for dato-overrides.
 * Brukes av booking-API for å vise korrekte ledige tider.
 */
export async function generateSlotsWithOverrides({
  instructorId,
  date,
  duration,
  bufferAfter,
  bufferBefore = 0,
  minNoticeHours,
}: {
  instructorId: string;
  date: Date;
  duration: number;
  bufferAfter: number;
  bufferBefore?: number;
  minNoticeHours: number;
}): Promise<string[]> {
  const nextDay = new Date(date);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // Hent tilgjengelighet (override eller fast)
  const availabilityWindows = await getAvailabilityForDate(instructorId, date);

  if (availabilityWindows.length === 0) {
    return [];
  }

  // Hent eksisterende bookinger og blokkerte tider
  const [existingBookings, blockedTimes] = await Promise.all([
    prisma.booking.findMany({
      where: {
        instructorId,
        startTime: { gte: date, lt: nextDay },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedTime.findMany({
      where: {
        OR: [{ instructorId }, { instructorId: null }],
        startTime: { lt: nextDay },
        endTime: { gt: date },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  // Generer slots for hvert tilgjengelighetsvindu
  const allSlots: string[] = [];
  for (const window of availabilityWindows) {
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

  return allSlots.sort();
}
