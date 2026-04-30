import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import {
  listTechnicalPlansForCoach,
  createTechnicalPlan,
} from "@/lib/portal/technical-plan/service";

/**
 * GET /api/portal/admin/technical-plans?playerId=<id>
 * Returns technical plans for a player (admin view) or all plans for coach.
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const playerId = req.nextUrl.searchParams.get("playerId");

  if (playerId) {
    const plans = await listTechnicalPlansForCoach(user.id);
    const filtered = plans.filter((p) => p.playerId === playerId);
    return NextResponse.json({ plans: filtered });
  }

  const plans = await listTechnicalPlansForCoach(user.id);
  return NextResponse.json({ plans });
}

/**
 * POST /api/portal/admin/technical-plans
 * Creates a new technical plan for a player.
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, RATE_LIMITS.API_GENERAL);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const body = await req.json();

  if (!body.playerId || !body.title) {
    return NextResponse.json(
      { error: "playerId og title er påkrevd" },
      { status: 400 }
    );
  }

  const plan = await createTechnicalPlan({
    playerId: body.playerId,
    coachId: user.id,
    title: body.title,
    description: body.description,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
  });

  return NextResponse.json({ plan }, { status: 201 });
}
