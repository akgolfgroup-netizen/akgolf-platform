import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/trackman/sessions — List TrackMan sessions for user
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const skip = (page - 1) * limit;

  const sessions = await prisma.trackManShotData.groupBy({
    by: ["sessionId"],
    where: { userId: user.id },
    _count: { sessionId: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
    skip,
    take: limit,
  });

  const total = await prisma.trackManShotData.groupBy({
    by: ["sessionId"],
    where: { userId: user.id },
  });

  const sessionIds = sessions.map((s) => s.sessionId);

  const firstShots = await prisma.trackManShotData.findMany({
    where: { sessionId: { in: sessionIds }, userId: user.id },
    orderBy: { shotNumber: "asc" },
    distinct: ["sessionId"],
    select: {
      sessionId: true,
      createdAt: true,
      context: true,
      pressureLevel: true,
    },
  });

  const clubCounts = await prisma.trackManShotData.groupBy({
    by: ["sessionId", "club"],
    where: { sessionId: { in: sessionIds }, userId: user.id },
    _count: { club: true },
  });

  const items = sessions.map((s) => {
    const meta = firstShots.find((f) => f.sessionId === s.sessionId);
    const clubs = clubCounts
      .filter((c) => c.sessionId === s.sessionId)
      .map((c) => ({ club: c.club, count: c._count.club }));

    return {
      sessionId: s.sessionId,
      date: meta?.createdAt ?? s._max.createdAt,
      context: meta?.context ?? "TRAINING",
      pressureLevel: meta?.pressureLevel ?? 1,
      totalShots: s._count.sessionId,
      clubs,
    };
  });

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total: total.length,
      totalPages: Math.ceil(total.length / limit),
    },
  });
}
