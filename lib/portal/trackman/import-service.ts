/**
 * TrackMan Import Service
 * Håndterer parsing, lagring og analyse av TrackMan CSV-data.
 */

import { nanoid } from "nanoid";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/portal/prisma";
import {
  parseTrackManCSV,
  convertToMetric,
  aggregateByClub,
  type TrackManShotMetric,
} from "@/lib/portal/golf/trackman-parser";

export type ImportContext = "TRAINING" | "CASUAL" | "COMPETITION";

export interface ImportTrackManOptions {
  userId: string;
  csvContent: string;
  fileName?: string;
  sessionDate?: string | Date;
  context?: ImportContext;
}

function classifyContext(fileName?: string, explicitContext?: ImportContext): ImportContext {
  if (explicitContext) return explicitContext;
  if (fileName?.toLowerCase().includes("comp")) return "COMPETITION";
  if (fileName?.toLowerCase().includes("casual")) return "CASUAL";
  return "TRAINING";
}

function contextToPressureLevel(context: ImportContext): number {
  switch (context) {
    case "TRAINING":
      return 1;
    case "CASUAL":
      return 2;
    case "COMPETITION":
      return 4;
    default:
      return 1;
  }
}

function getClubCategory(club: string): string {
  const lower = club.toLowerCase();
  if (lower.includes("driver") || lower.includes("wood")) return "WOOD";
  if (lower.includes("hybrid") || lower.includes("iron")) return "IRON";
  if (lower.includes("wedge") || lower === "pw" || lower === "gw" || lower === "sw" || lower === "lw")
    return "WEDGE";
  if (lower.includes("putter")) return "PUTTER";
  return "OTHER";
}

function classifyShotQuality(shot: TrackManShotMetric): string {
  const smash = shot.smashFactor;
  const offline = shot.offline;
  if (smash === null) return "UNKNOWN";
  if (smash >= 1.45 && (offline === null || Math.abs(offline) < 5)) return "GREAT";
  if (smash >= 1.35 && (offline === null || Math.abs(offline) < 10)) return "GOOD";
  if (smash >= 1.2) return "FAIR";
  return "POOR";
}

function classifyShotShape(clubPath: number | null, faceToPath: number | null): string {
  if (clubPath === null || faceToPath === null) return "UNKNOWN";
  const path = clubPath;
  const ftp = faceToPath;
  if (path > 2 && ftp > 2) return "DRAW";
  if (path < -2 && ftp < -2) return "FADE";
  if (path > 2 && ftp < -2) return "HOOK";
  if (path < -2 && ftp > 2) return "SLICE";
  if (Math.abs(path) <= 2 && Math.abs(ftp) <= 2) return "STRAIGHT";
  return "MIXED";
}

function classifyMissType(offline: number | null): string {
  if (offline === null) return "UNKNOWN";
  if (Math.abs(offline) < 5) return "CENTER";
  if (offline > 10) return "RIGHT";
  if (offline < -10) return "LEFT";
  if (offline > 0) return "SLIGHT_RIGHT";
  return "SLIGHT_LEFT";
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = avg(arr);
  const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function coefficientOfVariation(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = avg(arr);
  if (mean === 0) return 0;
  return stdDev(arr) / mean;
}

export async function importTrackManSession(options: ImportTrackManOptions) {
  const { userId, csvContent, fileName, sessionDate, context: explicitContext } = options;

  const context = classifyContext(fileName, explicitContext);
  const pressureLevel = contextToPressureLevel(context);

  // Parse CSV
  const rawShots = parseTrackManCSV(csvContent);
  const metricShots = rawShots.map(convertToMetric);

  if (metricShots.length === 0) {
    throw new Error("Ingen gyldige slag funnet i CSV-filen");
  }

  const importId = nanoid();
  const date = sessionDate ? new Date(sessionDate) : new Date();

  // Create import record
  await prisma.trackManImport.create({
    data: {
      id: importId,
      playerId: userId,
      importDate: new Date(),
      source: "CSV_UPLOAD",
      fileName: fileName ?? null,
      rawData: rawShots as unknown as Prisma.InputJsonValue,
      processed: true,
      processedAt: new Date(),
      context,
      pressureLevel,
    },
  });

  // Create session ID for all shots in this import
  const sessionId = nanoid();

  // Store granular shot data
  for (let i = 0; i < metricShots.length; i++) {
    const shot = metricShots[i];
    await prisma.trackManShotData.create({
      data: {
        sessionId,
        userId,
        shotNumber: i + 1,
        club: shot.club,
        clubCategory: getClubCategory(shot.club),
        ballSpeed: shot.ballSpeed,
        launchAngle: shot.launchAngle,
        launchDirection: shot.launchDirection,
        spinRate: shot.spinRate,
        spinAxis: shot.spinAxis,
        carryDistance: shot.carry,
        totalDistance: shot.totalDistance,
        maxHeight: shot.maxHeight,
        landingAngle: shot.landAngle,
        offlineDistance: shot.offline,
        smashFactor: shot.smashFactor,
        clubSpeed: shot.clubSpeed,
        attackAngle: shot.attackAngle,
        clubPath: shot.clubPath,
        faceAngle: shot.faceAngle,
        faceToPath: shot.faceToPath,
        shotQuality: classifyShotQuality(shot),
        shotShape: classifyShotShape(shot.clubPath, shot.faceToPath),
        missType: classifyMissType(shot.offline),
        context,
        pressureLevel,
      },
    });
  }

  // Compute session analytics
  await computeSessionAnalytics(sessionId, userId, metricShots);

  // Update player metrics
  await updatePlayerMetrics(userId);

  // Update dispersion data
  await updateClubDispersion(userId, metricShots, context);

  return {
    importId,
    sessionId,
    shotCount: metricShots.length,
    context,
  };
}

async function computeSessionAnalytics(
  sessionId: string,
  userId: string,
  shots: TrackManShotMetric[]
) {
  const categories = ["WOOD", "IRON", "WEDGE"] as const;

  const driverStats = buildCategoryStats(shots, "WOOD");
  const ironStats = buildCategoryStats(shots, "IRON");
  const wedgeStats = buildCategoryStats(shots, "WEDGE");

  const allBallSpeeds = shots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
  const allCarries = shots.map((s) => s.carry).filter((v): v is number => v !== null);

  const avgBallSpeed = allBallSpeeds.length > 0 ? avg(allBallSpeeds) : null;
  const maxBallSpeed = allBallSpeeds.length > 0 ? Math.max(...allBallSpeeds) : null;
  const avgCarryDistance = allCarries.length > 0 ? avg(allCarries) : null;
  const maxCarryDistance = allCarries.length > 0 ? Math.max(...allCarries) : null;

  const ballSpeedConsistency =
    allBallSpeeds.length > 1 ? Math.round((1 - coefficientOfVariation(allBallSpeeds)) * 100) : null;
  const distanceConsistency =
    allCarries.length > 1 ? Math.round((1 - coefficientOfVariation(allCarries)) * 100) : null;

  const shapes = shots.reduce((acc, s) => {
    const shape = classifyShotShape(s.clubPath, s.faceToPath);
    acc[shape] = (acc[shape] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const misses = shots.reduce((acc, s) => {
    const miss = classifyMissType(s.offline);
    acc[miss] = (acc[miss] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sweetSpotCount = shots.filter((s) => {
    const smash = s.smashFactor;
    return smash !== null && smash >= 1.45;
  }).length;
  const sweetSpotPercentage = shots.length > 0 ? Math.round((sweetSpotCount / shots.length) * 100) : null;

  await prisma.trackManSessionAnalytics.create({
    data: {
      sessionId,
      userId,
      driverStats: driverStats as unknown as Prisma.InputJsonValue,
      ironStats: ironStats as unknown as Prisma.InputJsonValue,
      wedgeStats: wedgeStats as unknown as Prisma.InputJsonValue,
      avgBallSpeed,
      maxBallSpeed,
      avgCarryDistance,
      maxCarryDistance,
      ballSpeedConsistency,
      distanceConsistency,
      shotShapeDistribution: shapes,
      missPattern: misses,
      sweetSpotPercentage,
      generatedInsights: [],
      recommendedFocus: [],
    },
  });
}

function buildCategoryStats(shots: TrackManShotMetric[], category: string) {
  const catShots = shots.filter((s) => getClubCategory(s.club) === category);
  const ballSpeeds = catShots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
  const carries = catShots.map((s) => s.carry).filter((v): v is number => v !== null);
  const offlines = catShots.map((s) => s.offline).filter((v): v is number => v !== null);

  return {
    shotCount: catShots.length,
    avgBallSpeed: ballSpeeds.length > 0 ? Math.round(avg(ballSpeeds) * 10) / 10 : null,
    avgCarry: carries.length > 0 ? Math.round(avg(carries) * 10) / 10 : null,
    carryStdDev: carries.length > 1 ? Math.round(stdDev(carries) * 10) / 10 : null,
    lateralStdDev: offlines.length > 1 ? Math.round(stdDev(offlines) * 10) / 10 : null,
  };
}

async function updatePlayerMetrics(userId: string) {
  // Fetch last 10 shots per relevant club
  const driverShots = await prisma.trackManShotData.findMany({
    where: { userId, club: { contains: "Driver", mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const sevenIronShots = await prisma.trackManShotData.findMany({
    where: { userId, OR: [{ club: "7 Iron" }, { club: "7i" }] },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const allShots = await prisma.trackManShotData.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const last10DriverSpeed =
    driverShots.filter((s) => s.ballSpeed !== null).length > 0
      ? avg(driverShots.map((s) => s.ballSpeed!).filter((v) => v !== null))
      : null;

  const last10DriverCarry =
    driverShots.filter((s) => s.carryDistance !== null).length > 0
      ? avg(driverShots.map((s) => s.carryDistance!).filter((v) => v !== null))
      : null;

  const last10SevenIronSpeed =
    sevenIronShots.filter((s) => s.ballSpeed !== null).length > 0
      ? avg(sevenIronShots.map((s) => s.ballSpeed!).filter((v) => v !== null))
      : null;

  const last10SevenIronCarry =
    sevenIronShots.filter((s) => s.carryDistance !== null).length > 0
      ? avg(sevenIronShots.map((s) => s.carryDistance!).filter((v) => v !== null))
      : null;

  const allBallSpeeds = allShots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
  const allCarries = allShots.map((s) => s.carryDistance).filter((v): v is number => v !== null);
  const driverCarries = driverShots.map((s) => s.carryDistance).filter((v): v is number => v !== null);

  const pbBallSpeed = allBallSpeeds.length > 0 ? Math.max(...allBallSpeeds) : null;
  const pbCarryDistance = allCarries.length > 0 ? Math.max(...allCarries) : null;
  const pbDriverDistance = driverCarries.length > 0 ? Math.max(...driverCarries) : null;

  // Simple expected benchmarks based on amateur data
  const expectedDriverSpeed = 145; // mph for decent amateur
  const expectedSevenIronCarry = 145; // meters
  const speedGapToPotential = last10DriverSpeed !== null ? expectedDriverSpeed - last10DriverSpeed : null;

  const consistencyData = allShots.slice(0, 20).map((s) => s.carryDistance).filter((v): v is number => v !== null);
  const consistencyScore =
    consistencyData.length > 1
      ? Math.round(Math.max(0, Math.min(100, (1 - coefficientOfVariation(consistencyData)) * 100)))
      : null;

  const metrics = await prisma.playerMetrics.upsert({
    where: { userId },
    create: {
      userId,
      last10DriverSpeed,
      last10DriverCarry,
      last10SevenIronSpeed,
      last10SevenIronCarry,
      pbBallSpeed,
      pbCarryDistance,
      pbDriverDistance,
      expectedDriverSpeed,
      expectedSevenIronCarry,
      speedGapToPotential,
      consistencyScore,
    },
    update: {
      last10DriverSpeed,
      last10DriverCarry,
      last10SevenIronSpeed,
      last10SevenIronCarry,
      pbBallSpeed,
      pbCarryDistance,
      pbDriverDistance,
      expectedDriverSpeed,
      expectedSevenIronCarry,
      speedGapToPotential,
      consistencyScore,
    },
  });

  // Create snapshot
  await prisma.metricSnapshot.create({
    data: {
      playerMetricsId: metrics.id,
      snapshotDate: new Date(),
      driverSpeed: last10DriverSpeed,
      driverCarry: last10DriverCarry,
      sevenIronCarry: last10SevenIronCarry,
      consistencyScore,
    },
  });
}

async function updateClubDispersion(
  userId: string,
  shots: TrackManShotMetric[],
  context: ImportContext
) {
  const groups = new Map<string, TrackManShotMetric[]>();
  for (const shot of shots) {
    const key = shot.club;
    const existing = groups.get(key) ?? [];
    existing.push(shot);
    groups.set(key, existing);
  }

  for (const [club, clubShots] of groups.entries()) {
    const carries = clubShots.map((s) => s.carry).filter((v): v is number => v !== null);
    const totals = clubShots.map((s) => s.totalDistance).filter((v): v is number => v !== null);
    const offlines = clubShots.map((s) => s.offline).filter((v): v is number => v !== null);

    if (carries.length < 2) continue;

    const carryAvg = avg(carries);
    const totalAvg = avg(totals);
    const lateralSd = stdDev(offlines);
    const distanceSd = stdDev(carries);
    const lateral95 = lateralSd * 1.96;
    const distance95 = distanceSd * 1.96;

    // Determine typical shape
    const shapes = clubShots.map((s) => classifyShotShape(s.clubPath, s.faceToPath));
    const shapeCounts = shapes.reduce((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const typicalShape = Object.entries(shapeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "UNKNOWN";

    // Shape bias: positive = tends right, negative = tends left
    const shapeBias = offlines.length > 0 ? avg(offlines) : 0;

    await prisma.clubDispersionData.upsert({
      where: {
        userId_club_context: {
          userId,
          club,
          context,
        },
      },
      create: {
        userId,
        club,
        context,
        carryDistance: Math.round(carryAvg * 10) / 10,
        totalDistance: Math.round(totalAvg * 10) / 10,
        lateralStdDev: Math.round(lateralSd * 10) / 10,
        distanceStdDev: Math.round(distanceSd * 10) / 10,
        lateral95: Math.round(lateral95 * 10) / 10,
        distance95: Math.round(distance95 * 10) / 10,
        typicalShape,
        shapeBias: Math.round(shapeBias * 10) / 10,
        sampleSize: clubShots.length,
      },
      update: {
        carryDistance: Math.round(carryAvg * 10) / 10,
        totalDistance: Math.round(totalAvg * 10) / 10,
        lateralStdDev: Math.round(lateralSd * 10) / 10,
        distanceStdDev: Math.round(distanceSd * 10) / 10,
        lateral95: Math.round(lateral95 * 10) / 10,
        distance95: Math.round(distance95 * 10) / 10,
        typicalShape,
        shapeBias: Math.round(shapeBias * 10) / 10,
        sampleSize: clubShots.length,
        lastCalculated: new Date(),
      },
    });
  }
}
