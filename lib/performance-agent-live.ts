// PerformanceAgent live — wrapper rundt MCP performance_caddy_recommend
// + lagrer beslutninger til DB for senere analyse

import { callMcpTool } from "@/lib/mcp-client";

export interface PerformanceLiveInput {
  playerId: string;
  hole: {
    holeNumber: number;
    par: 3 | 4 | 5;
    totalDistance: number;
    fairwayWidth: number;
    greenWidth: number;
    greenDepth: number;
    hazards: Array<{
      type: "WATER" | "OB" | "BUNKER" | "ROUGH" | "TREES";
      side: "LEFT" | "RIGHT" | "FRONT" | "CARRY" | "AROUND_GREEN";
      distanceFromTee: number;
      width: number;
      severity: 1 | 2 | 3;
    }>;
  };
  remainingDistance: number;
  mentalState: 1 | 2 | 3 | 4 | 5;
  holesPlayed: number;
  scoreVsPar: number;
  weather?: { windSpeed: number; windDirection: number };
  roundId?: string; // for å koble flere beslutninger sammen
}

export interface PerformanceLiveOutput {
  recommendation: {
    recommendedClub: string;
    aimAdjustment: { direction: string; metersFromCenter: number };
    bogeyAvoidanceProbability: number;
    expectedScore: number;
    tigerFive: Array<{ scenario: string; eliminated: boolean; severity: number }>;
    eightPercentMargin: { appliedTo: string; margin: number };
    alternatives: Array<{ club: string; bogeyAvoidance: number; rationale: string }>;
    decision: "EXECUTE" | "RECONSIDER";
  };
  decisionLogId?: string;
}

/**
 * Hent live anbefaling og logg beslutningen.
 * Senere: log_outcome når spilleren har slått.
 */
export async function getPerformanceCaddyLive(
  input: PerformanceLiveInput
): Promise<PerformanceLiveOutput> {
  const result = (await callMcpTool("performance_caddy_recommend", {
    playerId: input.playerId,
    hole: input.hole,
    remainingDistance: input.remainingDistance,
    mentalState: input.mentalState,
    holesPlayed: input.holesPlayed,
    scoreVsPar: input.scoreVsPar,
    weather: input.weather,
  })) as { recommendation: PerformanceLiveOutput["recommendation"] };

  // I produksjon: lagre PerformanceDecision i DB
  // For nå returnerer vi bare anbefaling
  return {
    recommendation: result.recommendation,
  };
}

/**
 * Logg outcome etter at spilleren har slått.
 * Sammenligner anbefaling vs faktisk valg + utfall.
 */
export interface OutcomeLogInput {
  decisionLogId: string;
  actualClub?: string;
  actualOutcome: "HIT_TARGET" | "LEFT" | "RIGHT" | "SHORT" | "LONG" | "HAZARD";
}

export async function logShotOutcome(input: OutcomeLogInput): Promise<{
  decisionGrade: "SMART" | "NEUTRAL" | "RISKY" | "POOR";
}> {
  // Forenklet: hvis utfall = HIT_TARGET → SMART, HAZARD → POOR, ellers NEUTRAL
  let grade: "SMART" | "NEUTRAL" | "RISKY" | "POOR" = "NEUTRAL";
  if (input.actualOutcome === "HIT_TARGET") grade = "SMART";
  else if (input.actualOutcome === "HAZARD") grade = "POOR";
  else if (input.actualOutcome === "LEFT" || input.actualOutcome === "RIGHT") grade = "NEUTRAL";
  else grade = "RISKY";

  // I produksjon: oppdatér PerformanceDecision-tabell med utfallet
  return { decisionGrade: grade };
  void input.decisionLogId;
  void input.actualClub;
}
