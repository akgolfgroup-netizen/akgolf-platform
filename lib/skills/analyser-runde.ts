// Skill: analyser-runde
// Strokes Gained-analyse + AI-genererte insights

import { runSkill } from "./anthropic";
import { analyzeRound, calculateUSI } from "@/lib/mcp-client";

const SYSTEM_PROMPT = `
Du er Strokes Gained-analytiker for AK Golf Academy.

Du analyserer runder med kombinasjon av:
- SG-data per slag-type (tee/approach/around-green/putting)
- Performance-metoden compliance
- Spillerens USI før runden

Output-format:
1. Sammendrag av runden (2-3 setninger)
2. SG-breakdown med fortolkning
3. 3-5 nøkkelinnsikter (hvor tapte/vant spilleren slag)
4. Anbefalt fokus de neste 2 ukene
5. Drill-anbefalinger fra biblioteket

Vær konkret. Bruk navn på drills og tester.
Tone: faglig, trener-til-trener.
Lengde: 200-400 ord.
`.trim();

export interface AnalyserRundeInput {
  playerId: string;
  score: number;
  par: number;
  fairwaysHit: boolean[];
  girHits: boolean[];
  putts: number[];
  penalties?: number;
  context?: string; // f.eks. "førsteturnering, var nervøs"
}

export interface AnalyserRundeOutput {
  analysis: string;
  rawData: unknown;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function analyserRunde(
  input: AnalyserRundeInput
): Promise<AnalyserRundeOutput> {
  // 1. Kjør SG-analyse via MCP
  const [sgData, usi] = await Promise.all([
    analyzeRound({
      playerId: input.playerId,
      score: input.score,
      par: input.par,
      fairwaysHit: input.fairwaysHit,
      girHits: input.girHits,
      putts: input.putts,
      penalties: input.penalties,
    }),
    calculateUSI(input.playerId, false),
  ]);

  // 2. Be Claude generere innsikter
  const userPrompt = `
Analyser denne runden og gi strukturert tilbakemelding:

SCORE: ${input.score} (par ${input.par}, ${input.score - input.par > 0 ? "+" : ""}${input.score - input.par})

${input.context ? `KONTEKST: ${input.context}\n` : ""}

STROKES GAINED-DATA:
${JSON.stringify(sgData, null, 2)}

SPILLERENS USI (før runden):
- Total: ${usi.totalUSI.toFixed(1)}
- Svakeste: ${usi.weakestDimension} (${usi.dimensions[usi.weakestDimension]?.toFixed(1)})
- Sterkeste: ${usi.strongestDimension}

Generer en analyse som:
1. Oppsummerer runden
2. Kobler SG-tap/-vinst til USI-svakheter
3. Foreslår 2-3 konkrete fokusområder for neste 2 uker
4. Anbefaler 2-3 drill-typer som adresserer det

Bruk metodikk-master-terminologi (kategorier, AK-formel, MORAD/Performance).
`.trim();

  const result = await runSkill({
    model: "SONNET",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 1500,
  });

  return {
    analysis: result.text,
    rawData: { sgData, usi },
    usage: result.usage,
    durationMs: result.durationMs,
  };
}
