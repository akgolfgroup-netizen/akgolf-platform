"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";
import { nanoid } from "nanoid";

interface SaveRoundData {
  date: string;
  courseName?: string;
  totalScore: number;
  scoreToPar: number;
  fairwaysHit?: number;
  fairwaysTotal?: number;
  gir?: number;
  girTotal?: number;
  totalPutts?: number;
  notes?: string;
}

export async function saveRound(data: SaveRoundData) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const now = new Date();

  await prisma.roundStats.create({
    data: {
      id: nanoid(),
      userId: user.id,
      date: new Date(data.date),
      courseName: data.courseName ?? null,
      source: "MANUAL",
      totalScore: data.totalScore,
      scoreToPar: data.scoreToPar,
      fairwaysHit: data.fairwaysHit ?? null,
      fairwaysTotal: data.fairwaysTotal ?? null,
      gir: data.gir ?? null,
      girTotal: data.girTotal ?? null,
      totalPutts: data.totalPutts ?? null,
      notes: data.notes ?? null,
      updatedAt: now,
    },
  });

  revalidatePath("/portal/statistikk");
  revalidatePath("/portal/profil");

  // Sjekk achievements i bakgrunnen
  checkAchievements(user.id).catch(() => {});
}
