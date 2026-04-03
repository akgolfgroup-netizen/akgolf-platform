import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  calculateDegradation,
  getTekSlagSpillGap,
  getEnvironmentDistribution,
} from "@/lib/portal/training/degradation-service";
import { getAllLPhasesForUser, SHOT_TYPES, type ShotType } from "@/lib/portal/training/l-phase-service";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/portal/training/analysis
 *
 * Returns comprehensive training analysis for the authenticated user:
 * - degradation: Degradation curves per shot type (TEK → SLAG → SPILL → TURN)
 * - gap: TEK/SLAG/SPILL gap analysis per shot type
 * - distribution: M-environment distribution (where the player trains)
 * - lPhases: Current L-phase per shot type
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit(`training-analysis:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
    }

    const user = await getPortalUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all data in parallel for performance
    const [degradationResults, gapResults, distribution, lPhasesMap] = await Promise.all([
      Promise.all(SHOT_TYPES.map((shotType) => calculateDegradation(user.id, shotType))),
      Promise.all(SHOT_TYPES.map((shotType) => getTekSlagSpillGap(user.id, shotType))),
      getEnvironmentDistribution(user.id),
      getAllLPhasesForUser(user.id),
    ]);

    // Convert degradation array to object keyed by shot type
    const degradation: Record<ShotType, Awaited<ReturnType<typeof calculateDegradation>>> = {} as Record<
      ShotType,
      Awaited<ReturnType<typeof calculateDegradation>>
    >;
    for (let i = 0; i < SHOT_TYPES.length; i++) {
      degradation[SHOT_TYPES[i]] = degradationResults[i];
    }

    // Convert gap array to object keyed by shot type
    const gap: Record<ShotType, Awaited<ReturnType<typeof getTekSlagSpillGap>>> = {} as Record<
      ShotType,
      Awaited<ReturnType<typeof getTekSlagSpillGap>>
    >;
    for (let i = 0; i < SHOT_TYPES.length; i++) {
      gap[SHOT_TYPES[i]] = gapResults[i];
    }

    // Convert Map to serializable object for L-phases
    const lPhases: Record<ShotType, { lPhase: string; setAt: string } | null> = {} as Record<
      ShotType,
      { lPhase: string; setAt: string } | null
    >;
    for (const shotType of SHOT_TYPES) {
      const entry = lPhasesMap.get(shotType);
      lPhases[shotType] = entry ? { lPhase: entry.lPhase, setAt: entry.setAt.toISOString() } : null;
    }

    return NextResponse.json({
      degradation,
      gap,
      distribution,
      lPhases,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
