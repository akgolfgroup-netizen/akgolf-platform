import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/portal/facilities
 * Henter alle fasiliteter (krever staff-tilgang)
 */
export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");

  const facilities = await prisma.facility.findMany({
    where: {
      isActive: true,
      ...(locationId && { locationId }),
    },
    include: {
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ Location: { name: "asc" } }, { sortOrder: "asc" }],
  });

  return NextResponse.json(facilities);
}

/**
 * POST /api/portal/facilities
 * Opprett ny fasilitet (krever admin-tilgang)
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: "Kun admin kan opprette fasiliteter" }, { status: 403 });
  }

  const body = await req.json();
  const { locationId, name, slug, description, capacity, sortOrder } = body;

  if (!locationId || !name || !slug) {
    return NextResponse.json(
      { error: "Mangler obligatoriske felter: locationId, name, slug" },
      { status: 400 }
    );
  }

  // Sjekk at slug er unik
  const existing = await prisma.facility.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug er allerede i bruk" }, { status: 400 });
  }

  const facility = await prisma.facility.create({
    data: {
      locationId,
      name,
      slug,
      description,
      capacity,
      sortOrder: sortOrder ?? 0,
    },
    include: {
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(facility, { status: 201 });
}
