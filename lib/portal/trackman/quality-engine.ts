/**
 * TrackMan Data Quality Engine
 *
 * Vurderer påliteligheten til treningsdata basert på kilde og kontekst.
 * Hierarki: TRACKMAN_VERIFIED > GPS_CALCULATED > HYBRID_ESTIMATED > SELF_REPORTED
 */

import {
  DATA_QUALITY_SCORE,
  type DataQualityLevel,
} from "@/lib/portal/training-research/constants";

export interface QualityAssessment {
  level: DataQualityLevel;
  score: number; // 1-4
  confidence: number; // 0-100
  factors: QualityFactor[];
}

export interface QualityFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  weight: number; // 0-1
  description: string;
}

// ─── Hovedvurdering ──────────────────────────────────────────────────

/**
 * Vurder datakvalitet for en økt basert på tilgjengelige kilder.
 */
export function assessSessionQuality(params: {
  hasTrackManData: boolean;
  trackManShotCount?: number;
  hasGPSData: boolean;
  hasVideoRecording: boolean;
  isCoachPresent: boolean;
  playerSelfReportedReps: number;
  environment: string; // M1-M4
}): QualityAssessment {
  const factors: QualityFactor[] = [];

  // 1. Primær datakilde
  if (params.hasTrackManData && (params.trackManShotCount ?? 0) > 0) {
    factors.push({
      name: "TrackMan-verifisering",
      impact: "positive",
      weight: 0.40,
      description: `${params.trackManShotCount} shots med TrackMan-data`,
    });
  } else if (params.hasGPSData) {
    factors.push({
      name: "GPS-beregning",
      impact: "positive",
      weight: 0.25,
      description: "Avstand beregnet fra GPS",
    });
  } else {
    factors.push({
      name: "Selvrapportering",
      impact: "negative",
      weight: 0.10,
      description: "Ingen objektiv datakilde",
    });
  }

  // 2. Video-dokumentasjon
  if (params.hasVideoRecording) {
    factors.push({
      name: "Video-opptak",
      impact: "positive",
      weight: 0.20,
      description: "Visuell verifisering tilgjengelig",
    });
  }

  // 3. Coach-tilstedeværelse
  if (params.isCoachPresent) {
    factors.push({
      name: "Coach-tilstedeværelse",
      impact: "positive",
      weight: 0.15,
      description: "Coach verifiserte økten",
    });
  }

  // 4. Miljø-faktor
  const envScore = getEnvironmentQualityScore(params.environment);
  if (envScore < 1.0) {
    factors.push({
      name: "Miljø-kvalitet",
      impact: "negative",
      weight: 0.10,
      description: `Lavere pålitelighet i ${params.environment}`,
    });
  }

  // Beregn total score og nivå
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScore = factors.reduce(
    (sum, f) => sum + f.weight * (f.impact === "positive" ? 1 : f.impact === "negative" ? 0.3 : 0.6),
    0
  );

  const normalizedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  const confidence = Math.round(normalizedScore * 100);

  // Bestem nivå
  let level: DataQualityLevel;
  if (params.hasTrackManData && confidence >= 75) {
    level = "TRACKMAN_VERIFIED";
  } else if (params.hasGPSData && confidence >= 60) {
    level = "GPS_CALCULATED";
  } else if (confidence >= 40) {
    level = "HYBRID_ESTIMATED";
  } else {
    level = "SELF_REPORTED";
  }

  return {
    level,
    score: DATA_QUALITY_SCORE[level],
    confidence,
    factors,
  };
}

function getEnvironmentQualityScore(env: string): number {
  switch (env) {
    case "M1": return 0.95; // Range — optimale forhold
    case "M2": return 0.90; // Simulator — god data, men ikke ekte ballflyt
    case "M3": return 0.85; // Bane (trening) — variabler
    case "M4": return 0.70; // Bane (konkurranse) — høyt press, mindre kontroll
    default: return 0.80;
  }
}

// ─── Verifisering ────────────────────────────────────────────────────

/**
 * Sjekk om en økt kvalifiserer for TrackMan-verifisert status.
 */
export function qualifiesForTrackManVerification(params: {
  trackManSessionId?: string | null;
  trackManShotCount?: number;
  trackManDataQuality?: number; // 0-100
}): boolean {
  if (!params.trackManSessionId) return false;
  if ((params.trackManShotCount ?? 0) < 5) return false;
  if ((params.trackManDataQuality ?? 0) < 70) return false;
  return true;
}

/**
 * Beregn match-score mellom TrackMan-shots og plan-fase.
 * Returnerer 0-100 hvor 100 = perfekt match.
 */
export function calculateTrackManPhaseMatch(params: {
  trackManShots: Array<{ club: string; carryDistance: number | null }>;
  phaseArea: string; // TrainingArea
}): { score: number; warnings: string[] } {
  const warnings: string[] = [];

  if (params.trackManShots.length === 0) {
    return { score: 0, warnings: ["Ingen TrackMan-shots å matche"] };
  }

  // Forventet klubb-miks per fase-område
  const expectedClubs = getExpectedClubsForArea(params.phaseArea);
  const actualClubs = params.trackManShots.map((s) => s.club.toLowerCase());

  // Sjekk klubb-overlapp
  const matchingClubs = actualClubs.filter((c) =>
    expectedClubs.some((ec) => c.includes(ec))
  );
  const clubRatio = matchingClubs.length / actualClubs.length;

  // Sjekk avstandsdistribusjon
  const distances = params.trackManShots
    .map((s) => s.carryDistance)
    .filter((d): d is number => d !== null);
  const avgDistance = distances.length > 0 ? distances.reduce((a, b) => a + b, 0) / distances.length : 0;
  const expectedDistance = getExpectedDistanceForArea(params.phaseArea);
  const distanceDeviation = expectedDistance > 0 ? Math.abs(avgDistance - expectedDistance) / expectedDistance : 0;

  // Beregn score
  let score = Math.round(clubRatio * 70); // 70% vekt på klubb
  if (distanceDeviation < 0.2) score += 30; // 30% vekt på avstand
  else if (distanceDeviation < 0.4) score += 15;

  score = Math.min(100, Math.max(0, score));

  // Generer advarsler
  if (clubRatio < 0.5) {
    warnings.push(`Kun ${Math.round(clubRatio * 100)}% av klubbene matcher fase-området`);
  }
  if (distanceDeviation > 0.3) {
    warnings.push(`Avvik i forventet avstand: ${Math.round(distanceDeviation * 100)}%`);
  }
  if (params.trackManShots.length < 10) {
    warnings.push("Få shots (<10) — lav statistisk sikkerhet");
  }

  return { score, warnings };
}

function getExpectedClubsForArea(area: string): string[] {
  switch (area) {
    case "TEE_OFF_THE_TEE":
      return ["driver", "wood", "3-wood", "5-wood"];
    case "APPROACH_200_PLUS":
      return ["4-iron", "5-iron", "hybrid", "3-iron"];
    case "APPROACH_150_200":
      return ["6-iron", "7-iron", "5-iron", "hybrid"];
    case "APPROACH_100_150":
      return ["8-iron", "9-iron", "pw", "7-iron"];
    case "APPROACH_50_100":
      return ["pw", "gw", "sw", "9-iron"];
    case "CHIP_PITCH_10_50":
      return ["sw", "lw", "pw", "gw"];
    case "BUNKER":
      return ["sw", "lw"];
    case "PUTTING":
      return ["putter"];
    default:
      return [];
  }
}

function getExpectedDistanceForArea(area: string): number {
  switch (area) {
    case "TEE_OFF_THE_TEE": return 240;
    case "APPROACH_200_PLUS": return 210;
    case "APPROACH_150_200": return 170;
    case "APPROACH_100_150": return 125;
    case "APPROACH_50_100": return 75;
    case "CHIP_PITCH_10_50": return 25;
    case "BUNKER": return 15;
    case "PUTTING": return 5;
    default: return 0;
  }
}
