import { prisma } from "@/lib/portal/prisma";
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
  const conflictingItems: ConflictingItem[] = [];

  // Sjekk overlappende aktiviteter
  const overlappingActivities = await prisma.facilityActivity.findMany({
    where: {
      facilityId,
      status: { not: FacilityActivityStatus.CANCELLED },
      id: excludeActivityId ? { not: excludeActivityId } : undefined,
      OR: [
        // Aktivitet starter i tidsrommet
        {
          startTime: { gte: startTime, lt: endTime },
        },
        // Aktivitet slutter i tidsrommet
        {
          endTime: { gt: startTime, lte: endTime },
        },
        // Aktivitet omslutter hele tidsrommet
        {
          startTime: { lte: startTime },
          endTime: { gte: endTime },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
    },
  });

  for (const activity of overlappingActivities) {
    conflictingItems.push({
      type: "activity",
      id: activity.id,
      title: activity.title,
      startTime: activity.startTime,
      endTime: activity.endTime,
    });
  }

  // Sjekk overlappende bookinger
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      facilityId,
      status: {
        in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      OR: [
        // Booking starter i tidsrommet
        {
          startTime: { gte: startTime, lt: endTime },
        },
        // Booking slutter i tidsrommet
        {
          endTime: { gt: startTime, lte: endTime },
        },
        // Booking omslutter hele tidsrommet
        {
          startTime: { lte: startTime },
          endTime: { gte: endTime },
        },
      ],
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      User: {
        select: { name: true },
      },
      ServiceType: {
        select: { name: true },
      },
    },
  });

  for (const booking of overlappingBookings) {
    conflictingItems.push({
      type: "booking",
      id: booking.id,
      title: `${booking.ServiceType.name} - ${booking.User.name ?? "Ukjent"}`,
      startTime: booking.startTime,
      endTime: booking.endTime,
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
