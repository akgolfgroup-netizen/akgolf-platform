import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/trackman/sessions/[id]/shots — Get shots for a session
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

  const shots = await prisma.trackManShotData.findMany({
    where: { sessionId, userId: user.id },
    orderBy: { shotNumber: "asc" },
  });

  return NextResponse.json({ sessionId, shots });
}
