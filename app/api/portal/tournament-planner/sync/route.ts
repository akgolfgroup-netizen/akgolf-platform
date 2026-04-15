import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { isStaff } from "@/lib/portal/rbac";
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

  const result = {
    success: true,
    year,
    syncedBy: userId || "cron",
    tournamentsUpdated: 0,
    message: "Tournament sync not fully implemented yet - please implement the actual sync logic",
  };

  return NextResponse.json(result);
}
