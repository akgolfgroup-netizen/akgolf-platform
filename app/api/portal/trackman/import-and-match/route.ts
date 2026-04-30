/**
 * POST /api/portal/trackman/import-and-match
 *
 * Importerer TrackMan-shot-data, beregner datakvalitet,
 * auto-matcher til spillerens aktive tekniske plan,
 * og lagrer session-link med match-metadata.
 *
 * Body:
 *   - shots: Array of { club, ballSpeed, carryDistance, smashFactor, offline, spinRate, launchAngle, clubPath, faceToPath }
 *   - sessionDate?: ISO string
 *   - context?: "TRAINING" | "CASUAL" | "COMPETITION"
 *   - fileName?: string
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import {
  getActivePlanForPlayer,
  createPlanSessionWithMatch,
} from "@/lib/portal/technical-plan/service";
import { assessSessionQuality } from "@/lib/portal/trackman/quality-engine";
import { matchTrackManSessionToPlan } from "@/lib/portal/trackman/plan-matcher";

function dominantClub(shots: Array<{ club: string }>): string {
  const counts = new Map<string, number>();
  for (const s of shots) {
    counts.set(s.club, (counts.get(s.club) ?? 0) + 1);
  }
  let best = shots[0]?.club ?? "Unknown";
  let bestCount = 0;
  for (const [club, count] of counts) {
    if (count > bestCount) {
      best = club;
      bestCount = count;
    }
  }
  return best;
}

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const body = await req.json();
  const { shots, sessionDate, fileName } = body;

  if (!Array.isArray(shots) || shots.length === 0) {
    return NextResponse.json(
      { error: "shots må være et ikke-tomt array" },
      { status: 400 }
    );
  }

  try {
    // 1. Beregn datakvalitet for sessionen
    const sessionQuality = assessSessionQuality({
      hasTrackManData: true,
      trackManShotCount: shots.length,
      hasGPSData: false,
      hasVideoRecording: false,
      isCoachPresent: false,
      playerSelfReportedReps: shots.length,
      environment: "M2", // Simulator som default for TrackMan
    });

    // 2. Finn spillerens aktive plan
    const activePlan = await getActivePlanForPlayer(user.id);
    if (!activePlan) {
      return NextResponse.json(
        { error: "Ingen aktiv teknisk plan funnet. Opprett en plan først." },
        { status: 404 }
      );
    }

    // 3. Auto-match til beste fase
    const matchResult = await matchTrackManSessionToPlan(
      user.id,
      "session-temp-id",
      shots.map((s: { club: string; carryDistance?: number | null }) => ({
        club: s.club,
        carryDistance: s.carryDistance ?? null,
      }))
    );

    // 4. Beregn estimert tid
    const estimatedHours = Math.max(0.25, shots.length * 1.5 / 60);

    // 5. Lagre session-link hvis match er god nok (>= 40%)
    let savedSession = null;
    if (matchResult.phaseId && matchResult.matchScore >= 40) {
      savedSession = await createPlanSessionWithMatch({
        phaseId: matchResult.phaseId,
        repsDone: shots.length,
        hoursDone: Math.round(estimatedHours * 10) / 10,
        ballsDone: shots.length,
        qualityScore: sessionQuality.score,
        dataQuality: sessionQuality.level,
        matchScore: matchResult.matchScore,
        matchWarnings: matchResult.matchWarnings,
        autoMatched: true,
        notes: `TrackMan-import: ${dominantClub(shots)}, ${shots.length} shots. ${fileName ?? ""}`,
      });
    }

    return NextResponse.json({
      sessionQuality,
      matchResult,
      savedSession,
      planId: activePlan.id,
      club: dominantClub(shots),
      shotCount: shots.length,
    });
  } catch (error) {
    console.error("[import-and-match] error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Feil ved import og matching",
      },
      { status: 500 }
    );
  }
}
