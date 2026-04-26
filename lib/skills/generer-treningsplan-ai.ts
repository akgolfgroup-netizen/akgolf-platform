// Skill: generer-treningsplan-ai
// Bygger på MCP regelbasert plan, men beriker med AI-rationale + tilpasninger

import { runSkill } from "./anthropic.js";
import { generateTrainingPlan, calculateUSI, getMcpResource } from "@/lib/mcp-client";

const SYSTEM_PROMPT = `
Du er TreningsplaneAgent for AK Golf Academy.

Du beriker en regelbasert treningsplan med:
1. Personlig rationale basert på spillerens historie
2. Konkrete justeringer hvor relevant
3. Mental-fokus per uke
4. Oppmuntrende tone tilpasset kategori

Du har tilgang til:
- Metodikk-master (alle 27 seksjoner)
- Spillerens fulle profil (USI, historikk, kategori)
- Drills-bibliotek
- Tester (20 stk)

REGLER:
1. Aldri bryt invarianter (sek 12)
2. Følg pyramidefordeling for spillerens periode (sek 7)
3. Respekter aldersregelen for junior
4. Mental trening tilpasset kategori (sek 17)
5. Ikke endre struktur — beriker bare med språk
6. Output: Markdown-formatert plan med uke-overskrifter

Du foreslår — treneren godkjenner.
`.trim();

export interface GenererTreningsplanAiInput {
  playerId: string;
  playerName: string;
  category: string;
  period: "GRUNN" | "SPES" | "TURN";
  hoursPerWeek?: number;
  startDate?: string;
  trainerNote?: string;
}

export interface GenererTreningsplanAiOutput {
  planMarkdown: string;
  planJson: unknown;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function genererTreningsplanAi(
  input: GenererTreningsplanAiInput
): Promise<GenererTreningsplanAiOutput> {
  // 1. Generer regelbasert plan via MCP
  const [plan, usi] = await Promise.all([
    generateTrainingPlan({
      playerId: input.playerId,
      period: input.period,
      hoursPerWeek: input.hoursPerWeek,
      startDate: input.startDate,
      save: false, // ikke lagre ennå - trener må godkjenne først
    }),
    calculateUSI(input.playerId, false),
  ]);

  // 2. Hent metodikk-kontekst (kort, kun de viktige seksjonene)
  let pyramidContext = "";
  try {
    const data = await getMcpResource<string>("ak-golf://methodology/pyramid");
    pyramidContext = (typeof data === "string" ? data : JSON.stringify(data)).slice(0, 3000);
  } catch {
    pyramidContext = "(kontekst utilgjengelig)";
  }

  // 3. Be Claude generere markdown-versjon med rationale
  const userPrompt = `
Beriker følgende regelbaserte plan med rationale og personlig språk:

SPILLER: ${input.playerName}, kategori ${input.category}
PERIODE: ${input.period}
USI: ${usi.totalUSI.toFixed(1)}/100 (svakeste: ${usi.weakestDimension})

${input.trainerNote ? `TRENER-NOTAT: ${input.trainerNote}\n` : ""}

REGELBASERT PLAN:
${JSON.stringify(plan, null, 2)}

PYRAMIDE-KONTEKST:
${pyramidContext}

Skriv ut planen som Markdown med:
- Overskrift per uke
- Hver økt med formula-ID, drills, og kort rationale
- Mental-fokus per uke
- Forventet utvikling-tabell

Format-eksempel:
# Treningsplan — [Spillernavn]

**Periode:** [periode]
**USI før:** [tall]
**Forventet etter:** [tall]

## Uke 1: [Tema]

### [Dag] [tid] — [Type-økt]
- Formel: \`[ID]\`
- Drills:
  1. [drill-id-1]
  2. [drill-id-2]
- Begrunnelse: [hvorfor]

[osv]
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 3000,
  });

  return {
    planMarkdown: result.text,
    planJson: plan,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
