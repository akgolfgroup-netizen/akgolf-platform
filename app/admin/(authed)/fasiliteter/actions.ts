"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";

// ─── Fetch-funksjoner ───

export async function getFacilities() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  return prisma.facility.findMany({
    where: { isActive: true },
    include: { Location: true },
    orderBy: { name: "asc" },
  });
}

export async function getTodaySchedule() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.facilityActivity.findMany({
    where: {
      startTime: { gte: today, lt: tomorrow },
      status: { not: "CANCELLED" },
    },
    include: {
      Facility: true,
      CreatedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getTodayBookingCounts() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.booking.groupBy({
    by: ["facilityId"],
    where: {
      startTime: { gte: today, lt: tomorrow },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  for (const b of bookings) {
    if (b.facilityId) {
      countMap[b.facilityId] = b._count.id;
    }
  }
  return countMap;
}

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

  const supabase = await createServerSupabase();

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
  const validTypes = ["PRACTICE", "LESSON", "TOURNAMENT", "MAINTENANCE", "EVENT", "OTHER"];
  if (!validTypes.includes(activityType)) {
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
  let activityStatus = "CONFIRMED";
  let conflictNote: string | null = null;

  if (conflicts.hasConflict) {
    if (isAdmin(user.role)) {
      activityStatus = "CONFIRMED";
      conflictNote = `Godkjent med ${conflicts.conflictingItems.length} konflikter`;
    } else {
      activityStatus = "PENDING";
      conflictNote = `Venter på godkjenning - ${conflicts.conflictingItems.length} konflikter`;
    }
  }

  const { data: activity } = await supabase
    .from("FacilityActivity")
    .insert({
      facilityId,
      title,
      description,
      activityType,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      createdById: user.id,
      approvedById: activityStatus === "CONFIRMED" ? user.id : null,
      status: activityStatus,
      conflictNote,
      color,
    })
    .select()
    .single();

  revalidatePath("/admin/fasiliteter");

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

  const supabase = await createServerSupabase();

  const { data: activity } = await supabase
    .from("FacilityActivity")
    .select("*")
    .eq("id", activityId)
    .eq("status", "PENDING")
    .single();

  if (!activity) {
    throw new Error("Aktivitet ikke funnet");
  }

  await supabase
    .from("FacilityActivity")
    .update({
      status: "CONFIRMED",
      approvedById: user.id,
      conflictNote: `Godkjent av ${user.name ?? "admin"}`,
    })
    .eq("id", activityId);

  revalidatePath("/admin/fasiliteter");
  revalidatePath("/admin/godkjenninger");

  return { success: true };
}

export async function cancelActivity(activityId: string) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const supabase = await createServerSupabase();

  const { data: activity } = await supabase
    .from("FacilityActivity")
    .select("createdById")
    .eq("id", activityId)
    .single();

  if (!activity) {
    throw new Error("Aktivitet ikke funnet");
  }

  // Kun admin eller oppretter kan kansellere
  if (!isAdmin(user.role) && activity.createdById !== user.id) {
    throw new Error("Du kan kun kansellere egne aktiviteter");
  }

  await supabase
    .from("FacilityActivity")
    .update({ status: "CANCELLED" })
    .eq("id", activityId);

  revalidatePath("/admin/fasiliteter");

  return { success: true };
}

export async function getPendingActivities() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke tilgang");
  }

  const supabase = await createServerSupabase();

  const { data: activities } = await supabase
    .from("FacilityActivity")
    .select(`
      *,
      Facility (id, name),
      CreatedBy (id, name)
    `)
    .eq("status", "PENDING")
    .order("createdAt", { ascending: true });

  return activities || [];
}
