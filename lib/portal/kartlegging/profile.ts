import "server-only";
import { prisma } from "@/lib/portal/prisma";
import {
  SKILL_LEVELS,
  getSkillLevelByScore,
  getSkillLevelByCode,
  getNextLevel,
} from "@/lib/portal/golf/skill-levels";
import {
  getBenchmarkByCategory,
  SG_DIMENSIONS,
  SG_DIMENSION_LABEL,
  type SGDimension,
  type SGBenchmark,
} from "@/lib/portal/golf/sg-benchmarks";
import type {
  PlayerProfile,
  DimensionBreakdown,
  GapAnalysis,
  GapAnalysisRow,
} from "./types";

const DIM_TO_SG_FIELD: Record<SGDimension, keyof SGBenchmark["sg"]> = {
  offTheTee: "offTheTee",
  approach: "approach",
  aroundTheGreen: "aroundTheGreen",
  putting: "putting",
};

const USI_TO_SG: Record<SGDimension, "sgOtt" | "sgApp" | "sgArg" | "sgPutt"> =
  {
    offTheTee: "sgOtt",
    approach: "sgApp",
    aroundTheGreen: "sgArg",
    putting: "sgPutt",
  };

function dimensionCategoryFromSg(
  sg: number,
  dim: SGDimension
): string {
  const key = DIM_TO_SG_FIELD[dim];
  let best = SKILL_LEVELS[0];
  let smallest = Infinity;
  for (const level of SKILL_LEVELS) {
    const bench = getBenchmarkByCategory(level.code);
    if (!bench) continue;
    const diff = Math.abs(sg - bench.sg[key]);
    if (diff < smallest) {
      smallest = diff;
      best = level;
    }
  }
  return best.code;
}

function classifyGap(
  playerSg: number,
  benchmarkSg: number
): DimensionBreakdown["gap"] {
  const delta = playerSg - benchmarkSg;
  if (delta >= 0.2) return "strength";
  if (delta <= -0.2) return "gap";
  return "on-level";
}

export async function getPlayerProfile(
  userId: string
): Promise<PlayerProfile | null> {
  const [user, usi, latestHandicap, roundStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    }),
    prisma.unifiedSkillIndex.findUnique({ where: { userId } }),
    prisma.handicapEntry.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.roundStats.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { scoreToPar: true },
    }),
  ]);

  if (!user || !usi) return null;

  const avgScoreToPar =
    roundStats.length > 0
      ? roundStats.reduce((acc, r) => acc + (r.scoreToPar ?? 0), 0) /
        roundStats.length
      : null;
  const averageScore =
    avgScoreToPar !== null ? Math.round((72 + avgScoreToPar) * 10) / 10 : null;

  const level =
    (averageScore !== null
      ? getSkillLevelByScore(averageScore)
      : undefined) ?? getSkillLevelByCode(usi.estimatedCategory);
  if (!level) return null;

  const currentBenchmark = getBenchmarkByCategory(level.code);
  if (!currentBenchmark) return null;

  const dimensions: DimensionBreakdown[] = SG_DIMENSIONS.map((dim) => {
    const sgField = USI_TO_SG[dim];
    const sgValue = usi[sgField];
    const dimCategory = dimensionCategoryFromSg(sgValue, dim);
    const benchmarkSg = currentBenchmark.sg[DIM_TO_SG_FIELD[dim]];
    return {
      dimension: dim,
      label: SG_DIMENSION_LABEL[dim],
      sgValue,
      category: dimCategory,
      benchmarkCategory: level.code,
      gap: classifyGap(sgValue, benchmarkSg),
    };
  });

  const next = getNextLevel(level.code);
  let progressPct: number | null = null;
  if (next && averageScore !== null) {
    const [maxScore, minScore] = [
      level.scoreRange[1],
      level.scoreRange[0],
    ];
    const span = maxScore - minScore;
    if (span > 0) {
      const within = Math.max(0, Math.min(span, maxScore - averageScore));
      progressPct = Math.round((within / span) * 100);
    }
  }

  const totalSg =
    usi.sgOtt + usi.sgApp + usi.sgArg + usi.sgPutt;

  return {
    userId: user.id,
    userName: user.name,
    category: level.code,
    categoryLabel: level.labelNO,
    averageScore,
    handicap: latestHandicap?.handicapIndex ?? null,
    totalUsi: usi.totalUsi,
    totalSg,
    progressToNextPct: progressPct,
    nextCategory: next?.code ?? null,
    dimensions,
    tournamentContext: level.tournamentContext,
  };
}

export async function getGapAnalysis(
  userId: string,
  targetCategory?: string
): Promise<GapAnalysis | null> {
  const profile = await getPlayerProfile(userId);
  if (!profile) return null;

  const nextCode = targetCategory ?? profile.nextCategory;
  if (!nextCode) {
    return {
      currentCategory: profile.category,
      targetCategory: null,
      rows: [],
      totalGap: 0,
      estimatedMonths: null,
      trainingEfficiency: 0,
      assumption: "Du er allerede på toppkategorien (A).",
    };
  }

  const target = getBenchmarkByCategory(nextCode);
  if (!target) return null;

  const rows: GapAnalysisRow[] = profile.dimensions.map((d) => {
    const targetSg = target.sg[DIM_TO_SG_FIELD[d.dimension]];
    const gap = Math.max(0, targetSg - d.sgValue);
    return {
      dimension: d.dimension,
      label: d.label,
      current: d.sgValue,
      target: targetSg,
      gap,
      isBottleneck: false,
      statusLabel:
        gap < 0.05 ? "Ingen gap" : gap < 0.2 ? "Nesten der" : "Gap",
    };
  });

  if (rows.length > 0) {
    const maxGap = Math.max(...rows.map((r) => r.gap));
    if (maxGap > 0.05) {
      const idx = rows.findIndex((r) => r.gap === maxGap);
      if (idx >= 0) {
        rows[idx].isBottleneck = true;
        rows[idx].statusLabel = "Flaskehals";
      }
    }
  }

  const usi = await prisma.unifiedSkillIndex.findUnique({
    where: { userId },
    select: { trainingEfficiency: true },
  });
  const eff = usi?.trainingEfficiency ?? 0.05;

  const totalGap = rows.reduce((acc, r) => acc + r.gap, 0);
  const estimatedMonths =
    eff > 0.01 ? Math.max(1, Math.round(totalGap / eff)) : null;

  return {
    currentCategory: profile.category,
    targetCategory: nextCode,
    rows,
    totalGap,
    estimatedMonths,
    trainingEfficiency: eff,
    assumption: `Forutsetter ${eff.toFixed(2)} SG/måned per time med fokus på flaskehalsen.`,
  };
}
