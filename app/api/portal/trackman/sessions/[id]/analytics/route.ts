import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/trackman/sessions/[id]/analytics — Get analytics for a session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { id: sessionId } = await params;

  const analytics = await prisma.trackManSessionAnalytics.findUnique({
    where: { sessionId },
  });

  if (!analytics) {
    return NextResponse.json({ error: "Analyse ikke funnet" }, { status: 404 });
  }

  // Verify ownership via shots
  const firstShot = await prisma.trackManShotData.findFirst({
    where: { sessionId },
    select: { userId: true },
  });

  if (firstShot?.userId !== user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  return NextResponse.json({ sessionId, analytics });
}
