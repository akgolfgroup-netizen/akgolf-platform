"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import {
  linkParentToChild,
  unlinkParentFromChild,
  getParentsForChild,
  type ParentSummary,
} from "@/lib/portal/parent/relations";

export type { ParentSummary };

/**
 * Hent eksisterende foreldre for en spiller (admin-UI).
 */
export async function listParentsForChild(childId: string): Promise<ParentSummary[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];
  return getParentsForChild(childId);
}

/**
 * Søk etter eksisterende User som kan kobles som forelder.
 * Returnerer brukere som ikke allerede er knyttet som forelder eller er barnet selv.
 */
export async function searchPotentialParents(input: {
  childId: string;
  query: string;
}): Promise<Array<{ id: string; name: string | null; email: string; role: string }>> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];
  if (!input.query || input.query.length < 2) return [];

  const existing = await prisma.parentChildRelation.findMany({
    where: { childId: input.childId },
    select: { parentId: true },
  });
  const excludeIds = new Set([input.childId, ...existing.map((r) => r.parentId)]);

  const results = await prisma.user.findMany({
    where: {
      AND: [
        { id: { notIn: Array.from(excludeIds) } },
        {
          OR: [
            { email: { contains: input.query, mode: "insensitive" } },
            { name: { contains: input.query, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: { id: true, name: true, email: true, role: true },
    take: 10,
    orderBy: { name: "asc" },
  });

  return results.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email ?? "",
    role: u.role,
  }));
}

/**
 * Opprett ny User med PARENT-rolle og koble til barn (admin-flyt).
 */
export async function createParentAndLink(input: {
  childId: string;
  name: string;
  email: string;
  phone?: string;
  relationType?: string;
}): Promise<{ parentId: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (!input.name.trim()) throw new Error("Navn kreves");
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new Error("Ugyldig e-postadresse");
  }

  const lower = input.email.toLowerCase().trim();

  // Finn eksisterende eller opprett ny
  let parent = await prisma.user.findUnique({
    where: { email: lower },
    select: { id: true },
  });

  if (!parent) {
    const id = randomUUID();
    await prisma.user.create({
      data: {
        id,
        email: lower,
        name: input.name.trim(),
        phone: input.phone?.trim() || null,
        role: "PARENT",
        isActive: true,
        subscriptionTier: "VISITOR",
        updatedAt: new Date(),
      },
    });
    parent = { id };
  }

  await linkParentToChild({
    parentId: parent.id,
    childId: input.childId,
    relationType: input.relationType,
  });

  revalidatePath(`/admin/elever/${input.childId}`);
  return { parentId: parent.id };
}

/**
 * Koble eksisterende User som forelder.
 */
export async function linkExistingParent(input: {
  parentId: string;
  childId: string;
  relationType?: string;
}): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }
  await linkParentToChild(input);
  revalidatePath(`/admin/elever/${input.childId}`);
}

/**
 * Fjern kobling.
 */
export async function removeParentLink(input: {
  parentId: string;
  childId: string;
}): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }
  await unlinkParentFromChild(input);
  revalidatePath(`/admin/elever/${input.childId}`);
}
