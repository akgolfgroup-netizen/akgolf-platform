/**
 * Konfliktsjekk for booking-systemet
 */

import { createServiceClient } from "@/lib/supabase/server";
import { BookingStatus } from "@prisma/client";
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
  options: ConflictCheckOptions
): Promise<ConflictResult> {
  const {
    instructorId,
    startTime,
    endTime,
    excludeBookingId,
    bufferBefore = 0,
    bufferAfter = 0,
  } = options;

  const supabase = createServiceClient();
  const conflictStart = addMinutes(startTime, -bufferBefore);
  const conflictEnd = addMinutes(endTime, bufferAfter);

  let query = supabase
    .from("Booking")
    .select("id, startTime, endTime, status")
    .eq("instructorId", instructorId)
    .in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED])
    .lt("startTime", conflictEnd.toISOString())
    .gt("endTime", conflictStart.toISOString());

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId);
  }

  const { data: existingBooking, error } = await query.limit(1).single();

  if (error && error.code !== "PGRST116") {
    console.error("[ConflictCheck] Error checking double booking:", error);
  }

  if (existingBooking) {
    return {
      hasConflict: true,
      conflictType: "booking",
      conflictingItem: {
        id: existingBooking.id,
        startTime: new Date(existingBooking.startTime),
        endTime: new Date(existingBooking.endTime),
        type: "booking",
      },
      message: "Tidspunktet er allerede booket",
    };
  }

  return { hasConflict: false, conflictType: null, message: "Ingen konflikt funnet" };
}

export async function checkBlockedTimeConflict(
  options: Omit<ConflictCheckOptions, "bufferBefore" | "bufferAfter">
): Promise<ConflictResult> {
  const { instructorId, startTime, endTime } = options;
  const supabase = createServiceClient();

  const { data: blockedTime, error } = await supabase
    .from("BlockedTime")
    .select("id, startTime, endTime, reason")
    .or(`instructorId.eq.${instructorId},instructorId.is.null`)
    .lt("startTime", endTime.toISOString())
    .gt("endTime", startTime.toISOString())
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("[ConflictCheck] Error checking blocked time:", error);
  }

  if (blockedTime) {
    return {
      hasConflict: true,
      conflictType: "blocked",
      conflictingItem: {
        id: blockedTime.id,
        startTime: new Date(blockedTime.startTime),
        endTime: new Date(blockedTime.endTime),
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
  options: ConflictCheckOptions & { checkBlocked?: boolean; checkFacility?: boolean; facilityId?: string }
): Promise<ConflictResult> {
  const { checkBlocked = true } = options;

  const bookingConflict = await checkDoubleBookingConflict(options);
  if (bookingConflict.hasConflict) return bookingConflict;

  if (checkBlocked) {
    const blockedConflict = await checkBlockedTimeConflict(options);
    if (blockedConflict.hasConflict) return blockedConflict;
  }

  return { hasConflict: false, conflictType: null, message: "Ingen konflikter funnet" };
}

export async function validateInstructorAvailability(
  instructorId: string,
  startTime: Date,
  endTime: Date
): Promise<{ isAvailable: boolean; message?: string }> {
  const supabase = createServiceClient();
  const dayOfWeek = startTime.getUTCDay();
  const dateOnly = new Date(Date.UTC(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate(), 0, 0, 0, 0));

  // Check date-specific override first
  const { data: dateOverride } = await supabase
    .from("InstructorDateAvailability")
    .select("startTime, endTime")
    .eq("instructorId", instructorId)
    .eq("date", dateOnly.toISOString())
    .limit(1)
    .single();

  if (dateOverride) {
    const [sH, sM] = dateOverride.startTime.split(":").map(Number);
    const [eH, eM] = dateOverride.endTime.split(":").map(Number);
    const availStart = new Date(startTime); availStart.setUTCHours(sH, sM, 0, 0);
    const availEnd = new Date(startTime); availEnd.setUTCHours(eH, eM, 0, 0);

    if (startTime >= availStart && endTime <= availEnd) return { isAvailable: true };
    return { isAvailable: false, message: `Instruktøren er kun tilgjengelig ${dateOverride.startTime}-${dateOverride.endTime} denne dagen` };
  }

  // Check regular availability
  const { data: availability, error } = await supabase
    .from("InstructorAvailability")
    .select("startTime, endTime")
    .eq("instructorId", instructorId)
    .eq("dayOfWeek", dayOfWeek)
    .or("validUntil.is.null,validUntil.gte." + new Date().toISOString())
    .limit(1)
    .single();

  if (error || !availability) {
    return { isAvailable: false, message: "Instruktøren er ikke tilgjengelig på denne ukedagen" };
  }

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
    createFn: () => Promise<T>;
  }
): Promise<{ success: true; result: T } | { success: false; error: string }> {
  const { instructorId, startTime, endTime, bufferBefore = 0, bufferAfter = 0, createFn } = data;

  try {
    const conflict = await checkAllConflicts({ instructorId, startTime, endTime, bufferBefore, bufferAfter });
    if (conflict.hasConflict) throw new Error(conflict.message);
    
    const result = await createFn();
    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "Ukjent feil ved opprettelse av booking" };
  }
}

// Bakoverkompatibilitet for health check
export async function detectExistingDoubleBookings(): Promise<Array<{ id: string; instructorId: string; startTime: Date; endTime: Date }>> {
  const supabase = createServiceClient();
  
  const { data: bookings, error } = await supabase
    .from("Booking")
    .select("id, instructorId, startTime, endTime")
    .in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED]);
  
  if (error || !bookings) return [];
  
  const conflicts: Array<{ id: string; instructorId: string; startTime: Date; endTime: Date }> = [];
  const seen = new Map<string, Array<{ id: string; startTime: Date; endTime: Date }>>();
  
  for (const booking of bookings) {
    const key = `${booking.instructorId}:${new Date(booking.startTime).toISOString()}`;
    const existing = seen.get(key) || [];
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    for (const other of existing) {
      if (bookingStart < other.endTime && bookingEnd > other.startTime) {
        conflicts.push({
          id: booking.id,
          instructorId: booking.instructorId,
          startTime: bookingStart,
          endTime: bookingEnd,
        });
        break;
      }
    }
    
    existing.push({ id: booking.id, startTime: bookingStart, endTime: bookingEnd });
    seen.set(key, existing);
  }
  
  return conflicts;
}

export async function getBookingStats(): Promise<{ totalBookings: number; activeBookings: number; pendingLocks: number; doubleBookingsDetected: number }> {
  const supabase = createServiceClient();
  
  const [{ count: totalBookings }, { count: activeBookings }, doubleBookings] = await Promise.all([
    supabase.from("Booking").select("id", { count: "exact", head: true }),
    supabase.from("Booking").select("id", { count: "exact", head: true }).in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED]),
    detectExistingDoubleBookings(),
  ]);
  
  return {
    totalBookings: totalBookings || 0,
    activeBookings: activeBookings || 0,
    pendingLocks: 0,
    doubleBookingsDetected: doubleBookings.length,
  };
}
