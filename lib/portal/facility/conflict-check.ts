import { createServiceClient } from "@/lib/supabase/server";
import { BookingStatus, FacilityActivityStatus } from "@prisma/client";

export interface ConflictingItem {
  type: "booking" | "activity";
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingItems: ConflictingItem[];
}

/**
 * Sjekker om det finnes konflikter for en fasilitet i et gitt tidsrom
 * @param facilityId - ID for fasiliteten
 * @param startTime - Starttidspunkt
 * @param endTime - Sluttidspunkt
 * @param excludeActivityId - ID for aktivitet som skal ekskluderes (ved oppdatering)
 * @param excludeBookingId - ID for booking som skal ekskluderes (ved oppdatering)
 */
export async function checkFacilityConflicts(
  facilityId: string,
  startTime: Date,
  endTime: Date,
  excludeActivityId?: string,
  excludeBookingId?: string
): Promise<ConflictCheckResult> {
  const supabase = createServiceClient();
  const conflictingItems: ConflictingItem[] = [];

  // Sjekk overlappende aktiviteter
  let activityQuery = supabase
    .from("FacilityActivity")
    .select("id, title, startTime, endTime")
    .eq("facilityId", facilityId)
    .neq("status", "CANCELLED" as FacilityActivityStatus)
    .or(
      `and(startTime.gte.${startTime.toISOString()},startTime.lt.${endTime.toISOString()}),` +
      `and(endTime.gt.${startTime.toISOString()},endTime.lte.${endTime.toISOString()}),` +
      `and(startTime.lte.${startTime.toISOString()},endTime.gte.${endTime.toISOString()})`
    );

  if (excludeActivityId) {
    activityQuery = activityQuery.neq("id", excludeActivityId);
  }

  const { data: overlappingActivities } = await activityQuery;

  for (const activity of overlappingActivities || []) {
    conflictingItems.push({
      type: "activity",
      id: activity.id,
      title: activity.title,
      startTime: new Date(activity.startTime),
      endTime: new Date(activity.endTime),
    });
  }

  // Sjekk overlappende bookinger
  let bookingQuery = supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      endTime,
      User:studentId(name),
      ServiceType:serviceTypeId(name)
    `)
    .eq("facilityId", facilityId)
    .in("status", ["CONFIRMED", "PENDING"] as BookingStatus[])
    .or(
      `and(startTime.gte.${startTime.toISOString()},startTime.lt.${endTime.toISOString()}),` +
      `and(endTime.gt.${startTime.toISOString()},endTime.lte.${endTime.toISOString()}),` +
      `and(startTime.lte.${startTime.toISOString()},endTime.gte.${endTime.toISOString()})`
    );

  if (excludeBookingId) {
    bookingQuery = bookingQuery.neq("id", excludeBookingId);
  }

  const { data: overlappingBookings } = await bookingQuery
    .returns<{
      id: string;
      startTime: string;
      endTime: string;
      User?: { name: string | null };
      ServiceType?: { name: string };
    }[]>();

  for (const booking of overlappingBookings || []) {
    conflictingItems.push({
      type: "booking",
      id: booking.id,
      title: `${booking.ServiceType?.name ?? "Ukjent tjeneste"} - ${booking.User?.name ?? "Ukjent"}`,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    });
  }

  return {
    hasConflict: conflictingItems.length > 0,
    conflictingItems,
  };
}

/**
 * Sjekker konflikter for flere fasiliteter samtidig
 */
export async function checkMultipleFacilityConflicts(
  facilityIds: string[],
  startTime: Date,
  endTime: Date
): Promise<Map<string, ConflictCheckResult>> {
  const results = new Map<string, ConflictCheckResult>();

  await Promise.all(
    facilityIds.map(async (facilityId) => {
      const result = await checkFacilityConflicts(facilityId, startTime, endTime);
      results.set(facilityId, result);
    })
  );

  return results;
}
