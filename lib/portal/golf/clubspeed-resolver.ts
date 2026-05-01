// VERIFY: ClubSpeed-target-oppslag for øvelser
// Kobler ExerciseDefinition mot spillerens faktiske eller estimerte club speed

import { prisma } from "@/lib/portal/prisma";
import { getBenchmarkByHcp } from "./clubspeed-benchmarks";
import type { ClubSpeedBenchmark } from "./clubspeed-benchmarks";

export interface ResolvedCSTarget {
  mphMin: number;
  mphMax: number;
  carryMin: number;
  carryMax: number;
}

/** Konverterer meter carry til ca. mph (rough est: 1m ≈ 2.2 mph for driver) */
function metersToMph(carryMeters: number, club: string): number {
  const factor = club === "driver" ? 2.2 : club.includes("iron") || club.includes("wedge") ? 2.0 : 2.1;
  return Math.round(carryMeters * factor * 10) / 10;
}

/** Resolver CS-target for en øvelse gitt spillerens profil eller HCP-fallback */
export async function resolveCSTarget(
  exerciseId: string,
  userId: string,
  userHcp: number,
): Promise<ResolvedCSTarget | null> {
  const exercise = await prisma.exerciseDefinition.findUnique({
    where: { id: exerciseId },
    select: { csTargetMin: true, csTargetMax: true, clubKey: true, distanceBucket: true },
  });

  if (!exercise) return null;

  // 1. Sjekk spillerens faktiske profil
  const profile = await prisma.clubSpeedProfile.findUnique({
    where: { userId },
    select: { clubs: true, source: true },
  });

  const benchmark: ClubSpeedBenchmark;

  if (profile?.clubs && typeof profile.clubs === "object") {
    const clubs = profile.clubs as Record<string, { carry: number; total: number }>;
    const clubData = clubs[exercise.clubKey ?? "driver"];
    if (clubData) {
      const mph = metersToMph(clubData.carry, exercise.clubKey ?? "driver");
      return {
        mphMin: Math.round((mph * 0.9) * 10) / 10,
        mphMax: Math.round((mph * 1.1) * 10) / 10,
        carryMin: Math.round(clubData.carry * 0.9),
        carryMax: Math.round(clubData.carry * 1.1),
      };
    }
  }

  // 2. Fallback til HCP-benchmark
  benchmark = getBenchmarkByHcp(userHcp);
  const key = exercise.clubKey as keyof ClubSpeedBenchmark | undefined;
  const clubBench = key && key in benchmark ? benchmark[key] : benchmark.driver;

  const mph = metersToMph(clubBench.carry, exercise.clubKey ?? "driver");
  return {
    mphMin: Math.round((mph * 0.85) * 10) / 10,
    mphMax: Math.round((mph * 1.15) * 10) / 10,
    carryMin: Math.round(clubBench.carry * 0.85),
    carryMax: Math.round(clubBench.carry * 1.15),
  };
}

/** Henter eller bygger fallback ClubSpeedProfile for en bruker */
export async function getOrFallbackProfile(userId: string, hcp: number) {
  const profile = await prisma.clubSpeedProfile.findUnique({
    where: { userId },
  });

  if (profile) return profile;

  // Bygg fallback fra HCP-benchmark
  const bench = getBenchmarkByHcp(hcp);
  return {
    id: "fallback",
    userId,
    source: "HCP_FALLBACK" as const,
    clubs: bench,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
