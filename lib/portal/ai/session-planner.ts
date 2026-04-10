import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface SessionPlanRequest {
  focusArea: string; // TEE_TOTAL, APPROACH, SHORT_GAME, PUTTING
  playerNotes?: string;
  playerName: string;
  serviceDuration: number; // minutter
  playerHandicap?: number;
  previousSessions?: string[]; // korte sammendrag av nylige sesjoner
}

export interface SessionPlan {
  summary: string;
  warmup: { duration: number; description: string };
  mainDrills: Array<{
    name: string;
    duration: number;
    description: string;
    equipment?: string;
  }>;
  cooldown: { duration: number; description: string };
  keyPoints: string[];
  trainerNotes: string;
}

const FOCUS_AREA_NAMES: Record<string, string> = {
  TEE_TOTAL: "Langt spill (Tee Total)",
  APPROACH: "Innspill (Approach, 50-150m)",
  SHORT_GAME: "Nærspill (Chipping & Pitching)",
  PUTTING: "Putting",
};

const SYSTEM_PROMPT = `Du er en AI-assistent for AK Golf Academy. Du hjelper trenere med å planlegge coaching-økter.

Treningsfilosofi (The Foundation Method):
- Teknikk bygges fra grunnen: grep, holdning, alignment, balanse
- Datadrevet: bruk TrackMan-data til å identifisere rotårsak, ikke symptom
- Progressiv overbelastning: start enkelt, øk gradvis
- Motorisk læring: blokktrening → variabel trening → transfer til bane
- Spilleren skal alltid forstå HVORFOR vi gjør en øvelse

Retningslinjer for øktplanlegging:
- Start alltid med oppvarming/bevegelseskvalitet (5-10 min)
- Hovedøvelser: maks 2-3 fokuspunkter per økt
- Avslutt med positiv transfer-øvelse eller spill-simulering
- Tilpass til spillerens nivå og ønsker
- Bruk TrackMan der relevant for feedback`;

export async function generateSessionPlan(
  input: SessionPlanRequest
): Promise<SessionPlan> {
  const focusName = FOCUS_AREA_NAMES[input.focusArea] ?? input.focusArea;

  const userPrompt = `Lag en coaching-økt for ${input.playerName}.

Fokusområde: ${focusName}
Varighet: ${input.serviceDuration} minutter
${input.playerNotes ? `Spillerens beskrivelse: "${input.playerNotes}"` : ""}
${input.playerHandicap !== undefined ? `Handicap: ${input.playerHandicap}` : ""}
${input.previousSessions?.length ? `Tidligere økter:\n${input.previousSessions.map((s) => `- ${s}`).join("\n")}` : ""}

Svar i JSON-format:
{
  "summary": "Kort oppsummering av øktens mål",
  "warmup": { "duration": <minutter>, "description": "Oppvarming" },
  "mainDrills": [
    { "name": "Øvelsesnavn", "duration": <minutter>, "description": "Beskrivelse", "equipment": "Utstyr (valgfritt)" }
  ],
  "cooldown": { "duration": <minutter>, "description": "Avslutning" },
  "keyPoints": ["Nøkkelpunkt 1", "Nøkkelpunkt 2"],
  "trainerNotes": "Notater til trener om hva å se etter"
}`;

  try {
    const response = await getClient().messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Ingen JSON i AI-respons");
    }
    return JSON.parse(jsonMatch[0]) as SessionPlan;
  } catch (error) {
    logger.error("[session-planner] AI generation failed:", error);

    // Fornuftig fallback-plan
    return {
      summary: `${focusName} — ${input.serviceDuration} min økt`,
      warmup: {
        duration: 5,
        description: "Dynamisk oppvarming og bevegelseskvalitet",
      },
      mainDrills: [
        {
          name: "Teknisk grunnøvelse",
          duration: Math.floor(input.serviceDuration * 0.4),
          description: `Grunnleggende ${focusName.toLowerCase()} med fokus på teknikk`,
        },
        {
          name: "Variabel trening",
          duration: Math.floor(input.serviceDuration * 0.3),
          description: "Varierte mål og situasjoner",
        },
      ],
      cooldown: {
        duration: 5,
        description: "Oppsummering og treningsplan fremover",
      },
      keyPoints: [
        "Fokus på prosess, ikke resultat",
        "Bruk TrackMan-data til feedback",
      ],
      trainerNotes: `Spilleren ønsker å jobbe med ${focusName.toLowerCase()}. ${input.playerNotes ?? "Ingen spesifikke notater."}`,
    };
  }
}
