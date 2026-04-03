"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { FacilityActivityStatus, FacilityActivityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface CreateActivityInput {
  facilityId: string;
  title: string;
  description?: string;
  activityType: string;
  startDate: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export async function createActivity(input: CreateActivityInput) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const {
    facilityId,
    title,
    description,
    activityType,
    startDate,
    startTime,
    endTime,
    color,
  } = input;

  // Valider aktivitetstype
  if (!Object.values(FacilityActivityType).includes(activityType as FacilityActivityType)) {
    throw new Error("Ugyldig aktivitetstype");
  }

  // Bygg dato-objekter
  const start = new Date(`${startDate}T${startTime}:00`);
  const end = new Date(`${startDate}T${endTime}:00`);

  if (end <= start) {
    throw new Error("Sluttid må være etter starttid");
  }

  // Sjekk konflikter
  const conflicts = await checkFacilityConflicts(facilityId, start, end);

  // Bestem status basert på konflikter
  let activityStatus: FacilityActivityStatus = FacilityActivityStatus.CONFIRMED;
  let conflictNote: string | null = null;

  if (conflicts.hasConflict) {
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
      activityType: activityType as FacilityActivityType,
      startTime: start,
      endTime: end,
      createdById: user.id,
      approvedById: activityStatus === FacilityActivityStatus.CONFIRMED ? user.id : null,
      status: activityStatus,
      conflictNote,
      color,
    },
  });

  revalidatePath("/portal/admin/fasiliteter");

  return {
    success: true,
    activity,
    hasConflict: conflicts.hasConflict,
    conflicts: conflicts.conflictingItems,
  };
}

export async function approveActivity(activityId: string) {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    throw new Error("Kun admin kan godkjenne aktiviteter");
  }

  const activity = await prisma.facilityActivity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Aktivitet ikke funnet");
  }

  if (activity.status !== FacilityActivityStatus.PENDING) {
    throw new Error("Aktiviteten er ikke i ventestatus");
  }

  await prisma.facilityActivity.update({
    where: { id: activityId },
    data: {
      status: FacilityActivityStatus.CONFIRMED,
      approvedById: user.id,
      conflictNote: `Godkjent av ${user.name ?? "admin"}`,
    },
  });

  revalidatePath("/portal/admin/fasiliteter");
  revalidatePath("/portal/admin/godkjenninger");

  return { success: true };
}

export async function cancelActivity(activityId: string) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const activity = await prisma.facilityActivity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Aktivitet ikke funnet");
  }

  // Kun admin eller oppretter kan kansellere
  if (!isAdmin(user.role) && activity.createdById !== user.id) {
    throw new Error("Du kan kun kansellere egne aktiviteter");
  }

  await prisma.facilityActivity.update({
    where: { id: activityId },
    data: { status: FacilityActivityStatus.CANCELLED },
  });

  revalidatePath("/portal/admin/fasiliteter");

  return { success: true };
}

export async function getPendingActivities() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  return prisma.facilityActivity.findMany({
    where: { status: FacilityActivityStatus.PENDING },
    include: {
      Facility: { select: { id: true, name: true } },
      CreatedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
