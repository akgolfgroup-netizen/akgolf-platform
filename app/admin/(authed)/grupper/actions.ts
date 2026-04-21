"use server";

import { prisma } from "@/lib/portal/prisma";
import { requireAuth } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

export interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
  periodType: string;
  memberCount: number;
  planCount: number;
  createdAt: Date;
}

export interface GroupMember {
  id: string;
  userId: string;
  name: string | null;
  email: string | null;
  role: string;
  joinedAt: Date;
}

export interface PlayerOption {
  id: string;
  name: string | null;
  email: string | null;
}

// -------------------------------------------------------------------
// List groups for current coach
// -------------------------------------------------------------------

export async function listGroups(): Promise<GroupSummary[]> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  const groups = await prisma.trainingGroup.findMany({
    where: { coachId: user.id },
    include: {
      _count: {
        select: { members: true, plans: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    periodType: g.periodType,
    memberCount: g._count.members,
    planCount: g._count.plans,
    createdAt: g.createdAt,
  }));
}

// -------------------------------------------------------------------
// Create group
// -------------------------------------------------------------------

export async function createGroup(data: {
  name: string;
  description?: string;
  periodType?: string;
}): Promise<{ success: boolean; groupId?: string; error?: string }> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  try {
    const group = await prisma.trainingGroup.create({
      data: {
        id: nanoid(),
        name: data.name,
        description: data.description ?? null,
        periodType: data.periodType ?? "grunnperiode",
        coachId: user.id,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/grupper");
    return { success: true, groupId: group.id };
  } catch (error) {
    console.error("[createGroup]", error);
    return { success: false, error: "Kunne ikke opprette gruppe" };
  }
}

// -------------------------------------------------------------------
// Update group
// -------------------------------------------------------------------

export async function updateGroup(
  groupId: string,
  data: {
    name?: string;
    description?: string;
    periodType?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  try {
    await prisma.trainingGroup.updateMany({
      where: { id: groupId, coachId: user.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/grupper");
    return { success: true };
  } catch (error) {
    console.error("[updateGroup]", error);
    return { success: false, error: "Kunne ikke oppdatere gruppe" };
  }
}

// -------------------------------------------------------------------
// Delete group
// -------------------------------------------------------------------

export async function deleteGroup(groupId: string): Promise<{ success: boolean; error?: string }> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  try {
    await prisma.trainingGroup.deleteMany({
      where: { id: groupId, coachId: user.id },
    });

    revalidatePath("/admin/grupper");
    return { success: true };
  } catch (error) {
    console.error("[deleteGroup]", error);
    return { success: false, error: "Kunne ikke slette gruppe" };
  }
}

// -------------------------------------------------------------------
// List available players (not already in group)
// -------------------------------------------------------------------

export async function listAvailablePlayers(groupId?: string): Promise<PlayerOption[]> {
  await requireStaff();

  const players = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isActive: true,
      ...(groupId
        ? {
            GroupMemberships: {
              none: { groupId },
            },
          }
        : {}),
    },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
    take: 200,
  });

  return players;
}

// -------------------------------------------------------------------
// Get group members
// -------------------------------------------------------------------

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  const group = await prisma.trainingGroup.findFirst({
    where: { id: groupId, coachId: user.id },
    include: {
      members: {
        include: {
          User: { select: { id: true, name: true, email: true } },
        },
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  if (!group) return [];

  return group.members.map((m) => ({
    id: m.id,
    userId: m.User.id,
    name: m.User.name,
    email: m.User.email,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
}

// -------------------------------------------------------------------
// Add member
// -------------------------------------------------------------------

export async function addMember(
  groupId: string,
  userId: string,
  role: string = "PLAYER"
): Promise<{ success: boolean; error?: string }> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  try {
    const group = await prisma.trainingGroup.findFirst({
      where: { id: groupId, coachId: user.id },
    });
    if (!group) return { success: false, error: "Gruppen finnes ikke" };

    await prisma.groupMembership.create({
      data: {
        id: nanoid(),
        groupId,
        userId,
        role,
      },
    });

    revalidatePath("/admin/grupper");
    return { success: true };
  } catch (error) {
    console.error("[addMember]", error);
    return { success: false, error: "Kunne ikke legge til medlem" };
  }
}

// -------------------------------------------------------------------
// Remove member
// -------------------------------------------------------------------

export async function removeMember(
  groupId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  try {
    const group = await prisma.trainingGroup.findFirst({
      where: { id: groupId, coachId: user.id },
    });
    if (!group) return { success: false, error: "Gruppen finnes ikke" };

    await prisma.groupMembership.deleteMany({
      where: { groupId, userId },
    });

    revalidatePath("/admin/grupper");
    return { success: true };
  } catch (error) {
    console.error("[removeMember]", error);
    return { success: false, error: "Kunne ikke fjerne medlem" };
  }
}
