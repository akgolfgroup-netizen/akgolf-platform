/**
 * Unified Skill Index (USI) v0.2 — Rule-based + ML-enhanced computation
 *
 * Combines RoundStats, TrackMan, TestResult, TrainingLog and
 * MentalScorecardEntry into a 9-dimensional latent skill vector.
 *
 * v0.2 adds:
 * - ONNX Random Forest inference for TrackMan → SG prediction
 * - Kalman-filtered HCP forecasts from snapshot history
 */

import { subDays } from "date-fns";
import { prisma } from "@/lib/portal/prisma";
import { sgToHandicap, sgToCategory } from "@/lib/portal/golf/sg-to-handicap";
import { predictSGFromTrackMan, type TrackManFeatures } from "./predict-sg-onnx";
import { forecastHcpFromSnapshots } from "./kalman-filter";

// ── Types ───────────────────────────────────────────────────────────

export interface USIResult {
  sgOtt: number;
  sgApp: number;
  sgArg: number;
  sgPutt: number;
  ballSpeedScore: number;
  consistencyScore: number;
  pressureScore: number;
  trainingEfficiency: number;
  trendMomentum: number;
  totalUsi: number;
  estimatedHandicap: number;
  estimatedCategory: string;
  uncertainty: {
    sgOtt: number;
    sgApp: number;
    sgArg: number;
    sgPutt: number;
    ballSpeedScore: number;
    consistencyScore: number;
    pressureScore: number;
    trainingEfficiency: number;
    trendMomentum: number;
  };
  vsTourAvgPct: number;
  predictedHcp30d: number | null;
  predictedHcp90d: number | null;
}

// ── Helpers ─────────────────────────────────────────────────────────

function avg(vals: (number | null)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null);
  return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}

function weightedAvg(values: number[], weights: number[]): number | null {
  if (values.length === 0 || values.length !== weights.length) return null;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return null;
  return values.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight;
}

function slope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return 0;
  return (n * sumXY - sumX * sumY) / denominator;
}

function stdDev(vals: number[]): number {
  if (vals.length <= 1) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((sum, v) => sum + (v - m) ** 2, 0) / vals.length);
}

function getClubCategory(club: string): "driver" | "iron" | "wedge" | "other" {
  const lower = club.toLowerCase();
  if (lower.includes("driver")) return "driver";
  if (lower.includes("wedge") || lower.includes("pitch") || lower.includes("gap"))
    return "wedge";
  if (lower.includes("iron") || lower.includes("hybrid") || lower.includes("wood"))
    return "iron";
  return "other";
}

// ── Sub-computations ────────────────────────────────────────────────

async function computeSgDimensions(userId: string) {
  const since = subDays(new Date(), 90);

  const rounds = await prisma.roundStats.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "desc" },
    take: 20,
  });

  if (rounds.length === 0) {
    return {
      sgOtt: null,
      sgApp: null,
      sgArg: null,
      sgPutt: null,
      sampleSize: 0,
    };
  }

  // Exponential decay weights (half-life 30 days)
  const weights = rounds.map((r) => {
    const daysAgo = Math.max(0, (Date.now() - r.date.getTime()) / (1000 * 60 * 60 * 24));
    return Math.exp(-(Math.LN2 / 30) * daysAgo);
  });

  const ottValues = rounds.map((r) => r.sgOffTheTee).filter((v): v is number => v !== null);
  const appValues = rounds.map((r) => r.sgApproach).filter((v): v is number => v !== null);
  const argValues = rounds.map((r) => r.sgAroundTheGreen).filter((v): v is number => v !== null);
  const puttValues = rounds.map((r) => r.sgPutting).filter((v): v is number => v !== null);

  return {
    sgOtt: weightedAvg(ottValues, weights.slice(0, ottValues.length)),
    sgApp: weightedAvg(appValues, weights.slice(0, appValues.length)),
    sgArg: weightedAvg(argValues, weights.slice(0, argValues.length)),
    sgPutt: weightedAvg(puttValues, weights.slice(0, puttValues.length)),
    sampleSize: rounds.length,
  };
}

async function computeBallSpeedScore(userId: string): Promise<number> {
  const driverShots = await prisma.trackManShotData.findMany({
    where: { userId, club: { contains: "driver", mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { ballSpeed: true },
  });

  const speeds = driverShots.map((s) => s.ballSpeed).filter((v): v is number => v != null);
  if (speeds.length === 0) return 0;

  const meanSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

  // Normalize: 100 mph ≈ 0.0 (beginner), 170 mph ≈ 1.0 (pro)
  return Math.max(0, Math.min(1, (meanSpeed - 100) / 70));
}

async function computeConsistencyScore(userId: string): Promise<number> {
  const dispersionData = await prisma.clubDispersionData.findMany({
    where: { userId },
    select: { lateralStdDev: true, carryDistance: true },
  });

  if (dispersionData.length === 0) {
    // Fallback: compute from TrackMan shots directly
    const shots = await prisma.trackManShotData.findMany({
      where: { userId, offlineDistance: { not: null }, carryDistance: { not: null } },
      take: 200,
      select: { offlineDistance: true, carryDistance: true, club: true },
    });

    if (shots.length === 0) return 0;

    // Group by club
    const byClub = new Map<string, { offlines: number[]; carries: number[] }>();
    for (const s of shots) {
      if (s.offlineDistance == null || s.carryDistance == null || s.carryDistance <= 0) continue;
      const existing = byClub.get(s.club) ?? { offlines: [], carries: [] };
      existing.offlines.push(Math.abs(s.offlineDistance));
      existing.carries.push(s.carryDistance);
      byClub.set(s.club, existing);
    }

    let totalScore = 0;
    let clubCount = 0;
    for (const [, data] of byClub) {
      if (data.offlines.length < 3) continue;
      const avgCarry = data.carries.reduce((a, b) => a + b, 0) / data.carries.length;
      const meanOffline = data.offlines.reduce((a, b) => a + b, 0) / data.offlines.length;
      const variance = data.offlines.reduce((sum, v) => sum + (v - meanOffline) ** 2, 0) / data.offlines.length;
      const stdDev = Math.sqrt(variance);
      const ratio = stdDev / avgCarry;
      // ratio 0.05 = excellent, 0.30 = poor
      const score = Math.max(0, Math.min(1, 1 - (ratio - 0.05) / 0.25));
      totalScore += score;
      clubCount++;
    }

    return clubCount > 0 ? totalScore / clubCount : 0;
  }

  let totalScore = 0;
  for (const d of dispersionData) {
    if (d.carryDistance <= 0) continue;
    const ratio = d.lateralStdDev / d.carryDistance;
    const score = Math.max(0, Math.min(1, 1 - (ratio - 0.05) / 0.25));
    totalScore += score;
  }
  return dispersionData.length > 0 ? totalScore / dispersionData.length : 0;
}

async function computePressureScore(userId: string): Promise<number | null> {
  const since = subDays(new Date(), 180);

  const [pr1, pr5] = await Promise.all([
    prisma.mentalScorecardEntry.aggregate({
      where: { userId, pressureLevel: 1, timestamp: { gte: since } },
      _avg: { processScore: true },
    }),
    prisma.mentalScorecardEntry.aggregate({
      where: { userId, pressureLevel: 5, timestamp: { gte: since } },
      _avg: { processScore: true },
    }),
  ]);

  const pr1Score = pr1._avg?.processScore ?? null;
  const pr5Score = pr5._avg?.processScore ?? null;

  if (pr1Score == null || pr5Score == null || pr1Score === 0) return null;

  // > 1.0 = better under pressure (rare), < 1.0 = falls under pressure
  const ratio = pr5Score / pr1Score;
  // Normalize to 0-1 scale where 0.5 = neutral
  return Math.max(0, Math.min(1, 0.5 + (ratio - 1) * 0.5));
}

async function computeTrainingEfficiency(userId: string): Promise<number> {
  const since = subDays(new Date(), 90);

  const [rounds, logs] = await Promise.all([
    prisma.roundStats.findMany({
      where: { userId, date: { gte: since }, sgTotal: { not: null } },
      orderBy: { date: "asc" },
      select: { date: true, sgTotal: true },
    }),
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: since } },
      select: { durationMinutes: true },
    }),
  ]);

  if (rounds.length < 4 || logs.length === 0) return 0;

  const sgSlope = slope(rounds.map((r) => r.sgTotal as number));
  const totalHours = logs.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0) / 60;
  if (totalHours === 0) return 0;

  // strokes improvement per hour per month
  const efficiency = (sgSlope * 30) / totalHours;
  // Clamp to reasonable range (-0.5 to +0.5)
  return Math.max(-0.5, Math.min(0.5, efficiency));
}

async function computeTrendMomentum(userId: string): Promise<number> {
  const since = subDays(new Date(), 90);

  const rounds = await prisma.roundStats.findMany({
    where: { userId, date: { gte: since }, sgTotal: { not: null } },
    orderBy: { date: "asc" },
    select: { sgTotal: true },
  });

  if (rounds.length < 4) return 0;

  const sgSlope = slope(rounds.map((r) => r.sgTotal as number));
  // Normalize: slope of -0.1 per round ≈ -1.0 momentum, +0.1 ≈ +1.0
  return Math.max(-1, Math.min(1, sgSlope * 10));
}

async function buildTrackManFeatures(userId: string): Promise<TrackManFeatures | null> {
  const shots = await prisma.trackManShotData.findMany({
    where: {
      userId,
      ballSpeed: { not: null },
      carryDistance: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  if (shots.length < 20) return null;

  const ballSpeeds = shots.map((s) => s.ballSpeed!).filter((v) => v > 0);
  const carryDistances = shots.map((s) => s.carryDistance!).filter((v) => v > 0);
  const offlineDistances = shots.map((s) => s.offlineDistance).filter((v): v is number => v != null);

  const byCat = new Map<string, { ballSpeeds: number[]; carries: number[] }>();
  for (const s of shots) {
    const cat = getClubCategory(s.club);
    const existing = byCat.get(cat) ?? { ballSpeeds: [], carries: [] };
    if (s.ballSpeed != null && s.ballSpeed > 0) existing.ballSpeeds.push(s.ballSpeed);
    if (s.carryDistance != null && s.carryDistance > 0) existing.carries.push(s.carryDistance);
    byCat.set(cat, existing);
  }

  const catMean = (cat: string) => {
    const data = byCat.get(cat);
    if (!data || data.ballSpeeds.length === 0) return { ballSpeed: null, carry: null };
    return {
      ballSpeed: data.ballSpeeds.reduce((a, b) => a + b, 0) / data.ballSpeeds.length,
      carry: data.carries.reduce((a, b) => a + b, 0) / data.carries.length,
    };
  };

  const driver = catMean("driver");
  const iron = catMean("iron");
  const wedge = catMean("wedge");

  return {
    ballSpeedMean: avg(ballSpeeds) ?? 0,
    ballSpeedStd: stdDev(ballSpeeds),
    launchAngleMean: avg(shots.map((s) => s.launchAngle).filter((v): v is number => v != null)) ?? 0,
    spinRateMean: avg(shots.map((s) => s.spinRate).filter((v): v is number => v != null)) ?? 0,
    spinAxisMean: avg(shots.map((s) => s.spinAxis).filter((v): v is number => v != null)) ?? 0,
    carryDistanceMean: avg(carryDistances) ?? 0,
    carryDistanceStd: stdDev(carryDistances),
    totalDistanceMean: avg(shots.map((s) => s.totalDistance).filter((v): v is number => v != null)) ?? 0,
    offlineDistanceMean: avg(offlineDistances) ?? 0,
    offlineDistanceStd: stdDev(offlineDistances),
    smashFactorMean: avg(shots.map((s) => s.smashFactor).filter((v): v is number => v != null)) ?? 0,
    clubSpeedMean: avg(shots.map((s) => s.clubSpeed).filter((v): v is number => v != null)) ?? 0,
    attackAngleMean: avg(shots.map((s) => s.attackAngle).filter((v): v is number => v != null)) ?? 0,
    clubPathMean: avg(shots.map((s) => s.clubPath).filter((v): v is number => v != null)) ?? 0,
    faceAngleMean: avg(shots.map((s) => s.faceAngle).filter((v): v is number => v != null)) ?? 0,
    faceToPathMean: avg(shots.map((s) => s.faceToPath).filter((v): v is number => v != null)) ?? 0,
    dynamicLoftMean: avg(shots.map((s) => s.dynamicLoft).filter((v): v is number => v != null)) ?? 0,
    driverBallSpeedMean: driver.ballSpeed,
    driverCarryMean: driver.carry,
    ironBallSpeedMean: iron.ballSpeed,
    ironCarryMean: iron.carry,
    wedgeBallSpeedMean: wedge.ballSpeed,
    wedgeCarryMean: wedge.carry,
  };
}

// ── Main computation ────────────────────────────────────────────────

export async function computeUSI(userId: string): Promise<USIResult | null> {
  const [
    sgDims,
    ballSpeedScore,
    consistencyScore,
    pressureScore,
    trainingEfficiency,
    trendMomentum,
    trackManFeatures,
    snapshots,
  ] = await Promise.all([
    computeSgDimensions(userId),
    computeBallSpeedScore(userId),
    computeConsistencyScore(userId),
    computePressureScore(userId),
    computeTrainingEfficiency(userId),
    computeTrendMomentum(userId),
    buildTrackManFeatures(userId),
    prisma.unifiedSkillSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 90,
      select: { estimatedHandicap: true, createdAt: true },
    }),
  ]);

  // If we have zero rounds, we can't build a meaningful USI
  if (sgDims.sampleSize === 0) {
    return null;
  }

  let sgOtt = sgDims.sgOtt ?? -2;
  let sgApp = sgDims.sgApp ?? -2;
  let sgArg = sgDims.sgArg ?? -2;
  let sgPutt = sgDims.sgPutt ?? -2;

  // ── ML fusion: blend ONNX TrackMan predictions with round-based SG ──
  const onnxPrediction = trackManFeatures ? await predictSGFromTrackMan(trackManFeatures) : null;
  if (onnxPrediction && onnxPrediction.confidence > 0.5) {
    // Blend weight: more rounds = trust round-based SG more; more TrackMan shots = trust ONNX more
    const roundWeight = Math.min(0.8, sgDims.sampleSize / 20); // 0.05 to 0.8
    const trackManWeight = Math.min(0.6, (trackManFeatures ? 200 : 0) / 300); // up to 0.6
    const totalWeight = roundWeight + trackManWeight;

    const blend = (roundVal: number, onnxVal: number) => {
      if (totalWeight === 0) return roundVal;
      return (roundVal * roundWeight + onnxVal * trackManWeight) / totalWeight;
    };

    sgOtt = blend(sgOtt, onnxPrediction.sgOtt);
    sgApp = blend(sgApp, onnxPrediction.sgApp);
    sgArg = blend(sgArg, onnxPrediction.sgArg);
    // Putting: keep round-based for now (TrackMan putting data is sparse)
    sgPutt = blend(sgPutt, onnxPrediction.sgPutt);
  }

  // Total USI = weighted sum
  const biomechanicalAdjustment =
    (ballSpeedScore - 0.5) * 0.4 +
    (consistencyScore - 0.5) * 0.4;

  const contextualAdjustment =
    ((pressureScore ?? 0.5) - 0.5) * 0.2 +
    trainingEfficiency * 0.1 +
    trendMomentum * 0.1;

  const totalUsi =
    sgOtt * 0.20 +
    sgApp * 0.30 +
    sgArg * 0.15 +
    sgPutt * 0.10 +
    biomechanicalAdjustment * 0.15 +
    contextualAdjustment * 0.10;

  const estimatedHandicap = sgToHandicap(totalUsi);
  const estimatedCategory = sgToCategory(totalUsi);

  // ── Kalman temporal smoothing & forecast ──
  const forecast = forecastHcpFromSnapshots(snapshots);

  // Uncertainty decreases with sample size (Empirical Bayes intuition)
  const baseUncertainty = Math.max(0.3, 1.5 - sgDims.sampleSize * 0.05);
  const onnxUncertaintyFactor = onnxPrediction ? 0.85 : 1.0;
  const uncertainty = {
    sgOtt: baseUncertainty * 0.9 * onnxUncertaintyFactor,
    sgApp: baseUncertainty * 0.9 * onnxUncertaintyFactor,
    sgArg: baseUncertainty * 1.1 * onnxUncertaintyFactor,
    sgPutt: baseUncertainty * 1.4,
    ballSpeedScore: ballSpeedScore > 0 ? 0.15 : 0.5,
    consistencyScore: consistencyScore > 0 ? 0.15 : 0.5,
    pressureScore: pressureScore != null ? 0.2 : 0.5,
    trainingEfficiency: 0.3,
    trendMomentum: 0.25,
  };

  // vsTourAvgPct: how close to PGA Tour median (0 SG) relative to A-category
  const vsTourAvgPct = Math.max(0, Math.min(120, (totalUsi + 5) / 5 * 100));

  return {
    sgOtt,
    sgApp,
    sgArg,
    sgPutt,
    ballSpeedScore,
    consistencyScore,
    pressureScore: pressureScore ?? 0.5,
    trainingEfficiency,
    trendMomentum,
    totalUsi,
    estimatedHandicap,
    estimatedCategory,
    uncertainty,
    vsTourAvgPct,
    predictedHcp30d: forecast.predictedHcp30d,
    predictedHcp90d: forecast.predictedHcp90d,
  };
}
