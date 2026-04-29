/**
 * Google Calendar Webhook Handler
 * 
 * Håndterer push-notifikasjoner fra Google Calendar når det skjer endringer.
 * Krever at webhook er satt opp via Google Calendar API.
 * 
 * Flow:
 * 1. Vi registrerer en webhook via Google Calendar API watch endpoint
 * 2. Google sender notifikasjoner til vår webhook URL når kalenderen endres
 * 3. Vi trigger synkronisering basert på notifikasjonen
 */

import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { syncGoogleCalendar, getValidAccessToken } from "./sync";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

// Vindu (ms) for å fornye webhook FØR utløp. Google maks-utløp = 7 dager,
// så 24 timer gir oss god buffer hvis cron eller fornyelsen feiler én gang.
const RENEWAL_WINDOW_MS = 24 * 60 * 60 * 1000;

 
interface WebhookNotification {
  kind: "api#channel";
  id: string;
  resourceId: string;
  resourceUri: string;
  token?: string;
}

/**
 * Start watching en kalender for endringer
 * Dette registrerer en webhook hos Google
 */
export async function startWatchingCalendar(
  instructorId: string,
  accessToken: string,
  calendarId: string = "primary"
): Promise<{ channelId: string; resourceId: string; expiration: Date } | null> {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/portal/calendar/google/webhook`;
    const channelId = `akgolf-${instructorId}-${Date.now()}`;

    const res = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/watch`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: channelId,
          type: "web_hook",
          address: webhookUrl,
          token: instructorId, // Bruk instructorId som token for verifisering
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      logger.error(
        `[Google Calendar Webhook] Failed to start watching: ${res.status} ${text}`
      );
      return null;
    }

    const data = await res.json();
    const expiration = new Date(parseInt(data.expiration));

    // Persistér webhook-state så `renewExpiringWebhooks()` kan finne
    // og fornye dem før Google trekker dem (max 7 dager hos Google).
    await prisma.instructor.update({
      where: { id: instructorId },
      data: {
        calendarWebhookChannelId: data.id,
        calendarWebhookResourceId: data.resourceId,
        calendarWebhookExpiration: expiration,
        calendarWebhookCalendarId: calendarId,
      },
    });

    logger.info(
      `[Google Calendar Webhook] Started watching calendar for instructor ${instructorId} (expires ${expiration.toISOString()})`
    );

    return {
      channelId: data.id,
      resourceId: data.resourceId,
      expiration,
    };
  } catch (error) {
    logger.error(
      `[Google Calendar Webhook] Error starting watch:`,
      error
    );
    return null;
  }
}

/**
 * Stopp watching en kalender
 */
export async function stopWatchingCalendar(
  channelId: string,
  resourceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const res = await fetch(`${GOOGLE_CALENDAR_API}/channels/stop`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: channelId,
        resourceId: resourceId,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error(
        `[Google Calendar Webhook] Failed to stop watching: ${res.status} ${text}`
      );
      return false;
    }

    logger.info(`[Google Calendar Webhook] Stopped watching ${channelId}`);
    return true;
  } catch (error) {
    logger.error(
      `[Google Calendar Webhook] Error stopping watch:`,
      error
    );
    return false;
  }
}

/**
 * Håndter innkommende webhook-notifikasjon fra Google
 */
export async function handleWebhookNotification(
  headers: Headers
): Promise<{ success: boolean; message: string; instructorId?: string }> {
  // Google sender headers:
  // X-Goog-Channel-ID: channel ID
  // X-Goog-Resource-ID: resource ID
  // X-Goog-Resource-State: sync | exists
  // X-Goog-Message-Number: message number
  // X-Goog-Channel-Token: token (vår instructorId)

  const channelId = headers.get("X-Goog-Channel-ID");
  const resourceId = headers.get("X-Goog-Resource-ID");
  const resourceState = headers.get("X-Goog-Resource-State");
  const channelToken = headers.get("X-Goog-Channel-Token");

  if (!channelId || !resourceId) {
    return { success: false, message: "Manglende headers" };
  }

  // X-Goog-Resource-State: "sync" er bare en ping ved oppstart
  if (resourceState === "sync") {
    return { success: true, message: "Sync ping mottatt" };
  }

  // Hent instructorId fra token
  const instructorId = channelToken;
  if (!instructorId) {
    return { success: false, message: "Manglende channel token" };
  }

  // Sjekk at instruktøren eksisterer
  const supabase = createServiceClient();
  const { data: instructor, error } = await supabase
    .from("Instructor")
    .select("id")
    .eq("id", instructorId)
    .single();

  if (error || !instructor) {
    return {
      success: false,
      message: "Instruktør ikke funnet",
    };
  }

  // Trigger synkronisering
  logger.info(
    `[Google Calendar Webhook] Change detected for instructor ${instructorId}, triggering sync`
  );

  // Kjør sync i bakgrunnen (ikke await for raskere respons)
  syncGoogleCalendar(instructorId).catch((error) => {
    logger.error(
      `[Google Calendar Webhook] Background sync failed for ${instructorId}:`,
      error
    );
  });

  return {
    success: true,
    message: "Synkronisering startet",
    instructorId,
  };
}

/**
 * Forny webhook-watch før det utløper.
 * Kjøres via cron job (hver 6t — se `vercel.json`).
 *
 * Strategi:
 *   1. Finn alle Instructor med webhook som utløper innen RENEWAL_WINDOW_MS
 *      (men ikke allerede er utgått — utgåtte håndteres ved neste connect).
 *   2. For hver instruktør: hent gyldig access token via User-relasjonen,
 *      stopp gammel webhook, start ny.
 *   3. `startWatchingCalendar()` persisterer ny state automatisk.
 */
export async function renewExpiringWebhooks(): Promise<{
  renewed: number;
  failed: number;
}> {
  const now = new Date();
  const renewalDeadline = new Date(now.getTime() + RENEWAL_WINDOW_MS);

  // Finn instruktører hvor webhook utløper snart, men ikke allerede er utgått.
  const expiring = await prisma.instructor.findMany({
    where: {
      calendarWebhookExpiration: {
        lt: renewalDeadline,
        gt: now,
      },
      calendarWebhookChannelId: { not: null },
      calendarWebhookResourceId: { not: null },
    },
    select: {
      id: true,
      userId: true,
      calendarWebhookChannelId: true,
      calendarWebhookResourceId: true,
      calendarWebhookCalendarId: true,
    },
  });

  if (expiring.length === 0) {
    logger.info(
      `[Google Calendar Webhook] Renewal check: ingen webhooks utløper innen 24t`
    );
    return { renewed: 0, failed: 0 };
  }

  logger.info(
    `[Google Calendar Webhook] Renewal check: ${expiring.length} webhooks må fornyes`
  );

  let renewed = 0;
  let failed = 0;

  for (const instructor of expiring) {
    try {
      // Hent gyldig access token (refresh hvis nødvendig)
      const accessToken = await getValidAccessToken(instructor.userId);
      if (!accessToken) {
        logger.error(
          `[Google Calendar Webhook] Mangler access token for instructor ${instructor.id} — kan ikke fornye`
        );
        failed += 1;
        continue;
      }

      // Stopp gammel webhook (best effort — ikke abort hvis dette feiler,
      // for Google fjerner gamle kanaler automatisk ved utløp uansett).
      if (
        instructor.calendarWebhookChannelId &&
        instructor.calendarWebhookResourceId
      ) {
        await stopWatchingCalendar(
          instructor.calendarWebhookChannelId,
          instructor.calendarWebhookResourceId,
          accessToken
        );
      }

      // Start ny watch — bruk samme calendarId som før, fall tilbake til "primary"
      const calendarId = instructor.calendarWebhookCalendarId ?? "primary";
      const result = await startWatchingCalendar(
        instructor.id,
        accessToken,
        calendarId
      );

      if (!result) {
        logger.error(
          `[Google Calendar Webhook] Fornyelse feilet for instructor ${instructor.id}`
        );
        failed += 1;
        continue;
      }

      renewed += 1;
      logger.info(
        `[Google Calendar Webhook] Fornyet webhook for instructor ${instructor.id} (ny utløp: ${result.expiration.toISOString()})`
      );
    } catch (error) {
      failed += 1;
      logger.error(
        `[Google Calendar Webhook] Uventet feil ved fornyelse for instructor ${instructor.id}:`,
        error
      );
    }
  }

  logger.info(
    `[Google Calendar Webhook] Renewal ferdig: ${renewed} fornyet, ${failed} feilet`
  );

  return { renewed, failed };
}
