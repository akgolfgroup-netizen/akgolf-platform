"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";
import { nanoid } from "nanoid";
import { z } from "zod";

// --- Zod-skjemaer for validering ---

const VALID_FOCUS_AREAS = [
  "TEE_TOTAL",
  "APPROACH",
  "SHORT_GAME",
  "PUTTING",
  "DRIVING",
  "IRON_PLAY",
  "CHIPPING",
  "PITCHING",
  "BUNKER",
  "COURSE_MANAGEMENT",
  "MENTAL",
  "FITNESS",
  "OTHER",
] as const;

const logSessionSchema = z.object({
  planSessionId: z.string().min(1).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ugyldig datoformat",
  }),
  durationMinutes: z
    .number()
    .int("Varighet må være et heltall")
    .min(1, "Varighet må være minst 1 minutt")
    .max(480, "Varighet kan ikke overstige 480 minutter (8 timer)")
    .optional(),
  focusArea: z
    .string()
    .refine((val) => VALID_FOCUS_AREAS.includes(val as (typeof VALID_FOCUS_AREAS)[number]), {
      message: "Ugyldig fokusområde",
    })
    .optional(),
  notes: z.string().max(2000, "Notater kan ikke overstige 2000 tegn").optional(),
  rating: z
    .number()
    .int("Vurdering må være et heltall")
    .min(1, "Vurdering må være mellom 1 og 10")
    .max(10, "Vurdering må være mellom 1 og 10")
    .optional(),
  deviatedFromPlan: z.boolean().optional(),
  deviationReason: z.string().max(500, "Avviksgrunn kan ikke overstige 500 tegn").optional(),
});

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

export async function logSession(input: {
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

  const parsed = logSessionSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    throw new Error(firstError?.message ?? "Ugyldig input");
  }

  const data = parsed.data;
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

// Quick-log: 1-click session by focus area
export async function quickLogSession(focusArea: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  if (!VALID_FOCUS_AREAS.includes(focusArea as (typeof VALID_FOCUS_AREAS)[number])) {
    throw new Error("Ugyldig fokusomrade");
  }

  const supabase = await createServerSupabase();

  const sessionId = nanoid();

  await supabase.from("TrainingLog").insert({
    id: sessionId,
    updatedAt: new Date().toISOString(),
    userId: user.id,
    date: new Date().toISOString(),
    focusArea,
    durationMinutes: 60,
    exercises: [],
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

  return { success: true, focusArea, sessionId };
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

const exerciseInputSchema = z.object({
  exerciseId: z.string().min(1).optional(),
  name: z.string().min(1, "Øvelsesnavn er påkrevd").max(200),
  plannedSets: z.number().int().min(0).max(100).optional(),
  plannedReps: z.number().int().min(0).max(1000).optional(),
  actualSets: z.number().int().min(0).max(100).optional(),
  actualReps: z.number().int().min(0).max(1000).optional(),
  lPhase: z.string().max(50).optional(),
  clubSpeed: z.number().min(0).max(250).optional(),
  environment: z.number().int().min(1).max(10).optional(),
  pressLevel: z.number().int().min(1).max(10).optional(),
  successRate: z.number().min(0).max(100).optional(),
  score: z.number().min(0).max(1000).optional(),
  notes: z.string().max(1000).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const sessionWithExercisesSchema = logSessionSchema.extend({
  primaryLPhase: z.string().max(50).optional(),
  primaryEnvironment: z.number().int().min(1).max(10).optional(),
  primaryPressLevel: z.number().int().min(1).max(10).optional(),
  exercises: z.array(exerciseInputSchema).max(50, "Maks 50 øvelser per økt"),
});

type SessionWithExercisesInput = z.infer<typeof sessionWithExercisesSchema>;

export async function logSessionWithExercises(input: SessionWithExercisesInput) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const parsed = sessionWithExercisesSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    throw new Error(firstError?.message ?? "Ugyldig input");
  }

  const data = parsed.data;

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
  const trainingLogArr = exercise.TrainingLog as unknown as Array<{ userId: string }>;
  const trainingLog = trainingLogArr?.[0];
  if (trainingLog?.userId !== user.id) throw new Error("Unauthorized");

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
