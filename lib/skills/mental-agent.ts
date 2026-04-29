// MentalAgent — designer mentalt program per spiller
// Spec: software/dokumenter/ai-system/agents-spec.md sek 7

import { runSkill } from "./anthropic";

const SYSTEM_PROMPT = `
Du er MentalAgent for AK Golf Academy.

Du designer mentalt program basert på sek 17 i metodikk-master:

8 mentale ferdigheter:
1. Målsetting (SMART)
2. Pre-shot rutine
3. Fokus og konsentrasjon
4. Indre dialog
5. Emosjonell regulering
6. Visualisering
7. Håndtere press
8. Motstandsdyktighet

Per kategori-progresjon:
- K (6-10 år): Lek-basert, "Jeg kan!", enkle mål — innbakt i økt
- J (8-12): SMART-mål, 3-stegs rutine, vekstmentalitet, pust — 5-10 min/økt
- I (10-14): Strukturert målsetting, 5-stegs rutine, fokussoner, indre dialog, visualisering-intro — 15 min/uke
- H (12-16): Avansert målsetting, turneringsrutine, refokusering, mindfulness, press-strategier — 30 min/uke
- G-F (14-20): Komplett mental plan, prestasjonsprofil, biofeedback, konkurransementalitet — 60+ min/uke

REGLER:
1. Tilpass programmet til spillerens kategori
2. Bygg på TEST 18-20 resultater hvis tilgjengelig
3. Inkluder konkrete mental-drills (ikke bare prinsipper)
4. Tone: empatisk, ikke teknisk
5. Output i strukturert format (JSON)

OUTPUT (JSON):
{
  "category": "...",
  "primarySkillFocus": "Pre-shot rutine | Visualisering | osv",
  "minutesPerWeek": 30,
  "weeklyDrills": [
    { "drill": "5-stegs pre-shot", "duration": 10, "frequency": "daglig" }
  ],
  "journalPrompts": ["spørsmål 1", "spørsmål 2"],
  "trainerActions": ["coach-handlinger"],
  "pressureProgression": "PR2",
  "rationale": "hvorfor denne tilnærmingen for denne spilleren"
}
`.trim();

export interface MentalAgentInput {
  playerId: string;
  playerName: string;
  category: string;
  age?: number;
  preShotConsistency?: number; // % fra TEST 18
  stroopScore?: number; // antall korrekte fra TEST 19
  pressShotsSuccess?: number; // % fra TEST 20
  recentSessionsContext?: string; // f.eks. "spilte dårlig under press i forrige turnering"
}

export interface MentalAgentOutput {
  program: {
    category: string;
    primarySkillFocus: string;
    minutesPerWeek: number;
    weeklyDrills: Array<{ drill: string; duration: number; frequency: string }>;
    journalPrompts: string[];
    trainerActions: string[];
    pressureProgression: string;
    rationale: string;
  };
  rawJsonText: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function generateMentalProgram(
  input: MentalAgentInput
): Promise<MentalAgentOutput> {
  const userPrompt = `
Design mentalt program for følgende spiller:

SPILLER: ${input.playerName}
KATEGORI: ${input.category}
ALDER: ${input.age ?? "ukjent"}

MENTAL-TESTER:
- Pre-shot konsistens: ${input.preShotConsistency != null ? input.preShotConsistency + "%" : "ikke testet"}
- Stroop-score (fokus): ${input.stroopScore ?? "ikke testet"}
- Press-håndtering: ${input.pressShotsSuccess != null ? input.pressShotsSuccess + "%" : "ikke testet"}

KONTEKST:
${input.recentSessionsContext ?? "Ingen spesifikk kontekst"}

Returner GYLDIG JSON ifølge systemprompten. Ingen kommentarer utenfor JSON.
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 1500,
  });

  let program;
  try {
    let jsonText = result.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];
    program = JSON.parse(jsonText);
  } catch (err) {
    console.error("MentalAgent JSON-parse feilet:", err);
    program = {
      category: input.category,
      primarySkillFocus: "Pre-shot rutine",
      minutesPerWeek: 15,
      weeklyDrills: [],
      journalPrompts: [],
      trainerActions: [],
      pressureProgression: "PR2",
      rationale: "Kunne ikke generere — manuell oppfølging kreves",
    };
  }

  return {
    program,
    rawJsonText: result.text,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
