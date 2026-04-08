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

import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { syncGoogleCalendar } from "./sync";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

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

    logger.info(
      `[Google Calendar Webhook] Started watching calendar for instructor ${instructorId}`
    );

    return {
      channelId: data.id,
      resourceId: data.resourceId,
      expiration: new Date(parseInt(data.expiration)),
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

  // Sjekk at sync-konfigurasjonen eksisterer
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { instructorId },
  });

  if (!sync || !sync.syncEnabled) {
    return {
      success: false,
      message: "Synkronisering ikke aktiv for denne instruktøren",
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
 * Forny webhook-watch før det utløper
 * Kjøres via cron job
 */
export async function renewExpiringWebhooks(): Promise<{
  renewed: number;
  failed: number;
}> {
  // Finn webhooks som utløper innen 24 timer
  const expiringSoon = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const syncs = await prisma.googleCalendarSync.findMany({
    where: {
      syncEnabled: true,
      // Her ville vi hatt et webhookExpiration felt
      // For nå logger vi bare at dette bør implementeres
    },
  });

  let renewed = 0;
  let failed = 0;

  // TODO: Implementer webhook fornyelse når vi har webhookExpiration felt
  logger.info(
    `[Google Calendar Webhook] Webhook renewal check: ${syncs.length} active syncs`
  );

  return { renewed, failed };
}
