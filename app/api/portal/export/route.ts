import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { roundStatsToCsv } from "@/lib/portal/export/csv-stats";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "round-stats") {
    const stats = await prisma.roundStats.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const csv = roundStatsToCsv(stats);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rundestatistikk-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Ugyldig eksporttype. Bruk ?type=round-stats" },
    { status: 400 }
  );
}
