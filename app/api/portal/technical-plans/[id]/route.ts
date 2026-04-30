import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { getTechnicalPlanById } from "@/lib/portal/technical-plan/service";

/**
 * GET /api/portal/technical-plans/[id]
 * Returns a single technical plan for the player.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { id } = await params;
  const plan = await getTechnicalPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.playerId !== user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  return NextResponse.json({ plan });
}
