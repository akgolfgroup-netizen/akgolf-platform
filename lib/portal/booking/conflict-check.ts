/**
 * Konfliktsjekk for booking-systemet
 */

import { prisma } from "@/lib/portal/prisma";
import { BookingStatus, Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";

export interface ConflictCheckOptions {
  instructorId: string;
  startTime: Date;
  endTime: Date;
  excludeBookingId?: string;
  bufferBefore?: number;
  bufferAfter?: number;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflictType: "booking" | "blocked" | "facility" | null;
  conflictingItem?: {
    id: string;
    startTime: Date;
    endTime: Date;
    type: string;
  };
  message: string;
}

export async function checkDoubleBookingConflict(
  options: ConflictCheckOptions,
  tx?: Prisma.TransactionClient
): Promise<ConflictResult> {
  const {
    instructorId,
    startTime,
    endTime,
    excludeBookingId,
    bufferBefore = 0,
    bufferAfter = 0,
  } = options;

  const conflictStart = addMinutes(startTime, -bufferBefore);
  const conflictEnd = addMinutes(endTime, bufferAfter);
  const client = tx || prisma;

  const existingBooking = await client.booking.findFirst({
    where: {
      instructorId,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      AND: [
        { startTime: { lt: conflictEnd } },
        { endTime: { gt: conflictStart } },
      ],
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
    },
    select: { id: true, startTime: true, endTime: true, status: true },
  });

  if (existingBooking) {
    return {
      hasConflict: true,
      conflictType: "booking",
      conflictingItem: {
        id: existingBooking.id,
        startTime: existingBooking.startTime,
        endTime: existingBooking.endTime,
        type: "booking",
      },
      message: "Tidspunktet er allerede booket",
    };
  }

  return { hasConflict: false, conflictType: null, message: "Ingen konflikt funnet" };
}

export async function checkBlockedTimeConflict(
  options: Omit<ConflictCheckOptions, "bufferBefore" | "bufferAfter">,
  tx?: Prisma.TransactionClient
): Promise<ConflictResult> {
  const { instructorId, startTime, endTime } = options;
  const client = tx || prisma;

  const blockedTime = await client.blockedTime.findFirst({
    where: {
      OR: [{ instructorId }, { instructorId: null }],
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
    select: { id: true, startTime: true, endTime: true, reason: true },
  });

  if (blockedTime) {
    return {
      hasConflict: true,
      conflictType: "blocked",
      conflictingItem: {
        id: blockedTime.id,
        startTime: blockedTime.startTime,
        endTime: blockedTime.endTime,
        type: "blocked",
      },
      message: blockedTime.reason 
        ? `Tidspunktet er blokkert: ${blockedTime.reason}` 
        : "Tidspunktet er ikke tilgjengelig",
    };
  }

  return { hasConflict: false, conflictType: null, message: "Ingen blokkering funnet" };
}

export async function checkAllConflicts(
  options: ConflictCheckOptions & { checkBlocked?: boolean; checkFacility?: boolean; facilityId?: string },
  tx?: Prisma.TransactionClient
): Promise<ConflictResult> {
  const { checkBlocked = true } = options;

  const bookingConflict = await checkDoubleBookingConflict(options, tx);
  if (bookingConflict.hasConflict) return bookingConflict;

  if (checkBlocked) {
    const blockedConflict = await checkBlockedTimeConflict(options, tx);
    if (blockedConflict.hasConflict) return blockedConflict;
  }

  return { hasConflict: false, conflictType: null, message: "Ingen konflikter funnet" };
}

export async function validateInstructorAvailability(
  instructorId: string,
  startTime: Date,
  endTime: Date,
  tx?: Prisma.TransactionClient
): Promise<{ isAvailable: boolean; message?: string }> {
  const client = tx || prisma;
  const dayOfWeek = startTime.getUTCDay();
  const dateOnly = new Date(Date.UTC(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate(), 0, 0, 0, 0));

  const dateOverride = await client.instructorDateAvailability.findFirst({
    where: { instructorId, date: dateOnly },
  });

  if (dateOverride) {
    const [sH, sM] = dateOverride.startTime.split(":").map(Number);
    const [eH, eM] = dateOverride.endTime.split(":").map(Number);
    const availStart = new Date(startTime); availStart.setUTCHours(sH, sM, 0, 0);
    const availEnd = new Date(startTime); availEnd.setUTCHours(eH, eM, 0, 0);

    if (startTime >= availStart && endTime <= availEnd) return { isAvailable: true };
    return { isAvailable: false, message: `Instruktøren er kun tilgjengelig ${dateOverride.startTime}-${dateOverride.endTime} denne dagen` };
  }

  const availability = await client.instructorAvailability.findFirst({
    where: {
      instructorId, dayOfWeek, isActive: true,
      OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
    },
  });

  if (!availability) return { isAvailable: false, message: "Instruktøren er ikke tilgjengelig på denne ukedagen" };

  const [sH, sM] = availability.startTime.split(":").map(Number);
  const [eH, eM] = availability.endTime.split(":").map(Number);
  const availStart = new Date(startTime); availStart.setUTCHours(sH, sM, 0, 0);
  const availEnd = new Date(startTime); availEnd.setUTCHours(eH, eM, 0, 0);

  if (startTime >= availStart && endTime <= availEnd) return { isAvailable: true };
  return { isAvailable: false, message: `Instruktøren er tilgjengelig ${availability.startTime}-${availability.endTime} denne dagen` };
}

export async function createBookingWithConflictCheck<T>(
  data: {
    instructorId: string;
    startTime: Date;
    endTime: Date;
    bufferBefore?: number;
    bufferAfter?: number;
    createFn: (tx: Prisma.TransactionClient) => Promise<T>;
  }
): Promise<{ success: true; result: T } | { success: false; error: string }> {
  const { instructorId, startTime, endTime, bufferBefore = 0, bufferAfter = 0, createFn } = data;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const conflict = await checkAllConflicts({ instructorId, startTime, endTime, bufferBefore, bufferAfter }, tx);
        if (conflict.hasConflict) throw new Error(conflict.message);
        return await createFn(tx);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 10000 }
    );
    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "Ukjent feil ved opprettelse av booking" };
  }
}

// Bakoverkompatibilitet for health check
export async function detectExistingDoubleBookings(): Promise<Array<{ id: string; instructorId: string; startTime: Date; endTime: Date }>> {
  const bookings = await prisma.booking.findMany({
    where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } },
    select: { id: true, instructorId: true, startTime: true, endTime: true },
  });
  
  const conflicts: Array<{ id: string; instructorId: string; startTime: Date; endTime: Date }> = [];
  const seen = new Map<string, Array<{ id: string; startTime: Date; endTime: Date }>>();
  
  for (const booking of bookings) {
    const key = `${booking.instructorId}:${booking.startTime.toISOString()}`;
    const existing = seen.get(key) || [];
    
    for (const other of existing) {
      if (booking.startTime < other.endTime && booking.endTime > other.startTime) {
        conflicts.push(booking);
        break;
      }
    }
    
    existing.push({ id: booking.id, startTime: booking.startTime, endTime: booking.endTime });
    seen.set(key, existing);
  }
  
  return conflicts;
}

export async function getBookingStats(): Promise<{ totalBookings: number; activeBookings: number; pendingLocks: number; doubleBookingsDetected: number }> {
  const [totalBookings, activeBookings, doubleBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } } }),
    detectExistingDoubleBookings(),
  ]);
  
  return {
    totalBookings,
    activeBookings,
    pendingLocks: 0,
    doubleBookingsDetected: doubleBookings.length,
  };
}
