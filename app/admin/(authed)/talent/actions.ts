"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import {
  TalentAgeGroup,
  BirthYearSource,
  NorwegianGender,
  NorwegianRegion,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 50;

export type TalentPlayerRow = {
  id: string;
  firstName: string;
  lastName: string;
  club: string | null;
  birthYear: number | null;
  birthYearSource: BirthYearSource;
  gender: NorwegianGender | null;
  region: NorwegianRegion | null;
  ngfId: string | null;
  wagrRank: number | null;
  collegeId: string | null;
  coach: string | null;
  photoUrl: string | null;
  hasNotes: boolean;
  resultCount: number;
  bestConfidence: number | null;
  lastActiveAt: Date | null;
};

export type TalentListData = {
  players: TalentPlayerRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type TalentFilters = {
  search?: string;
  ageGroup?: TalentAgeGroup | "ALL";
  region?: NorwegianRegion | "ALL";
  hasGender?: "yes" | "no" | "ALL";
  hasBirthYear?: "yes" | "no" | "ALL";
  page?: number;
};

async function ensureStaff() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Krever staff-tilgang");
  }
  return user;
}

export async function fetchTalentPlayers(filters: TalentFilters): Promise<TalentListData> {
  await ensureStaff();
  const page = Math.max(1, filters.page ?? 1);

  const where: Record<string, unknown> = {};
  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { club: { contains: q, mode: "insensitive" } },
      { ngfId: { contains: q, mode: "insensitive" } },
    ];
  }
  if (filters.region && filters.region !== "ALL") {
    where.region = filters.region;
  }
  if (filters.hasGender === "yes") where.gender = { not: null };
  if (filters.hasGender === "no") where.gender = null;
  if (filters.hasBirthYear === "yes") where.birthYear = { not: null };
  if (filters.hasBirthYear === "no") where.birthYear = null;

  if (filters.ageGroup && filters.ageGroup !== "ALL") {
    where.results = {
      some: { ageGroup: filters.ageGroup },
    };
  }

  const [total, rawPlayers] = await Promise.all([
    prisma.talentPlayer.count({ where }),
    prisma.talentPlayer.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: [{ lastActiveAt: "desc" }, { lastName: "asc" }],
      include: {
        _count: { select: { results: true } },
        stats: {
          orderBy: { dataConfidenceScore: "desc" },
          take: 1,
          select: { dataConfidenceScore: true },
        },
      },
    }),
  ]);

  const players: TalentPlayerRow[] = rawPlayers.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    club: p.club,
    birthYear: p.birthYear,
    birthYearSource: p.birthYearSource,
    gender: p.gender,
    region: p.region,
    ngfId: p.ngfId,
    wagrRank: p.wagrRank,
    collegeId: p.collegeId,
    coach: p.coach,
    photoUrl: p.photoUrl,
    hasNotes: !!p.notes && p.notes.length > 0,
    resultCount: p._count.results,
    bestConfidence: p.stats[0]?.dataConfidenceScore ?? null,
    lastActiveAt: p.lastActiveAt,
  }));

  return { players, total, page, pageSize: PAGE_SIZE };
}

export type TalentPlayerDetail = TalentPlayerRow & {
  notes: string | null;
  wagrId: number | null;
  collegeRank: number | null;
  birthYearConfidence: number | null;
  linkedUserId: string | null;
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

export async function fetchTalentPlayerDetail(playerId: string): Promise<TalentPlayerDetail | null> {
  await ensureStaff();
  const p = await prisma.talentPlayer.findUnique({
    where: { id: playerId },
    include: {
      _count: { select: { results: true } },
      stats: {
        orderBy: { dataConfidenceScore: "desc" },
        take: 1,
        select: { dataConfidenceScore: true },
      },
      results: {
        orderBy: { tournamentDate: "desc" },
        take: 20,
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
    birthYearSource: p.birthYearSource,
    birthYearConfidence: p.birthYearConfidence,
    gender: p.gender,
    region: p.region,
    ngfId: p.ngfId,
    wagrId: p.wagrId,
    wagrRank: p.wagrRank,
    collegeId: p.collegeId,
    collegeRank: p.collegeRank,
    coach: p.coach,
    photoUrl: p.photoUrl,
    hasNotes: !!p.notes,
    notes: p.notes,
    resultCount: p._count.results,
    bestConfidence: p.stats[0]?.dataConfidenceScore ?? null,
    lastActiveAt: p.lastActiveAt,
    linkedUserId: p.linkedUserId,
    recentResults: p.results,
  };
}

export type TalentPlayerUpdate = {
  firstName?: string;
  lastName?: string;
  club?: string | null;
  birthYear?: number | null;
  birthYearSource?: BirthYearSource;
  gender?: NorwegianGender | null;
  region?: NorwegianRegion | null;
  ngfId?: string | null;
  wagrId?: number | null;
  collegeId?: string | null;
  coach?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
};

export async function updateTalentPlayer(playerId: string, patch: TalentPlayerUpdate) {
  await ensureStaff();
  await prisma.talentPlayer.update({
    where: { id: playerId },
    data: patch,
  });
  revalidatePath("/admin/talent");
  return { ok: true };
}
