import { NextResponse } from "next/server";
import {
  handleCallback,
  verifyState,
} from "@/lib/portal/calendar/google-calendar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

/**
 * GET /api/portal/calendar/google/callback
 *
 * Google redirects here after the user grants calendar access.
 * Exchanges the authorization code for tokens and saves them.
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

    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=connected`
    );
  } catch {
    return NextResponse.redirect(
      `${BASE_URL}/portal/kalender?google=error`
    );
  }
}
