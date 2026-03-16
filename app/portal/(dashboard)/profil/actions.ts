"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { subDays, subMonths } from "date-fns";

export async function getMyProfile() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      subscriptionTier: true,
      instructorProfile: {
        select: { specialization: true, title: true, bio: true },
      },
    },
  });
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      phone: data.phone,
    },
  });

  revalidatePath("/profil");
}

async function calculateStreak(userId: string): Promise<number> {
  const logs = await prisma.trainingLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  if (logs.length === 0) return 0;

  // Normalize to UTC date-only strings (YYYY-MM-DD) and deduplicate
  const uniqueDates = [
    ...new Set(
      logs.map((l) => new Date(l.date).toISOString().split("T")[0])
    ),
  ].sort().reverse();

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = subDays(new Date(), 1).toISOString().split("T")[0];

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getPlayerStats() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");
  const userId = user.id;

  const thirtyDaysAgo = subDays(new Date(), 30);

  const [trainingSessions, coachingSessions, tournaments, streak, latestHandicap] =
    await Promise.all([
      prisma.trainingLog.count({
        where: { userId, date: { gte: thirtyDaysAgo } },
      }),
      prisma.coachingSession.count({
        where: { studentId: userId },
      }),
      prisma.playerTournamentPlan.count({
        where: { studentId: userId },
      }),
      calculateStreak(userId),
      prisma.handicapEntry.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
        select: { handicapIndex: true },
      }),
    ]);

  return {
    trainingSessions,
    coachingSessions,
    tournaments,
    streak,
    currentHandicap: latestHandicap?.handicapIndex ?? null,
  };
}

export async function getHandicapHistory(months = 6) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  return prisma.handicapEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: subMonths(new Date(), months) },
    },
    orderBy: { date: "asc" },
  });
}

export async function getAchievements() {
  const user = await requirePortalUser();
  if (!user?.id) return { definitions: [], unlocked: [] };

  const [definitions, unlocked] = await Promise.all([
    prisma.achievementDefinition.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.playerAchievement.findMany({
      where: { userId: user.id },
      select: { achievementDefinitionId: true, unlockedAt: true },
    }),
  ]);

  return { definitions, unlocked };
}

export async function uploadAvatar(formData: FormData) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const file = formData.get("avatar") as File;
  if (!file || !file.size) throw new Error("Ingen fil valgt");
  if (file.size > 5 * 1024 * 1024) throw new Error("Filen er for stor (maks 5MB)");

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${user.id}.${ext}`;
  const filePath = path.join(process.cwd(), "public", "avatars", fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const imageUrl = `/avatars/${fileName}`;
  await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  });

  revalidatePath("/profil");
  return imageUrl;
}
