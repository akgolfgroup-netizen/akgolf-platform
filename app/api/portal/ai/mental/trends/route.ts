import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/ai/mental/trends — Get mental trends over time
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const entries = await prisma.mentalScorecardEntry.findMany({
    where: { userId: user.id, hole: { gt: 0 } },
    orderBy: { timestamp: "asc" },
  });

  const focus = entries
    .filter((e) => e.focusLevel !== null)
    .map((e) => ({ date: e.timestamp.toISOString(), value: e.focusLevel }));

  const confidence = entries
    .filter((e) => e.confidence !== null)
    .map((e) => ({ date: e.timestamp.toISOString(), value: e.confidence }));

  const commitment = entries
    .filter((e) => e.committedToShot !== null)
    .map((e) => ({ date: e.timestamp.toISOString(), value: e.committedToShot ? 1 : 0 }));

  const acceptance = entries
    .filter((e) => e.acceptedResult !== null)
    .map((e) => ({ date: e.timestamp.toISOString(), value: e.acceptedResult ? 1 : 0 }));

  return NextResponse.json({ focus, confidence, commitment, acceptance });
}
