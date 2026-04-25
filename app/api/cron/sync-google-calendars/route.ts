import { NextResponse } from "next/server";
import { syncAllGoogleCalendars } from "@/lib/portal/google-calendar/sync";
import { verifyCronAuth } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/sync-google-calendars
 * 
 * Automatisk synkronisering av alle Google Calendar koblinger.
 * Kjøres via Vercel Cron hver time.
 * 
 * Cron config i vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/sync-google-calendars",
 *       "schedule": "0 * * * *"
 *     }
 *   ]
 * }
 */
export async function GET(request: Request) {
  // Valider at request kommer fra Vercel Cron eller har gyldig auth
  const isAuthorized = verifyCronAuth(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Uautorisert" },
      { status: 401 }
    );
  }

  try {
    const result = await syncAllGoogleCalendars();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error("[Cron] Google Calendar sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Synkronisering feilet",
        message: error instanceof Error ? error.message : "Ukjent feil",
      },
      { status: 500 }
    );
  }
}
