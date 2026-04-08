import { createServiceClient } from "@/lib/supabase/server";
import { PYRAMID_LEVELS, M_ENVIRONMENTS } from "@/lib/portal/golf/ak-formula";
import type { ShotType } from "./l-phase-service";

/**
 * The Foundation Method — Degradation Service
 *
 * Core concept: Technical change happens at low speed/pressure.
 * As speed/pressure increases, technique degrades.
 * This service calculates how much technique falls at each pyramid level.
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Score at each pyramid level (TEK, SLAG, SPILL, TURN).
 * Score is 0-10 based on exercise quality ratings.
 */
export interface PyramidScores {
  TEK: number | null;
  SLAG: number | null;
  SPILL: number | null;
  TURN: number | null;
}

/**
 * Gap analysis between pyramid levels.
 * Shows how much technique degrades as pressure increases.
 */
export interface TekSlagSpillGap {
  shotType: ShotType;
  tekScore: number | null;
  slagScore: number | null;
  spillScore: number | null;
  turnScore: number | null;
  tekToSlagGap: number | null; // Negative = degradation
  slagToSpillGap: number | null;
  spillToTurnGap: number | null;
  totalDegradation: number | null; // TEK - TURN
  dataPoints: number;
}

/**
 * Degradation curve data point.
 */
export interface DegradationPoint {
  pyramidLevel: keyof typeof PYRAMID_LEVELS;
  score: number | null;
  dataPoints: number;
}

/**
 * Full degradation curve for a shot type.
 */
export interface DegradationCurve {
  shotType: ShotType;
  points: DegradationPoint[];
  trend: "stable" | "degrading" | "improving" | "insufficient_data";
  averageDegradationPerLevel: number | null;
}

/**
 * M-environment distribution showing where the player trains.
 */
export interface EnvironmentDistribution {
  environment: number; // 0-5
  name: string;
  description: string;
  count: number;
  percentage: number;
  averageScore: number | null;
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Calculate degradation curve based on TEK/SLAG/SPILL/TURN scores.
 *
 * Maps exercises to pyramid levels:
 * - TEK: Low speed (CS 20-40), low environment (M 0-1)
 * - SLAG: Medium speed (CS 60-80), medium environment (M 2-3)
 * - SPILL: High speed (CS 80-100), course environment (M 4)
 * - TURN: Competition (M 5) or high pressure (PR 4-5)
 */
export async function calculateDegradation(
  userId: string,
  shotType: ShotType
): Promise<DegradationCurve> {
  const supabase = createServiceClient();
  
  // Get exercises for this shot type from the last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: exercises, error } = await supabase
    .from("TrainingLogExercise")
    .select(`
      score,
      clubSpeed,
      environment,
      pressLevel,
      name,
      TrainingLog!inner(userId, date)
    `)
    .gte("TrainingLog.date", ninetyDaysAgo.toISOString())
    .eq("TrainingLog.userId", userId)
    .not("score", "is", null);

  if (error) throw error;

  // Filter exercises that match this shot type (by name pattern)
  const shotTypePatterns = getShotTypePatterns(shotType);
  const relevantExercises = (exercises || []).filter((ex) =>
    shotTypePatterns.some((pattern) =>
      ex.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  // Categorize exercises by pyramid level
  const tekExercises: number[] = [];
  const slagExercises: number[] = [];
  const spillExercises: number[] = [];
  const turnExercises: number[] = [];

  for (const ex of relevantExercises) {
    if (ex.score === null) continue;

    const level = classifyPyramidLevel(
      ex.clubSpeed ?? 60,
      ex.environment ?? 2,
      ex.pressLevel ?? 2
    );

    switch (level) {
      case "TEK":
        tekExercises.push(ex.score);
        break;
      case "SLAG":
        slagExercises.push(ex.score);
        break;
      case "SPILL":
        spillExercises.push(ex.score);
        break;
      case "TURN":
        turnExercises.push(ex.score);
        break;
    }
  }

  // Calculate average scores
  const tekScore = average(tekExercises);
  const slagScore = average(slagExercises);
  const spillScore = average(spillExercises);
  const turnScore = average(turnExercises);

  // Build points array
  const points: DegradationPoint[] = [
    { pyramidLevel: "TEK", score: tekScore, dataPoints: tekExercises.length },
    { pyramidLevel: "SLAG", score: slagScore, dataPoints: slagExercises.length },
    { pyramidLevel: "SPILL", score: spillScore, dataPoints: spillExercises.length },
    { pyramidLevel: "TURN", score: turnScore, dataPoints: turnExercises.length },
  ];

  // Determine trend
  const trend = determineTrend(tekScore, slagScore, spillScore, turnScore);

  // Calculate average degradation per level
  const scores = [tekScore, slagScore, spillScore, turnScore].filter(
    (s): s is number => s !== null
  );
  let averageDegradationPerLevel: number | null = null;
  if (scores.length >= 2) {
    const totalDrop = scores[0] - scores[scores.length - 1];
    averageDegradationPerLevel = totalDrop / (scores.length - 1);
  }

  return {
    shotType,
    points,
    trend,
    averageDegradationPerLevel,
  };
}

/**
 * Get gap analysis between TEK/SLAG/SPILL levels.
 * Shows how much technique falls at each level transition.
 */
export async function getTekSlagSpillGap(
  userId: string,
  shotType: ShotType
): Promise<TekSlagSpillGap> {
  const curve = await calculateDegradation(userId, shotType);

  const tekScore = curve.points.find((p) => p.pyramidLevel === "TEK")?.score ?? null;
  const slagScore = curve.points.find((p) => p.pyramidLevel === "SLAG")?.score ?? null;
  const spillScore = curve.points.find((p) => p.pyramidLevel === "SPILL")?.score ?? null;
  const turnScore = curve.points.find((p) => p.pyramidLevel === "TURN")?.score ?? null;

  const totalDataPoints = curve.points.reduce((sum, p) => sum + p.dataPoints, 0);

  return {
    shotType,
    tekScore,
    slagScore,
    spillScore,
    turnScore,
    tekToSlagGap: calculateGap(tekScore, slagScore),
    slagToSpillGap: calculateGap(slagScore, spillScore),
    spillToTurnGap: calculateGap(spillScore, turnScore),
    totalDegradation: calculateGap(tekScore, turnScore),
    dataPoints: totalDataPoints,
  };
}

/**
 * Get M-environment distribution showing where the player trains.
 * Returns percentage of training in each environment level (0-5).
 */
export async function getEnvironmentDistribution(
  userId: string
): Promise<EnvironmentDistribution[]> {
  const supabase = createServiceClient();
  
  // Get exercises from the last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: exercises, error } = await supabase
    .from("TrainingLogExercise")
    .select(`
      environment,
      score,
      TrainingLog!inner(userId, date)
    `)
    .gte("TrainingLog.date", ninetyDaysAgo.toISOString())
    .eq("TrainingLog.userId", userId)
    .not("environment", "is", null);

  if (error) throw error;

  // Group by environment
  const envGroups: Map<number, { count: number; scores: number[] }> = new Map();

  for (let i = 0; i <= 5; i++) {
    envGroups.set(i, { count: 0, scores: [] });
  }

  for (const ex of (exercises || [])) {
    if (ex.environment === null) continue;
    const group = envGroups.get(ex.environment);
    if (group) {
      group.count++;
      if (ex.score !== null) {
        group.scores.push(ex.score);
      }
    }
  }

  const totalCount = (exercises || []).length || 1; // Avoid division by zero

  // Build distribution array
  const distribution: EnvironmentDistribution[] = [];

  for (let i = 0; i <= 5; i++) {
    const envData = M_ENVIRONMENTS[i as keyof typeof M_ENVIRONMENTS];
    const group = envGroups.get(i);

    distribution.push({
      environment: i,
      name: envData.name,
      description: envData.description,
      count: group?.count ?? 0,
      percentage: ((group?.count ?? 0) / totalCount) * 100,
      averageScore: average(group?.scores ?? []),
    });
  }

  return distribution;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get name patterns that match a shot type.
 */
function getShotTypePatterns(shotType: ShotType): string[] {
  switch (shotType) {
    case "DRIVER":
      return ["driver", "tee", "utsving", "tee total"];
    case "IRON":
      return ["jern", "iron", "innspill", "approach", "hybrid"];
    case "WEDGE":
      return ["wedge", "chip", "pitch", "lob", "bunker", "naerspill"];
    case "PUTT":
      return ["putt", "putting"];
    default:
      return [];
  }
}

/**
 * Classify an exercise into a pyramid level based on its parameters.
 */
function classifyPyramidLevel(
  clubSpeed: number,
  environment: number,
  pressLevel: number
): "TEK" | "SLAG" | "SPILL" | "TURN" {
  // TURN: Competition environment or very high pressure
  if (environment === 5 || pressLevel >= 4) {
    return "TURN";
  }

  // SPILL: Course environment
  if (environment === 4) {
    return "SPILL";
  }

  // TEK: Low speed and controlled environment
  if (clubSpeed <= 40 && environment <= 1) {
    return "TEK";
  }

  // SLAG: Everything else (medium conditions)
  return "SLAG";
}

/**
 * Calculate average of an array of numbers.
 */
function average(numbers: number[]): number | null {
  if (numbers.length === 0) return null;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round((sum / numbers.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate gap between two scores.
 * Negative means degradation (lower is worse).
 */
function calculateGap(from: number | null, to: number | null): number | null {
  if (from === null || to === null) return null;
  return Math.round((to - from) * 10) / 10;
}

/**
 * Determine the overall trend based on scores.
 */
function determineTrend(
  tekScore: number | null,
  slagScore: number | null,
  spillScore: number | null,
  turnScore: number | null
): DegradationCurve["trend"] {
  const scores = [tekScore, slagScore, spillScore, turnScore].filter(
    (s): s is number => s !== null
  );

  if (scores.length < 2) {
    return "insufficient_data";
  }

  // Check if scores are declining (degrading) or stable
  let increases = 0;
  let decreases = 0;

  for (let i = 1; i < scores.length; i++) {
    const diff = scores[i] - scores[i - 1];
    if (diff > 0.5) increases++;
    else if (diff < -0.5) decreases++;
  }

  if (decreases > increases) {
    return "degrading";
  } else if (increases > decreases) {
    return "improving";
  }

  return "stable";
}
