import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { generateNextSessionDraft } from "@/lib/portal/ai/next-session-orchestrator";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/portal/ai/next-session
 *
 * Body:
 *   - studentId: string
 *   - durationMinutes?: number (default 60)
 *
 * Returns a full next-session draft (focus + plan + context + sources).
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(`next-session:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler", resetAt: rateLimit.resetAt },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.studentId || typeof body.studentId !== "string") {
    return NextResponse.json(
      { error: "studentId er påkrevd" },
      { status: 400 }
    );
  }

  const durationMinutes = Number(body.durationMinutes) || 60;

  try {
    const draft = await generateNextSessionDraft({
      studentId: body.studentId,
      durationMinutes,
    });
    return NextResponse.json({ draft });
  } catch (err) {
    logger.error("[next-session] generation failed", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Kunne ikke generere økt-forslag",
      },
      { status: 500 }
    );
  }
}
