/**
 * Google Calendar Sync for AK Golf Portal
 * 
 * Synkroniserer Google Calendar events til BlockedTime for å hindre
double-booking når Anders har møter i sin Google Calendar.
 */

import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status: string;
  transparency?: string;
  visibility?: string;
  recurrence?: string[];
  created: string;
  updated: string;
}

function getClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("[Google Calendar Sync] GOOGLE_CLIENT_ID not set");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error("[Google Calendar Sync] GOOGLE_CLIENT_SECRET not set");
  return secret;
}

/**
 * Refresh access token hvis det er utløpt
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: Date }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[Google Calendar Sync] Token refresh failed: ${res.status} ${text}`
    );
  }

  const data = await res.json();

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
  };
}

/**
 * Hent gyldig access token, refresh om nødvendig
 */
async function getValidAccessToken(
  sync: {
    id: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }
): Promise<string> {
  // Refresh hvis utløpt eller utløper innen 5 minutter
  if (new Date() >= new Date(sync.expiresAt.getTime() - 5 * 60 * 1000)) {
    logger.info(`[Google Calendar Sync] Refreshing token for sync ${sync.id}`);
    
    const refreshed = await refreshAccessToken(sync.refreshToken);
    
    await prisma.googleCalendarSync.update({
      where: { id: sync.id },
      data: {
        accessToken: refreshed.accessToken,
        expiresAt: refreshed.expiresAt,
      },
    });

    return refreshed.accessToken;
  }

  return sync.accessToken;
}

/**
 * Hent events fra Google Calendar
 */
async function fetchCalendarEvents(
  accessToken: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date
): Promise<GoogleCalendarEvent[]> {
  const params = new URLSearchParams({
    calendarId: calendarId === "primary" ? "primary" : calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true", // Ekspander recurring events
    orderBy: "startTime",
    maxResults: "250",
  });

  const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId === "primary" ? "primary" : calendarId)}/events?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[Google Calendar Sync] Failed to fetch events: ${res.status} ${text}`
    );
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Sjekk om event skal synkroniseres
 * - Hopp over avlyste events
 * - Hopp over transparente events (free/available)
 * - Hopp over private events hvis konfigurert
 */
function shouldSyncEvent(event: GoogleCalendarEvent): boolean {
  // Hopp over avlyste events
  if (event.status === "cancelled") {
    return false;
  }

  // Hopp over events markert som "free" (transparent)
  if (event.transparency === "transparent") {
    return false;
  }

  // Hopp over private events
  if (event.visibility === "private") {
    logger.info(`[Google Calendar Sync] Skipping private event: ${event.summary}`);
    return false;
  }

  // Må ha enten dateTime eller date
  if (!event.start?.dateTime && !event.start?.date) {
    return false;
  }

  return true;
}

/**
 * Konverter Google Calendar event til BlockedTime
 */
function eventToBlockedTime(
  event: GoogleCalendarEvent,
  instructorId: string
): {
  externalId: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  source: "GOOGLE_CALENDAR";
  isRecurring: boolean;
} {
  // Håndter all-day events (date) vs timed events (dateTime)
  const startTime = event.start.dateTime 
    ? new Date(event.start.dateTime)
    : new Date(event.start.date!); // All-day event

  const endTime = event.end.dateTime
    ? new Date(event.end.dateTime)
    : new Date(event.end.date!); // All-day event

  return {
    externalId: event.id,
    instructorId,
    startTime,
    endTime,
    reason: event.summary || "Opptatt (Google Calendar)",
    source: "GOOGLE_CALENDAR",
    isRecurring: !!event.recurrence && event.recurrence.length > 0,
  };
}

/**
 * Synkroniser Google Calendar for en instruktør
 */
export async function syncGoogleCalendar(
  instructorId: string
): Promise<{ synced: number; errors: number; message: string }> {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { instructorId },
  });

  if (!sync) {
    return {
      synced: 0,
      errors: 1,
      message: "Ingen Google Calendar kobling funnet for instruktør",
    };
  }

  if (!sync.syncEnabled) {
    return {
      synced: 0,
      errors: 0,
      message: "Synkronisering er deaktivert",
    };
  }

  try {
    // 1. Hent gyldig access token
    const accessToken = await getValidAccessToken(sync);

    // 2. Definer tidsperiode for synkronisering
    // Synkroniser 30 dager tilbake og 180 dager fremover
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const timeMax = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    // 3. Hent events fra Google Calendar
    const events = await fetchCalendarEvents(
      accessToken,
      sync.calendarId,
      timeMin,
      timeMax
    );

    logger.info(
      `[Google Calendar Sync] Fetched ${events.length} events for instructor ${instructorId}`
    );

    // 4. Filtrer events som skal synkroniseres
    const eventsToSync = events.filter(shouldSyncEvent);

    // 5. Synkroniser hver event
    let synced = 0;
    let errors = 0;

    for (const event of eventsToSync) {
      try {
        const blockedTimeData = eventToBlockedTime(event, instructorId);

        await prisma.blockedTime.upsert({
          where: {
            externalId: event.id,
          },
          create: {
            id: nanoid(),
            ...blockedTimeData,
          },
          update: {
            startTime: blockedTimeData.startTime,
            endTime: blockedTimeData.endTime,
            reason: blockedTimeData.reason,
            isRecurring: blockedTimeData.isRecurring,
          },
        });

        synced++;
      } catch (error) {
        logger.error(
          `[Google Calendar Sync] Failed to sync event ${event.id}:`,
          error
        );
        errors++;
      }
    }

    // 6. Oppdater lastSyncAt og nullstill feil
    await prisma.googleCalendarSync.update({
      where: { id: sync.id },
      data: {
        lastSyncAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    });

    logger.info(
      `[Google Calendar Sync] Synced ${synced} events for instructor ${instructorId} (${errors} errors)`
    );

    return {
      synced,
      errors,
      message: `Synkronisert ${synced} events${errors > 0 ? ` (${errors} feil)` : ""}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ukjent feil";
    
    // Logg feilen
    await prisma.googleCalendarSync.update({
      where: { id: sync.id },
      data: {
        lastError: errorMessage,
        lastErrorAt: new Date(),
      },
    });

    logger.error(
      `[Google Calendar Sync] Sync failed for instructor ${instructorId}:`,
      error
    );

    return {
      synced: 0,
      errors: 1,
      message: `Synkronisering feilet: ${errorMessage}`,
    };
  }
}

/**
 * Synkroniser alle aktive Google Calendar koblinger
 * Brukes av cron job
 */
export async function syncAllGoogleCalendars(): Promise<{
  total: number;
  successful: number;
  failed: number;
  details: Array<{ instructorId: string; result: ReturnType<typeof syncGoogleCalendar> extends Promise<infer T> ? T : never }>;
}> {
  const syncs = await prisma.googleCalendarSync.findMany({
    where: {
      syncEnabled: true,
    },
    select: {
      instructorId: true,
    },
  });

  const results = [];
  let successful = 0;
  let failed = 0;

  for (const { instructorId } of syncs) {
    if (!instructorId) continue;

    const result = await syncGoogleCalendar(instructorId);
    results.push({ instructorId, result });

    if (result.errors === 0) {
      successful++;
    } else {
      failed++;
    }
  }

  logger.info(
    `[Google Calendar Sync] Batch sync complete: ${successful} successful, ${failed} failed`
  );

  return {
    total: syncs.length,
    successful,
    failed,
    details: results,
  };
}

/**
 * Hent synkroniseringsstatus for en instruktør
 */
export async function getSyncStatus(instructorId: string) {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { instructorId },
    select: {
      id: true,
      calendarId: true,
      syncEnabled: true,
      lastSyncAt: true,
      lastError: true,
      lastErrorAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!sync) {
    return null;
  }

  // Tell antall blokkerte tider fra Google Calendar
  const blockedCount = await prisma.blockedTime.count({
    where: {
      instructorId,
      source: "GOOGLE_CALENDAR",
      endTime: {
        gte: new Date(),
      },
    },
  });

  return {
    ...sync,
    blockedCount,
  };
}

/**
 * Fjern Google Calendar kobling og alle tilhørende blocked times
 */
export async function disconnectGoogleCalendar(
  instructorId: string
): Promise<void> {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { instructorId },
  });

  if (!sync) {
    throw new Error("Ingen Google Calendar kobling funnet");
  }

  // Slett alle blocked times fra Google Calendar
  await prisma.blockedTime.deleteMany({
    where: {
      instructorId,
      source: "GOOGLE_CALENDAR",
    },
  });

  // Slett sync-konfigurasjonen
  await prisma.googleCalendarSync.delete({
    where: { id: sync.id },
  });

  logger.info(
    `[Google Calendar Sync] Disconnected calendar for instructor ${instructorId}`
  );
}

/**
 * Hent importerte events for visning i admin
 */
export async function getImportedEvents(
  instructorId: string,
  options: {
    from?: Date;
    to?: Date;
    limit?: number;
  } = {}
) {
  const { from, to, limit = 50 } = options;

  const where = {
    instructorId,
    source: "GOOGLE_CALENDAR" as const,
    ...(from && { startTime: { gte: from } }),
    ...(to && { endTime: { lte: to } }),
  };

  const events = await prisma.blockedTime.findMany({
    where,
    orderBy: {
      startTime: "desc",
    },
    take: limit,
    select: {
      id: true,
      startTime: true,
      endTime: true,
      reason: true,
      externalId: true,
      isRecurring: true,
      createdAt: true,
    },
  });

  return events;
}
