import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { listTechnicalPlansForPlayer } from "@/lib/portal/technical-plan/service";

/**
 * GET /api/portal/technical-plans
 * Returns the current player's technical plans with phase progress.
 */
export async function GET(_req: NextRequest) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const plans = await listTechnicalPlansForPlayer(user.id);
  return NextResponse.json({ plans });
}
