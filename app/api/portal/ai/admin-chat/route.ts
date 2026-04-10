import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { isStaff } from "@/lib/portal/rbac";
import { logger } from "@/lib/logger";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ADMIN_SYSTEM_PROMPT = `Du er AI-assistent for AK Golf Academy sitt administrasjonspanel (Mission Control). Du hjelper instruktorer og administratorer med:

- Sporsmal om elever, bookinger, kapasitet og inntekt
- Analyse av trender og statistikk
- Forslag til oppfolging av inaktive elever
- Generering av rapporter og oppsummeringer
- Praktiske rad for drift av akademiet

Regler:
- Svar pa norsk bokmal
- Vaar konkret og handlingsorientert
- Hold svar under 500 ord med mindre brukeren ber om mer detalj
- Du har IKKE tilgang til sanntidsdata — vear aerlig om dette. Si "Basert pa generell erfaring..." hvis du ikke har spesifikke data.
- Aldri bruk emojier
- Du er en del av AK Golf Academy sitt team, og kommuniserer profesjonelt
- Referer til bookingsystem, elevlister og okonomi som konsepter du kan hjelpe med, men presiser at du ikke kan slå opp spesifikke data direkte`;

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(
    `ai-admin-chat:${user.id}`,
    RATE_LIMITS.AI_ENDPOINTS
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange foresporsler. Vent litt for du prover igjen." },
      { status: 429 }
    );
  }

  let body: { messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Meldinger mangler" },
      { status: 400 }
    );
  }

  const trimmedMessages = messages.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: typeof m.content === "string" ? m.content.slice(0, 4000) : "",
  }));

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: ADMIN_SYSTEM_PROMPT,
      messages: trimmedMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          logger.error("[ai-admin-chat] Streaming error:", {
            error: error instanceof Error ? error.message : "Unknown",
          });
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    logger.error("[ai-admin-chat] Error:", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Kunne ikke fa svar fra AI-assistenten" },
      { status: 500 }
    );
  }
}
