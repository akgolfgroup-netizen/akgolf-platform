"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { endOfISOWeek, isWithinInterval } from "date-fns";
import { nanoid } from "nanoid";

// -------------------------------------------------------------------
// Types for exercise data passed from client
// -------------------------------------------------------------------

interface ExerciseProgressData {
  id: string;
  exerciseId?: string;
  name: string;
  completed?: boolean;
  actualReps?: number;
  actualScore?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  sets?: number;
  reps?: number;
  lPhase?: string;
  clubSpeed?: number;
  environment?: number;
  pressLevel?: number;
  playerNotes?: string;
}

// -------------------------------------------------------------------
// Save session progress — creates/updates TrainingLog + exercises
// -------------------------------------------------------------------

export async function saveSessionProgress(
  sessionId: string,
  exercises: ExerciseProgressData[]
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  // Verify session exists
  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, focusArea, durationMinutes")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsokten finnes ikke");

  // Check for existing TrainingLog for this session and user
  const { data: existingLog } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("planSessionId", sessionId)
    .eq("userId", user.id)
    .single();

  const completedCount = exercises.filter((e) => e.completed).length;
  const now = new Date();

  if (existingLog) {
    // Update existing log
    await supabase
      .from("TrainingLog")
      .update({
        exercises: JSON.stringify(exercises),
        durationMinutes: session.durationMinutes,
        focusArea: session.focusArea,
        updatedAt: now.toISOString(),
      })
      .eq("id", existingLog.id);

    // Delete old exercises and insert fresh
    await supabase
      .from("TrainingLogExercise")
      .delete()
      .eq("trainingLogId", existingLog.id);

    if (exercises.length > 0) {
      await supabase.from("TrainingLogExercise").insert(
        exercises.map((e, index) => ({
          id: nanoid(),
          trainingLogId: existingLog.id,
          exerciseId: e.exerciseId ?? null,
          name: e.name,
          plannedReps: e.reps ?? null,
          plannedSets: e.sets ?? null,
          actualReps: e.actualReps ?? null,
          lPhase: e.lPhase ?? null,
          clubSpeed: e.clubSpeed ?? null,
          environment: e.environment ?? null,
          pressLevel: e.pressLevel ?? null,
          score: e.actualScore ?? null,
          notes: e.playerNotes ?? null,
          sortOrder: index,
        }))
      );
    }
  } else {
    // Create new log
    const logId = nanoid();
    await supabase.from("TrainingLog").insert({
      id: logId,
      userId: user.id,
      planSessionId: sessionId,
      date: now.toISOString(),
      completedAt: now.toISOString(),
      durationMinutes: session.durationMinutes,
      focusArea: session.focusArea,
      exercises: JSON.stringify(exercises),
      updatedAt: now.toISOString(),
    });

    if (exercises.length > 0) {
      await supabase.from("TrainingLogExercise").insert(
        exercises.map((e, index) => ({
          id: nanoid(),
          trainingLogId: logId,
          exerciseId: e.exerciseId ?? null,
          name: e.name,
          plannedReps: e.reps ?? null,
          plannedSets: e.sets ?? null,
          actualReps: e.actualReps ?? null,
          lPhase: e.lPhase ?? null,
          clubSpeed: e.clubSpeed ?? null,
          environment: e.environment ?? null,
          pressLevel: e.pressLevel ?? null,
          score: e.actualScore ?? null,
          notes: e.playerNotes ?? null,
          sortOrder: index,
        }))
      );
    }
  }

  return { success: true, completedCount, totalCount: exercises.length };
}

// -------------------------------------------------------------------
// Add exercise to session — updates exercises JSON in TrainingPlanSession
// -------------------------------------------------------------------

export async function addExerciseToSession(
  sessionId: string,
  exercise: {
    id: string;
    name: string;
    description?: string;
    pyramid: string;
    area: string;
    lPhase?: string;
  }
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  // Get current exercises
  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, exercises")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsokten finnes ikke");

  const currentExercises = Array.isArray(session.exercises)
    ? (session.exercises as string[])
    : [];

  // Add new exercise name to the list
  const updatedExercises = [...currentExercises, exercise.name];

  await supabase
    .from("TrainingPlanSession")
    .update({ exercises: JSON.stringify(updatedExercises) })
    .eq("id", sessionId);

  return { success: true };
}

export async function getActivePlan(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      *,
      TrainingPlanWeek (
        *,
        TrainingPlanSession (*)
      )
    `)
    .eq("studentId", id)
    .eq("isActive", true)
    .single();

  return plan;
}

export async function getCurrentWeekSessions(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;
  const now = new Date();
  const weekEnd = endOfISOWeek(now);

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      id,
      TrainingPlanWeek (
        id,
        weekStart,
        TrainingPlanSession (
          *,
          TrainingLog (id)
        )
      )
    `)
    .eq("studentId", id)
    .eq("isActive", true)
    .lte("TrainingPlanWeek.weekStart", weekEnd.toISOString())
    .single();

  if (!plan) return [];

  interface SessionFromSupabase {
    id: string;
    dayOfWeek: number;
    title: string;
    durationMinutes: number;
    focusArea: string | null;
    exercises: unknown;
    TrainingLog: { id: string }[];
    [key: string]: unknown;
  }

  const weeks = (plan.TrainingPlanWeek as unknown as { weekStart: string; TrainingPlanSession: SessionFromSupabase[] }[]) || [];

  // Find week that contains today
  const currentWeek = weeks.find((w) =>
    isWithinInterval(now, {
      start: new Date(w.weekStart),
      end: endOfISOWeek(new Date(w.weekStart)),
    })
  );

  return currentWeek?.TrainingPlanSession ?? [];
}
