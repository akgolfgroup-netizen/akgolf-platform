import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/ai/mental/rounds/[roundId] — Get round summary
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { roundId } = await params;

  const entries = await prisma.mentalScorecardEntry.findMany({
    where: { roundId, userId: user.id },
    orderBy: [{ hole: "asc" }, { shotNumber: "asc" }],
  });

  if (entries.length === 0) {
    return NextResponse.json({ error: "Runde ikke funnet" }, { status: 404 });
  }

  const shotEntries = entries.filter((e) => e.hole > 0);

  const avgFocus = shotEntries.filter((e) => e.focusLevel !== null).length > 0
    ? Math.round(
        shotEntries
          .filter((e) => e.focusLevel !== null)
          .reduce((a, e) => a + (e.focusLevel ?? 0), 0) /
          shotEntries.filter((e) => e.focusLevel !== null).length
      )
    : null;

  const avgConfidence = shotEntries.filter((e) => e.confidence !== null).length > 0
    ? Math.round(
        shotEntries
          .filter((e) => e.confidence !== null)
          .reduce((a, e) => a + (e.confidence ?? 0), 0) /
          shotEntries.filter((e) => e.confidence !== null).length
      )
    : null;

  const commitmentRate = shotEntries.length > 0
    ? Math.round(
        (shotEntries.filter((e) => e.committedToShot).length / shotEntries.length) * 100
      )
    : null;

  const acceptanceRate = shotEntries.length > 0
    ? Math.round(
        (shotEntries.filter((e) => e.acceptedResult).length / shotEntries.length) * 100
      )
    : null;

  const roundMeta = entries.find((e) => e.hole === 0);
  let courseName: string | null = null;
  try {
    const parsed = JSON.parse(roundMeta?.situation ?? "{}");
    courseName = parsed.courseName ?? null;
  } catch {
    courseName = null;
  }

  return NextResponse.json({
    roundId,
    courseName,
    entries: shotEntries,
    summary: {
      avgFocus,
      avgConfidence,
      commitmentRate,
      acceptanceRate,
      totalShots: shotEntries.length,
    },
  });
}
