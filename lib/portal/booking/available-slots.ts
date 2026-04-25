import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import {
  computeRemainingSlots,
  endOfWeek,
  type AvailabilityWindow,
  type BookingWindow,
  type ComputeRemainingSlotsInput,
} from "./available-slots-compute";

export {
  computeRemainingSlots,
  type AvailabilityWindow,
  type BookingWindow,
  type ComputeRemainingSlotsInput,
};

export interface CountAvailableSlotsOptions {
  instructorId: string;
  durationMinutes: number;
  now?: Date;
}

/**
 * Beregner gjenværende tilgjengelige slots for instruktøren denne uken
 * (fra now frem til søndag 23:59 lokalt). Henter ukeplan og eksisterende
 * bookinger fra databasen via Prisma — ingen hardkodede verdier.
 */
export async function countAvailableSlotsThisWeek({
  instructorId,
  durationMinutes,
  now = new Date(),
}: CountAvailableSlotsOptions): Promise<number> {
  if (durationMinutes <= 0) return 0;

  const weekEnd = endOfWeek(now);
  if (now >= weekEnd) return 0;

  const [windows, bookings, blocked] = await Promise.all([
    prisma.instructorAvailability.findMany({
      where: { instructorId },
      select: { dayOfWeek: true, startTime: true, endTime: true },
    }),
    prisma.booking.findMany({
      where: {
        instructorId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        startTime: { gte: now, lt: weekEnd },
      },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedTime.findMany({
      where: {
        OR: [{ instructorId }, { instructorId: null }],
        startTime: { lt: weekEnd },
        endTime: { gt: now },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  if (windows.length === 0) return 0;

  return computeRemainingSlots({
    now,
    weekEnd,
    windows: windows as AvailabilityWindow[],
    bookings: bookings as BookingWindow[],
    blocked: blocked as BookingWindow[],
    durationMinutes,
  });
}
