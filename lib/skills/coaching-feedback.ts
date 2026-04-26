// Skill: coaching-feedback
// Genererer strukturert feedback til spilleren etter en treningsøkt

import { runSkill } from "./anthropic";

const SYSTEM_PROMPT = `
Du genererer coaching-feedback til AK Golf Academy-spillere etter en treningsøkt.

Tone-of-voice:
- Direkte og konkret
- Growth-mindset (bruk "ENNÅ" og "neste skritt")
- Fokus på prosess, ikke resultat
- Nordisk profesjonell stil — ikke amerikansk overdrevet positiv

REGLER:
1. Start med 1 konkret observasjon av hva som fungerte
2. Identifiser 1-2 områder for fokus neste økt
3. Gi 1 konkret hjemmeoppgave
4. Inkluder formelle koder (P-posisjon, CS, etc.) hvis relevant
5. Maks 200 ord
6. Skriv direkte til spilleren ("du", "din")

Format:
"Hei [navn],

[1 ting som fungerte med konkret data/eksempel]

[Breaking point eller utfordring + 'ENNÅ']

For neste uke:
1. [Hjemmeoppgave]
2. [Eventuell tilleggsoppgave]

— [trener-navn]"
`.trim();

export interface CoachingFeedbackInput {
  playerId: string;
  playerName: string;
  category: string;
  age?: number;
  sessionType: string; // "TEK-økt 90 min" osv
  date: string;
  drillsExecuted: string[];
  duration: number;
  formulaId: string;
  coachNotes: string;
  breakingPoints?: Array<{ type: string; threshold: string; technical?: string }>;
  qualityRating?: number;
  hasVideo?: boolean;
  coachName?: string;
}

export interface CoachingFeedbackOutput {
  feedback: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function coachingFeedback(
  input: CoachingFeedbackInput
): Promise<CoachingFeedbackOutput> {
  const breakingPointsText =
    input.breakingPoints && input.breakingPoints.length > 0
      ? input.breakingPoints
          .map(
            (bp) =>
              `- ${bp.type} ved ${bp.threshold}${bp.technical ? ` (${bp.technical})` : ""}`
          )
          .join("\n")
      : "Ingen registrert";

  const userPrompt = `
Generer coaching-feedback til:

SPILLER: ${input.playerName}, kategori ${input.category}${input.age ? `, ${input.age} år` : ""}
ØKT-TYPE: ${input.sessionType}
DATO: ${input.date}
VARIGHET: ${input.duration} min
FORMULA: ${input.formulaId}

DRILLS GJENNOMFØRT:
${input.drillsExecuted.map((d) => `- ${d}`).join("\n")}

BREAKING POINTS:
${breakingPointsText}

TRENERS NOTATER:
${input.coachNotes}

${input.qualityRating ? `KVALITETS-SCORE: ${input.qualityRating}/5` : ""}
${input.hasVideo ? "VIDEO: opplastet" : ""}

Trener: ${input.coachName ?? "Anders"}

Skriv coaching-feedback iht. systemprompt. Direkte til spilleren, under 200 ord.
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 600,
  });

  return {
    feedback: result.text,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
