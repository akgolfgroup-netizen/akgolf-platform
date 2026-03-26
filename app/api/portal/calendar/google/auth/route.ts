import { NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { getAuthUrl } from "@/lib/portal/calendar/google-calendar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

/**
 * GET /api/portal/calendar/google/auth
 *
 * Redirects the user to the Google OAuth2 consent screen.
 */
export async function GET() {
  try {
    const user = await requirePortalUser();

    const redirectUri = `${BASE_URL}/api/portal/calendar/google/callback`;
    const authUrl = getAuthUrl(user.id, redirectUri);

    return NextResponse.redirect(authUrl);
  } catch {
    return NextResponse.redirect(`${BASE_URL}/portal/login`);
  }
}
