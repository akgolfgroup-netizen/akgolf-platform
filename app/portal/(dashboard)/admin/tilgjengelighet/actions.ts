"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";

export async function getAvailability(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.instructorAvailability.findMany({
    where: { instructorId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function upsertAvailability(
  instructorId: string,
  slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  // Replace all availability for this instructor
  await prisma.$transaction([
    prisma.instructorAvailability.deleteMany({ where: { instructorId } }),
    ...slots.map((slot) =>
      prisma.instructorAvailability.create({
        data: {
          instructorId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      })
    ),
  ]);

  revalidatePath("/admin/tilgjengelighet");
}

export async function getBlockedTimes(instructorId?: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.blockedTime.findMany({
    where: {
      ...(instructorId ? { instructorId } : {}),
      endTime: { gte: new Date() },
    },
    orderBy: { startTime: "asc" },
    take: 50,
  });
}

export async function createBlockedTime(data: {
  instructorId?: string;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.blockedTime.create({
    data: {
      instructorId: data.instructorId || null,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      reason: data.reason,
    },
  });

  revalidatePath("/admin/tilgjengelighet");
}

export async function deleteBlockedTime(id: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.blockedTime.delete({ where: { id } });
  revalidatePath("/admin/tilgjengelighet");
}
