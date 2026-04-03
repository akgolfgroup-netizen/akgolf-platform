import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { syncTournamentsFromSources } from "@/modules/tournament-planner/actions";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  // Allow auth via session (staff UI) or bearer token (cron)
  const syncSecret = process.env.TOURNAMENT_SYNC_SECRET;
  const authHeader = req.headers.get("authorization");

  let userId: string | undefined;

  if (syncSecret && authHeader === `Bearer ${syncSecret}`) {
    // Cron auth — no user context
  } else {
    const user = await getPortalUser();
    if (!user || !isStaff(user.role)) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
    }
    userId = user.id;
  }

  const body = await req.json().catch(() => ({}));
  const year = body.year ?? new Date().getFullYear();

  const result = await syncTournamentsFromSources(prisma, year, userId);

  return NextResponse.json(result);
}
