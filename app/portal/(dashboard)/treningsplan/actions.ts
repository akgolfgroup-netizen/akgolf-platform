"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { endOfISOWeek, isWithinInterval, addWeeks, startOfISOWeek } from "date-fns";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export interface CurrentPeriodization {
  id: string;
  periodType: string;
  label: string | null;
  startDate: string;
  endDate: string;
  focusAllocation: Record<string, number> | null;
  weekNumber: number;
  totalWeeks: number;
}

export async function getCurrentPeriodization(studentId?: string): Promise<CurrentPeriodization | null> {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;
  const now = new Date().toISOString();

  const { data: period } = await supabase
    .from("PeriodizationPeriod")
    .select("id, periodType, label, startDate, endDate, focusAllocation")
    .or(`studentId.is.null,studentId.eq.${id}`)
    .lte("startDate", now)
    .gte("endDate", now)
    .order("startDate", { ascending: false })
    .limit(1)
    .single();

  if (!period) return null;

  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  const totalWeeks = Math.max(1, Math.round((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const currentWeek = Math.max(1, Math.min(totalWeeks, Math.floor((new Date().getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1));

  return {
    id: period.id,
    periodType: period.periodType,
    label: period.label,
    startDate: period.startDate,
    endDate: period.endDate,
    focusAllocation: period.focusAllocation as Record<string, number> | null,
    weekNumber: currentWeek,
    totalWeeks,
  };
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

// -------------------------------------------------------------------
// Manual training plan creation
// -------------------------------------------------------------------

const manualSessionSchema = z.object({
  dayOfWeek: z.number().int().min(1).max(7),
  title: z.string().min(1, "Tittel er påkrevd").max(200),
  description: z.string().max(1000).optional(),
  durationMinutes: z.number().int().min(1).max(480).optional(),
  focusArea: z.string().max(100).optional(),
});

const manualWeekSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  focus: z.string().max(200).optional(),
  volumeLabel: z.string().max(100).optional(),
  sessions: z.array(manualSessionSchema).min(0).max(14),
});

const manualPlanSchema = z.object({
  studentId: z.string().min(1).optional(),
  title: z.string().min(1, "Tittel er påkrevd").max(200),
  description: z.string().max(1000).optional(),
  goals: z.string().max(2000).optional(),
  periodType: z.enum(["PREPARATION", "COMPETITION", "RECOVERY", "OFF_SEASON"]),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ugyldig startdato",
  }),
  weeks: z.array(manualWeekSchema).min(1, "Planen må ha minst én uke").max(52),
});

export type ManualPlanInput = z.infer<typeof manualPlanSchema>;

export async function createManualPlan(input: ManualPlanInput) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const parsed = manualPlanSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    throw new Error(firstError?.message ?? "Ugyldig input");
  }

  const data = parsed.data;
  const supabase = await createServerSupabase();

  const studentId = data.studentId ?? user.id;
  const startDate = new Date(data.startDate);
  const endDate = addWeeks(startDate, data.weeks.length);

  // Deaktiver eksisterende aktive planer for studenten
  await supabase
    .from("TrainingPlan")
    .update({ isActive: false })
    .eq("studentId", studentId)
    .eq("isActive", true);

  // Opprett plan
  const planId = nanoid();
  const now = new Date().toISOString();

  const { error: planError } = await supabase.from("TrainingPlan").insert({
    id: planId,
    studentId,
    createdById: user.id,
    title: data.title,
    description: data.description ?? null,
    goals: data.goals ?? null,
    periodType: data.periodType,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    isActive: true,
    aiGenerated: false,
    updatedAt: now,
  });

  if (planError) {
    throw new Error(`Kunne ikke opprette plan: ${planError.message}`);
  }

  // Opprett uker og økter
  for (const week of data.weeks) {
    const weekId = nanoid();
    const weekStart = startOfISOWeek(addWeeks(startDate, week.weekNumber - 1));

    const { error: weekError } = await supabase.from("TrainingPlanWeek").insert({
      id: weekId,
      planId,
      weekNumber: week.weekNumber,
      weekStart: weekStart.toISOString().slice(0, 10),
      focus: week.focus ?? null,
      volumeLabel: week.volumeLabel ?? null,
    });

    if (weekError) {
      throw new Error(`Kunne ikke opprette uke ${week.weekNumber}: ${weekError.message}`);
    }

    if (week.sessions.length > 0) {
      const sessionsToInsert = week.sessions.map((session, idx) => ({
        id: nanoid(),
        weekId,
        dayOfWeek: session.dayOfWeek,
        title: session.title,
        description: session.description ?? null,
        durationMinutes: session.durationMinutes ?? null,
        focusArea: session.focusArea ?? null,
        exercises: [],
        sortOrder: idx,
      }));

      const { error: sessionError } = await supabase
        .from("TrainingPlanSession")
        .insert(sessionsToInsert);

      if (sessionError) {
        throw new Error(`Kunne ikke opprette økter: ${sessionError.message}`);
      }
    }
  }

  revalidatePath("/portal/treningsplan");
  return { success: true, planId };
}

// -------------------------------------------------------------------
// Toggle session complete — quick mark from week view
// -------------------------------------------------------------------

export async function toggleSessionComplete(sessionId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  // Verify session exists
  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, focusArea, durationMinutes, exercises")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsokten finnes ikke");

  // Check for existing log
  const { data: existingLog } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("planSessionId", sessionId)
    .eq("userId", user.id)
    .single();

  const now = new Date();

  if (existingLog) {
    // Already completed — remove log to "uncomplete"
    await supabase
      .from("TrainingLogExercise")
      .delete()
      .eq("trainingLogId", existingLog.id);

    await supabase
      .from("TrainingLog")
      .delete()
      .eq("id", existingLog.id);

    revalidatePath("/portal/treningsplan");
    return { completed: false };
  }

  // Not completed — create log
  const logId = nanoid();
  const exerciseData = Array.isArray(session.exercises) ? session.exercises : [];

  await supabase.from("TrainingLog").insert({
    id: logId,
    userId: user.id,
    planSessionId: sessionId,
    date: now.toISOString(),
    completedAt: now.toISOString(),
    durationMinutes: session.durationMinutes,
    focusArea: session.focusArea,
    exercises: JSON.stringify(
      exerciseData.map((name: unknown, i: number) => ({
        id: `ex-${i}`,
        name: typeof name === "string" ? name : `Ovelse ${i + 1}`,
        completed: true,
      }))
    ),
    updatedAt: now.toISOString(),
  });

  revalidatePath("/portal/treningsplan");
  return { completed: true };
}

// -------------------------------------------------------------------
// V2: Update session time (drag resize)
// -------------------------------------------------------------------

export async function updateSessionTime(
  sessionId: string,
  startH: number,
  startM: number,
  durationMinutes: number
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, exercises")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsokten finnes ikke");

  // Check if this is a group session
  const rawExercises = Array.isArray(session.exercises) ? session.exercises : [];
  if (rawExercises.some((ex: unknown) => typeof ex === "object" && ex !== null && (ex as Record<string, unknown>)._groupSessionId)) {
    throw new Error("Gruppeøkter kan ikke endres. Kontakt coach for endringer.");
  }

  // Store startH/startM in exercises JSON metadata
  const currentExercises = Array.isArray(session.exercises) ? session.exercises : [];
  const meta = { _startH: startH, _startM: startM };

  await supabase
    .from("TrainingPlanSession")
    .update({
      durationMinutes,
      exercises: JSON.stringify(
        Array.isArray(currentExercises) && currentExercises.length > 0
          ? currentExercises.map((ex: unknown, i: number) =>
              i === 0 ? { ...(typeof ex === "object" && ex !== null ? ex : {}), ...meta } : ex
            )
          : [meta]
      ),
    })
    .eq("id", sessionId);

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// V2: Move session to another day (drag move)
// -------------------------------------------------------------------

export async function moveSessionToDay(
  sessionId: string,
  newDayOfWeek: number,
  startH?: number,
  startM?: number
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, dayOfWeek, exercises")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsokten finnes ikke");

  // Check if this is a group session
  const rawExercises = Array.isArray(session.exercises) ? session.exercises : [];
  if (rawExercises.some((ex: unknown) => typeof ex === "object" && ex !== null && (ex as Record<string, unknown>)._groupSessionId)) {
    throw new Error("Gruppeøkter kan ikke flyttes. Kontakt coach for endringer.");
  }

  const updateData: Record<string, unknown> = {
    dayOfWeek: newDayOfWeek,
  };

  // Optionally update start time metadata
  if (startH !== undefined && startM !== undefined) {
    const currentExercises = Array.isArray(session.exercises) ? session.exercises : [];
    const meta = { _startH: startH, _startM: startM };
    updateData.exercises = JSON.stringify(
      Array.isArray(currentExercises) && currentExercises.length > 0
        ? currentExercises.map((ex: unknown, i: number) =>
            i === 0 ? { ...(typeof ex === "object" && ex !== null ? ex : {}), ...meta } : ex
          )
        : [meta]
    );
  }

  await supabase
    .from("TrainingPlanSession")
    .update(updateData)
    .eq("id", sessionId);

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// V2: Delete session
// -------------------------------------------------------------------

export async function deleteSession(sessionId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  // Check if this is a group session
  const { data: sessionCheck } = await supabase
    .from("TrainingPlanSession")
    .select("exercises")
    .eq("id", sessionId)
    .single();

  if (sessionCheck?.exercises) {
    const exercises = Array.isArray(sessionCheck.exercises)
      ? (sessionCheck.exercises as Record<string, unknown>[])
      : [];
    if (exercises.some((ex) => ex._groupSessionId)) {
      throw new Error("Gruppeøkter kan ikke slettes. Kontakt coach for endringer.");
    }
  }

  // Delete associated training logs first
  await supabase
    .from("TrainingLogExercise")
    .delete()
    .in(
      "trainingLogId",
      (
        await supabase
          .from("TrainingLog")
          .select("id")
          .eq("planSessionId", sessionId)
      ).data?.map((l: { id: string }) => l.id) || []
    );

  await supabase
    .from("TrainingLog")
    .delete()
    .eq("planSessionId", sessionId);

  await supabase
    .from("TrainingPlanSession")
    .delete()
    .eq("id", sessionId);

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// Create single session for current week (B-1.2)
// -------------------------------------------------------------------

export async function createSessionForWeek(data: {
  weekOffset: number;
  dayOfWeek: number;
  title: string;
  description?: string;
  durationMinutes?: number;
  focusArea?: string;
  startH?: number;
  startM?: number;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();
  const now = new Date();
  const targetDate = addWeeks(now, data.weekOffset);
  const weekStart = startOfISOWeek(targetDate);

  // Finn aktiv plan
  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select("id, TrainingPlanWeek(id, weekStart)")
    .eq("studentId", user.id)
    .eq("isActive", true)
    .single();

  if (!plan) throw new Error("Ingen aktiv treningsplan. Opprett en plan først.");

  interface WeekRow {
    id: string;
    weekStart: string;
  }

  const weeks = (plan.TrainingPlanWeek as unknown as WeekRow[]) || [];
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  let weekId = weeks.find(
    (w) => w.weekStart === weekStartStr
  )?.id;

  // Hvis uken ikke finnes, opprett den
  if (!weekId) {
    weekId = nanoid();
    const { error: weekError } = await supabase.from("TrainingPlanWeek").insert({
      id: weekId,
      planId: plan.id,
      weekNumber: parseInt(format(targetDate, "I")),
      weekStart: weekStartStr,
    });
    if (weekError) {
      throw new Error(`Kunne ikke opprette uke: ${weekError.message}`);
    }
  }

  // Bygg exercises JSON med starttids-metadata
  const exercises: Record<string, unknown>[] = [];
  if (data.startH !== undefined && data.startM !== undefined) {
    exercises.push({
      _startH: data.startH,
      _startM: data.startM,
    });
  }

  // Opprett økt
  const sessionId = nanoid();
  const { error: sessionError } = await supabase
    .from("TrainingPlanSession")
    .insert({
      id: sessionId,
      weekId,
      dayOfWeek: data.dayOfWeek,
      title: data.title,
      description: data.description ?? null,
      durationMinutes: data.durationMinutes ?? 60,
      focusArea: data.focusArea ?? null,
      exercises,
      sortOrder: 0,
    });

  if (sessionError) {
    throw new Error(`Kunne ikke opprette økt: ${sessionError.message}`);
  }

  revalidatePath("/portal/treningsplan");
  return { success: true, sessionId };
}

// -------------------------------------------------------------------
// Update session details (B-1.5)
// -------------------------------------------------------------------

export async function updateSession(
  sessionId: string,
  data: {
    title?: string;
    description?: string;
    durationMinutes?: number;
    focusArea?: string;
  }
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();

  const { data: session } = await supabase
    .from("TrainingPlanSession")
    .select("id, exercises")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Treningsøkten finnes ikke");

  // Check if this is a group session
  const exercises = Array.isArray(session.exercises)
    ? (session.exercises as Record<string, unknown>[])
    : [];
  if (exercises.some((ex) => ex._groupSessionId)) {
    throw new Error("Gruppeøkter kan ikke endres. Kontakt coach for endringer.");
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.durationMinutes !== undefined)
    updateData.durationMinutes = data.durationMinutes;
  if (data.focusArea !== undefined) updateData.focusArea = data.focusArea;

  await supabase
    .from("TrainingPlanSession")
    .update(updateData)
    .eq("id", sessionId);

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// V2: Get all sessions for a week as V2 events
// -------------------------------------------------------------------

interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  exercises: V2ExerciseData[];
  done: boolean;
  isGroupSession?: boolean;
  groupName?: string | null;
}

interface V2ExerciseData {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  cs: string | null;
  m: string | null;
  pr: string | null;
  pFrom: string | null;
  pTo: string | null;
  slagFocus: string[];
  baller: number;
  bevegelser: number;
}

export async function getWeekEvents(weekOffset = 0): Promise<V2Event[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const now = new Date();
  const targetDate = addWeeks(now, weekOffset);

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
    .eq("studentId", user.id)
    .eq("isActive", true)
    .single();

  if (!plan) return [];

  interface SessionRow {
    id: string;
    dayOfWeek: number;
    title: string;
    durationMinutes: number | null;
    focusArea: string | null;
    exercises: unknown;
    TrainingLog: { id: string }[];
  }

  interface WeekRow {
    weekStart: string;
    TrainingPlanSession: SessionRow[];
  }

  const weeks = (plan.TrainingPlanWeek as unknown as WeekRow[]) || [];

  // Find week that contains target date
  const currentWeek = weeks.find((w) =>
    isWithinInterval(targetDate, {
      start: new Date(w.weekStart),
      end: endOfISOWeek(new Date(w.weekStart)),
    })
  );

  if (!currentWeek) return [];

  const weekStartDate = startOfISOWeek(new Date(currentWeek.weekStart));

  return currentWeek.TrainingPlanSession.map((session) => {
    const sessionDate = new Date(weekStartDate);
    sessionDate.setDate(sessionDate.getDate() + session.dayOfWeek - 1);
    const dateStr = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, "0")}-${String(sessionDate.getDate()).padStart(2, "0")}`;

    // Parse exercises JSON for start time metadata and exercise data
    const rawExercises = Array.isArray(session.exercises)
      ? (session.exercises as Record<string, unknown>[])
      : [];

    let startH = 9;
    let startM = 0;
    const v2Exercises: V2ExerciseData[] = [];

    for (const ex of rawExercises) {
      if (ex._startH !== undefined) {
        startH = Number(ex._startH);
        startM = Number(ex._startM) || 0;
      }
      if (ex.name && typeof ex.name === "string") {
        v2Exercises.push({
          id: (ex.id as string) || Math.random().toString(36).slice(2, 9),
          name: ex.name as string,
          pyramid: (ex.pyramid as string) || inferPyramidFromFocus(session.focusArea),
          area: (ex.area as string) || "",
          lPhase: (ex.lPhase as string) || null,
          cs: (ex.cs as string) || null,
          m: (ex.m as string) || null,
          pr: (ex.pr as string) || null,
          pFrom: (ex.pFrom as string) || null,
          pTo: (ex.pTo as string) || null,
          slagFocus: Array.isArray(ex.slagFocus) ? (ex.slagFocus as string[]) : [],
          baller: 0,
          bevegelser: 0,
        });
      }
    }

    // Check if this is a group session
    const groupMeta = rawExercises.find((ex) => ex._groupSessionId);
    const isGroupSession = !!groupMeta;
    const groupName = groupMeta?._groupName as string | undefined;

    return {
      id: session.id,
      date: dateStr,
      startH,
      startM,
      dur: session.durationMinutes || 60,
      title: session.title,
      focus: inferPyramidFromFocus(session.focusArea),
      exercises: v2Exercises,
      done: session.TrainingLog?.length > 0,
      isGroupSession,
      groupName: groupName ?? null,
    };
  });
}

function inferPyramidFromFocus(focusArea: string | null): string {
  if (!focusArea) return "TEK";
  const lower = focusArea.toLowerCase();
  if (["styrke", "kondisjon", "mobilitet", "eksplosivitet", "gym"].some((k) => lower.includes(k))) return "FYS";
  if (["sving", "teknikk", "driver", "jern", "full swing"].some((k) => lower.includes(k))) return "TEK";
  if (["putting", "putt", "chip", "pitch", "bunker", "naerspill", "approach", "range"].some((k) => lower.includes(k))) return "SLAG";
  if (["bane", "strategi", "management", "9 hull", "18 hull", "spill"].some((k) => lower.includes(k))) return "SPILL";
  if (["turnering", "test", "konkurranse", "benchmark"].some((k) => lower.includes(k))) return "TURN";
  return "TEK";
}

// -------------------------------------------------------------------
// V2: Log live session with exercises
// -------------------------------------------------------------------

export async function logLiveSession(data: {
  durationMinutes: number;
  focusArea: string | null;
  exercises: V2ExerciseData[];
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const supabase = await createServerSupabase();
  const now = new Date();
  const logId = nanoid();

  await supabase.from("TrainingLog").insert({
    id: logId,
    userId: user.id,
    planSessionId: null,
    date: now.toISOString(),
    completedAt: now.toISOString(),
    durationMinutes: data.durationMinutes,
    focusArea: data.focusArea,
    exercises: JSON.stringify(data.exercises),
    updatedAt: now.toISOString(),
  });

  if (data.exercises.length > 0) {
    await supabase.from("TrainingLogExercise").insert(
      data.exercises.map((e, index) => ({
        id: nanoid(),
        trainingLogId: logId,
        exerciseId: null,
        name: e.name,
        plannedReps: null,
        plannedSets: null,
        actualReps: e.baller || null,
        lPhase: e.lPhase ?? null,
        clubSpeed: null,
        environment: e.m ? parseInt(e.m.replace("M", "")) : null,
        pressLevel: e.pr ? parseInt(e.pr.replace("PR", "")) : null,
        score: null,
        notes: null,
        sortOrder: index,
      }))
    );
  }

  revalidatePath("/portal/treningsplan");
  return { success: true, logId };
}


// -------------------------------------------------------------------
// Plan deviation analysis — auto-adjustment trigger (B-1.7)
// -------------------------------------------------------------------

export interface PlanDeviationAnalysis {
  adherencePct: number;
  avgRating: number | null;
  deviationCount: number;
  plannedHours: number;
  actualHours: number;
  recommendation: "reduce" | "increase" | "adjust" | "none";
  message: string;
  detailMessage: string;
}

export async function analyzePlanDeviation(): Promise<PlanDeviationAnalysis | null> {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  const since = new Date();
  since.setDate(since.getDate() - 14);

  // Fetch TrainingLog for last 14 days
  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("durationMinutes, rating, deviatedFromPlan, date")
    .eq("userId", user.id)
    .gte("date", since.toISOString())
    .order("date", { ascending: false });

  // Fetch active plan with sessions for last 2 weeks
  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select("id, TrainingPlanWeek (weekStart, TrainingPlanSession (durationMinutes))")
    .eq("studentId", user.id)
    .eq("isActive", true)
    .single();

  if (!plan) return null;

  // Calculate actual hours from logs
  const actualMinutes = (logs ?? []).reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);
  const actualHours = actualMinutes / 60;

  // Calculate planned hours from sessions in last 2 weeks
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const weeks = (plan.TrainingPlanWeek as unknown as { weekStart: string; TrainingPlanSession: { durationMinutes: number | null }[] }[]) || [];
  const plannedMinutes = weeks
    .filter((w) => new Date(w.weekStart) >= twoWeeksAgo)
    .flatMap((w) => w.TrainingPlanSession)
    .reduce((sum, s) => sum + (s.durationMinutes ?? 60), 0);
  const plannedHours = plannedMinutes / 60;

  // Calculate adherence: planned sessions vs logged sessions with planSessionId
  const { data: plannedSessions } = await supabase
    .from("TrainingPlanSession")
    .select("id, weekId!inner(weekStart)")
    .gte("weekId.weekStart", twoWeeksAgo.toISOString().slice(0, 10))
    .eq("weekId.planId", plan.id);

  const plannedCount = plannedSessions?.length ?? 0;
  const completedCount = plannedCount > 0
    ? (logs ?? []).filter((log) => log.planSessionId && plannedSessions?.some((ps) => ps.id === log.planSessionId)).length
    : 0;
  const adherencePct = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

  // Average rating
  const ratings = (logs ?? []).map((l) => l.rating).filter((r): r is number => r != null);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  // Deviation count
  const deviationCount = (logs ?? []).filter((l) => l.deviatedFromPlan).length;

  // Determine recommendation
  let recommendation: PlanDeviationAnalysis["recommendation"] = "none";
  let message = "";
  let detailMessage = "";

  if (adherencePct < 40 && actualHours < plannedHours * 0.5) {
    recommendation = "reduce";
    message = "Planen er for ambisiøs";
    detailMessage = `Du har fulgt ${adherencePct}% av planen siste 2 uker og trent ${actualHours.toFixed(1)}t av ${plannedHours.toFixed(1)}t planlagt. Vil du redusere volumet med ca. 20%?`;
  } else if (adherencePct < 40 && actualHours > plannedHours * 1.5) {
    recommendation = "increase";
    message = "Du trener mer enn planlagt!";
    detailMessage = `Du har trent ${actualHours.toFixed(1)}t mot ${plannedHours.toFixed(1)}t planlagt. Vil du øke volumet i planen?`;
  } else if (adherencePct >= 40 && adherencePct < 70) {
    recommendation = "adjust";
    message = "Du er på vei";
    detailMessage = `Du har fulgt ${adherencePct}% av planen siste 2 uker. Vil du justere planen til din timeplan?`;
  } else if (adherencePct >= 80) {
    recommendation = "none";
    message = "Bra jobbet!";
    detailMessage = "Du følger planen godt. Fortsett som planlagt!";
  }

  return {
    adherencePct,
    avgRating,
    deviationCount,
    plannedHours,
    actualHours,
    recommendation,
    message,
    detailMessage,
  };
}
