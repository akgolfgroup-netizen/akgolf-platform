import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// --- Types ---

export type PyramidLevel = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

export type DifficultyLevel =
  | "nybegynner"
  | "rekrutt"
  | "klubb"
  | "regional"
  | "nasjonal"
  | "elite";

export type SGArea = "tee" | "approach" | "short_game" | "putting";

export interface GenerateDrillInput {
  pyramidLevel: PyramidLevel;
  trainingArea: string;
  difficulty: DifficultyLevel;
  sgArea: SGArea;
  description?: string;
}

export interface GeneratedDrill {
  name: string;
  description: string;
  goal: string;
  instructions: string;
  duration_minutes: number;
  pyramid_level: PyramidLevel;
  training_area: string;
  difficulty: DifficultyLevel;
  sg_area: SGArea;
  tags: string[];
  l_phase: string;
  cs_level: string;
  equipment: string[];
  success_criteria: string;
}

// --- Validation ---

const VALID_PYRAMID_LEVELS: PyramidLevel[] = [
  "FYS",
  "TEK",
  "SLAG",
  "SPILL",
  "TURN",
];

const VALID_DIFFICULTIES: DifficultyLevel[] = [
  "nybegynner",
  "rekrutt",
  "klubb",
  "regional",
  "nasjonal",
  "elite",
];

const VALID_SG_AREAS: SGArea[] = ["tee", "approach", "short_game", "putting"];

export function validateDrillInput(
  body: unknown
): { valid: true; data: GenerateDrillInput } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Ugyldig foresporselsformat" };
  }

  const input = body as Record<string, unknown>;

  if (
    !input.pyramidLevel ||
    !VALID_PYRAMID_LEVELS.includes(input.pyramidLevel as PyramidLevel)
  ) {
    return {
      valid: false,
      error: `pyramidLevel ma vaere en av: ${VALID_PYRAMID_LEVELS.join(", ")}`,
    };
  }

  if (!input.trainingArea || typeof input.trainingArea !== "string") {
    return { valid: false, error: "trainingArea er pakrevd (string)" };
  }

  if (
    !input.difficulty ||
    !VALID_DIFFICULTIES.includes(input.difficulty as DifficultyLevel)
  ) {
    return {
      valid: false,
      error: `difficulty ma vaere en av: ${VALID_DIFFICULTIES.join(", ")}`,
    };
  }

  if (!input.sgArea || !VALID_SG_AREAS.includes(input.sgArea as SGArea)) {
    return {
      valid: false,
      error: `sgArea ma vaere en av: ${VALID_SG_AREAS.join(", ")}`,
    };
  }

  if (input.description !== undefined && typeof input.description !== "string") {
    return { valid: false, error: "description ma vaere en string" };
  }

  return {
    valid: true,
    data: {
      pyramidLevel: input.pyramidLevel as PyramidLevel,
      trainingArea: input.trainingArea as string,
      difficulty: input.difficulty as DifficultyLevel,
      sgArea: input.sgArea as SGArea,
      description: input.description as string | undefined,
    },
  };
}

// --- System prompt ---

const SYSTEM_PROMPT = `Du er en ekspert golftrener og drill-designer for AK Golf Academy. Du lager strukturerte treningsovelser basert pa AK-formelen.

## AK-formelen — Treningspyramiden

Pyramiden har 5 nivaer som bygger pa hverandre:
1. FYS — Fysisk grunnlag (mobilitet, styrke, stabilitet, utholdenhet)
2. TEK — Teknisk fundament (grep, setup, sving-mekanikk, kontaktpunkt)
3. SLAG — Slagferdigheter (slagformer, avstandskontroll, retningskontroll)
4. SPILL — Spillferdigheter (banemanagement, kursplanlegging, situasjonsvurdering)
5. TURN — Turneringsferdigheter (prestasjon under press, mental styrke, rutiner)

## L-faser (laeringsprogresjon)
- L1: Isolert ovelse — isoler en bevegelse eller ferdighet
- L2: Blokktrening — gjenta samme bevegelse mange ganger
- L3: Variabel trening — varier mellom ulike maal/situasjoner
- L4: Tilfeldig trening — random rekkefolgje, simulerer bane
- L5: Transfer — overfor til reell spillsituasjon

## CS-nivaer (Competitive Standard)
- CS1: Nybegynner (hcp 36+)
- CS2: Rekrutt (hcp 20-36)
- CS3: Klubb (hcp 10-20)
- CS4: Regional (hcp 5-10)
- CS5: Nasjonal (hcp 0-5)
- CS6: Elite (pluss-hcp, proff)

## DECADE-metodikken
- Bruk strokes gained-tenkning i ovelsesdesign
- Fokuser pa omradene der spilleren taper flest slag
- Mal ytelse mot referanseniva (benchmark)
- Track suksessrate for a male forbedring

## Regler for drill-design
- Varighet: 5-30 minutter
- Konkrete steg-for-steg instruksjoner (nummererte)
- Tydelig mal og suksesskriterium
- Realistisk utstyrsbehov
- Tilpass til angitt vanskelighetsgrad
- Alt pa norsk bokmal

Returner ALLTID kun gyldig JSON i dette formatet:
{
  "name": "Kort, beskrivende navn pa ovelsen",
  "description": "1-2 setninger som forklarer hva ovelsen trener",
  "goal": "Konkret mal for ovelsen (hva spilleren skal oppna)",
  "instructions": "Nummererte steg-for-steg instruksjoner, separert med linjeskift",
  "duration_minutes": 15,
  "pyramid_level": "TEK",
  "training_area": "PUTT0-3",
  "difficulty": "klubb",
  "sg_area": "putting",
  "tags": ["putting", "avstandskontroll", "blokktrening"],
  "l_phase": "L2",
  "cs_level": "CS3",
  "equipment": ["Putter", "3 baller", "tees som markorer"],
  "success_criteria": "Konkret malebart kriterium (f.eks. '8 av 10 putter innenfor 1 meter')"
}`;

// --- Generation ---

export async function generateDrill(
  input: GenerateDrillInput
): Promise<GeneratedDrill> {
  const client = getClient();

  const userPrompt = buildUserPrompt(input);

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Ingen tekstrespons fra AI");
  }

  const parsed = parseJsonResponse(textBlock.text);
  return parsed;
}

function buildUserPrompt(input: GenerateDrillInput): string {
  const difficultyToCS: Record<DifficultyLevel, string> = {
    nybegynner: "CS1",
    rekrutt: "CS2",
    klubb: "CS3",
    regional: "CS4",
    nasjonal: "CS5",
    elite: "CS6",
  };

  let prompt = `Lag en treningsovelse med folgende spesifikasjoner:

- Pyramideniva: ${input.pyramidLevel}
- Treningsomrade: ${input.trainingArea}
- Vanskelighetsgrad: ${input.difficulty} (${difficultyToCS[input.difficulty]})
- Strokes Gained-omrade: ${input.sgArea}`;

  if (input.description) {
    prompt += `\n- Ekstra kontekst: ${input.description}`;
  }

  prompt += `\n\nGenerer en komplett drill som JSON.`;
  return prompt;
}

function parseJsonResponse(text: string): GeneratedDrill {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    // Validate required fields
    const required = [
      "name",
      "description",
      "goal",
      "instructions",
      "duration_minutes",
    ];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Mangler pakrevd felt: ${field}`);
      }
    }

    const durationMinutes = Number(parsed.duration_minutes);
    if (isNaN(durationMinutes) || durationMinutes < 5 || durationMinutes > 30) {
      throw new Error("duration_minutes ma vaere mellom 5 og 30");
    }

    return {
      name: String(parsed.name),
      description: String(parsed.description),
      goal: String(parsed.goal),
      instructions: String(parsed.instructions),
      duration_minutes: durationMinutes,
      pyramid_level: String(parsed.pyramid_level) as GeneratedDrill["pyramid_level"],
      training_area: String(parsed.training_area),
      difficulty: String(parsed.difficulty) as GeneratedDrill["difficulty"],
      sg_area: String(parsed.sg_area) as GeneratedDrill["sg_area"],
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map(String)
        : [],
      l_phase: String(parsed.l_phase ?? "L2"),
      cs_level: String(parsed.cs_level ?? "CS3"),
      equipment: Array.isArray(parsed.equipment)
        ? parsed.equipment.map(String)
        : [],
      success_criteria: String(parsed.success_criteria ?? ""),
    };
  } catch (error) {
    logger.error("[generate-drill] Feil ved parsing av AI-respons:", error);
    throw new Error("Kunne ikke parse AI-respons som gyldig drill-JSON");
  }
}
