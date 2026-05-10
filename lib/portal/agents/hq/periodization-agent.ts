/**
 * Periodiseringsagent — TypeScript-interface og stub
 *
 * Definerer input/output-typer for Anthropic Managed Agent som genererer
 * periodiseringsplaner for AK Golf-spillere.
 *
 * Sprint 0: Kun typer og stub. Implementasjon kobles til
 * Anthropic Managed Agent API i Sprint 1.
 *
 * Kilde: docs/agents/periodisering-agent-spec.md
 */

import type { PyramideCode } from "@/lib/portal/training/ak-taxonomy";
import type { Phase } from "@/lib/portal/allocation/formulas";

// ─── INPUT ────────────────────────────────────────────────────────────

export interface PeriodizationInput {
  playerId: string;
  season: number; // 2026, 2027...
}

/** Spillerdata som agenten henter fra databasen */
export interface PlayerSnapshot {
  playerId: string;
  handicap: number;
  averageScore: number | null;
  category: string; // A-K
  age: number;
  weeklyTrainingHours: number;
  playerType: string;
}

export interface SGSnapshot {
  tee: number;
  approach: number;
  aroundGreen: number;
  putting: number;
  samples: number;
}

export interface TournamentEntry {
  id: string;
  name: string;
  date: string; // ISO date
  importance: number; // 1-5
}

export interface TrainingLogSummary {
  last12WeeksAvgHours: number;
  completionRate: number;
  mostTrainedArea: PyramideCode;
  leastTrainedArea: PyramideCode;
}

// ─── OUTPUT ───────────────────────────────────────────────────────────

/** Fordelingsprosent per pyramideniva — summen er alltid 100 */
export interface PyramidDistribution {
  FYS: number;
  TEK: number;
  SLAG: number;
  SPILL: number;
  TURN: number;
}

export interface PeriodBlock {
  id: string;
  type: Phase;
  label: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  weeks: number;
  distribution: PyramidDistribution;
  focus: string[];
  weeklySessionCount: number;
  /** Anbefalte treningsmiljoer for perioden (M0-M5) */
  environment: string[];
  /** Anbefalt CS-range for perioden */
  csTarget: string;
  /** Anbefalt press-range for perioden */
  pressLevel: string;
}

export interface TaperBlock {
  tournamentId: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  weeks: number;
  distribution: PyramidDistribution;
  focus: string[];
}

export interface PeriodizationOutput {
  playerId: string;
  season: number;
  playerCategory: string;
  handicap: number;
  averageScore: number;
  weeklyHours: number;
  periods: PeriodBlock[];
  taperBlocks: TaperBlock[];
  /** Fordeling per fasetype — brukes som oppslagstabell */
  weeklyDistribution: Record<string, PyramidDistribution>;
  /** Naturlig-sprak-forklaring av beslutningene */
  rationale: string;
  /** Regler for nar planen bor justeres automatisk */
  adjustmentTriggers: string[];
}

// ─── AGENT CONFIG ─────────────────────────────────────────────────────

export const PERIODIZATION_AGENT_CONFIG = {
  agentId: "periodization" as const,
  name: "Periodiseringsagent",
  model: "claude-sonnet-4-6",
  maxTurns: 15,
  /** Minimum antall SG-runder for at SG-data skal brukes */
  minSGSamples: 5,
  /** Minimum gjennomforingsrate for at planen skal bestaa (0-1) */
  minCompletionRate: 0.7,
  /** Antall uker taper-blokk for prioriterte turneringer */
  taperWeeks: {
    low: 2, // importance 1-2
    medium: 3, // importance 3-4
    high: 4, // importance 5
  },
} as const;

// ─── STUB ─────────────────────────────────────────────────────────────

/**
 * Genererer periodiseringsplan for en spiller via Anthropic Managed Agent.
 *
 * Sprint 0: Stub som returnerer null.
 * Sprint 1: Kobles til Anthropic Agent API med Supabase MCP.
 *
 * @param input - Spiller-ID og sesong
 * @returns Periodiseringsplan eller null hvis agenten ikke er tilgjengelig
 */
export async function generatePeriodization(
  input: PeriodizationInput,
): Promise<PeriodizationOutput | null> {
  // Sprint 1: Implementer med Anthropic Managed Agent API
  // const agent = new AnthropicAgent(PERIODIZATION_AGENT_CONFIG);
  // const result = await agent.run({ prompt: buildPrompt(input) });
  // return parsePeriodizationOutput(result);

  console.log(
    `[periodization-agent] Stub kalt for spiller ${input.playerId}, sesong ${input.season}`,
  );
  return null;
}

/**
 * Validerer at en PeriodizationOutput er gyldig.
 * Sjekker at distribusjoner summerer til 100, datoer er sekvensielle, osv.
 */
export function validatePeriodizationOutput(
  output: PeriodizationOutput,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Sjekk at alle perioder har distribusjoner som summerer til 100
  for (const period of output.periods) {
    const sum =
      period.distribution.FYS +
      period.distribution.TEK +
      period.distribution.SLAG +
      period.distribution.SPILL +
      period.distribution.TURN;
    if (sum !== 100) {
      errors.push(
        `Periode "${period.label}": fordeling summerer til ${sum}, ikke 100`,
      );
    }
  }

  // Sjekk at taper-blokker har gyldige distribusjoner
  for (const taper of output.taperBlocks) {
    const sum =
      taper.distribution.FYS +
      taper.distribution.TEK +
      taper.distribution.SLAG +
      taper.distribution.SPILL +
      taper.distribution.TURN;
    if (sum !== 100) {
      errors.push(
        `Taper "${taper.tournamentName}": fordeling summerer til ${sum}, ikke 100`,
      );
    }
  }

  // Sjekk at FYS aldri er under 5% (skadeforebygging)
  for (const period of output.periods) {
    if (period.distribution.FYS < 5) {
      errors.push(
        `Periode "${period.label}": FYS er ${period.distribution.FYS}% — minimum er 5%`,
      );
    }
  }

  // Sjekk at TURN aldri er over 35%
  for (const period of output.periods) {
    if (period.distribution.TURN > 35) {
      errors.push(
        `Periode "${period.label}": TURN er ${period.distribution.TURN}% — maksimum er 35%`,
      );
    }
  }

  // Sjekk at perioder er sekvensielle (ingen overlapp)
  const sortedPeriods = [...output.periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
  for (let i = 1; i < sortedPeriods.length; i++) {
    const prevEnd = new Date(sortedPeriods[i - 1].endDate);
    const currStart = new Date(sortedPeriods[i].startDate);
    if (currStart < prevEnd) {
      errors.push(
        `Overlapp mellom "${sortedPeriods[i - 1].label}" og "${sortedPeriods[i].label}"`,
      );
    }
  }

  // Sjekk at rationale ikke er tom
  if (!output.rationale || output.rationale.trim().length === 0) {
    errors.push("Rationale mangler");
  }

  return { valid: errors.length === 0, errors };
}
