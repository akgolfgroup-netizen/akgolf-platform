"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/portal/rbac";

export async function getCoachingSessions() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const where = isStaff(user.role)
    ? {} // Staff sees all sessions
    : { studentId: user.id };

  return prisma.coachingSession.findMany({
    where,
    include: {
      student: { select: { name: true, image: true } },
      instructor: {
        select: { user: { select: { name: true } }, title: true },
      },
    },
    orderBy: { sessionDate: "desc" },
    take: 50,
  });
}

export async function createCoachingSession(data: {
  bookingId: string;
  studentId: string;
  instructorId: string;
  sessionDate: Date;
  primaryFocus?: string;
  instructorNotes?: string;
  studentNotes?: string;
}) {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const created = await prisma.coachingSession.create({
    data: {
      ...data,
      techniquesCovered: [],
      drillsAssigned: [],
      videoUrls: [],
    },
  });

  revalidatePath("/coaching-historikk");
  return created;
}

export async function saveAISummary(
  sessionId: string,
  summary: {
    keyPoints: string[];
    focusAreas: string[];
    actionItems: string[];
  }
) {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.coachingSession.update({
    where: { id: sessionId },
    data: {
      aiKeyPoints: summary.keyPoints,
      aiFocusAreas: summary.focusAreas,
      aiActionItems: summary.actionItems,
      aiGeneratedAt: new Date(),
    },
  });

  revalidatePath("/coaching-historikk");
}
