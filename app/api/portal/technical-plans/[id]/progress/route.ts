import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logProgress } from "@/lib/portal/technical-plan/service";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/portal/technical-plans/[id]/progress
 * Player logs progress for a phase.
 *
 * Body:
 *   - phaseId: string
 *   - repsDone?: number
 *   - hoursDone?: number
 *   - ballsDone?: number
 *   - qualityScore?: number (1-10)
 *   - notes?: string
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, RATE_LIMITS.API_GENERAL);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const { id } = await params;
  const body = await req.json();

  if (!body.phaseId) {
    return NextResponse.json(
      { error: "phaseId er påkrevd" },
      { status: 400 }
    );
  }

  // Verify the phase belongs to a plan owned by this player
  const supabase = createServiceClient();
  const { data: phase, error: phaseError } = await supabase
    .from("technical_plan_phases")
    .select("plan_id, plan:plan_id(player_id)")
    .eq("id", body.phaseId)
    .single();

  if (phaseError || !phase) {
    return NextResponse.json({ error: "Fase ikke funnet" }, { status: 404 });
  }

  // Supabase returns nested data as an array; extract player_id
  const planPlayerId = (phase.plan as unknown as { player_id: string }[])?.[0]?.player_id;
  if (phase.plan_id !== id || planPlayerId !== user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const session = await logProgress({
    phaseId: body.phaseId,
    repsDone: body.repsDone,
    hoursDone: body.hoursDone,
    ballsDone: body.ballsDone,
    qualityScore: body.qualityScore,
    notes: body.notes,
    trainingLogId: body.trainingLogId,
  });

  return NextResponse.json({ session }, { status: 201 });
}
