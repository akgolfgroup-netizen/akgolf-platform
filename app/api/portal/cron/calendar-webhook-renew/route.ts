import { NextResponse } from "next/server";
import { renewExpiringWebhooks } from "@/lib/portal/google-calendar/webhook";
import { verifyCronAuth } from "@/lib/cron-auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/portal/cron/calendar-webhook-renew
 *
 * Fornyer Google Calendar push-notification-webhooks før de utløper.
 * Google watch-channels lever maks 7 dager — vi fornyer alle som utløper
 * innen 24 timer. Cron-frekvens 6t gir oss minst 4 sjanser per webhook
 * til å fornye før utløp, slik at én feilet kjøring ikke gir tap av sync.
 *
 * Schedule (vercel.json): "0 *\/6 * * *"
 */
export async function GET(request: Request) {
  // Valider at request kommer fra Vercel Cron eller har gyldig auth
  const isAuthorized = verifyCronAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 401 });
  }

  try {
    const result = await renewExpiringWebhooks();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    logger.error("[Cron] Calendar webhook renewal feilet:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Webhook-fornyelse feilet",
        message: error instanceof Error ? error.message : "Ukjent feil",
      },
      { status: 500 }
    );
  }
}
