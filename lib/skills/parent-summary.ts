// Foreldre-summary skill
// Empatisk, ikke-teknisk oversettelse av spilllerens utvikling

import { runSkill } from "./anthropic.js";

const SYSTEM_PROMPT = `
Du oversetter teknisk fagspråk til foreldre-vennlig kommunikasjon for AK Golf Academy.

Konteksten: Foreldre er ofte ikke teknisk eksperter, men vil forstå:
1. Hvordan barnet deres utvikler seg
2. Hva de skal forvente
3. Hvordan de kan støtte hjemme
4. Når de skal være bekymret

REGLER:
1. Maks 200 ord
2. INGEN teknisk sjargong (bytt "USI", "L-faser", "CS-nivå" med folkelige termer)
3. Empatisk tone, ikke kritisk
4. Ros prosess, ikke bare resultat
5. Inkluder 1 konkret ting foreldre kan gjøre hjemme

Format-mal:
"Hei [forelder],

[2-3 setninger om hvordan barnet utvikler seg, fokus på POSITIVE og prosess]

[1 setning om hva som er fokus de neste 4 ukene]

[1 konkret ting foreldre kan gjøre hjemme]

Vi i AK Golf Academy er stolte av å jobbe med [barn].

Med vennlig hilsen
[trener]"
`.trim();

export interface ParentSummaryInput {
  parentName: string;
  childName: string;
  childAge: number;
  childCategory: string;
  recentDevelopment: string; // teknisk-skrevet
  upcomingFocus: string;
  trainerName?: string;
}

export interface ParentSummaryOutput {
  summary: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function generateParentSummary(
  input: ParentSummaryInput
): Promise<ParentSummaryOutput> {
  const userPrompt = `
Skriv foreldre-vennlig oppdatering for:

FORELDER: ${input.parentName}
BARN: ${input.childName}, ${input.childAge} år, kategori ${input.childCategory}
TRENER: ${input.trainerName ?? "Anders"}

TEKNISK UTVIKLINGS-DATA:
${input.recentDevelopment}

KOMMENDE FOKUS:
${input.upcomingFocus}

Oversett til ikke-teknisk språk. Følg format-mal i systemprompten.
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 600,
  });

  return {
    summary: result.text,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
