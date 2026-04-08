/**
 * Caching for booking-systemet
 */

import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { generateSlotsWithOverrides } from "@/lib/portal/slots";

export const CACHE_TTL = {
  SLOTS: 30,
  AVAILABILITY: 60,
  BOOKINGS: 10,
  INSTRUCTORS: 300,
};

export const CACHE_TAGS = {
  slots: (instructorId: string, date: string) => `slots:${instructorId}:${date}`,
  availability: (instructorId: string) => `availability:${instructorId}`,
  bookings: (instructorId: string) => `bookings:${instructorId}`,
  allSlots: "slots:all",
  allBookings: "bookings:all",
};

export const getCachedSlots = unstable_cache(
  async (
    instructorId: string,
    date: Date,
    serviceTypeId: string
  ): Promise<string[]> => {
    const supabase = createServiceClient();
    
    const { data: serviceType, error } = await supabase
      .from("ServiceType")
      .select("duration, bufferAfter, bufferBefore, minNoticeHours")
      .eq("id", serviceTypeId)
      .single();

    if (error || !serviceType) return [];

    return generateSlotsWithOverrides({
      instructorId,
      date,
      duration: serviceType.duration,
      bufferAfter: serviceType.bufferAfter,
      bufferBefore: serviceType.bufferBefore,
      minNoticeHours: serviceType.minNoticeHours,
    });
  },
  ["slots"],
  { revalidate: CACHE_TTL.SLOTS, tags: ["slots"] }
);

export async function invalidateSlotsCache(
  instructorId: string,
  date?: string
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { revalidateTag } = await import("next/cache") as any;
    
    if (date) revalidateTag(CACHE_TAGS.slots(instructorId, date));
    revalidateTag(CACHE_TAGS.availability(instructorId));
    revalidateTag(CACHE_TAGS.allSlots);
  } catch {
    // Fallback: cache vil utløpe naturlig
  }
}

export async function invalidateBookingsCache(
  instructorId: string
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { revalidateTag } = await import("next/cache") as any;
    revalidateTag(CACHE_TAGS.bookings(instructorId));
    revalidateTag(CACHE_TAGS.allBookings);
  } catch {
    // Fallback
  }
}

class RealtimeCache {
  private activeViewers: Map<string, Set<string>> = new Map();

  addViewer(instructorId: string, clientId: string): void {
    if (!this.activeViewers.has(instructorId)) {
      this.activeViewers.set(instructorId, new Set());
    }
    this.activeViewers.get(instructorId)!.add(clientId);
  }

  removeViewer(instructorId: string, clientId: string): void {
    const viewers = this.activeViewers.get(instructorId);
    if (viewers) {
      viewers.delete(clientId);
      if (viewers.size === 0) this.activeViewers.delete(instructorId);
    }
  }

  getViewers(instructorId: string): Set<string> {
    return this.activeViewers.get(instructorId) || new Set();
  }

  hasActiveViewers(instructorId: string): boolean {
    const viewers = this.activeViewers.get(instructorId);
    return viewers ? viewers.size > 0 : false;
  }
}

export const realtimeCache = new RealtimeCache();
