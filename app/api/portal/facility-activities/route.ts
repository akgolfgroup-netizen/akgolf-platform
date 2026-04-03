import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { FacilityActivityStatus, FacilityActivityType } from "@prisma/client";

/**
 * GET /api/portal/facility-activities
 * Henter aktiviteter med filter
 */
export async function GET(req: NextRequest) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const facilityId = searchParams.get("facilityId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const status = searchParams.get("status") as FacilityActivityStatus | null;

  const activities = await prisma.facilityActivity.findMany({
    where: {
      ...(facilityId && { facilityId }),
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          OR: [
            {
              startTime: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            },
            {
              endTime: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            },
            {
              startTime: { lte: new Date(startDate) },
              endTime: { gte: new Date(endDate) },
            },
          ],
        }),
    },
    include: {
      Facility: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      CreatedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      ApprovedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(activities);
}

/**
 * POST /api/portal/facility-activities
 * Opprett ny aktivitet
 */
export async function POST(req: NextRequest) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
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
  } = body;

  if (!facilityId || !title || !activityType || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Mangler obligatoriske felter" },
      { status: 400 }
    );
  }

  // Valider aktivitetstype
  if (!Object.values(FacilityActivityType).includes(activityType)) {
    return NextResponse.json(
      { error: "Ugyldig aktivitetstype" },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    return NextResponse.json(
      { error: "Sluttid må være etter starttid" },
      { status: 400 }
    );
  }

  // Sjekk konflikter
  const conflicts = await checkFacilityConflicts(facilityId, start, end);

  // Bestem status basert på konflikter
  let activityStatus: FacilityActivityStatus = FacilityActivityStatus.CONFIRMED;
  let conflictNote: string | null = null;

  if (conflicts.hasConflict) {
    // Kun admin kan godkjenne konflikter direkte
    if (isAdmin(user.role)) {
      activityStatus = FacilityActivityStatus.CONFIRMED;
      conflictNote = `Godkjent med ${conflicts.conflictingItems.length} konflikter`;
    } else {
      activityStatus = FacilityActivityStatus.PENDING;
      conflictNote = `Venter på godkjenning - ${conflicts.conflictingItems.length} konflikter`;
    }
  }

  const activity = await prisma.facilityActivity.create({
    data: {
      facilityId,
      title,
      description,
      activityType,
      startTime: start,
      endTime: end,
      isRecurring: isRecurring ?? false,
      recurrenceRule,
      createdById: user.id,
      approvedById: activityStatus === FacilityActivityStatus.CONFIRMED ? user.id : null,
      status: activityStatus,
      conflictNote,
      color,
    },
    include: {
      Facility: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      CreatedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      activity,
      conflicts: conflicts.hasConflict ? conflicts.conflictingItems : null,
    },
    { status: 201 }
  );
}
