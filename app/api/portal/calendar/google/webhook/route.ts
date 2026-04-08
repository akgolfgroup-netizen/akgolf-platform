import { NextResponse } from "next/server";
import { handleWebhookNotification } from "@/lib/portal/google-calendar/webhook";

/**
 * POST /api/portal/calendar/google/webhook
 * 
 * Webhook endpoint for Google Calendar push-notifikasjoner.
 * Google sender en POST-request hit når det skjer endringer i kalenderen.
 * 
 * Headers fra Google:
 * - X-Goog-Channel-ID: Unik channel ID
 * - X-Goog-Resource-ID: Resource ID for kalenderen
 * - X-Goog-Resource-State: "sync" | "exists"
 * - X-Goog-Message-Number: Sekvensnummer
 * - X-Goog-Channel-Token: Custom token (vi bruker instructorId)
 */
export async function POST(request: Request) {
  try {
    const result = await handleWebhookNotification(request.headers);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      instructorId: result.instructorId,
    });
  } catch (error) {
    console.error("[Google Calendar Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook håndtering feilet" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/portal/calendar/google/webhook
 * 
 * Brukes for webhook-verifisering ved oppsett.
 * Google kan sende en GET-request for å verifisere endpoint.
 */
export async function GET(request: Request) {
  // Returner 200 for å bekrefte at endpoint er aktivt
  return NextResponse.json({
    status: "active",
    service: "AK Golf Google Calendar Webhook",
    timestamp: new Date().toISOString(),
  });
}
