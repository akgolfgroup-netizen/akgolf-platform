// CoachingNoteAgent — strukturer coaching-notater fra trener
// Bruker Sonnet for å forstå norsk + golf-domene

import { runSkill } from "./anthropic.js";

const SYSTEM_PROMPT = `
Du strukturer coaching-notater fra AK Golf-trenere.

Du har tilgang til:
- AK-formelen (alle koder fra metodikk-master sek 9-10)
- MORAD-prinsipper (sek 19)
- Performance-metoden (sek 20)
- 13 invarianter (sek 12)

Når trener skriver "P5.0 brytes ved CS70, hælvekt mister kontakt", skal du oversette til:
- breakingPoints: [{ type: 'CS', threshold: 'CS70', technical: 'P5.0', notes: 'hælvekt mister kontakt' }]
- tags: ['P5.0', 'hælvekt', 'breaking-point', 'CS70']
- nextSessionFocus: "CS-redusert L-BALL trening på P5.0-P6.0"

OUTPUT-format (JSON):
{
  "summary": "1-2 setninger sammendrag",
  "technicalObservations": ["punkt 1", "punkt 2"],
  "breakingPoints": [{ "type": "CS|M|PR", "threshold": "...", "technical": "...", "notes": "..." }],
  "progressNotes": ["1 ting som ble bedre"],
  "homeworkForPlayer": ["1-2 konkrete oppgaver"],
  "nextSessionFocus": "1 setning om hva neste økt skal fokusere på",
  "tags": ["søkord1", "søkord2"],
  "followUpFlags": ["ting som krever oppmerksomhet senere"]
}
`.trim();

export interface CoachingNoteAgentInput {
  rawNotes: string;
  formulaId?: string;
  drillsExecuted?: string[];
  playerCategory?: string;
}

export interface CoachingNoteAgentOutput {
  structured: {
    summary: string;
    technicalObservations: string[];
    breakingPoints: Array<{
      type: "CS" | "M" | "PR";
      threshold: string;
      technical?: string;
      notes?: string;
    }>;
    progressNotes: string[];
    homeworkForPlayer: string[];
    nextSessionFocus: string;
    tags: string[];
    followUpFlags: string[];
  };
  rawJsonText: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function structureCoachingNote(
  input: CoachingNoteAgentInput
): Promise<CoachingNoteAgentOutput> {
  const userPrompt = `
Strukturér følgende coaching-notater:

KONTEKST:
${input.formulaId ? `Formula-ID: ${input.formulaId}` : ""}
${input.playerCategory ? `Spiller-kategori: ${input.playerCategory}` : ""}
${input.drillsExecuted ? `Drills: ${input.drillsExecuted.join(", ")}` : ""}

RÅ NOTATER:
${input.rawNotes}

Returner GYLDIG JSON ifølge systemprompten. Ingen kommentarer utenfor JSON.
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 1500,
  });

  // Parse JSON-respons
  let structured;
  try {
    // Finn JSON-blokk (kan være innpakket i ```json ... ```)
    let jsonText = result.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    structured = JSON.parse(jsonText);
  } catch (err) {
    // Fallback: returnér rå tekst med tomt struktur
    console.error("CoachingNoteAgent JSON-parse feilet:", err);
    structured = {
      summary: input.rawNotes.slice(0, 100),
      technicalObservations: [],
      breakingPoints: [],
      progressNotes: [],
      homeworkForPlayer: [],
      nextSessionFocus: "",
      tags: [],
      followUpFlags: ["Kunne ikke strukturere — manuell gjennomgang"],
    };
  }

  return {
    structured,
    rawJsonText: result.text,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
