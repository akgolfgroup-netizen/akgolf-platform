/**
 * Server-Sent Events (SSE) API for sanntids booking-oppdateringer
 * 
 * GET /api/portal/bookings/live?instructorId=xxx&date=YYYY-MM-DD
 * 
 * Denne endpointen oppretter en SSE-forbindelse som pusher oppdateringer
 * når tilgjengelighet endres eller nye bookinger opprettes.
 * 
 * Bruk:
 * const eventSource = new EventSource('/api/portal/bookings/live?instructorId=123&date=2024-01-15');
 * eventSource.onmessage = (e) => {
 *   const data = JSON.parse(e.data);
 *   if (data.type === 'SLOTS_UPDATED') {
 *     // Oppdater UI med nye slots
 *   }
 * };
 */

import { NextRequest } from "next/server";
import { realtimeCache } from "@/lib/portal/booking/cache";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";
import { getPortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

// Hearthbeat interval (hold connection alive)
const HEARTBEAT_INTERVAL = 30000; // 30 sekunder

// Maksimum connection tid (for å forhindre memory leaks)
const MAX_CONNECTION_TIME = 5 * 60 * 1000; // 5 minutter

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Auth: krever innlogget bruker
  const user = await getPortalUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Ikke autentisert" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Rate limit SSE-tilkoblinger
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`sse:${clientIp}`, RATE_LIMITS.BOOKING_SLOTS);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "For mange forespørsler" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const instructorId = searchParams.get("instructorId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!instructorId || !date) {
    return new Response(
      JSON.stringify({ error: "Mangler parametere: instructorId, date" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Valider datoformat
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return new Response(
      JSON.stringify({ error: "Ugyldig datoformat. Bruk YYYY-MM-DD" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Valider at instructorId er gyldig UUID-format (forhindrer vilkårlig input)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cuidRegex = /^c[a-z0-9]{24,}$/;
  if (!uuidRegex.test(instructorId) && !cuidRegex.test(instructorId)) {
    return new Response(
      JSON.stringify({ error: "Ugyldig instructorId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const clientId = nanoid();
  const cacheKey = `${instructorId}:${date}`;
  
  // Registrer klienten (instructorId er validert ovenfor)
  realtimeCache.addViewer(instructorId as string, clientId);
  
  logger.debug(`[SSE] Client ${clientId} connected for ${cacheKey}`);

  const encoder = new TextEncoder();
  let heartbeatInterval: NodeJS.Timeout;
  let timeoutId: NodeJS.Timeout;
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ 
          clientId, 
          instructorId, 
          date,
          timestamp: new Date().toISOString(),
        })}\n\n`)
      );

      // Set up heartbeat
      heartbeatInterval = setInterval(() => {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(`event: heartbeat\ndata: ${Date.now()}\n\n`));
          } catch {
            // Client disconnected
            cleanup();
          }
        }
      }, HEARTBEAT_INTERVAL);

      // Set up connection timeout
      timeoutId = setTimeout(() => {
        if (!isClosed) {
          controller.enqueue(
            encoder.encode(`event: timeout\ndata: ${JSON.stringify({ 
              message: "Connection timeout - please reconnect" 
            })}\n\n`)
          );
          cleanup();
          controller.close();
        }
      }, MAX_CONNECTION_TIME);

      // Cleanup function
      function cleanup() {
        if (isClosed) return;
        isClosed = true;
        
        clearInterval(heartbeatInterval);
        clearTimeout(timeoutId);
        realtimeCache.removeViewer(instructorId as string, clientId);
        
        logger.debug(`[SSE] Client ${clientId} disconnected from ${cacheKey}`);
      }

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        cleanup();
      });
    },

    cancel() {
      if (!isClosed) {
        isClosed = true;
        clearInterval(heartbeatInterval);
        clearTimeout(timeoutId);
        realtimeCache.removeViewer(instructorId, clientId);
        
        logger.debug(`[SSE] Client ${clientId} cancelled from ${cacheKey}`);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}

/**
 * Hjelpefunksjon for å broadcaste oppdateringer til alle seere
 * 
 * Kalles fra andre API-er når tilgjengelighet eller bookinger endres
 */
export async function broadcastUpdate(
  instructorId: string,
  date: string,
  updateType: "SLOTS_UPDATED" | "BOOKING_CREATED" | "BOOKING_CANCELLED" | "AVAILABILITY_CHANGED",
  data?: Record<string, unknown>
): Promise<number> {
  const viewers = realtimeCache.getViewers(instructorId);
  
  if (viewers.size === 0) {
    return 0; // Ingen aktive seere
  }

  const message = {
    type: updateType,
    timestamp: new Date().toISOString(),
    instructorId,
    date,
    ...data,
  };

  // I en full implementasjon ville vi brukt en pub/sub-tjeneste som Redis
  // eller en message broker for å distribuere meldinger til alle server-noder.
  // For nå logger vi bare at en oppdatering skulle ha blitt sendt.
  
  logger.info(`[SSE] Broadcasting ${updateType} to ${viewers.size} viewers for ${instructorId}:${date}`);
  
  return viewers.size;
}

/**
 * Hjelpefunksjon for å trigge en revalidate av slots-data
 * 
 * Dette brukes når vi vil tvinge klienter til å hente fersk data
 */
export async function triggerSlotsRefresh(
  instructorId: string,
  date?: string
): Promise<void> {
  // Invalider cache
  const { invalidateSlotsCache } = await import("@/lib/portal/booking/cache");
  await invalidateSlotsCache(instructorId, date);
  
  // Broadcast til aktive seere
  if (date) {
    await broadcastUpdate(instructorId, date, "SLOTS_UPDATED", { 
      refreshRequired: true,
      timestamp: Date.now(),
    });
  } else {
    // Broadcast til alle datoer for denne instruktøren
    // I praksis ville vi hatt en liste over aktive datoer
    logger.info(`[SSE] Triggered refresh for instructor ${instructorId}`);
  }
}
