/**
 * ML Dataset Exporter for TrackMan → SG modeling
 *
 * Generates a JSON/CSV dataset that can be fed into the Python
 * training pipeline (`ml/train_trackman_sg_model.py`).
 */

import { prisma } from "@/lib/portal/prisma";

export interface TrackManFeatureRow {
  userId: string;
  ballSpeedMean: number;
  ballSpeedStd: number;
  launchAngleMean: number;
  spinRateMean: number;
  spinAxisMean: number;
  carryDistanceMean: number;
  carryDistanceStd: number;
  totalDistanceMean: number;
  offlineDistanceMean: number;
  offlineDistanceStd: number;
  smashFactorMean: number;
  clubSpeedMean: number;
  attackAngleMean: number;
  clubPathMean: number;
  faceAngleMean: number;
  faceToPathMean: number;
  dynamicLoftMean: number;
  driverBallSpeedMean: number | null;
  driverCarryMean: number | null;
  ironBallSpeedMean: number | null;
  ironCarryMean: number | null;
  wedgeBallSpeedMean: number | null;
  wedgeCarryMean: number | null;
  sgOtt: number | null;
  sgApp: number | null;
  sgArg: number | null;
  sgPutt: number | null;
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

function mean(vals: number[]): number {
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function std(vals: number[]): number {
  if (vals.length <= 1) return 0;
  const m = mean(vals);
  return Math.sqrt(vals.reduce((sum, v) => sum + (v - m) ** 2, 0) / vals.length);
}

export async function exportTrackManSGDataset(): Promise<TrackManFeatureRow[]> {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true },
  });

  const rows: TrackManFeatureRow[] = [];

  for (const user of users) {
    const [shots, rounds] = await Promise.all([
      prisma.trackManShotData.findMany({
        where: {
          userId: user.id,
          ballSpeed: { not: null },
          carryDistance: { not: null },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.roundStats.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 20,
        select: {
          sgOffTheTee: true,
          sgApproach: true,
          sgAroundTheGreen: true,
          sgPutting: true,
        },
      }),
    ]);

    if (shots.length < 20 || rounds.length < 5) continue;

    // Global aggregates
    const ballSpeeds = shots.map((s) => s.ballSpeed!).filter((v) => v > 0);
    const carryDistances = shots.map((s) => s.carryDistance!).filter((v) => v > 0);
    const offlineDistances = shots.map((s) => s.offlineDistance).filter((v): v is number => v != null);

    // Per-category aggregates
    const byCat = new Map<string, { ballSpeeds: number[]; carries: number[] }>();
    for (const s of shots) {
      const cat = getClubCategory(s.club);
      const existing = byCat.get(cat) ?? { ballSpeeds: [], carries: [] };
      if (s.ballSpeed != null && s.ballSpeed > 0) existing.ballSpeeds.push(s.ballSpeed);
      if (s.carryDistance != null && s.carryDistance > 0) existing.carries.push(s.carryDistance);
      byCat.set(cat, existing);
    }

    const catMeans = (cat: string) => {
      const data = byCat.get(cat);
      if (!data || data.ballSpeeds.length === 0) return { ballSpeed: null, carry: null };
      return { ballSpeed: mean(data.ballSpeeds), carry: mean(data.carries) };
    };

    const driver = catMeans("driver");
    const iron = catMeans("iron");
    const wedge = catMeans("wedge");

    // SG labels (average over last 20 rounds)
    const sgOtt = mean(rounds.map((r) => r.sgOffTheTee).filter((v): v is number => v != null));
    const sgApp = mean(rounds.map((r) => r.sgApproach).filter((v): v is number => v != null));
    const sgArg = mean(rounds.map((r) => r.sgAroundTheGreen).filter((v): v is number => v != null));
    const sgPutt = mean(rounds.map((r) => r.sgPutting).filter((v): v is number => v != null));

    rows.push({
      userId: user.id,
      ballSpeedMean: mean(ballSpeeds),
      ballSpeedStd: std(ballSpeeds),
      launchAngleMean: mean(shots.map((s) => s.launchAngle).filter((v): v is number => v != null)),
      spinRateMean: mean(shots.map((s) => s.spinRate).filter((v): v is number => v != null)),
      spinAxisMean: mean(shots.map((s) => s.spinAxis).filter((v): v is number => v != null)),
      carryDistanceMean: mean(carryDistances),
      carryDistanceStd: std(carryDistances),
      totalDistanceMean: mean(shots.map((s) => s.totalDistance).filter((v): v is number => v != null)),
      offlineDistanceMean: mean(offlineDistances),
      offlineDistanceStd: std(offlineDistances),
      smashFactorMean: mean(shots.map((s) => s.smashFactor).filter((v): v is number => v != null)),
      clubSpeedMean: mean(shots.map((s) => s.clubSpeed).filter((v): v is number => v != null)),
      attackAngleMean: mean(shots.map((s) => s.attackAngle).filter((v): v is number => v != null)),
      clubPathMean: mean(shots.map((s) => s.clubPath).filter((v): v is number => v != null)),
      faceAngleMean: mean(shots.map((s) => s.faceAngle).filter((v): v is number => v != null)),
      faceToPathMean: mean(shots.map((s) => s.faceToPath).filter((v): v is number => v != null)),
      dynamicLoftMean: mean(shots.map((s) => s.dynamicLoft).filter((v): v is number => v != null)),
      driverBallSpeedMean: driver.ballSpeed,
      driverCarryMean: driver.carry,
      ironBallSpeedMean: iron.ballSpeed,
      ironCarryMean: iron.carry,
      wedgeBallSpeedMean: wedge.ballSpeed,
      wedgeCarryMean: wedge.carry,
      sgOtt: sgOtt || null,
      sgApp: sgApp || null,
      sgArg: sgArg || null,
      sgPutt: sgPutt || null,
    });
  }

  return rows;
}
