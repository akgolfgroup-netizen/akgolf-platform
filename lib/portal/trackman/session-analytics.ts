"use server";

import { prisma } from "@/lib/portal/prisma";
import { Prisma } from "@prisma/client";
import type { VisionShot } from "./vision-parser";

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

function getClubCategory(club: string): string {
  const lower = club.toLowerCase();
  if (lower.includes("driver") || lower.includes("wood")) return "WOOD";
  if (lower.includes("hybrid") || lower.includes("iron")) return "IRON";
  if (lower.includes("wedge") || lower === "pw" || lower === "gw" || lower === "sw" || lower === "lw")
    return "WEDGE";
  if (lower.includes("putter")) return "PUTTER";
  return "OTHER";
}

export async function computeSessionAnalytics(
  sessionId: string,
  userId: string,
  shots: VisionShot[],
  club: string
) {
  const category = getClubCategory(club);

  const allBallSpeeds = shots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
  const allCarries = shots.map((s) => s.carryDistance).filter((v): v is number => v !== null);

  const avgBallSpeed = allBallSpeeds.length > 0 ? avg(allBallSpeeds) : null;
  const maxBallSpeed = allBallSpeeds.length > 0 ? Math.max(...allBallSpeeds) : null;
  const avgCarryDistance = allCarries.length > 0 ? avg(allCarries) : null;
  const maxCarryDistance = allCarries.length > 0 ? Math.max(...allCarries) : null;

  const ballSpeedConsistency =
    allBallSpeeds.length > 1 ? Math.round((1 - coefficientOfVariation(allBallSpeeds)) * 100) : null;
  const distanceConsistency =
    allCarries.length > 1 ? Math.round((1 - coefficientOfVariation(allCarries)) * 100) : null;

  const categoryStats = {
    shotCount: shots.length,
    avgBallSpeed: avgBallSpeed ? Math.round(avgBallSpeed * 10) / 10 : null,
    avgCarry: avgCarryDistance ? Math.round(avgCarryDistance * 10) / 10 : null,
    carryStdDev: allCarries.length > 1 ? Math.round(stdDev(allCarries) * 10) / 10 : null,
    lateralStdDev: null,
  };

  const driverStats = category === "WOOD" ? categoryStats : null;
  const ironStats = category === "IRON" ? categoryStats : null;
  const wedgeStats = category === "WEDGE" ? categoryStats : null;

  const sweetSpotCount = shots.filter((s) => {
    const smash = s.ballSpeed;
    return smash !== null && smash >= 140;
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
      shotShapeDistribution: {},
      missPattern: {},
      sweetSpotPercentage,
      generatedInsights: [],
      recommendedFocus: [],
    },
  });
}

export async function updatePlayerMetrics(userId: string) {
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

  const expectedDriverSpeed = 145;
  const expectedSevenIronCarry = 145;
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

export async function updateClubDispersion(userId: string, shots: VisionShot[], club: string) {
  const carries = shots.map((s) => s.carryDistance).filter((v): v is number => v !== null);
  const totals = shots.map((s) => s.totalDistance).filter((v): v is number => v !== null);

  if (carries.length < 2) return;

  const carryAvg = avg(carries);
  const totalAvg = avg(totals);
  const distanceSd = stdDev(carries);
  const distance95 = distanceSd * 1.96;

  await prisma.clubDispersionData.upsert({
    where: {
      userId_club_context: {
        userId,
        club,
        context: "TRAINING",
      },
    },
    create: {
      userId,
      club,
      context: "TRAINING",
      carryDistance: Math.round(carryAvg * 10) / 10,
      totalDistance: Math.round(totalAvg * 10) / 10,
      lateralStdDev: 0,
      distanceStdDev: Math.round(distanceSd * 10) / 10,
      lateral95: 0,
      distance95: Math.round(distance95 * 10) / 10,
      typicalShape: "UNKNOWN",
      shapeBias: 0,
      sampleSize: shots.length,
    },
    update: {
      carryDistance: Math.round(carryAvg * 10) / 10,
      totalDistance: Math.round(totalAvg * 10) / 10,
      lateralStdDev: 0,
      distanceStdDev: Math.round(distanceSd * 10) / 10,
      lateral95: 0,
      distance95: Math.round(distance95 * 10) / 10,
      typicalShape: "UNKNOWN",
      shapeBias: 0,
      sampleSize: shots.length,
      lastCalculated: new Date(),
    },
  });
}
