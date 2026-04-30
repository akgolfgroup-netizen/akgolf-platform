/**
 * POST /api/portal/trackman/test-match
 *
 * Test-matcher en TrackMan-session til en teknisk plan
 * uten å lagre noe. Brukes for preview/debug.
 *
 * Body:
 *   - planId: string
 *   - shots: Array of { club, carryDistance? }
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { matchTrackManSessionToPlan } from "@/lib/portal/trackman/plan-matcher";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const body = await req.json();
  const { planId, shots } = body;

  if (!planId || !Array.isArray(shots) || shots.length === 0) {
    return NextResponse.json(
      { error: "planId og shots er påkrevd" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Sjekk tilgang til plan
  const { data: plan } = await supabase
    .from("technical_plans")
    .select("player_id, coach_id")
    .eq("id", planId)
    .single();

  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.player_id !== user.id && plan.coach_id !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  // Kjør matching
  const matchResult = await matchTrackManSessionToPlan(
    user.id,
    "test-session",
    shots.map((s: { club: string; carryDistance?: number | null }) => ({
      club: s.club,
      carryDistance: s.carryDistance ?? null,
    }))
  );

  // Hent alternativer for visning
  const { data: phases } = await supabase
    .from("technical_plan_phases")
    .select("id, title, area, status")
    .eq("plan_id", planId)
    .neq("status", "COMPLETED")
    .neq("status", "SKIPPED")
    .order("order", { ascending: true });

  return NextResponse.json({
    matchResult,
    alternatives: (phases ?? [])
      .filter((p) => p.id !== matchResult.phaseId)
      .map((p) => ({
        phaseId: p.id,
        title: p.title,
        area: p.area,
      })),
  });
}
