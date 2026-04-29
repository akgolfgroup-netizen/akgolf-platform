"use server";

import { prisma } from "@/lib/portal/prisma";

interface ClubSuggestion {
  club: string;
  avgCarryMeters: number | null;
  diff: number;
}

/**
 * Foreslå kolle basert på distanse til hull og spillerens ClubInBag.
 * Velger kolle der avgCarryMeters er nærmest distansen,
 med preferanse for litt kortere enn distansen (ikke for lang).
 */
export async function suggestClubFromDistance(
  distanceMeters: number,
  userId: string
): Promise<ClubSuggestion | null> {
  const clubs = await prisma.clubInBag.findMany({
    where: {
      userId,
      isInActiveBag: true,
      avgCarryMeters: { not: null },
    },
    select: {
      club: true,
      avgCarryMeters: true,
    },
    orderBy: { avgCarryMeters: "asc" },
  });

  if (clubs.length === 0) return null;

  let best: ClubSuggestion | null = null;

  for (const c of clubs) {
    const carry = c.avgCarryMeters;
    if (carry == null) continue;

    const diff = Math.abs(carry - distanceMeters);

    if (!best || diff < best.diff) {
      best = { club: c.club, avgCarryMeters: carry, diff };
    }
  }

  return best;
}

/**
 * Hent alle aktive køller i baggen sortert etter carry-distans
 */
export async function getPlayerClubs(userId: string) {
  return prisma.clubInBag.findMany({
    where: { userId, isInActiveBag: true },
    select: {
      club: true,
      avgCarryMeters: true,
      avgTotalMeters: true,
      loft: true,
    },
    orderBy: { avgCarryMeters: "asc" },
  });
}
