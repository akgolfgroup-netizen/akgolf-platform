// Skill: vurder-opprykk
// Bygger på MCP check_promotion + AI-anbefaling i naturlig språk

import { runSkill } from "./anthropic.js";
import { checkPromotion } from "@/lib/mcp-client";

const SYSTEM_PROMPT = `
Du vurderer kategori-opprykk for AK Golf Academy-spillere.

REGLER:
1. Spilleren må passere 5 av 7 testkategorier på neste nivå (sek 16.6)
2. Ikke bare se på score — kontekst er viktig (skader, sesong, konsistens)
3. Hvis nær opprykk: gi en konkret 4-8 ukers plan
4. Hvis langt unna: gi 3 prioriterte tiltak

Ikke "godkjenn" opprykk — du gir trenervurdering. Trener tar endelig beslutning.

Format-mal:
- Konklusjon (1 setning)
- Begrunnelse (3-5 punkter)
- Anbefalte neste-steg
- Estimert tidslinje
`.trim();

export interface VurderOpprykkInput {
  playerId: string;
}

export interface VurderOpprykkOutput {
  recommendation: string;
  eligible: boolean;
  testsPassed: number;
  weakestArea: string | null;
  rawData: unknown;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function vurderOpprykk(
  input: VurderOpprykkInput
): Promise<VurderOpprykkOutput> {
  // 1. Hent strukturerte data fra MCP
  const promotionData = (await checkPromotion(input.playerId)) as {
    eligible: boolean;
    testsPassed: number;
    weakestArea: string | null;
    nextCategory: string | null;
    testsByCategory: Array<{
      category: string;
      passed: boolean;
      latestResult: number | null;
      benchmark: string | null;
      gap: string | null;
    }>;
    timelineEstimate: string;
    promotionEligible?: boolean;
    weakestTestCategory?: string;
  };

  // Tilpass shape — handleCheckPromotion returnerer noen ulike felt
  const eligible = promotionData.promotionEligible ?? promotionData.eligible ?? false;
  const weakest =
    promotionData.weakestTestCategory ?? promotionData.weakestArea ?? null;

  // 2. Be Claude gi naturlig-språk-anbefaling
  const userPrompt = `
Vurder kategori-opprykk basert på følgende data:

Aktuell vurdering: ${eligible ? "BEREKTIGET" : "IKKE BEREKTIGET"}
Tester passert: ${promotionData.testsPassed}/7
Neste kategori: ${promotionData.nextCategory ?? "(maks oppnådd)"}
Svakeste område: ${weakest ?? "ingen"}
Tidslinje: ${promotionData.timelineEstimate}

Test-detaljer per kategori:
${JSON.stringify(promotionData.testsByCategory, null, 2)}

Gi en strukturert vurdering med:
1. Konklusjon
2. Begrunnelse (3-5 punkter)
3. Anbefalte neste steg
4. Estimert tidslinje for opprykk
`.trim();

  const result = await runSkill({
    model: "HAIKU",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 1000,
  });

  return {
    recommendation: result.text,
    eligible,
    testsPassed: promotionData.testsPassed,
    weakestArea: weakest,
    rawData: promotionData,
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
