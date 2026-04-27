"use server";

import { prisma } from "@/lib/portal/prisma";
import { TalentAgeGroup, NorwegianRegion } from "@prisma/client";

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
