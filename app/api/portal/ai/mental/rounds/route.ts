import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";

/**
 * POST /api/portal/ai/mental/rounds — Create a new round
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();
  const roundId = nanoid();

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
