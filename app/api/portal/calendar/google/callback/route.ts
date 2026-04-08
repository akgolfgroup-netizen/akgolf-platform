import { NextResponse } from "next/server";
import {
  handleCallback,
  verifyState,
} from "@/lib/portal/calendar/google-calendar";
import { syncGoogleCalendar } from "@/lib/portal/google-calendar/sync";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

/**
 * GET /api/portal/calendar/google/callback
 *
 * Google redirects here after the user grants calendar access.
 * Exchanges the authorization code for tokens and saves them.
 * Triggers initial sync to BlockedTime.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=error&reason=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=error&reason=missing_params`
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
            `[Google Calendar Callback] Initial sync completed: ${result.synced} events`
          );
        })
        .catch((syncError) => {
          logger.error(
            `[Google Calendar Callback] Initial sync failed:`,
            syncError
          );
        });
    }

    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=connected`
    );
  } catch (error) {
    logger.error("[Google Calendar Callback] Error:", error);
    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=error`
    );
  }
}
