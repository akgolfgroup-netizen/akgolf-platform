import { prisma } from "@/lib/portal/prisma";
import type { ShotTypeLPhase } from "@prisma/client";

// Re-export client-safe types from types file
export { L_PHASES, SHOT_TYPES } from "./l-phase-types";
export type { LPhase, ShotType } from "./l-phase-types";
import type { ShotType, LPhase } from "./l-phase-types";

/**
 * Get current L-phase for a specific shot type.
 * Returns the most recent L-phase entry, or null if none exists.
 */
export async function getLPhaseForShotType(
  userId: string,
  shotType: ShotType
): Promise<ShotTypeLPhase | null> {
  const entry = await prisma.shotTypeLPhase.findFirst({
    where: {
      userId,
      shotType,
    },
    orderBy: {
      setAt: "desc",
    },
  });

  return entry;
}

/**
 * Set a new L-phase for a specific shot type.
 * Creates a new entry (preserves history).
 */
export async function setLPhaseForShotType(
  userId: string,
  shotType: ShotType,
  lPhase: LPhase,
  setBy: string,
  notes?: string
): Promise<ShotTypeLPhase> {
  const entry = await prisma.shotTypeLPhase.create({
    data: {
      userId,
      shotType,
      lPhase,
      setBy,
      notes,
    },
  });

  return entry;
}

/**
 * Get full history of L-phase changes for a specific shot type.
 * Ordered by date descending (most recent first).
 */
export async function getLPhaseHistory(
  userId: string,
  shotType: ShotType
): Promise<ShotTypeLPhase[]> {
  const entries = await prisma.shotTypeLPhase.findMany({
    where: {
      userId,
      shotType,
    },
    orderBy: {
      setAt: "desc",
    },
  });

  return entries;
}

/**
 * Get current L-phases for all shot types for a user.
 * Returns a map of shotType → most recent L-phase entry.
 */
export async function getAllLPhasesForUser(
  userId: string
): Promise<Map<ShotType, ShotTypeLPhase>> {
  const entries = await prisma.shotTypeLPhase.findMany({
    where: {
      userId,
    },
    orderBy: {
      setAt: "desc",
    },
  });

  const phaseMap = new Map<ShotType, ShotTypeLPhase>();

  // Group by shotType, keep only the most recent for each
  for (const entry of entries) {
    const shotType = entry.shotType as ShotType;
    if (!phaseMap.has(shotType)) {
      phaseMap.set(shotType, entry);
    }
  }

  return phaseMap;
}
