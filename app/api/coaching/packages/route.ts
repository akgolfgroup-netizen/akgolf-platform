import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`coaching:${getClientIp(request)}`, RATE_LIMITS.COACHING_BOOK);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const packages = await prisma.coachingPackage.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        priceNok: true,
        billingType: true,
        bookingType: true,
        sessionsPerMonth: true,
        sessionDurationMin: true,
        bookingWindowDays: true,
        bookingWindowHours: true,
        maxBookingsPerWeek: true,
        slotsRequired: true,
        description: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(packages, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("[coaching/packages] Error:", msg);
    return NextResponse.json(
      { error: "Kunne ikke hente pakker", detail: msg },
      { status: 503 }
    );
  }
}
