// RapportAgent — kvartalsvise spiller-rapporter
// Spec: software/dokumenter/ai-system/agents-spec.md sek 9

import { runSkill } from "./anthropic";

const SYSTEM_PROMPT_TRAINER = `
Du genererer kvartalsrapport for trener-versjon (faglig, full detalj).

REGLER:
1. Maks 2 sider tekst
2. Faglig terminologi (kategorier, AK-formel, MORAD/Performance)
3. Inkluder konkrete tall (USI, GIR%, putts/runde)
4. Vis trender (Q1 vs Q2 osv.)
5. Identifisér 3 prioriterte fokusområder
6. Foreslå konkrete tiltak

Format:
# Kvartalsrapport [spillernavn] [Q[n] [år]]

## Sammendrag
[2-3 setninger]

## Nøkkeltall
- USI: [tall] (Δ +X)
- Snittscore: [tall]
- GIR: [%]
- Putts/runde: [tall]
- Test-utvikling: [highlights]

## Hva har spilleren utviklet
[3-5 punkter]

## Hvor er det rom for vekst
[3 prioriterte områder]

## Plan for neste kvartal
[3 konkrete tiltak]

## Coach-signatur
[trener]
`.trim();

const SYSTEM_PROMPT_PARENT = `
Du genererer kvartalsrapport for foreldre-versjon (empatisk, ikke teknisk).

REGLER:
1. Maks 1 side
2. INGEN teknisk sjargong (USI, L-faser osv. forklart)
3. Empatisk tone — ros prosess, ikke bare resultat
4. Konkret hva foreldre kan gjøre hjemme
5. Hva som er fokus de neste 3 mnd

Format:
# [Barnets navn] — Kvartalsrapport [Q[n] [år]]

## Hilsen til foreldre
[Empatisk åpning]

## Hva [barn] har utviklet
[2-3 ting i ikke-tekniske ord]

## Hva vi jobber med fremover
[2-3 ting i hverdagsspråk]

## Hjemme kan dere
[1-2 konkrete handlinger]

## Med vennlig hilsen
[trener]
`.trim();

export interface RapportAgentInput {
  playerId: string;
  playerName: string;
  category: string;
  age?: number;
  parentName?: string;
  trainerName?: string;
  quarter: string; // "Q3 2027"

  metrics: {
    usiBefore: number;
    usiAfter: number;
    avgScore?: number;
    girPct?: number;
    puttsPerRound?: number;
    testProgress?: string[];
  };

  developmentNotes: string[];
  focusAreasNextQuarter: string[];

  version: "trainer" | "parent" | "both";
}

export interface RapportAgentOutput {
  trainerReport?: string;
  parentReport?: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostNOK: number };
  durationMs: number;
}

export async function generateQuarterlyReport(
  input: RapportAgentInput
): Promise<RapportAgentOutput> {
  const totalUsage = { inputTokens: 0, outputTokens: 0, estimatedCostNOK: 0 };
  let totalDuration = 0;
  let trainerReport: string | undefined;
  let parentReport: string | undefined;

  const dataContext = buildDataContext(input);

  if (input.version === "trainer" || input.version === "both") {
    const result = await runSkill({
      model: "SONNET",
      systemPrompt: SYSTEM_PROMPT_TRAINER,
      userPrompt: dataContext,
      maxTokens: 1800,
    });
    trainerReport = result.text;
    totalUsage.inputTokens += result.usage.inputTokens;
    totalUsage.outputTokens += result.usage.outputTokens;
    totalUsage.estimatedCostNOK += result.usage.estimatedCostNOK;
    totalDuration += result.durationMs;
  }

  if (input.version === "parent" || input.version === "both") {
    const result = await runSkill({
      model: "SONNET",
      systemPrompt: SYSTEM_PROMPT_PARENT,
      userPrompt: dataContext,
      maxTokens: 1200,
    });
    parentReport = result.text;
    totalUsage.inputTokens += result.usage.inputTokens;
    totalUsage.outputTokens += result.usage.outputTokens;
    totalUsage.estimatedCostNOK += result.usage.estimatedCostNOK;
    totalDuration += result.durationMs;
  }

  return {
    trainerReport,
    parentReport,
    usage: totalUsage,
    durationMs: totalDuration,
  };
}

function buildDataContext(input: RapportAgentInput): string {
  return `
SPILLER: ${input.playerName}
KATEGORI: ${input.category}${input.age ? `, ${input.age} år` : ""}
KVARTAL: ${input.quarter}
${input.parentName ? `FORELDER: ${input.parentName}\n` : ""}TRENER: ${input.trainerName ?? "Anders"}

KEY METRICS:
- USI før: ${input.metrics.usiBefore.toFixed(1)}
- USI etter: ${input.metrics.usiAfter.toFixed(1)} (Δ ${input.metrics.usiAfter > input.metrics.usiBefore ? "+" : ""}${(input.metrics.usiAfter - input.metrics.usiBefore).toFixed(1)})
${input.metrics.avgScore ? `- Snittscore: ${input.metrics.avgScore}` : ""}
${input.metrics.girPct != null ? `- GIR: ${input.metrics.girPct}%` : ""}
${input.metrics.puttsPerRound ? `- Putts/runde: ${input.metrics.puttsPerRound}` : ""}
${input.metrics.testProgress ? `- Test-utvikling: ${input.metrics.testProgress.join(", ")}` : ""}

UTVIKLING I KVARTALET:
${input.developmentNotes.map((n) => `- ${n}`).join("\n")}

FOKUS NESTE KVARTAL:
${input.focusAreasNextQuarter.map((f) => `- ${f}`).join("\n")}

Generer kvartalsrapport ifølge systemprompten. Bruk dataene over.
`.trim();
}
