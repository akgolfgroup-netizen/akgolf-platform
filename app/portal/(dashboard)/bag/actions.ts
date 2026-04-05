"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

export async function addClub(data: {
  name: string;
  brand?: string;
  model?: string;
  loft?: number;
  avgCarry?: number;
  avgTotal?: number;
}) {
  const user = await requirePortalUser();

  let bag = await prisma.playerBag.findUnique({
    where: { userId: user.id },
  });

  if (!bag) {
    bag = await prisma.playerBag.create({
      data: { id: nanoid(), userId: user.id },
    });
  }

  const clubCount = await prisma.playerClub.count({ where: { bagId: bag.id } });

  const club = await prisma.playerClub.create({
    data: {
      id: nanoid(),
      bagId: bag.id,
      name: data.name,
      brand: data.brand ?? null,
      model: data.model ?? null,
      loft: data.loft ?? null,
      avgCarry: data.avgCarry ?? null,
      avgTotal: data.avgTotal ?? null,
      sortOrder: clubCount,
    },
  });

  return club;
}

export async function updateClub(
  clubId: string,
  data: {
    name?: string;
    brand?: string;
    model?: string;
    loft?: number;
    avgCarry?: number;
    avgTotal?: number;
  }
) {
  const user = await requirePortalUser();

  const club = await prisma.playerClub.findUnique({
    where: { id: clubId },
    include: { PlayerBag: { select: { userId: true } } },
  });

  if (!club || club.PlayerBag.userId !== user.id) {
    throw new Error("Klubb ikke funnet");
  }

  return prisma.playerClub.update({
    where: { id: clubId },
    data: {
      name: data.name ?? club.name,
      brand: data.brand ?? club.brand,
      model: data.model ?? club.model,
      loft: data.loft ?? club.loft,
      avgCarry: data.avgCarry ?? club.avgCarry,
      avgTotal: data.avgTotal ?? club.avgTotal,
    },
  });
}

export async function deleteClub(clubId: string) {
  const user = await requirePortalUser();

  const club = await prisma.playerClub.findUnique({
    where: { id: clubId },
    include: { PlayerBag: { select: { userId: true } } },
  });

  if (!club || club.PlayerBag.userId !== user.id) {
    throw new Error("Klubb ikke funnet");
  }

  await prisma.playerClub.delete({ where: { id: clubId } });
}

export async function getClubDispersions() {
  const user = await requirePortalUser();

  const bag = await prisma.playerBag.findUnique({
    where: { userId: user.id },
    include: { clubs: { orderBy: { sortOrder: "asc" } } },
  });

  if (!bag) return [];

  return bag.clubs.map((c) => ({
    club: c.name,
    avgCarry: c.avgCarry ?? 0,
    avgTotal: c.avgTotal ?? 0,
    avgOffline: c.avgOffline ?? 0,
    shotCount: c.shotCount,
    carryStdDev: 0, // Beregnes fra TrackMan
    lateralStdDev: c.avgOffline ?? 0,
  }));
}
