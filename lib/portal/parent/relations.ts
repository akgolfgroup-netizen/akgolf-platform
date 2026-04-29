/**
 * Foreldre/foresatte-relasjoner (Fase I).
 *
 * - Maks 2 foreldre per junior (håndheves i app, ikke DB)
 * - Foreldre kan se barnas trening, turneringsplan og betalinger
 * - Admin/coach kobler foreldre til junior; foreldre selv kan ikke koble seg
 */

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/portal/prisma";

export const MAX_PARENTS_PER_CHILD = 2;

export interface ParentSummary {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  relationType: string;
  relationCreatedAt: Date;
}

export interface ChildSummary {
  id: string;
  name: string | null;
  email: string | null;
  relationType: string;
}

/**
 * Hent foreldrene som er koblet til en junior.
 */
export async function getParentsForChild(childId: string): Promise<ParentSummary[]> {
  const relations = await prisma.parentChildRelation.findMany({
    where: { childId },
    include: {
      Parent: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return relations.map((r) => ({
    id: r.Parent.id,
    name: r.Parent.name,
    email: r.Parent.email ?? "",
    phone: r.Parent.phone,
    relationType: r.relationType,
    relationCreatedAt: r.createdAt,
  }));
}

/**
 * Hent barna som en forelder er koblet til.
 */
export async function getChildrenForParent(parentId: string): Promise<ChildSummary[]> {
  const relations = await prisma.parentChildRelation.findMany({
    where: { parentId },
    include: {
      Child: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return relations.map((r) => ({
    id: r.Child.id,
    name: r.Child.name,
    email: r.Child.email,
    relationType: r.relationType,
  }));
}

/**
 * Koble en eksisterende User som forelder til et barn.
 * Kaster feil hvis barnet allerede har MAX_PARENTS_PER_CHILD foreldre,
 * eller hvis paret allerede er koblet.
 */
export async function linkParentToChild(input: {
  parentId: string;
  childId: string;
  relationType?: string;
}): Promise<void> {
  if (input.parentId === input.childId) {
    throw new Error("Forelder og barn kan ikke være samme person");
  }

  const existingCount = await prisma.parentChildRelation.count({
    where: { childId: input.childId },
  });
  if (existingCount >= MAX_PARENTS_PER_CHILD) {
    throw new Error(`Maks ${MAX_PARENTS_PER_CHILD} foreldre per spiller`);
  }

  const alreadyLinked = await prisma.parentChildRelation.findFirst({
    where: { parentId: input.parentId, childId: input.childId },
  });
  if (alreadyLinked) {
    throw new Error("Forelderen er allerede koblet til denne spilleren");
  }

  await prisma.parentChildRelation.create({
    data: {
      id: randomUUID(),
      parentId: input.parentId,
      childId: input.childId,
      relationType: input.relationType ?? "PARENT",
    },
  });

  // Sørg for at User har PARENT-rolle hvis de var INVITED/STUDENT
  const parent = await prisma.user.findUnique({
    where: { id: input.parentId },
    select: { role: true },
  });
  if (parent && parent.role !== "ADMIN" && parent.role !== "INSTRUCTOR" && parent.role !== "PARENT") {
    await prisma.user.update({
      where: { id: input.parentId },
      data: { role: "PARENT" },
    });
  }
}

/**
 * Fjern kobling mellom forelder og barn.
 */
export async function unlinkParentFromChild(input: {
  parentId: string;
  childId: string;
}): Promise<void> {
  await prisma.parentChildRelation.deleteMany({
    where: {
      parentId: input.parentId,
      childId: input.childId,
    },
  });
}

/**
 * Sjekk om en bruker har lov til å se en spillers data — enten fordi de
 * er spilleren selv, ADMIN/INSTRUCTOR, eller en koblet forelder.
 */
export async function canViewPlayerData(
  viewerId: string,
  playerId: string,
  viewerRole: string,
): Promise<boolean> {
  if (viewerId === playerId) return true;
  if (viewerRole === "ADMIN" || viewerRole === "INSTRUCTOR") return true;

  if (viewerRole === "PARENT") {
    const link = await prisma.parentChildRelation.findFirst({
      where: { parentId: viewerId, childId: playerId },
    });
    return !!link;
  }

  return false;
}
