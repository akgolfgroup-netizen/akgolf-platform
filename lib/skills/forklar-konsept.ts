// Skill: forklar-konsept
// Spør om et AK Golf-konsept, få forklaring fra metodikk-master

import { runSkill } from "./anthropic";
import { getMcpResource } from "@/lib/mcp-client";

const SYSTEM_PROMPT = `
Du forklarer AK Golf Academy-konsepter til spillere, foreldre eller trenere.

Du har tilgang til:
- Metodikk-master (alle 27 seksjoner)
- AK-formelen
- Performance-metoden
- MORAD-prinsipper
- 13 invarianter

REGLER:
1. Bruk metodikk-master som kilde — ikke finn på
2. Hold svaret under 200 ord
3. Tilpass språk: spillere får direkte forklaring, foreldre får tilgjengelig språk
4. Bruk konkrete eksempler hvor mulig
5. Henvis til seksjonsnummer hvis relevant
`.trim();

export interface ForklarKonseptInput {
  question: string;
  audience?: "player" | "parent" | "coach";
}

export interface ForklarKonseptOutput {
  answer: string;
  references: string[];
  audience: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function forklarKonsept(
  input: ForklarKonseptInput
): Promise<ForklarKonseptOutput> {
  const audience = input.audience ?? "player";

  // Hent relevant kontekst fra metodikk-masteren
  // For enkelhets skyld henter vi master + spørsmålsspesifikke seksjoner
  let methodologyContext = "";
  try {
    const lower = input.question.toLowerCase();
    const sectionRefs: string[] = [];

    if (/morad|hælvekt|hael|cog|svinge?prinsipp/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/morad");
    }
    if (/performance|tiger.?five|8.?prosent|caddy|sannsynlighet/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/performance");
    }
    if (/kategori|opprykk|a.?k|snittscore/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/categories");
    }
    if (/pyramide|fys|tek|slag|spill|turn/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/pyramid");
    }
    if (/periode|grunn|spes|turner|sesong/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/periodization");
    }
    if (/invariant|regel/.test(lower)) {
      sectionRefs.push("ak-golf://methodology/invariants");
    }

    if (sectionRefs.length === 0) {
      sectionRefs.push("ak-golf://methodology/master");
    }

    const sections = await Promise.all(
      sectionRefs.map(async (uri) => {
        try {
          const data = await getMcpResource<string>(uri);
          return typeof data === "string" ? data : JSON.stringify(data);
        } catch {
          return "";
        }
      })
    );

    methodologyContext = sections.filter(Boolean).slice(0, 3).join("\n\n---\n\n");
    // Begrens kontekst til ~10k tegn for å holde Haiku rimelig
    if (methodologyContext.length > 10000) {
      methodologyContext = methodologyContext.slice(0, 10000) + "...[trunkert]";
    }
  } catch (err) {
    console.error("Kunne ikke hente metodikk:", err);
    methodologyContext = "(kontekst utilgjengelig)";
  }

  const audienceInstruction = {
    player: "Skriv direkte til spilleren. Bruk konkrete tips de kan handle på.",
    parent: "Skriv tilgjengelig — unngå teknisk sjargong. Forklar HVORFOR vi gjør det.",
    coach: "Faglig nivå — bruk korrekt terminologi. Inkluder formler og benchmarks der relevant.",
  }[audience];

  const userPrompt = `
Spørsmål: ${input.question}

Mottaker: ${audienceInstruction}

KONTEKST FRA METODIKK-MASTER:
${methodologyContext}

Skriv kort, konkret svar (under 200 ord). Inkluder seksjonsreferanse hvis du brukte spesifikk seksjon.
`.trim();

  const result = await runSkill({
    model: "HAIKU",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 800,
  });

  // Parser ut seksjons-referanser
  const refs = Array.from(result.text.matchAll(/(?:sek|seksjon)\s+(\d+(?:\.\d+)?)/gi)).map(
    (m) => `Sek ${m[1]}`
  );

  return {
    answer: result.text,
    references: [...new Set(refs)],
    audience,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
