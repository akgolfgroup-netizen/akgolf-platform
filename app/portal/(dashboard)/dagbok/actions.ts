"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";
import { nanoid } from "nanoid";

export async function getTrainingLogs(month?: Date) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const ref = month ?? new Date();
  const from = startOfMonth(ref);
  const to = endOfMonth(ref);

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select(`
      id,
      date,
      durationMinutes,
      focusArea,
      notes,
      rating,
      TrainingPlanSession (id, title, focusArea, durationMinutes)
    `)
    .eq("userId", user.id)
    .gte("date", from.toISOString())
    .lte("date", to.toISOString())
    .order("date", { ascending: false });

  // Transform to expected format
  return (logs || []).map((log) => ({
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

  const supabase = await createServerSupabase();

  await supabase.from("TrainingLog").insert({
    id: nanoid(),
    updatedAt: new Date().toISOString(),
    userId: user.id,
    planSessionId: data.planSessionId ?? null,
    date: new Date(data.date).toISOString(),
    durationMinutes: data.durationMinutes ?? null,
    focusArea: data.focusArea ?? null,
    exercises: [],
    notes: data.notes ?? null,
    rating: data.rating ?? null,
    deviatedFromPlan: data.deviatedFromPlan ?? false,
    deviationReason: data.deviationReason ?? null,
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

  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (!existing) throw new Error("Not found");

  await supabase
    .from("TrainingLog")
    .update(data)
    .eq("id", id);

  revalidatePath("/dagbok");
}

export async function deleteTrainingLog(id: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (!existing) throw new Error("Not found");

  await supabase.from("TrainingLog").delete().eq("id", id);

  revalidatePath("/dagbok");
  revalidatePath("/analyse");
}

// Returns planSessionIds that have been logged today by the current user
export async function getLoggedSessionIds() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("planSessionId")
    .eq("userId", user.id)
    .gte("date", today.toISOString())
    .lt("date", tomorrow.toISOString())
    .not("planSessionId", "is", null);

  return (logs || []).map((l) => l.planSessionId!);
}

// Quick-log: Repeat last session
export async function repeatLastSession() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const supabase = await createServerSupabase();

  // Get the most recent log
  const { data: lastLog } = await supabase
    .from("TrainingLog")
    .select("focusArea, durationMinutes, exercises")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!lastLog) {
    throw new Error("Ingen tidligere okter funnet");
  }

  // Create new log with same details
  await supabase.from("TrainingLog").insert({
    id: nanoid(),
    updatedAt: new Date().toISOString(),
    userId: user.id,
    date: new Date().toISOString(),
    focusArea: lastLog.focusArea,
    durationMinutes: lastLog.durationMinutes,
    exercises: lastLog.exercises ?? [],
    notes: null,
    rating: null,
    deviatedFromPlan: false,
    deviationReason: null,
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

  const supabase = await createServerSupabase();

  const { data: lastLog } = await supabase
    .from("TrainingLog")
    .select("focusArea, durationMinutes")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

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

  const supabase = await createServerSupabase();
  const sessionId = nanoid();

  // Create TrainingLog and TrainingLogExercises in a transaction using RPC
  const { error } = await supabase.rpc("log_session_with_exercises", {
    p_session_id: sessionId,
    p_user_id: user.id,
    p_plan_session_id: data.planSessionId ?? null,
    p_date: new Date(data.date).toISOString(),
    p_duration_minutes: data.durationMinutes ?? null,
    p_focus_area: data.focusArea ?? null,
    p_notes: data.notes ?? null,
    p_rating: data.rating ?? null,
    p_deviated_from_plan: data.deviatedFromPlan ?? false,
    p_deviation_reason: data.deviationReason ?? null,
    p_primary_l_phase: data.primaryLPhase ?? null,
    p_primary_environment: data.primaryEnvironment ?? null,
    p_primary_press_level: data.primaryPressLevel ?? null,
    p_exercises: data.exercises.map((ex, index) => ({
      id: nanoid(),
      name: ex.name,
      exerciseId: ex.exerciseId ?? null,
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

  if (error) {
    // Fallback: Insert separately if RPC doesn't exist
    const { error: logError } = await supabase.from("TrainingLog").insert({
      id: sessionId,
      updatedAt: new Date().toISOString(),
      userId: user.id,
      planSessionId: data.planSessionId ?? null,
      date: new Date(data.date).toISOString(),
      durationMinutes: data.durationMinutes ?? null,
      focusArea: data.focusArea ?? null,
      exercises: [],
      notes: data.notes ?? null,
      rating: data.rating ?? null,
      deviatedFromPlan: data.deviatedFromPlan ?? false,
      deviationReason: data.deviationReason ?? null,
      primaryLPhase: data.primaryLPhase ?? null,
      primaryEnvironment: data.primaryEnvironment ?? null,
      primaryPressLevel: data.primaryPressLevel ?? null,
    });

    if (logError) throw logError;

    if (data.exercises.length > 0) {
      await supabase.from("TrainingLogExercise").insert(
        data.exercises.map((ex, index) => ({
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
        }))
      );
    }
  }

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

  const supabase = await createServerSupabase();

  // Verify the exercise belongs to a log owned by this user
  const { data: exercise } = await supabase
    .from("TrainingLogExercise")
    .select(`
      id,
      TrainingLog!inner(userId)
    `)
    .eq("id", id)
    .single();

  if (!exercise) throw new Error("Not found");
  if ((exercise.TrainingLog as { userId: string }).userId !== user.id) throw new Error("Unauthorized");

  await supabase
    .from("TrainingLogExercise")
    .update(data)
    .eq("id", id);

  revalidatePath("/dagbok");
}

export async function addCoachFeedback(
  sessionId: string,
  feedback: string
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const supabase = await createServerSupabase();

  // Check that user is INSTRUCTOR or ADMIN
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    throw new Error("Kun instruktorer kan legge til tilbakemelding");
  }

  // Verify the session exists
  const { data: session } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Not found");

  await supabase
    .from("TrainingLog")
    .update({
      coachFeedback: feedback,
      coachId: user.id,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", sessionId);

  revalidatePath("/dagbok");
}

export async function getSessionWithExercises(sessionId: string) {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  // Build query based on user role
  let query = supabase
    .from("TrainingLog")
    .select(`
      *,
      TrainingPlanSession (id, title, focusArea, durationMinutes),
      TrainingLogExercises (*),
      User (id, name)
    `)
    .eq("id", sessionId);

  // Allow access if user is the owner, or is an instructor/admin
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    query = query.eq("userId", user.id);
  }

  const { data: session } = await query.single();

  return session;
}
