"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";
import { nanoid } from "nanoid";
import { UserRole } from "@prisma/client";

export async function getTrainingLogs(month?: Date) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const ref = month ?? new Date();
  const from = startOfMonth(ref);
  const to = endOfMonth(ref);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: from, lte: to },
    },
    include: {
      TrainingPlanSession: {
        select: { id: true, title: true, focusArea: true, durationMinutes: true },
      },
    },
    orderBy: { date: "desc" },
  });

  // Transform to expected format
  return logs.map((log) => ({
    id: log.id,
    date: log.date,
    durationMinutes: log.durationMinutes,
    focusArea: log.focusArea,
    notes: log.notes,
    rating: log.rating,
    energyLevel: null as "high" | "medium" | "low" | null,
    type: "range" as "range" | "course" | "putting" | "coaching" | "fitness",
    completed: true,
    TrainingPlanSession: log.TrainingPlanSession,
  }));
}

export async function logSession(data: {
  planSessionId?: string;
  date: string;
  durationMinutes?: number;
  focusArea?: string;
  notes?: string;
  rating?: number;
  deviatedFromPlan?: boolean;
  deviationReason?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  await prisma.trainingLog.create({
    data: {
      id: nanoid(),
      updatedAt: new Date(),
      userId: user.id,
      planSessionId: data.planSessionId ?? null,
      date: new Date(data.date),
      durationMinutes: data.durationMinutes ?? null,
      focusArea: data.focusArea ?? null,
      exercises: [],
      notes: data.notes ?? null,
      rating: data.rating ?? null,
      deviatedFromPlan: data.deviatedFromPlan ?? false,
      deviationReason: data.deviationReason ?? null,
    },
  });

  revalidatePath("/dagbok");
  revalidatePath("/treningsplan");
  revalidatePath("/analyse");

  // Check achievements in background
  checkAchievements(user.id).catch(() => {});
}

export async function updateTrainingLog(
  id: string,
  data: Partial<{
    durationMinutes: number;
    focusArea: string;
    notes: string;
    rating: number;
    deviatedFromPlan: boolean;
    deviationReason: string;
  }>
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Not found");

  await prisma.trainingLog.update({ where: { id }, data });
  revalidatePath("/dagbok");
}

export async function deleteTrainingLog(id: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) throw new Error("Not found");

  await prisma.trainingLog.delete({ where: { id } });
  revalidatePath("/dagbok");
  revalidatePath("/analyse");
}

// Returns planSessionIds that have been logged today by the current user
export async function getLoggedSessionIds() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: today, lt: tomorrow },
      planSessionId: { not: null },
    },
    select: { planSessionId: true },
  });

  return logs.map((l) => l.planSessionId!);
}

// Quick-log: Repeat last session
export async function repeatLastSession() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  // Get the most recent log
  const lastLog = await prisma.trainingLog.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      focusArea: true,
      durationMinutes: true,
      exercises: true,
    },
  });

  if (!lastLog) {
    throw new Error("Ingen tidligere okter funnet");
  }

  // Create new log with same details
  await prisma.trainingLog.create({
    data: {
      id: nanoid(),
      updatedAt: new Date(),
      userId: user.id,
      date: new Date(),
      focusArea: lastLog.focusArea,
      durationMinutes: lastLog.durationMinutes,
      exercises: lastLog.exercises ?? [],
      notes: null,
      rating: null,
      deviatedFromPlan: false,
      deviationReason: null,
    },
  });

  revalidatePath("/dagbok");
  revalidatePath("/treningsplan");
  revalidatePath("/analyse");

  // Check achievements in background
  checkAchievements(user.id).catch(() => {});

  return { success: true, focusArea: lastLog.focusArea };
}

// Get last session for preview
export async function getLastSession() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const lastLog = await prisma.trainingLog.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      focusArea: true,
      durationMinutes: true,
    },
  });

  return lastLog;
}

// === NEW FUNCTIONS FOR EXERCISE LOGGING ===

interface ExerciseInput {
  exerciseId?: string;
  name: string;
  plannedSets?: number;
  plannedReps?: number;
  actualSets?: number;
  actualReps?: number;
  lPhase?: string;
  clubSpeed?: number;
  environment?: number;
  pressLevel?: number;
  successRate?: number;
  score?: number;
  notes?: string;
  sortOrder?: number;
}

interface SessionWithExercisesInput {
  planSessionId?: string;
  date: string;
  durationMinutes?: number;
  focusArea?: string;
  notes?: string;
  rating?: number;
  deviatedFromPlan?: boolean;
  deviationReason?: string;
  // AK-formel fields
  primaryLPhase?: string;
  primaryEnvironment?: number;
  primaryPressLevel?: number;
  // Exercises
  exercises: ExerciseInput[];
}

export async function logSessionWithExercises(data: SessionWithExercisesInput) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const sessionId = nanoid();

  // Create TrainingLog and TrainingLogExercises in a transaction
  await prisma.$transaction(async (tx) => {
    // Create the training log
    await tx.trainingLog.create({
      data: {
        id: sessionId,
        updatedAt: new Date(),
        userId: user.id,
        planSessionId: data.planSessionId ?? null,
        date: new Date(data.date),
        durationMinutes: data.durationMinutes ?? null,
        focusArea: data.focusArea ?? null,
        exercises: [], // Legacy field, kept for backwards compatibility
        notes: data.notes ?? null,
        rating: data.rating ?? null,
        deviatedFromPlan: data.deviatedFromPlan ?? false,
        deviationReason: data.deviationReason ?? null,
        primaryLPhase: data.primaryLPhase ?? null,
        primaryEnvironment: data.primaryEnvironment ?? null,
        primaryPressLevel: data.primaryPressLevel ?? null,
      },
    });

    // Create exercises if provided
    if (data.exercises.length > 0) {
      await tx.trainingLogExercise.createMany({
        data: data.exercises.map((ex, index) => ({
          id: nanoid(),
          trainingLogId: sessionId,
          exerciseId: ex.exerciseId ?? null,
          name: ex.name,
          plannedSets: ex.plannedSets ?? null,
          plannedReps: ex.plannedReps ?? null,
          actualSets: ex.actualSets ?? null,
          actualReps: ex.actualReps ?? null,
          lPhase: ex.lPhase ?? null,
          clubSpeed: ex.clubSpeed ?? null,
          environment: ex.environment ?? null,
          pressLevel: ex.pressLevel ?? null,
          successRate: ex.successRate ?? null,
          score: ex.score ?? null,
          notes: ex.notes ?? null,
          sortOrder: ex.sortOrder ?? index,
        })),
      });
    }
  });

  revalidatePath("/dagbok");
  revalidatePath("/treningsplan");
  revalidatePath("/analyse");

  // Check achievements in background
  checkAchievements(user.id).catch(() => {});

  return { sessionId };
}

export async function updateExerciseLog(
  id: string,
  data: Partial<{
    actualSets: number;
    actualReps: number;
    lPhase: string;
    clubSpeed: number;
    environment: number;
    pressLevel: number;
    successRate: number;
    score: number;
    notes: string;
  }>
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  // Verify the exercise belongs to a log owned by this user
  const exercise = await prisma.trainingLogExercise.findFirst({
    where: { id },
    include: {
      TrainingLog: {
        select: { userId: true },
      },
    },
  });

  if (!exercise) throw new Error("Not found");
  if (exercise.TrainingLog.userId !== user.id) throw new Error("Unauthorized");

  await prisma.trainingLogExercise.update({
    where: { id },
    data,
  });

  revalidatePath("/dagbok");
}

export async function addCoachFeedback(
  sessionId: string,
  feedback: string
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  // Check that user is INSTRUCTOR or ADMIN
  if (user.role !== UserRole.INSTRUCTOR && user.role !== UserRole.ADMIN) {
    throw new Error("Kun instruktorer kan legge til tilbakemelding");
  }

  // Verify the session exists
  const session = await prisma.trainingLog.findFirst({
    where: { id: sessionId },
  });

  if (!session) throw new Error("Not found");

  await prisma.trainingLog.update({
    where: { id: sessionId },
    data: {
      coachFeedback: feedback,
      coachId: user.id,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dagbok");
}

export async function getSessionWithExercises(sessionId: string) {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const session = await prisma.trainingLog.findFirst({
    where: {
      id: sessionId,
      // Allow access if user is the owner, or is an instructor/admin
      OR: [
        { userId: user.id },
        ...(user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN
          ? [{}] // Instructors/admins can view all sessions
          : []),
      ],
    },
    include: {
      TrainingPlanSession: {
        select: { id: true, title: true, focusArea: true, durationMinutes: true },
      },
      TrainingLogExercises: {
        orderBy: { sortOrder: "asc" },
      },
      User: {
        select: { id: true, name: true },
      },
    },
  });

  return session;
}
