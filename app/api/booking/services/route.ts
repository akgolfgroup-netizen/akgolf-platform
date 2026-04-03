import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/booking/services
 * Returns active, public services with instructors.
 * Reads directly from the database (same monorepo as portal).
 */
export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(request)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const types = await prisma.serviceType.findMany({
      where: { isPublic: true, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        duration: true,
        price: true,
        color: true,
        minNoticeHours: true,
        maxAdvanceDays: true,
        allowStripe: true,
        allowVipps: true,
        Instructor: {
          select: {
            id: true,
            title: true,
            User: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(types, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    logger.error("[booking/services] DB error:", error);
    return NextResponse.json(
      { error: "Tjenester er midlertidig utilgjengelige" },
      { status: 503 }
    );
  }
}
