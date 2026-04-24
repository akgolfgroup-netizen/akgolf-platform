"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import type { Prisma } from "@prisma/client";

// ---------- Types (manual plan) ----------

export type StudentOption = {
  id: string;
  name: string | null;
  email: string | null;
};

export type DrillOption = {
  id: string;
  name: string;
  description: string | null;
  pyramid: string;
  area: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  difficulty: number;
};

export type ManualPlanExercise = {
  drillId: string;
  name: string;
  durationMinutes: number;
  sets?: number;
  reps?: number;
  notes?: string;
};

export type ManualPlanSession = {
  dayOfWeek: number;
  title: string;
  durationMinutes: number;
  focusArea: string;
  exercises?: ManualPlanExercise[];
};

export type ManualPlanWeek = {
  focus: string;
  volumeLabel?: string;
  sessions: ManualPlanSession[];
};

export type CreateManualPlanInput = {
  studentId: string;
  title: string;
  periodType: string;
  periodizationPeriodId?: string;
  startDate: string;
  durationWeeks: number;
  weeks: ManualPlanWeek[];
};

export type ExistingPlanSummary = {
  id: string;
  title: string;
  periodType: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  aiGenerated: boolean;
  createdAt: Date;
  student: { name: string | null; email: string | null } | null;
};

// ---------- Types (existing)

export type PlanSession = {
  id: string;
  weekId: string;
  dayOfWeek: number;
  title: string;
  description: string | null;
  durationMinutes: number | null;
  focusArea: string | null;
  exercises: Prisma.JsonValue;
  sortOrder: number;
  facilityId: string | null;
};

export type PlanWeek = {
  id: string;
  planId: string;
  weekNumber: number;
  weekStart: Date;
  focus: string | null;
  volumeLabel: string | null;
  sessions: PlanSession[];
};

export type StudentPlan = {
  id: string;
  studentId: string;
  createdById: string;
  title: string;
  description: string | null;
  goals: string | null;
  periodType: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  aiGenerated: boolean;
  createdAt: Date;
  weeks: PlanWeek[];
};

export type StudentInfo = {
  id: string;
  name: string | null;
  email: string | null;
};

// ---------- Auth helper ----------

async function requireStaff() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }
  return user;
}

// ---------- Read ----------

export async function getStudentPlans(
  studentId: string
): Promise<{ plans: StudentPlan[]; student: StudentInfo | null }> {
  await requireStaff();

  const [plans, student] = await Promise.all([
    prisma.trainingPlan.findMany({
      where: { studentId },
      include: {
        TrainingPlanWeek: {
          include: {
            TrainingPlanSession: {
              orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
            },
          },
          orderBy: { weekNumber: "asc" },
        },
      },
      orderBy: [{ isActive: "desc" }, { startDate: "desc" }],
    }),
    prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const mapped: StudentPlan[] = plans.map((p) => ({
    id: p.id,
    studentId: p.studentId,
    createdById: p.createdById,
    title: p.title,
    description: p.description,
    goals: p.goals,
    periodType: p.periodType,
    startDate: p.startDate,
    endDate: p.endDate,
    isActive: p.isActive,
    aiGenerated: p.aiGenerated,
    createdAt: p.createdAt,
    weeks: p.TrainingPlanWeek.map((w) => ({
      id: w.id,
      planId: w.planId,
      weekNumber: w.weekNumber,
      weekStart: w.weekStart,
      focus: w.focus,
      volumeLabel: w.volumeLabel,
      sessions: w.TrainingPlanSession.map((s) => ({
        id: s.id,
        weekId: s.weekId,
        dayOfWeek: s.dayOfWeek,
        title: s.title,
        description: s.description,
        durationMinutes: s.durationMinutes,
        focusArea: s.focusArea,
        exercises: s.exercises,
        sortOrder: s.sortOrder,
        facilityId: s.facilityId,
      })),
    })),
  }));

  return { plans: mapped, student };
}

// ---------- Session CRUD ----------

export async function updateSession(
  sessionId: string,
  data: {
    title?: string;
    durationMinutes?: number;
    focusArea?: string;
    exercises?: Prisma.JsonValue;
    dayOfWeek?: number;
    description?: string;
    sortOrder?: number;
    facilityId?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  await requireStaff();

  try {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;
    if (data.focusArea !== undefined) updateData.focusArea = data.focusArea;
    if (data.exercises !== undefined) updateData.exercises = data.exercises;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.facilityId !== undefined) updateData.facilityId = data.facilityId;

    await prisma.trainingPlanSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    revalidatePath("/admin/treningsplan");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke oppdatere sesjonen" };
  }
}

export async function deleteSession(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  await requireStaff();

  try {
    await prisma.trainingPlanSession.delete({
      where: { id: sessionId },
    });

    revalidatePath("/admin/treningsplan");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke slette sesjonen" };
  }
}

export async function addSession(
  weekId: string,
  data: {
    dayOfWeek: number;
    title: string;
    durationMinutes: number;
    focusArea: string;
    exercises?: Prisma.JsonValue;
    description?: string;
    facilityId?: string | null;
  }
): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  await requireStaff();

  try {
    // Finn hoyeste sortOrder i uken
    const existing = await prisma.trainingPlanSession.findMany({
      where: { weekId, dayOfWeek: data.dayOfWeek },
      select: { sortOrder: true },
      orderBy: { sortOrder: "desc" },
      take: 1,
    });

    const nextSort = (existing[0]?.sortOrder ?? -1) + 1;
    const id = nanoid();

    await prisma.trainingPlanSession.create({
      data: {
        id,
        weekId,
        dayOfWeek: data.dayOfWeek,
        title: data.title,
        durationMinutes: data.durationMinutes,
        focusArea: data.focusArea,
        exercises: data.exercises ?? [],
        description: data.description ?? null,
        sortOrder: nextSort,
        facilityId: data.facilityId ?? null,
      },
    });

    revalidatePath("/admin/treningsplan");
    return { success: true, sessionId: id };
  } catch {
    return { success: false, error: "Kunne ikke legge til sesjon" };
  }
}

// ---------- Week ----------

export async function updateWeekFocus(
  weekId: string,
  focus: string
): Promise<{ success: boolean; error?: string }> {
  await requireStaff();

  try {
    await prisma.trainingPlanWeek.update({
      where: { id: weekId },
      data: { focus },
    });

    revalidatePath("/admin/treningsplan");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke oppdatere ukefokus" };
  }
}

// ---------- Duplicate plan ----------

export async function duplicatePlan(
  planId: string,
  newStudentId: string
): Promise<{ success: boolean; error?: string; newPlanId?: string }> {
  const user = await requireStaff();

  try {
    const original = await prisma.trainingPlan.findUnique({
      where: { id: planId },
      include: {
        TrainingPlanWeek: {
          include: { TrainingPlanSession: true },
        },
      },
    });

    if (!original) {
      return { success: false, error: "Plan ikke funnet" };
    }

    const newPlanId = nanoid();
    const now = new Date();

    await prisma.trainingPlan.create({
      data: {
        id: newPlanId,
        studentId: newStudentId,
        createdById: user.id,
        title: `${original.title} (kopi)`,
        description: original.description,
        goals: original.goals,
        periodType: original.periodType,
        startDate: original.startDate,
        endDate: original.endDate,
        isActive: false,
        aiGenerated: false,
        updatedAt: now,
      },
    });

    for (const week of original.TrainingPlanWeek) {
      const newWeekId = nanoid();

      await prisma.trainingPlanWeek.create({
        data: {
          id: newWeekId,
          planId: newPlanId,
          weekNumber: week.weekNumber,
          weekStart: week.weekStart,
          focus: week.focus,
          volumeLabel: week.volumeLabel,
        },
      });

      for (const session of week.TrainingPlanSession) {
        await prisma.trainingPlanSession.create({
          data: {
            id: nanoid(),
            weekId: newWeekId,
            dayOfWeek: session.dayOfWeek,
            title: session.title,
            description: session.description,
            durationMinutes: session.durationMinutes,
            focusArea: session.focusArea,
            exercises: session.exercises ?? [],
            sortOrder: session.sortOrder,
          },
        });
      }
    }

    revalidatePath("/admin/treningsplan");
    return { success: true, newPlanId };
  } catch {
    return { success: false, error: "Kunne ikke duplisere planen" };
  }
}

// ---------- Manual plan actions ----------

export async function getStudents(): Promise<StudentOption[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) return [];

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return students;
}

export async function getDrills(
  pyramidLevel?: string
): Promise<DrillOption[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) return [];

  const where: Record<string, unknown> = {
    OR: [{ isPublic: true }, { isSystemDrill: true }],
  };

  if (pyramidLevel) {
    where.pyramid = pyramidLevel;
  }

  const drills = await prisma.exerciseDefinition.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      pyramid: true,
      area: true,
      minDurationMinutes: true,
      maxDurationMinutes: true,
      difficulty: true,
    },
    orderBy: [{ pyramid: "asc" }, { name: "asc" }],
  });

  return drills;
}

export async function getExistingPlans(): Promise<ExistingPlanSummary[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) return [];

  const plans = await prisma.trainingPlan.findMany({
    include: {
      User_TrainingPlan_studentIdToUser: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    periodType: p.periodType,
    startDate: p.startDate,
    endDate: p.endDate,
    isActive: p.isActive,
    aiGenerated: p.aiGenerated,
    createdAt: p.createdAt,
    student: p.User_TrainingPlan_studentIdToUser
      ? {
          name: p.User_TrainingPlan_studentIdToUser.name,
          email: p.User_TrainingPlan_studentIdToUser.email,
        }
      : null,
  }));
}

export async function createManualPlan(
  data: CreateManualPlanInput
): Promise<{ success: boolean; planId?: string; error?: string }> {
  const user = await requireStaff();

  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + data.durationWeeks * 7 - 1);

    // Deaktiver eksisterende aktive planer for eleven
    await prisma.trainingPlan.updateMany({
      where: { studentId: data.studentId, isActive: true },
      data: { isActive: false },
    });

    const planId = nanoid();
    const now = new Date();

    // Opprett plan med uker og sesjoner
    await prisma.trainingPlan.create({
      data: {
        id: planId,
        studentId: data.studentId,
        createdById: user.id,
        title: data.title,
        periodType: data.periodType,
        periodizationPeriodId: data.periodizationPeriodId ?? null,
        startDate,
        endDate,
        isActive: true,
        aiGenerated: false,
        updatedAt: now,
        TrainingPlanWeek: {
          create: data.weeks.map((week, weekIndex) => {
            const weekId = nanoid();
            const weekStart = new Date(startDate);
            weekStart.setDate(weekStart.getDate() + weekIndex * 7);

            return {
              id: weekId,
              weekNumber: weekIndex + 1,
              weekStart,
              focus: week.focus,
              volumeLabel: week.volumeLabel ?? null,
              TrainingPlanSession: {
                create: week.sessions.map((session) => ({
                  id: nanoid(),
                  dayOfWeek: session.dayOfWeek,
                  title: session.title,
                  durationMinutes: session.durationMinutes,
                  focusArea: session.focusArea,
                  exercises: session.exercises ?? [],
                  sortOrder: session.dayOfWeek,
                })),
              },
            };
          }),
        },
      },
    });

    revalidatePath("/admin/treningsplan");
    return { success: true, planId };
  } catch (error) {
    console.error("[createManualPlan]", error);
    return { success: false, error: "Kunne ikke opprette treningsplan" };
  }
}
