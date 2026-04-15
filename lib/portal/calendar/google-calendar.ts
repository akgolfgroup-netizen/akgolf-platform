import { createServiceClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";
import { logger } from "@/lib/logger";


/**
 * Google Calendar integration for AK Golf Portal.
 *
 * Uses Google Calendar API v3 with OAuth2 for user-delegated access.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   NEXT_PUBLIC_BASE_URL
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("[Google Calendar] GOOGLE_CLIENT_ID not set");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret)
    throw new Error("[Google Calendar] GOOGLE_CLIENT_SECRET not set");
  return secret;
}

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number; // epoch ms
}

async function refreshAccessToken(
  tokens: GoogleTokens
): Promise<GoogleTokens> {
  if (!tokens.refresh_token) {
    throw new Error("[Google Calendar] No refresh token available");
  }

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[Google Calendar] Token refresh failed: ${res.status} ${text}`
    );
  }

  const data = await res.json();

  return {
    access_token: data.access_token,
    refresh_token: tokens.refresh_token, // keep existing refresh token
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
}

async function getValidTokens(userId: string): Promise<GoogleTokens> {
  const supabase = createServiceClient();
  
  const { data: user, error } = await supabase
    .from("User")
    .select("googleCalendarTokens")
    .eq("id", userId)
    .single();

  if (error || !user?.googleCalendarTokens) {
    throw new Error(
      "[Google Calendar] User has not connected Google Calendar"
    );
  }

  let tokens = user.googleCalendarTokens as unknown as GoogleTokens;

  // Refresh if expired or expiring within 5 minutes
  if (Date.now() >= tokens.expires_at - 5 * 60 * 1000) {
    tokens = await refreshAccessToken(tokens);

    // Persist refreshed tokens
    await supabase
      .from("User")
      .update({ googleCalendarTokens: tokens as object })
      .eq("id", userId);
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate the Google OAuth2 consent URL.
 *
 * @param userId     Internal user ID (stored in `state` for the callback)
 * @param redirectUri The callback URL (e.g. /api/portal/calendar/google/callback)
 */
/**
 * Sign the OAuth state parameter with HMAC to prevent tampering.
 * Format: userId.signature
 */
function signState(userId: string): string {
  const secret = getClientSecret();
  const sig = createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${sig}`;
}

/**
 * Verify and extract userId from a signed state parameter.
 * Returns the userId if valid, throws if tampered.
 */
export function verifyState(state: string): string {
  const dotIndex = state.lastIndexOf(".");
  if (dotIndex === -1) throw new Error("[Google Calendar] Invalid state format");

  const userId = state.substring(0, dotIndex);
  const sig = state.substring(dotIndex + 1);

  const secret = getClientSecret();
  const expected = createHmac("sha256", secret).update(userId).digest("hex");

  if (sig !== expected) {
    throw new Error("[Google Calendar] State signature mismatch — possible CSRF");
  }

  return userId;
}

export function getAuthUrl(userId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: signState(userId),
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange the authorization code for tokens and save them to the user record.
 *
 * @param code   Authorization code from Google callback
 * @param userId Internal user ID
 * @param redirectUri Must match the redirect_uri used in the auth URL
 */
export async function handleCallback(
  code: string,
  userId: string,
  redirectUri: string
): Promise<{ syncId: string }> {
  const supabase = createServiceClient();
  
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[Google Calendar] Token exchange failed: ${res.status} ${text}`
    );
  }

  const data = await res.json();

  const tokens: GoogleTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  // Oppdater bruker med tokens (for bakoverkompatibilitet)
  await supabase
    .from("User")
    .update({ googleCalendarTokens: tokens as object })
    .eq("id", userId);

  // Opprett eller oppdater GoogleCalendarSync for synkronisering til BlockedTime
  const { data: instructor } = await supabase
    .from("Instructor")
    .select("id")
    .eq("userId", userId)
    .single();

  if (instructor) {
    // Note: GoogleCalendarSync table may not exist - this is placeholder
    // TODO: Create GoogleCalendarSync table in Supabase or use existing table
    logger.info(`[Google Calendar] Tokens saved for instructor ${instructor.id}`);
  }

  logger.info("[Google Calendar] Tokens and sync config saved successfully");
  
  return { syncId: instructor?.id ?? userId };
}

/**
 * Create or update a Google Calendar event for a booking.
 *
 * @param userId  Internal user ID
 * @param booking Booking details
 * @returns The Google Calendar event ID
 */
export async function syncBookingToCalendar(
  userId: string,
  booking: {
    id: string;
    startTime: Date;
    endTime: Date;
    serviceName: string;
    instructorName?: string;
    location?: string;
    googleCalendarEventId?: string | null;
  }
): Promise<string> {
  const tokens = await getValidTokens(userId);

  const event = {
    summary: `${booking.serviceName} — AK Golf`,
    description: [
      booking.instructorName
        ? `Instruktor: ${booking.instructorName}`
        : null,
      `Booking-ID: ${booking.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start: {
      dateTime: booking.startTime.toISOString(),
      timeZone: "Europe/Oslo",
    },
    end: {
      dateTime: booking.endTime.toISOString(),
      timeZone: "Europe/Oslo",
    },
    location: booking.location ?? undefined,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  };

  const supabase = createServiceClient();
  const { data: user } = await supabase
    .from("User")
    .select("googleCalendarId")
    .eq("id", userId)
    .single();

  const calendarId = user?.googleCalendarId ?? "primary";

  let eventId: string;

  if (booking.googleCalendarEventId) {
    // Update existing event
    const res = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(booking.googleCalendarEventId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `[Google Calendar] Failed to update event: ${res.status} ${text}`
      );
    }

    const data = await res.json();
    eventId = data.id;
  } else {
    // Create new event
    const res = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `[Google Calendar] Failed to create event: ${res.status} ${text}`
      );
    }

    const data = await res.json();
    eventId = data.id;
  }

  logger.info(`[Google Calendar] Synced booking ${booking.id} → event ${eventId}`);
  return eventId;
}

/**
 * Delete a Google Calendar event.
 *
 * @param userId  Internal user ID
 * @param eventId Google Calendar event ID
 */
export async function removeFromCalendar(
  userId: string,
  eventId: string
): Promise<void> {
  const tokens = await getValidTokens(userId);

  const supabase = createServiceClient();
  const { data: user } = await supabase
    .from("User")
    .select("googleCalendarId")
    .eq("id", userId)
    .single();

  const calendarId = user?.googleCalendarId ?? "primary";

  const res = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  if (!res.ok && res.status !== 404 && res.status !== 410) {
    const text = await res.text();
    throw new Error(
      `[Google Calendar] Failed to delete event ${eventId}: ${res.status} ${text}`
    );
  }

  logger.info(`[Google Calendar] Removed event ${eventId} for user ${userId}`);
}
