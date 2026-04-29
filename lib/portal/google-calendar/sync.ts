/**
 * Google Calendar Sync for AK Golf Portal
 * 
 * Synkroniserer Google Calendar events til BlockedTime for å hindre
double-booking når Anders har møter i sin Google Calendar.
 */

import { createServiceClient } from "@/lib/supabase/server";
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
export async function getValidAccessToken(
  userId: string
): Promise<string | null> {
  const supabase = createServiceClient();
  
  const { data: user, error } = await supabase
    .from("User")
    .select("googleCalendarTokens")
    .eq("id", userId)
    .single();

  if (error || !user?.googleCalendarTokens) {
    return null;
  }

  const tokens = user.googleCalendarTokens as unknown as GoogleTokens;

  // Refresh hvis utløpt eller utløper innen 5 minutter
  if (Date.now() >= tokens.expires_at - 5 * 60 * 1000) {
    if (!tokens.refresh_token) {
      return null;
    }

    logger.info(`[Google Calendar Sync] Refreshing token for user ${userId}`);
    
    const refreshed = await refreshAccessToken(tokens.refresh_token);
    
    await supabase
      .from("User")
      .update({
        googleCalendarTokens: {
          ...tokens,
          access_token: refreshed.accessToken,
          expires_at: refreshed.expiresAt.getTime(),
        } as object,
      })
      .eq("id", userId);

    return refreshed.accessToken;
  }

  return tokens.access_token;
}

/**
 * Hent liste over alle Google-kalendere brukeren har tilgang til
 */
export async function fetchCalendarList(
  accessToken: string
): Promise<Array<{ id: string; summary: string; primary?: boolean; backgroundColor?: string }>> {
  const res = await fetch(`${GOOGLE_CALENDAR_API}/users/me/calendarList`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`[Google Calendar] calendarList failed: ${res.status}`);
  }
  const data = await res.json();
  return (data.items || []).map((c: { id: string; summary: string; primary?: boolean; backgroundColor?: string }) => ({
    id: c.id,
    summary: c.summary,
    primary: c.primary,
    backgroundColor: c.backgroundColor,
  }));
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
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true", // Ekspander recurring events
    orderBy: "startTime",
    maxResults: "250",
  });

  const calId = calendarId === "primary" ? "primary" : calendarId;
  const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calId)}/events?${params.toString()}`;

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
  startTime: string;
  endTime: string;
  reason: string;
  source: "GOOGLE_CALENDAR";
  isRecurring: boolean;
} {
  // Håndter all-day events (date) vs timed events (dateTime)
  const startTime = event.start.dateTime 
    ? new Date(event.start.dateTime).toISOString()
    : new Date(event.start.date!).toISOString(); // All-day event

  const endTime = event.end.dateTime
    ? new Date(event.end.dateTime).toISOString()
    : new Date(event.end.date!).toISOString(); // All-day event

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
  const supabase = createServiceClient();
  
  // Hent instruktør med tilhørende bruker for å få tokens
  const { data: instructor, error } = await supabase
    .from("Instructor")
    .select(`
      id,
      User:userId (
        id,
        googleCalendarTokens
      )
    `)
    .eq("id", instructorId)
    .single();

  if (error || !instructor) {
    return {
      synced: 0,
      errors: 1,
      message: "Ingen instruktør funnet",
    };
  }

  const userArr = instructor.User as unknown as Array<{ id: string; googleCalendarTokens: unknown }>;
  const userData = userArr?.[0] ?? null;
  
  if (!userData?.googleCalendarTokens) {
    return {
      synced: 0,
      errors: 1,
      message: "Ingen Google Calendar kobling funnet for instruktør",
    };
  }

  try {
    // 1. Hent gyldig access token
    const accessToken = await getValidAccessToken(userData.id);
    
    if (!accessToken) {
      return {
        synced: 0,
        errors: 1,
        message: "Kunne ikke hente gyldig access token",
      };
    }

    // 2. Definer tidsperiode for synkronisering
    // Synkroniser 30 dager tilbake og 180 dager fremover
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const timeMax = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    // 3. Hent valgte kalender-ID-er for brukeren (faller tilbake til primary hvis tabellen mangler)
    let calendarIds: string[] = ["primary"];
    try {
      const { data: subscriptions } = await supabase
        .from("UserCalendarSubscription")
        .select("googleCalendarId")
        .eq("userId", userData.id)
        .eq("enabled", true);
      if (subscriptions && subscriptions.length > 0) {
        calendarIds = subscriptions.map((s) => s.googleCalendarId as string);
      }
    } catch (err) {
      logger.warn("[Google Calendar Sync] UserCalendarSubscription ikke tilgjengelig, bruker primary", err instanceof Error ? { msg: err.message } : undefined);
    }

    // 4. Hent events fra alle valgte kalendere
    const events: GoogleCalendarEvent[] = [];
    for (const calId of calendarIds) {
      try {
        const calEvents = await fetchCalendarEvents(accessToken, calId, timeMin, timeMax);
        // Prefix externalId med kalenderId for å unngå kollisjon
        for (const ev of calEvents) {
          events.push({ ...ev, id: `${calId}:${ev.id}` });
        }
      } catch (err) {
        logger.error(`[Google Calendar Sync] Kalender ${calId} feilet:`, err);
      }
    }

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

        // Sjekk om det finnes en eksisterende post
        const { data: existing } = await supabase
          .from("BlockedTime")
          .select("id")
          .eq("externalId", event.id)
          .single();

        if (existing) {
          // Oppdater eksisterende
          await supabase
            .from("BlockedTime")
            .update({
              startTime: blockedTimeData.startTime,
              endTime: blockedTimeData.endTime,
              reason: blockedTimeData.reason,
              isRecurring: blockedTimeData.isRecurring,
            })
            .eq("id", existing.id);
        } else {
          // Opprett ny
          await supabase
            .from("BlockedTime")
            .insert({
              id: nanoid(),
              ...blockedTimeData,
            });
        }

        synced++;
      } catch (error) {
        logger.error(
          `[Google Calendar Sync] Failed to sync event ${event.id}:`,
          error
        );
        errors++;
      }
    }

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
  details: Array<{ instructorId: string; result: Awaited<ReturnType<typeof syncGoogleCalendar>> }>;
}> {
  const supabase = createServiceClient();
  
  // Hent alle instruktører som har Google Calendar tokens
  const { data: instructors, error } = await supabase
    .from("Instructor")
    .select(`
      id,
      User:userId (
        googleCalendarTokens
      )
    `);

  if (error || !instructors) {
    return {
      total: 0,
      successful: 0,
      failed: 0,
      details: [],
    };
  }

  // Filtrer bare de med Google Calendar tokens
  const instructorsWithTokens = instructors.filter((inst) => {
    const userArr = inst.User as unknown as Array<{ googleCalendarTokens: unknown }>;
    const userData = userArr?.[0] ?? null;
    return !!userData?.googleCalendarTokens;
  });

  const results = [];
  let successful = 0;
  let failed = 0;

  for (const instructor of instructorsWithTokens) {
    const result = await syncGoogleCalendar(instructor.id);
    results.push({ instructorId: instructor.id, result });

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
    total: instructorsWithTokens.length,
    successful,
    failed,
    details: results,
  };
}

/**
 * Hent synkroniseringsstatus for en instruktør
 */
export async function getSyncStatus(instructorId: string) {
  const supabase = createServiceClient();
  
  // Hent instruktør med brukerinfo
  const { data: instructor, error } = await supabase
    .from("Instructor")
    .select(`
      id,
      createdAt,
      updatedAt,
      User:userId (
        googleCalendarTokens,
        googleCalendarId
      )
    `)
    .eq("id", instructorId)
    .single();

  if (error || !instructor) {
    return null;
  }

  const userArr = instructor.User as unknown as Array<{
    googleCalendarTokens: unknown;
    googleCalendarId: string | null;
  }>;
  const userData = userArr?.[0] ?? null;

  // Tell antall blokkerte tider fra Google Calendar
  const { count: blockedCount } = await supabase
    .from("BlockedTime")
    .select("id", { count: "exact", head: true })
    .eq("instructorId", instructorId)
    .eq("source", "GOOGLE_CALENDAR")
    .gte("endTime", new Date().toISOString());

  return {
    id: instructor.id,
    calendarId: userData?.googleCalendarId || "primary",
    syncEnabled: !!userData?.googleCalendarTokens,
    lastSyncAt: null, // Vi sporer ikke dette ennå
    lastError: null,
    lastErrorAt: null,
    createdAt: instructor.createdAt,
    updatedAt: instructor.updatedAt,
    blockedCount: blockedCount || 0,
  };
}

/**
 * Fjern Google Calendar kobling og alle tilhørende blocked times
 */
export async function disconnectGoogleCalendar(
  instructorId: string
): Promise<void> {
  const supabase = createServiceClient();
  
  // Hent instruktørens brukerId
  const { data: instructor, error } = await supabase
    .from("Instructor")
    .select("userId")
    .eq("id", instructorId)
    .single();

  if (error || !instructor) {
    throw new Error("Ingen instruktør funnet");
  }

  // Slett alle blocked times fra Google Calendar
  await supabase
    .from("BlockedTime")
    .delete()
    .eq("instructorId", instructorId)
    .eq("source", "GOOGLE_CALENDAR");

  // Fjern tokens fra bruker
  await supabase
    .from("User")
    .update({
      googleCalendarTokens: null,
      googleCalendarId: null,
    })
    .eq("id", instructor.userId);

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
  const supabase = createServiceClient();
  const { from, to, limit = 50 } = options;

  let query = supabase
    .from("BlockedTime")
    .select("id, startTime, endTime, reason, externalId, isRecurring, createdAt")
    .eq("instructorId", instructorId)
    .eq("source", "GOOGLE_CALENDAR")
    .order("startTime", { ascending: false })
    .limit(limit);

  if (from) {
    query = query.gte("startTime", from.toISOString());
  }

  if (to) {
    query = query.lte("endTime", to.toISOString());
  }

  const { data: events, error } = await query;

  if (error) throw error;

  return events || [];
}
