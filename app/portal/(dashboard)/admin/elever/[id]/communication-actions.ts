// @ts-nocheck
"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { CommunicationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCommunicationLogs(studentId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.communicationLog.findMany({
    where: { studentId },
    orderBy: { sentAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      subject: true,
      content: true,
      sentAt: true,
      instructor: {
        select: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });
}

export async function addCommunicationLog(
  studentId: string,
  type: CommunicationType,
  subject: string | null,
  content: string
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ikke tilgang" };
  }

  // Finn instruktørprofilen til innlogget bruker
  const instructor = await prisma.instructor.findFirst({
    where: {
      OR: [{ userId: user.id }],
    },
  });

  if (!instructor) {
    return { success: false, error: "Fant ikke instruktørprofil for innlogget bruker" };
  }

  if (!content.trim()) {
    return { success: false, error: "Innhold kan ikke være tomt" };
  }

  await prisma.communicationLog.create({
    data: {
      studentId,
      instructorId: instructor.id,
      type,
      subject: subject?.trim() || null,
      content: content.trim(),
    },
  });

  revalidatePath(`/portal/admin/elever/${studentId}`);
  return { success: true };
}
