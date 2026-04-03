// app/api/coach/integrations/gmail/sync/route.ts

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { processIncomingEmail, routeEmailToUser } from "@/lib/coach/integrations/gmail";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface IncomingGmailMessage {
  id: string;
  threadId: string;
  to: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  date: string;
}

/**
 * Gmail Sync API
 *
 * Mottar e-poster fra Gmail MCP eller webhook og prosesserer dem.
 * Krever INTEGRATION_SECRET i Authorization header.
 *
 * POST /api/coach/integrations/gmail/sync
 * Body: Array av GmailMessage-objekter
 */
export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    // Valider autentisering
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.INTEGRATION_SECRET}`;

    if (!process.env.INTEGRATION_SECRET) {
      logger.error("INTEGRATION_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (authHeader !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const messages: IncomingGmailMessage[] = await request.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body: expected array of messages" },
        { status: 400 }
      );
    }

    // Prosesser hver melding
    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const message of messages) {
      try {
        // Valider påkrevde felter
        if (!message.id || !message.from || !message.body) {
          results.push({
            id: message.id || "unknown",
            success: false,
            error: "Missing required fields: id, from, or body",
          });
          continue;
        }

        // Router e-post til riktig bruker
        const targetUserId = await routeEmailToUser(message.to);

        // Prosesser e-posten
        await processIncomingEmail(
          {
            id: message.id,
            threadId: message.threadId || message.id,
            from: message.fromName || message.from,
            fromEmail: message.from,
            subject: message.subject || "(Ingen emne)",
            body: message.body,
            date: new Date(message.date),
          },
          targetUserId
        );

        results.push({ id: message.id, success: true });
      } catch (error) {
        logger.error(`Failed to process message ${message.id}:`, error);
        results.push({
          id: message.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      processed: successCount,
      failed: failedCount,
      results,
    });
  } catch (error) {
    logger.error("Gmail sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
