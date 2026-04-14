import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/ai/mental/profile — Get mental profile
 * PUT /api/portal/ai/mental/profile — Update mental profile
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const profile = await prisma.mentalProfile.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const body = await req.json();

  const profile = await prisma.mentalProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      baselineConfidence: body.baselineConfidence ?? null,
      pressureTolerance: body.pressureTolerance ?? 3,
      focusBaseline: body.focusBaseline ?? null,
    },
    update: {
      baselineConfidence: body.baselineConfidence ?? undefined,
      pressureTolerance: body.pressureTolerance ?? undefined,
      focusBaseline: body.focusBaseline ?? undefined,
    },
  });

  return NextResponse.json({ profile });
}
