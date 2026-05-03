import { NextResponse } from "next/server";
import {
  handleCallback,
  verifyState,
} from "@/lib/portal/calendar/google-calendar";
import { syncGoogleCalendar } from "@/lib/portal/google-calendar/sync";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/portal/rate-limit";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

/**
 * GET /api/portal/calendar/google/callback
 *
 * Google redirects here after the user grants calendar access.
 * Exchanges the authorization code for tokens and saves them.
 * Triggers initial sync to BlockedTime.
 */
export async function GET(request: Request) {
  // Rate-limit for å hindre misbruk av callback-endepunktet
  const rateLimit = checkRateLimit(
    `gcal-callback:${getClientIp(request)}`,
    RATE_LIMITS.API_GENERAL
  );
  if (!rateLimit.allowed) {
    return NextResponse.redirect(
      `${BASE_URL}/admin/kalender?google=error&reason=rate_limited`
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    logger.warn("[Google Calendar Callback] OAuth-feil mottatt");
    return NextResponse.redirect(
      `${BASE_URL}/admin/kalender?google=error&reason=auth_failed`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${BASE_URL}/admin/kalender?google=error&reason=missing_params`
    );
  }

  try {
    // Verify HMAC-signed state to prevent CSRF / userId tampering
    const userId = verifyState(state);

    const redirectUri = `${BASE_URL}/api/portal/calendar/google/callback`;
    await handleCallback(code, userId, redirectUri);

    // Finn instruktør og trigger initial synkronisering
    const supabase = createServiceClient();
    const { data: instructor } = await supabase
      .from("Instructor")
      .select("id")
      .eq("userId", userId)
      .single();

    if (instructor) {
      // Kjør initial sync i bakgrunnen (ikke await for raskere respons)
      syncGoogleCalendar(instructor.id)
        .then((result) => {
          logger.info(
            `[Google Calendar Callback] Sync fullfort: ${result.synced} hendelser`
          );
        })
        .catch(() => {
          logger.error(
            "[Google Calendar Callback] Initial sync feilet"
          );
        });
    }

    return NextResponse.redirect(
      `${BASE_URL}/admin/kalender?google=connected`
    );
  } catch {
    logger.error("[Google Calendar Callback] Callback-behandling feilet");
    return NextResponse.redirect(
      `${BASE_URL}/admin/kalender?google=error`
    );
  }
}
