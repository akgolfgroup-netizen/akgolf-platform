"use server";

import { prisma } from "@/lib/portal/prisma";
import { Prisma } from "@prisma/client";
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

export interface GroupPlanSession {
  id: string;
  dayOfWeek: number;
  title: string;
  description: string | null;
  durationMinutes: number | null;
  focusArea: string | null;
  exercises: unknown;
  sortOrder: number;
}

export interface GroupPlanWeek {
  id: string;
  weekNumber: number;
  weekStart: Date;
  sessions: GroupPlanSession[];
}

export interface GroupPlanDetail {
  id: string;
  title: string;
  weeks: GroupPlanWeek[];
}

export interface SyncConflict {
  userId: string;
  userName: string | null;
  dayOfWeek: number;
  existingSessionTitle: string;
  groupSessionTitle: string;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  conflictCount: number;
  conflicts: SyncConflict[];
  errors: { userId: string; message: string }[];
  lastSyncedAt?: Date;
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
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

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

// -------------------------------------------------------------------
// Get group training plan with sessions
// -------------------------------------------------------------------

export async function getGroupPlan(groupId: string): Promise<GroupPlanDetail | null> {
  const authUserId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!user || !isStaff(user.role)) throw new Error("Unauthorized");

  const group = await prisma.trainingGroup.findFirst({
    where: { id: groupId, coachId: user.id },
    include: {
      plans: {
        where: { isActive: true },
        take: 1,
        include: {
          TrainingPlanWeek: {
            orderBy: { weekNumber: "asc" },
            include: {
              TrainingPlanSession: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!group || group.plans.length === 0) return null;

  const plan = group.plans[0];
  return {
    id: plan.id,
    title: plan.title,
    weeks: plan.TrainingPlanWeek.map((w) => ({
      id: w.id,
      weekNumber: w.weekNumber,
      weekStart: w.weekStart,
      sessions: w.TrainingPlanSession.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        title: s.title,
        description: s.description,
        durationMinutes: s.durationMinutes,
        focusArea: s.focusArea,
        exercises: s.exercises,
        sortOrder: s.sortOrder,
      })),
    })),
  };
}

// -------------------------------------------------------------------
// Sync group plan sessions to all members
// -------------------------------------------------------------------

type ConflictStrategy = "overwrite" | "keep" | "skip";

export async function syncGroupPlanToMembers(
  groupId: string,
  weekOffset: number,
  conflictStrategy: ConflictStrategy = "skip"
): Promise<SyncResult> {
  const authUserId = await requireAuth();
  const coach = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!coach || !isStaff(coach.role)) throw new Error("Unauthorized");

  const group = await prisma.trainingGroup.findFirst({
    where: { id: groupId, coachId: coach.id },
    include: {
      members: {
        include: {
          User: { select: { id: true, name: true, email: true } },
        },
      },
      plans: {
        where: { isActive: true },
        take: 1,
        include: {
          TrainingPlanWeek: {
            include: {
              TrainingPlanSession: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    return { success: false, syncedCount: 0, conflictCount: 0, conflicts: [], errors: [{ userId: "", message: "Gruppen finnes ikke" }] };
  }

  if (group.plans.length === 0) {
    return { success: false, syncedCount: 0, conflictCount: 0, conflicts: [], errors: [{ userId: "", message: "Ingen aktiv gruppeplan. Opprett en plan først." }] };
  }

  const groupPlan = group.plans[0];

  // Calculate target ISO week number from weekOffset
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + weekOffset * 7);
  const targetWeekNum = getISOWeek(targetDate);

  // Find the group's week that matches target week
  const groupWeek = groupPlan.TrainingPlanWeek.find(
    (w) => w.weekNumber === targetWeekNum
  );

  if (!groupWeek || groupWeek.TrainingPlanSession.length === 0) {
    return { success: false, syncedCount: 0, conflictCount: 0, conflicts: [], errors: [{ userId: "", message: `Ingen økter i gruppeplanen for uke ${targetWeekNum}` }] };
  }

  const conflicts: SyncConflict[] = [];
  const errors: { userId: string; message: string }[] = [];
  let syncedCount = 0;

  for (const member of group.members) {
    const studentId = member.User.id;

    try {
      // Find or create student's active plan
      let studentPlan = await prisma.trainingPlan.findFirst({
        where: { studentId, isActive: true },
        include: {
          TrainingPlanWeek: true,
        },
      });

      if (!studentPlan) {
        // Create a new plan for the student
        studentPlan = await prisma.trainingPlan.create({
          data: {
            id: nanoid(),
            studentId,
            createdById: coach.id,
            title: groupPlan.title,
            description: `Auto-opprettet fra gruppe "${group.name}"`,
            periodType: group.periodType,
            startDate: groupPlan.startDate,
            endDate: groupPlan.endDate,
            isActive: true,
            groupId: group.id,
            updatedAt: new Date(),
          },
          include: {
            TrainingPlanWeek: true,
          },
        });
      }

      // Find or create the target week in student's plan
      let studentWeek = studentPlan.TrainingPlanWeek.find(
        (w) => w.weekNumber === targetWeekNum
      );

      if (!studentWeek) {
        const weekStart = getStartOfISOWeek(targetDate);
        studentWeek = await prisma.trainingPlanWeek.create({
          data: {
            id: nanoid(),
            planId: studentPlan.id,
            weekNumber: targetWeekNum,
            weekStart,
          },
        });
      }

      // Get student's existing sessions in this week
      const existingSessions = await prisma.trainingPlanSession.findMany({
        where: { weekId: studentWeek.id },
      });

      // Determine which group sessions to copy
      const sessionsToCopy = [];
      for (const groupSession of groupWeek.TrainingPlanSession) {
        const existingOnSameDay = existingSessions.find(
          (s) => s.dayOfWeek === groupSession.dayOfWeek
        );

        if (existingOnSameDay) {
          // Check if it's already a synced group session
          const exExercises = Array.isArray(existingOnSameDay.exercises)
            ? (existingOnSameDay.exercises as Record<string, unknown>[])
            : [];
          const alreadySynced = exExercises.some(
            (ex) => ex._groupSessionId === groupSession.id
          );

          if (alreadySynced) {
            // Already synced — skip
            continue;
          }

          // Real conflict: player's own session vs group session
          conflicts.push({
            userId: studentId,
            userName: member.User.name,
            dayOfWeek: groupSession.dayOfWeek,
            existingSessionTitle: existingOnSameDay.title,
            groupSessionTitle: groupSession.title,
          });

          if (conflictStrategy === "skip") {
            continue;
          } else if (conflictStrategy === "keep") {
            // Keep player's session, skip group session
            continue;
          } else if (conflictStrategy === "overwrite") {
            // Delete existing and copy group session
            await prisma.trainingPlanSession.delete({
              where: { id: existingOnSameDay.id },
            });
          }
        }

        sessionsToCopy.push(groupSession);
      }

      // Copy sessions
      for (const gs of sessionsToCopy) {
        const exercises = Array.isArray(gs.exercises)
          ? (gs.exercises as Record<string, unknown>[])
          : [];

        await prisma.trainingPlanSession.create({
          data: {
            id: nanoid(),
            weekId: studentWeek!.id,
            dayOfWeek: gs.dayOfWeek,
            title: gs.title,
            description: gs.description,
            durationMinutes: gs.durationMinutes,
            focusArea: gs.focusArea,
            exercises: [
              ...exercises,
              { _groupSessionId: gs.id, _groupName: group.name },
            ] as Prisma.InputJsonValue,
            sortOrder: gs.sortOrder,
          },
        });
        syncedCount++;
      }
    } catch (err) {
      console.error(`[syncGroupPlanToMembers] Failed for ${studentId}:`, err);
      errors.push({
        userId: studentId,
        message: err instanceof Error ? err.message : "Ukjent feil",
      });
    }
  }

  return {
    success: errors.length === 0 && conflicts.length === 0,
    syncedCount,
    conflictCount: conflicts.length,
    conflicts,
    errors,
    lastSyncedAt: new Date(),
  };
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getStartOfISOWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
