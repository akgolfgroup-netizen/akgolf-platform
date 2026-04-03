import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { FacilityActivityStatus } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/portal/facility-activities/[id]/approve
 * Godkjenn en aktivitet med konflikt (kun admin)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    return NextResponse.json(
      { error: "Kun admin kan godkjenne konflikter" },
      { status: 403 }
    );
  }

  const { id } = await params;

  const existing = await prisma.facilityActivity.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  if (existing.status !== FacilityActivityStatus.PENDING) {
    return NextResponse.json(
      { error: "Aktiviteten er ikke i ventestatus" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { conflictNote } = body;

  const activity = await prisma.facilityActivity.update({
    where: { id },
    data: {
      status: FacilityActivityStatus.CONFIRMED,
      approvedById: user.id,
      conflictNote: conflictNote ?? `Godkjent av ${user.name ?? "admin"}`,
    },
    include: {
      Facility: { select: { id: true, name: true, slug: true } },
      CreatedBy: { select: { id: true, name: true } },
      ApprovedBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(activity);
}
