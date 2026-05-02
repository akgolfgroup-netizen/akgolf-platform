import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * DELETE /api/portal/trackman/sessions/[id]
 * Sletter en TrackMan-sesjon (alle slag + analytics + Trackman-session-record).
 * Begrenset til eieren av sesjonen.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  if (!sessionId) {
    return NextResponse.json({ error: "Mangler sessionId" }, { status: 400 });
  }

  // Verifiser eierskap via TrackManShotData
  const ownerShot = await prisma.trackManShotData.findFirst({
    where: { sessionId, userId: user.id },
    select: { id: true },
  });

  if (!ownerShot) {
    return NextResponse.json(
      { error: "Sesjon ikke funnet eller ikke din" },
      { status: 404 },
    );
  }

  // Slett i riktig rekkefolge for a unnga FK-feil. Bruk transaksjon.
  await prisma.$transaction([
    prisma.trackManSessionAnalytics.deleteMany({
      where: { sessionId, userId: user.id },
    }),
    prisma.trackManShotData.deleteMany({
      where: { sessionId, userId: user.id },
    }),
    prisma.trackmanSession.deleteMany({
      where: { id: sessionId, userId: user.id },
    }),
  ]);

  return NextResponse.json({ ok: true, sessionId });
}
