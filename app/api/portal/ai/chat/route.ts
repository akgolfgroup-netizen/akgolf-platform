import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatContext {
  userName: string;
  handicap: number | null;
  recentRounds: {
    date: string;
    courseName: string | null;
    totalScore: number | null;
    sgTotal: number | null;
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  }[];
  recentTrainingLogs: {
    date: string;
    focusArea: string | null;
    durationMinutes: number | null;
    notes: string | null;
    rating: number | null;
  }[];
  activePlan: {
    title: string;
    periodType: string;
    startDate: string;
    endDate: string;
  } | null;
  trackmanAverages: {
    club: string;
    averages: Record<string, unknown>;
  }[];
  upcomingTournaments: {
    name: string;
    startDate: string;
    course: string | null;
  }[];
}

function buildSystemPrompt(context: ChatContext): string {
  const parts: string[] = [
    `Du er AI Coach for AK Golf — en ekspert golfcoach som kjenner DECADE-metoden (strategisk kurshandtering), Foundation Method (AK Golfs grunnleggende teknikkbygging), og AK-formelen (systematisk prestasjonsforbedring).

Du kommuniserer pa norsk bokmal. Du er konkret, direkte og handlingsorientert. Aldri generell — bruk alltid spillerens faktiske data i svarene dine. Du gir rad basert pa Strokes Gained-analyse og periodisert trening.

Regler:
- Svar pa norsk bokmal
- Vaar spesifikk og bruk spillerens data
- Gi konkrete treningsopplegg med antall repetisjoner og ovelser
- Referer til Strokes Gained-kategorier (Off the Tee, Approach, Around the Green, Putting)
- Nevn relevante treningsperioder (grunnperiode, spesialiseringsperiode, turneringsperiode)
- Hold svar under 500 ord med mindre spilleren ber om mer detalj
- Aldri bruk emojier`,

    `\n\nSPILLERINFO:`,
    `Navn: ${context.userName}`,
  ];

  if (context.handicap !== null) {
    parts.push(`Handicap: ${context.handicap}`);
  }

  if (context.recentRounds.length > 0) {
    parts.push(`\nSISTE RUNDER (nyeste forst):`);
    for (const round of context.recentRounds) {
      const date = new Date(round.date).toLocaleDateString("nb-NO");
      const sg: string[] = [];
      if (round.sgOffTheTee !== null) sg.push(`OTT: ${round.sgOffTheTee.toFixed(1)}`);
      if (round.sgApproach !== null) sg.push(`APP: ${round.sgApproach.toFixed(1)}`);
      if (round.sgAroundTheGreen !== null) sg.push(`ATG: ${round.sgAroundTheGreen.toFixed(1)}`);
      if (round.sgPutting !== null) sg.push(`PUTT: ${round.sgPutting.toFixed(1)}`);
      parts.push(
        `- ${date} ${round.courseName ?? ""}: Score ${round.totalScore ?? "?"} | SG Total: ${round.sgTotal?.toFixed(1) ?? "?"} (${sg.join(", ")})`
      );
    }
  }

  if (context.recentTrainingLogs.length > 0) {
    parts.push(`\nSISTE TRENINGER (nyeste forst):`);
    for (const log of context.recentTrainingLogs.slice(0, 10)) {
      const date = new Date(log.date).toLocaleDateString("nb-NO");
      parts.push(
        `- ${date}: ${log.focusArea ?? "generell"} (${log.durationMinutes ?? "?"} min, vurdering: ${log.rating ?? "?"}/5)${log.notes ? ` — ${log.notes.slice(0, 100)}` : ""}`
      );
    }
  }

  if (context.activePlan) {
    parts.push(
      `\nAKTIV TRENINGSPLAN: "${context.activePlan.title}" (${context.activePlan.periodType}, ${new Date(context.activePlan.startDate).toLocaleDateString("nb-NO")} - ${new Date(context.activePlan.endDate).toLocaleDateString("nb-NO")})`
    );
  }

  if (context.trackmanAverages.length > 0) {
    parts.push(`\nTRACKMAN-GJENNOMSNITT:`);
    for (const t of context.trackmanAverages) {
      parts.push(`- ${t.club}: ${JSON.stringify(t.averages)}`);
    }
  }

  if (context.upcomingTournaments.length > 0) {
    parts.push(`\nKOMMENDE TURNERINGER:`);
    for (const t of context.upcomingTournaments) {
      const date = new Date(t.startDate).toLocaleDateString("nb-NO");
      parts.push(`- ${t.name} (${date}${t.course ? `, ${t.course}` : ""})`);
    }
  }

  return parts.join("\n");
}

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const rateLimit = checkRateLimit(`ai-chat:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forsporsel. Vent litt for du prover igjen." },
      { status: 429 }
    );
  }

  let body: { messages: ChatMessage[]; context: ChatContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { messages, context } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Meldinger mangler" },
      { status: 400 }
    );
  }

  // Limit message history to prevent token abuse
  const trimmedMessages = messages.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: typeof m.content === "string" ? m.content.slice(0, 4000) : "",
  }));

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: buildSystemPrompt(context),
      messages: trimmedMessages,
    });

    // Return a streaming response
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
          logger.error("[ai-chat] Streaming error:", {
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
    logger.error("[ai-chat] Error:", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Kunne ikke fa svar fra AI Coach" },
      { status: 500 }
    );
  }
}
