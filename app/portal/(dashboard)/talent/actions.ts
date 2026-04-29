"use server";

import { prisma } from "@/lib/portal/prisma";
import { TalentAgeGroup, NorwegianRegion } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";

export type LeaderboardFilters = {
  ageGroup?: TalentAgeGroup | "ALL";
  region?: NorwegianRegion | "ALL";
  year?: number;
  holesSegment?: 9 | 18;
  minRounds?: number;
  search?: string;
  page?: number;
};

export type LeaderboardRow = {
  playerId: string;
  firstName: string;
  lastName: string;
  club: string | null;
  region: NorwegianRegion | null;
  birthYear: number | null;
  photoUrl: string | null;
  totalRounds: number;
  avgRound: number | null;
  bestRound: number | null;
  top3Count: number;
  top10Count: number;
  improvementPerYear: number | null;
  dataConfidenceScore: number;
  ageGroup: TalentAgeGroup;
};

export type LeaderboardData = {
  rows: LeaderboardRow[];
  total: number;
  page: number;
  pageSize: number;
};

const PAGE_SIZE = 50;

export async function fetchLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardData> {
  const year = filters.year ?? new Date().getFullYear() - 1; // forrige sesong som default
  const holes = filters.holesSegment ?? 18;
  const minRounds = filters.minRounds ?? 3;
  const page = Math.max(1, filters.page ?? 1);

  // Hent dominerende aldersgruppe per spiller fra resultater. Vi bruker
  // ageGroup fra hver enkelt rad og finner mest brukte for spilleren i aaret.
  const params: unknown[] = [year, holes, minRounds];
  let ageGroupFilter = "";
  if (filters.ageGroup && filters.ageGroup !== "ALL") {
    params.push(filters.ageGroup);
    ageGroupFilter = `AND dom."ageGroup"::text = $${params.length}`;
  }
  let regionFilter = "";
  if (filters.region && filters.region !== "ALL") {
    params.push(filters.region);
    regionFilter = `AND p."region"::text = $${params.length}`;
  }
  let searchFilter = "";
  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    params.push(q, q, q);
    searchFilter = `AND (p."firstName" ILIKE $${params.length - 2} OR p."lastName" ILIKE $${params.length - 1} OR p."club" ILIKE $${params.length})`;
  }

  const sql = `
    WITH dominant AS (
      SELECT DISTINCT ON (r."playerId")
        r."playerId",
        r."ageGroup"
      FROM "TalentTournamentResult" r
      WHERE EXTRACT(YEAR FROM r."tournamentDate") = $1
        AND r."holes" = $2
        AND r."excludeFromUi" = false
        AND r."ageGroup" != 'UKJENT'
      ORDER BY r."playerId", r."ageGroup"
    )
    SELECT
      p.id AS "playerId",
      p."firstName",
      p."lastName",
      p.club,
      p.region::text,
      p."birthYear",
      p."photoUrl",
      s."totalRounds",
      s."avgRound",
      s."bestRound",
      s."top3Count",
      s."top10Count",
      s."improvementPerYear",
      s."dataConfidenceScore",
      dom."ageGroup"::text
    FROM "TalentPlayerStats" s
    JOIN "TalentPlayer" p ON p.id = s."playerId"
    JOIN dominant dom ON dom."playerId" = p.id
    WHERE s.year = $1
      AND s."holesSegment" = $2
      AND s."totalRounds" >= $3
      AND s."avgRound" IS NOT NULL
      ${ageGroupFilter}
      ${regionFilter}
      ${searchFilter}
    ORDER BY s."avgRound" ASC
    LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
  `;

  type Raw = {
    playerId: string;
    firstName: string;
    lastName: string;
    club: string | null;
    region: string | null;
    birthYear: number | null;
    photoUrl: string | null;
    totalRounds: number;
    avgRound: number | null;
    bestRound: number | null;
    top3Count: number;
    top10Count: number;
    improvementPerYear: number | null;
    dataConfidenceScore: number;
    ageGroup: string;
  };

  const rows = await prisma.$queryRawUnsafe<Raw[]>(sql, ...params);

  // Total — billig estimering ved a counte uten LIMIT
  const countSql = `
    SELECT COUNT(*)::int AS n
    FROM "TalentPlayerStats" s
    JOIN "TalentPlayer" p ON p.id = s."playerId"
    JOIN (
      SELECT DISTINCT ON (r."playerId") r."playerId", r."ageGroup"
      FROM "TalentTournamentResult" r
      WHERE EXTRACT(YEAR FROM r."tournamentDate") = $1
        AND r."holes" = $2
        AND r."excludeFromUi" = false
        AND r."ageGroup" != 'UKJENT'
      ORDER BY r."playerId", r."ageGroup"
    ) dom ON dom."playerId" = p.id
    WHERE s.year = $1 AND s."holesSegment" = $2 AND s."totalRounds" >= $3 AND s."avgRound" IS NOT NULL
      ${ageGroupFilter}
      ${regionFilter}
      ${searchFilter}
  `;
  const totalResult = await prisma.$queryRawUnsafe<{ n: number }[]>(countSql, ...params);
  const total = totalResult[0]?.n ?? 0;

  return {
    rows: rows.map((r) => ({
      ...r,
      region: r.region as NorwegianRegion | null,
      ageGroup: r.ageGroup as TalentAgeGroup,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}

export type PlayerProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  club: string | null;
  birthYear: number | null;
  region: NorwegianRegion | null;
  gender: string | null;
  photoUrl: string | null;
  ngfId: string | null;
  wagrRank: number | null;
  collegeId: string | null;
  coach: string | null;
  lastActiveAt: Date | null;
  yearlyStats: {
    year: number;
    holesSegment: number;
    totalResults: number;
    totalRounds: number;
    avgRound: number | null;
    bestRound: number | null;
    top3Count: number;
    top10Count: number;
    improvementPerYear: number | null;
    dataConfidenceScore: number;
  }[];
  recentResults: {
    id: string;
    tournamentName: string;
    tournamentDate: Date;
    ageGroup: TalentAgeGroup;
    holes: number;
    position: number | null;
    totalScore: number | null;
    toPar: number | null;
    source: string;
  }[];
};

export async function fetchPlayerProfile(playerId: string): Promise<PlayerProfileData | null> {
  const p = await prisma.talentPlayer.findUnique({
    where: { id: playerId },
    include: {
      stats: { orderBy: [{ year: "desc" }, { holesSegment: "desc" }] },
      results: {
        where: { excludeFromUi: false },
        orderBy: { tournamentDate: "desc" },
        take: 30,
        select: {
          id: true,
          tournamentName: true,
          tournamentDate: true,
          ageGroup: true,
          holes: true,
          position: true,
          totalScore: true,
          toPar: true,
          source: true,
        },
      },
    },
  });
  if (!p) return null;
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    club: p.club,
    birthYear: p.birthYear,
    region: p.region,
    gender: p.gender,
    photoUrl: p.photoUrl,
    ngfId: p.ngfId,
    wagrRank: p.wagrRank,
    collegeId: p.collegeId,
    coach: p.coach,
    lastActiveAt: p.lastActiveAt,
    yearlyStats: p.stats.map((s) => ({
      year: s.year,
      holesSegment: s.holesSegment,
      totalResults: s.totalResults,
      totalRounds: s.totalRounds,
      avgRound: s.avgRound,
      bestRound: s.bestRound,
      top3Count: s.top3Count,
      top10Count: s.top10Count,
      improvementPerYear: s.improvementPerYear,
      dataConfidenceScore: s.dataConfidenceScore,
    })),
    recentResults: p.results,
  };
}

// =====================================================================
// MyTalentDashboardData — for innlogget spillers personlige Talent-side
// =====================================================================

export type MyTalentTournamentRow = {
  id: string;
  tournamentName: string;
  tournamentDate: Date;
  ageGroup: TalentAgeGroup;
  holes: number;
  position: number | null;
  totalScore: number | null;
  toPar: number | null;
};

export type MyTalentData = {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    club: string | null;
    region: NorwegianRegion | null;
    birthYear: number | null;
    wagrRank: number | null;
    collegeRank: number | null;
  };
  currentHcp: number | null;
  hcpTrend90d: number | null;
  currentYearStats: {
    year: number;
    totalRounds: number;
    avgRound: number | null;
    bestRound: number | null;
    top3Count: number;
    top10Count: number;
    improvementPerYear: number | null;
    dataConfidenceScore: number;
  } | null;
  ageGroupPercentile: number | null;
  ageGroupSize: number | null;
  recentResults: MyTalentTournamentRow[];
};

/**
 * Henter personlige talent-data for den innloggede spilleren.
 * Returnerer null hvis brukeren ikke har en linket TalentPlayer.
 */
export async function fetchMyTalentDashboardData(): Promise<MyTalentData | null> {
  const user = await requirePortalUser();

  const player = await prisma.talentPlayer.findFirst({
    where: { linkedUserId: user.id },
    include: {
      stats: {
        orderBy: [{ year: "desc" }, { holesSegment: "desc" }],
        take: 4,
      },
      results: {
        where: { excludeFromUi: false },
        orderBy: { tournamentDate: "desc" },
        take: 12,
        select: {
          id: true,
          tournamentName: true,
          tournamentDate: true,
          ageGroup: true,
          holes: true,
          position: true,
          totalScore: true,
          toPar: true,
        },
      },
    },
  });

  if (!player) return null;

  const [latestHcp, hcp90dAgo] = await Promise.all([
    prisma.handicapEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { handicapIndex: true, date: true },
    }),
    prisma.handicapEntry.findFirst({
      where: {
        userId: user.id,
        date: { lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    }),
  ]);

  const currentHcp = latestHcp?.handicapIndex ?? null;
  const hcpTrend90d =
    currentHcp !== null && hcp90dAgo?.handicapIndex !== undefined
      ? Number((currentHcp - hcp90dAgo.handicapIndex).toFixed(1))
      : null;

  const currentYear = new Date().getFullYear();
  const candidate =
    player.stats.find((s) => s.year === currentYear && s.holesSegment === 18) ??
    player.stats.find((s) => s.year === currentYear - 1 && s.holesSegment === 18) ??
    player.stats.find((s) => s.holesSegment === 18) ??
    player.stats[0] ??
    null;

  const currentYearStats = candidate
    ? {
        year: candidate.year,
        totalRounds: candidate.totalRounds,
        avgRound: candidate.avgRound,
        bestRound: candidate.bestRound,
        top3Count: candidate.top3Count,
        top10Count: candidate.top10Count,
        improvementPerYear: candidate.improvementPerYear,
        dataConfidenceScore: candidate.dataConfidenceScore,
      }
    : null;

  let ageGroupPercentile: number | null = null;
  let ageGroupSize: number | null = null;

  const dominantGroup = player.results[0]?.ageGroup;
  if (
    candidate &&
    candidate.avgRound !== null &&
    dominantGroup &&
    dominantGroup !== TalentAgeGroup.UKJENT
  ) {
    try {
      const peerStatsRaw = await prisma.$queryRawUnsafe<
        { betterCount: number; totalCount: number }[]
      >(
        `
        WITH peer AS (
          SELECT DISTINCT ON (r."playerId") r."playerId", r."ageGroup"
          FROM "TalentTournamentResult" r
          WHERE r."ageGroup"::text = $1
            AND r."excludeFromUi" = false
            AND EXTRACT(YEAR FROM r."tournamentDate") = $2
          ORDER BY r."playerId", r."ageGroup"
        )
        SELECT
          COUNT(*) FILTER (WHERE s."avgRound" IS NOT NULL AND s."avgRound" < $3)::int AS "betterCount",
          COUNT(*) FILTER (WHERE s."avgRound" IS NOT NULL)::int AS "totalCount"
        FROM "TalentPlayerStats" s
        JOIN peer p ON p."playerId" = s."playerId"
        WHERE s.year = $2 AND s."holesSegment" = 18 AND s."totalRounds" >= 3
        `,
        dominantGroup,
        candidate.year,
        candidate.avgRound
      );
      const row = peerStatsRaw[0];
      if (row && row.totalCount > 0) {
        ageGroupPercentile = Math.round(
          ((row.totalCount - row.betterCount) / row.totalCount) * 100
        );
        ageGroupSize = row.totalCount;
      }
    } catch {
      ageGroupPercentile = null;
      ageGroupSize = null;
    }
  }

  return {
    player: {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      club: player.club,
      region: player.region,
      birthYear: player.birthYear,
      wagrRank: player.wagrRank,
      collegeRank: player.collegeRank,
    },
    currentHcp,
    hcpTrend90d,
    currentYearStats,
    ageGroupPercentile,
    ageGroupSize,
    recentResults: player.results,
  };
}
