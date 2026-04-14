import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/ai/metrics — Get current player metrics
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const history = searchParams.get("history");

  const metrics = await prisma.playerMetrics.findUnique({
    where: { userId: user.id },
  });

  if (!metrics) {
    return NextResponse.json({ metrics: null });
  }

  if (history) {
    const snapshots = await prisma.metricSnapshot.findMany({
      where: { playerMetricsId: metrics.id },
      orderBy: { snapshotDate: "desc" },
      take: 52,
    });
    return NextResponse.json({ metrics, snapshots });
  }

  return NextResponse.json({ metrics });
}
