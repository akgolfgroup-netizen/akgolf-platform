"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath, revalidateTag } from "next/cache";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { addMinutes, startOfDay, endOfDay, format } from "date-fns";

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export async function getInstructors(): Promise<Instructor[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const instructors = await prisma.instructor.findMany({
    include: {
      User: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      User: { name: "asc" },
    },
  });

  return instructors.map((i) => ({
    id: i.id,
    name: i.User?.name || "Ukjent",
    email: i.User?.email || "",
  }));
}

export async function getAvailability(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.instructorAvailability.findMany({
    where: { instructorId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function upsertAvailability(
  instructorId: string,
  slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  // Replace all availability for this instructor in a transaction
  await prisma.$transaction([
    prisma.instructorAvailability.deleteMany({ where: { instructorId } }),
    ...slots.map((slot) =>
      prisma.instructorAvailability.create({
        data: {
          id: nanoid(),
          instructorId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      })
    ),
  ]);

  // Revalidate cache
  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
  revalidateTag(`availability:${instructorId}`, {});
  
  // Invalidate slots cache for this instructor
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/portal/public/slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instructorId }),
  }).catch(() => {
    // Silent fail - cache will expire naturally
  });
}

export async function getBlockedTimes(instructorId?: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.blockedTime.findMany({
    where: {
      ...(instructorId ? { instructorId } : {}),
      endTime: { gte: new Date() },
    },
    orderBy: { startTime: "asc" },
    take: 50,
  });
}

export async function createBlockedTime(data: {
  instructorId?: string;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const blockedTime = await prisma.blockedTime.create({
    data: {
      id: nanoid(),
      instructorId: data.instructorId || null,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      reason: data.reason,
      source: "MANUAL",
    },
  });

  // Revalidate cache
  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
  if (data.instructorId) {
    revalidateTag(`availability:${data.instructorId}`, {});
  }

  return blockedTime;
}

export async function deleteBlockedTime(id: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const blockedTime = await prisma.blockedTime.delete({ 
    where: { id },
    select: { instructorId: true },
  });

  // Revalidate cache
  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
  if (blockedTime.instructorId) {
    revalidateTag(`availability:${blockedTime.instructorId}`, {});
  }
}

/**
 * Synkroniserer Google Calendar events som blokkerte tider
 * 
 * I en full implementasjon ville dette:
 * 1. Hentet access token fra GoogleCalendarSync
 * 2. Kalt Google Calendar API for å hente events
 * 3. Opprettet BlockedTime records for hver event
 * 
 * For nå simulerer vi en sync med mock data.
 */
export async function syncGoogleCalendar(
  instructorId: string
): Promise<{ success: boolean; count: number; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, count: 0, error: "Ikke autorisert" };
  }

  try {
    // Check if instructor has Google Calendar connected
    const syncConfig = await prisma.googleCalendarSync.findUnique({
      where: { instructorId },
    });

    if (!syncConfig) {
      return {
        success: false,
        count: 0,
        error: "Ingen Google Calendar koblet for denne instruktøren",
      };
    }

    if (!syncConfig.syncEnabled) {
      return {
        success: false,
        count: 0,
        error: "Synkronisering er deaktivert for denne instruktøren",
      };
    }

    // TODO: Implement actual Google Calendar API sync
    // For now, create some example blocked times
    const today = new Date();
    const mockEvents = [
      {
        start: addMinutes(startOfDay(addMinutes(today, 24 * 60 * 2)), 9 * 60), // Day after tomorrow 09:00
        end: addMinutes(startOfDay(addMinutes(today, 24 * 60 * 2)), 12 * 60),
        reason: "Møte (Google Calendar)",
        externalId: `gc-${nanoid(8)}`,
      },
    ];

    let createdCount = 0;

    for (const event of mockEvents) {
      // Check if already synced
      const existing = await prisma.blockedTime.findFirst({
        where: {
          instructorId,
          externalId: event.externalId,
        },
      });

      if (!existing) {
        await prisma.blockedTime.create({
          data: {
            id: nanoid(),
            instructorId,
            startTime: event.start,
            endTime: event.end,
            reason: event.reason,
            source: "GOOGLE_CALENDAR",
            externalId: event.externalId,
          },
        });
        createdCount++;
      }
    }

    // Update last sync time
    await prisma.googleCalendarSync.update({
      where: { instructorId },
      data: { lastSyncAt: new Date() },
    });

    // Revalidate cache
    revalidatePath("/portal/admin/tilgjengelighet");
    revalidateTag("slots", {});
    revalidateTag(`availability:${instructorId}`, {});

    logger.info(
      `[google-calendar-sync] Synced ${createdCount} events for instructor ${instructorId}`
    );

    return { success: true, count: createdCount };
  } catch (error) {
    logger.error("[google-calendar-sync] Error:", error);
    
    // Update error log
    await prisma.googleCalendarSync.update({
      where: { instructorId },
      data: {
        lastError: error instanceof Error ? error.message : "Unknown error",
        lastErrorAt: new Date(),
      },
    }).catch(() => {
      // Ignore errors updating error log
    });

    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "Synkronisering feilet",
    };
  }
}

/**
 * Hent synkroniseringsstatus for Google Calendar
 */
export async function getGoogleCalendarSyncStatus(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const sync = await prisma.googleCalendarSync.findUnique({
    where: { instructorId },
    select: {
      syncEnabled: true,
      lastSyncAt: true,
      lastError: true,
      lastErrorAt: true,
      calendarId: true,
    },
  });

  return sync;
}
