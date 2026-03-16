import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { createTournament } from "@/modules/tournament-planner";
import { isStaff } from "@/lib/portal/rbac";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { name, startDate, level, location, externalUrl } = await req.json();

  await createTournament(prisma, {
    name,
    startDate: new Date(startDate),
    level,
    location: location || undefined,
    externalUrl: externalUrl || undefined,
    createdById: user.id,
  });

  return NextResponse.json({ ok: true });
}
