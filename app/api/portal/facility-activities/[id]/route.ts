import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { FacilityActivityStatus, FacilityActivityType } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/portal/facility-activities/[id]
 * Hent en aktivitet
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;

  const activity = await prisma.facilityActivity.findUnique({
    where: { id },
    include: {
      Facility: {
        select: { id: true, name: true, slug: true },
      },
      CreatedBy: {
        select: { id: true, name: true },
      },
      ApprovedBy: {
        select: { id: true, name: true },
      },
    },
  });

  if (!activity) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  return NextResponse.json(activity);
}

/**
 * PUT /api/portal/facility-activities/[id]
 * Oppdater en aktivitet
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.facilityActivity.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  // Kun admin eller oppretter kan endre
  if (!isAdmin(user.role) && existing.createdById !== user.id) {
    return NextResponse.json(
      { error: "Du kan kun endre egne aktiviteter" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const {
    facilityId,
    title,
    description,
    activityType,
    startTime,
    endTime,
    isRecurring,
    recurrenceRule,
    color,
    status,
  } = body;

  const start = startTime ? new Date(startTime) : existing.startTime;
  const end = endTime ? new Date(endTime) : existing.endTime;

  if (end <= start) {
    return NextResponse.json(
      { error: "Sluttid må være etter starttid" },
      { status: 400 }
    );
  }

  // Sjekk konflikter hvis tidsrom eller fasilitet endres
  let conflictNote = existing.conflictNote;
  let activityStatus = status ?? existing.status;

  const targetFacilityId = facilityId ?? existing.facilityId;
  const timeChanged =
    (startTime && new Date(startTime).getTime() !== existing.startTime.getTime()) ||
    (endTime && new Date(endTime).getTime() !== existing.endTime.getTime());
  const facilityChanged = facilityId && facilityId !== existing.facilityId;

  if (timeChanged || facilityChanged) {
    const conflicts = await checkFacilityConflicts(
      targetFacilityId,
      start,
      end,
      id
    );

    if (conflicts.hasConflict && !isAdmin(user.role)) {
      activityStatus = FacilityActivityStatus.PENDING;
      conflictNote = `Venter på godkjenning - ${conflicts.conflictingItems.length} konflikter`;
    }
  }

  const activity = await prisma.facilityActivity.update({
    where: { id },
    data: {
      ...(facilityId && { facilityId }),
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(activityType &&
        Object.values(FacilityActivityType).includes(activityType) && { activityType }),
      ...(startTime && { startTime: start }),
      ...(endTime && { endTime: end }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(recurrenceRule !== undefined && { recurrenceRule }),
      ...(color !== undefined && { color }),
      status: activityStatus,
      conflictNote,
    },
    include: {
      Facility: { select: { id: true, name: true, slug: true } },
      CreatedBy: { select: { id: true, name: true } },
      ApprovedBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(activity);
}

/**
 * DELETE /api/portal/facility-activities/[id]
 * Slett/kanseller en aktivitet
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.facilityActivity.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  // Kun admin eller oppretter kan slette
  if (!isAdmin(user.role) && existing.createdById !== user.id) {
    return NextResponse.json(
      { error: "Du kan kun slette egne aktiviteter" },
      { status: 403 }
    );
  }

  // Sett status til CANCELLED i stedet for å slette
  await prisma.facilityActivity.update({
    where: { id },
    data: { status: FacilityActivityStatus.CANCELLED },
  });

  return NextResponse.json({ success: true });
}
