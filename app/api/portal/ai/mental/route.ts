import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

/**
 * POST /api/portal/ai/mental/rounds — Create a new round
 * GET /api/portal/ai/mental/trends — Get mental trends
 */

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();
  const roundId = nanoid();

  // We don't have a dedicated Round model for mental scorecard rounds,
  // so we store a placeholder entry with hole=0 to mark round creation
  await prisma.mentalScorecardEntry.create({
    data: {
      roundId,
      userId: user.id,
      hole: 0,
      shotNumber: 0,
      situation: JSON.stringify({
        type: "ROUND_CREATED",
        courseName: body.courseName ?? null,
        date: new Date().toISOString(),
      }),
    },
  });

  return NextResponse.json({ roundId });
}

export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (path === "trends") {
    const entries = await prisma.mentalScorecardEntry.findMany({
      where: { userId: user.id, hole: { gt: 0 } },
      orderBy: { timestamp: "asc" },
    });

    const focus = entries
      .filter((e) => e.focusLevel !== null)
      .map((e) => ({ date: e.timestamp, value: e.focusLevel }));

    const confidence = entries
      .filter((e) => e.confidence !== null)
      .map((e) => ({ date: e.timestamp, value: e.confidence }));

    const commitment = entries
      .filter((e) => e.committedToShot !== null)
      .map((e) => ({ date: e.timestamp, value: e.committedToShot ? 1 : 0 }));

    const acceptance = entries
      .filter((e) => e.acceptedResult !== null)
      .map((e) => ({ date: e.timestamp, value: e.acceptedResult ? 1 : 0 }));

    return NextResponse.json({ focus, confidence, commitment, acceptance });
  }

  return NextResponse.json({ error: "Ukjent sti" }, { status: 400 });
}
