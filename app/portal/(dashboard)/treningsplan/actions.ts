"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { endOfISOWeek, isWithinInterval, addWeeks, startOfISOWeek, format, addDays } from "date-fns";
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
    .maybeSingle();

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
    ? (session.exercises as Array<string | Record<string, unknown>>)
    : [];

  const newExerciseEntry: Record<string, unknown> = {
    id: nanoid(),
    exerciseId: exercise.id,
    name: exercise.name,
    pyramid: exercise.pyramid,
    area: exercise.area,
    lPhase: exercise.lPhase ?? null,
    description: exercise.description ?? null,
    addedAt: new Date().toISOString(),
  };

  const updatedExercises = [...currentExercises, newExerciseEntry];

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
      exerciseData.map((entry: unknown, i: number) => {
        if (typeof entry === "string") {
          return { id: `ex-${i}`, name: entry, completed: true };
        }
        if (entry && typeof entry === "object") {
          const obj = entry as Record<string, unknown>;
          const name = typeof obj.name === "string" ? obj.name : `Ovelse ${i + 1}`;
          return { id: `ex-${i}`, name, completed: true };
        }
        return { id: `ex-${i}`, name: `Ovelse ${i + 1}`, completed: true };
      })
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
      ? (sessionCheck.exercises as Array<string | Record<string, unknown>>)
      : [];
    if (
      exercises.some(
        (ex) => typeof ex === "object" && ex !== null && "_groupSessionId" in ex,
      )
    ) {
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
  facilityId?: string;
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
      facilityId: data.facilityId ?? null,
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
    facilityId?: string | null;
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
    ? (session.exercises as Array<string | Record<string, unknown>>)
    : [];
  if (
    exercises.some(
      (ex) => typeof ex === "object" && ex !== null && "_groupSessionId" in ex,
    )
  ) {
    throw new Error("Gruppeøkter kan ikke endres. Kontakt coach for endringer.");
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.durationMinutes !== undefined)
    updateData.durationMinutes = data.durationMinutes;
  if (data.focusArea !== undefined) updateData.focusArea = data.focusArea;
  if (data.facilityId !== undefined) updateData.facilityId = data.facilityId;

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

    // Parse exercises JSON for start time metadata and exercise data.
    // Format kan være string (legacy) eller objekt (nytt fra P1.2).
    const rawExercises = Array.isArray(session.exercises)
      ? (session.exercises as Array<string | Record<string, unknown>>)
      : [];

    let startH = 9;
    let startM = 0;
    const v2Exercises: V2ExerciseData[] = [];

    for (const ex of rawExercises) {
      if (typeof ex === "string") {
        v2Exercises.push({
          id: Math.random().toString(36).slice(2, 9),
          name: ex,
          pyramid: inferPyramidFromFocus(session.focusArea),
          area: "",
          lPhase: null,
          cs: null,
          m: null,
          pr: null,
          pFrom: null,
          pTo: null,
          slagFocus: [],
          baller: 0,
          bevegelser: 0,
        });
        continue;
      }
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

    // Check if this is a group session (kun objekt-format)
    const groupMeta = rawExercises.find(
      (ex): ex is Record<string, unknown> =>
        typeof ex === "object" && ex !== null && "_groupSessionId" in ex,
    );
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
  plannedSessionsThisWeek: number;
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
    .select("durationMinutes, rating, deviatedFromPlan, date, planSessionId")
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

  // Sjekk om bruker har avvist forslaget for denne planen (Epic 10)
  const activeDismiss = await prisma.dismissedAdjustment.findFirst({
    where: {
      userId: user.id,
      planId: plan.id,
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  });
  if (activeDismiss) {
    return null;
  }

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

  // Count planned sessions for current week for display
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const plannedSessionsThisWeek = weeks
    .filter((w) => {
      const ws = new Date(w.weekStart);
      return ws >= startOfWeek && ws < endOfWeek;
    })
    .flatMap((w) => w.TrainingPlanSession).length;

  return {
    adherencePct,
    avgRating,
    deviationCount,
    plannedHours,
    actualHours,
    plannedSessionsThisWeek,
    recommendation,
    message,
    detailMessage,
  };
}


// -------------------------------------------------------------------
// Adjust plan volume — scale upcoming sessions by factor
// -------------------------------------------------------------------

export async function adjustPlanVolume(factor: number): Promise<{ success: boolean; adjustedCount: number; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  // Use Prisma for reliable relational queries
  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: user.id, isActive: true },
    include: {
      TrainingPlanWeek: {
        where: {
          weekStart: { gte: new Date() },
        },
        include: {
          TrainingPlanSession: true,
        },
      },
    },
  });

  if (!plan) {
    return { success: false, adjustedCount: 0, error: "Ingen aktiv plan funnet" };
  }

  const sessions = plan.TrainingPlanWeek.flatMap((w) => w.TrainingPlanSession);

  if (sessions.length === 0) {
    return { success: false, adjustedCount: 0, error: "Ingen kommende økter å justere" };
  }

  let adjustedCount = 0;

  for (const session of sessions) {
    const currentDur = session.durationMinutes ?? 60;
    const newDur = Math.max(15, Math.round(currentDur * factor));

    if (newDur !== currentDur) {
      await prisma.trainingPlanSession.update({
        where: { id: session.id },
        data: { durationMinutes: newDur },
      });
      adjustedCount++;
    }
  }

  revalidatePath("/portal/treningsplan");
  return { success: adjustedCount > 0, adjustedCount };
}

// -------------------------------------------------------------------
// createPlanFromChoice — wizard-valg fra spilleren
// (manual / recommended / template) + varighet
// -------------------------------------------------------------------

import {
  type TemplateId,
  getTemplate,
} from "@/lib/portal/training/standard-templates";
import {
  getActiveTemplates,
  getTemplateById,
} from "@/lib/portal/training/template-service";
import { generateTrainingPlan } from "@/lib/portal/ai/training-plan";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { detectSessionConflicts } from "@/lib/portal/training/conflict-detector";

export type PlanCreationMode = "MANUAL" | "RECOMMENDED" | "TEMPLATE";

/**
 * AK-pyramide-fordeling i prosent (sum 100). Spillerstyrt — sendes til AI
 * som overstyrt fordeling og lagres på TrainingPlan.pyramidDistribution.
 */
export type PyramidDistributionInput = {
  FYS: number;
  TEK: number;
  SLAG: number;
  SPILL: number;
  TURN: number;
};

export interface CreatePlanFromChoiceInput {
  mode: PlanCreationMode;
  durationWeeks: 1 | 4 | 8 | 12;
  templateId?: TemplateId;
  title?: string;
  startDate?: string;
  /** Plan-spesifikk pyramide-fordeling (kun for RECOMMENDED). */
  pyramidDistribution?: PyramidDistributionInput;
}

export async function createPlanFromChoice(input: CreatePlanFromChoiceInput) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const startDate = input.startDate
    ? new Date(input.startDate)
    : startOfISOWeek(new Date());

  // ---- TEMPLATE: bygg plan fra forhåndsdefinert mal ----
  if (input.mode === "TEMPLATE") {
    if (!input.templateId) throw new Error("templateId mangler for TEMPLATE-mode");
    const template = await getTemplateById(input.templateId);
    if (!template) throw new Error(`Ukjent mal: ${input.templateId}`);

    const weeks = Array.from({ length: input.durationWeeks }, (_, i) => ({
      weekNumber: i + 1,
      focus: (template.weeklyFocusTemplate ?? "").replace("{n}", String(i + 1)),
      sessions: template.weekPattern.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        title: s.title,
        durationMinutes: s.durationMinutes,
        focusArea: s.focusArea,
        description: s.description,
      })),
    }));

    return createManualPlan({
      title: input.title ?? template.title,
      description: template.description,
      periodType: template.periodType,
      startDate: startDate.toISOString().slice(0, 10),
      weeks,
    });
  }

  // ---- MANUAL: tom plan med tomme uker ----
  if (input.mode === "MANUAL") {
    const weeks = Array.from({ length: input.durationWeeks }, (_, i) => ({
      weekNumber: i + 1,
      focus: undefined,
      sessions: [],
    }));

    return createManualPlan({
      title: input.title ?? `Min plan — ${input.durationWeeks} uker`,
      periodType: "PREPARATION",
      startDate: startDate.toISOString().slice(0, 10),
      weeks,
    });
  }

  // ---- RECOMMENDED: AI-generert plan basert på USI-prescription, HCP og mål ----
  if (input.mode === "RECOMMENDED") {
    // Rate-limit per bruker (AI er kostbart)
    const rateLimit = checkRateLimit(`ai:plan:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
    if (!rateLimit.allowed) {
      throw new Error("For mange AI-forespørsler. Vent litt og prøv igjen.");
    }

    // Hent kontekst: prescription (USI), HCP, aktive mål
    const [prescription, profile, goals] = await Promise.all([
      prisma.trainingPrescription.findFirst({
        where: { userId: user.id },
        orderBy: { generatedAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, UserGolfId: { select: { handicap: true } } },
      }),
      prisma.playerGoals.findMany({
        where: { userId: user.id, isActive: true },
        orderBy: { priority: "asc" },
        take: 5,
      }),
    ]);

    // Bygg goals-string
    const goalLines: string[] = [];
    if (profile?.UserGolfId?.handicap != null) {
      goalLines.push(`Nåværende handicap: ${profile.UserGolfId.handicap}.`);
    }
    if (goals.length > 0) {
      goalLines.push("Aktive mål:");
      for (const g of goals) {
        const target = g.targetValue != null ? ` (mål: ${g.targetValue})` : "";
        const deadline = g.targetDate ? ` innen ${g.targetDate.toISOString().slice(0, 10)}` : "";
        goalLines.push(`- ${g.title}${target}${deadline}`);
      }
    }
    if (prescription?.focusAreas?.length) {
      goalLines.push(`Fokusområder fra USI-analyse: ${prescription.focusAreas.join(", ")}.`);
    }
    if (prescription?.weeklyHours) {
      goalLines.push(`Anbefalt volum: ${prescription.weeklyHours.toFixed(1)} timer/uke.`);
    }
    if (goalLines.length === 0) {
      goalLines.push("Bygg en balansert plan for generell golfutvikling.");
    }
    const goalsText = goalLines.join("\n");

    // Bygg prescription-input til AI
    const aiPrescription = prescription
      ? {
          focusAreas: prescription.focusAreas,
          weeklyHours: prescription.weeklyHours,
          suggestedFormulaIds: prescription.suggestedFormulaIds,
          predictedHcpChange: prescription.predictedHcpChange,
          confidence: prescription.confidence,
          gradientJson: (prescription.gradientJson ?? {}) as Record<string, unknown>,
          gapAnalysisJson: (prescription.gapAnalysisJson ?? {}) as Record<string, unknown>,
          reasoning: "",
        }
      : undefined;

    // Valider spillerstyrt pyramide-fordeling
    const pyramid = input.pyramidDistribution;
    if (pyramid) {
      const total = pyramid.FYS + pyramid.TEK + pyramid.SLAG + pyramid.SPILL + pyramid.TURN;
      if (total !== 100) {
        throw new Error("AK-fordelingen må summere til 100 %.");
      }
    }

    // Kall AI
    let aiResult;
    try {
      aiResult = await generateTrainingPlan(
        {
          goals: goalsText,
          periodType: "grunnperiode",
          durationWeeks: input.durationWeeks,
          startDate: startDate.toISOString().slice(0, 10),
          pyramidDistribution: pyramid,
        },
        aiPrescription
      );
    } catch (err) {
      throw new Error(
        `AI-generering feilet: ${err instanceof Error ? err.message : "ukjent feil"}`
      );
    }

    // Deaktiver eksisterende aktive planer
    await prisma.trainingPlan.updateMany({
      where: { studentId: user.id, isActive: true },
      data: { isActive: false, updatedAt: new Date() },
    });

    // Bygg plan + uker + økter i en transaksjon
    const planId = nanoid();
    const planEnd = addDays(startDate, input.durationWeeks * 7 - 1);

    await prisma.$transaction(async (tx) => {
      await tx.trainingPlan.create({
        data: {
          id: planId,
          studentId: user.id,
          createdById: user.id,
          title: input.title ?? aiResult.title,
          description: "Generert av AI basert på din profil og USI-data. Juster fritt.",
          goals: goalsText,
          pyramidDistribution: pyramid ?? undefined,
          periodType: "PREPARATION",
          startDate: startDate,
          endDate: planEnd,
          isActive: true,
          aiGenerated: true,
          updatedAt: new Date(),
        },
      });

      for (const w of aiResult.weeks) {
        const weekId = nanoid();
        const weekStart = addDays(startDate, (w.weekNumber - 1) * 7);

        await tx.trainingPlanWeek.create({
          data: {
            id: weekId,
            planId,
            weekNumber: w.weekNumber,
            weekStart,
            focus: w.focus,
            volumeLabel: w.volumeLabel,
          },
        });

        for (let idx = 0; idx < w.sessions.length; idx++) {
          const s = w.sessions[idx];
          await tx.trainingPlanSession.create({
            data: {
              id: nanoid(),
              weekId,
              dayOfWeek: s.dayOfWeek,
              title: s.title,
              description: s.description,
              durationMinutes: s.durationMinutes,
              focusArea: s.focusArea,
              exercises: s.exercises,
              sortOrder: idx,
            },
          });
        }
      }
    });

    revalidatePath("/portal/treningsplan");
    return { success: true, planId };
  }

  throw new Error(`Ukjent mode: ${input.mode}`);
}

export async function applyTemplateToWeek(
  weekOffset: number,
  templateId: TemplateId,
): Promise<{ success: boolean; createdCount: number; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const template = getTemplate(templateId);
  if (!template) {
    return { success: false, createdCount: 0, error: `Ukjent mal: ${templateId}` };
  }

  let createdCount = 0;
  const errors: string[] = [];

  for (const tplSession of template.weekPattern) {
    try {
      await createSessionForWeek({
        weekOffset,
        dayOfWeek: tplSession.dayOfWeek,
        title: tplSession.title,
        description: tplSession.description,
        durationMinutes: tplSession.durationMinutes,
        focusArea: tplSession.focusArea,
        startH: 9 + tplSession.dayOfWeek - 1,
        startM: 0,
      });
      createdCount++;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  revalidatePath("/portal/treningsplan");
  if (errors.length > 0 && createdCount === 0) {
    return { success: false, createdCount, error: errors[0] };
  }
  return { success: true, createdCount };
}

export async function listStandardTemplates() {
  const templates = await getActiveTemplates();
  return templates.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    iconName: t.iconName,
    badge: t.badge,
    sessionCount: t.weekPattern.length,
  }));
}

// -------------------------------------------------------------------
// Epic 3: Plan- og økt-CRUD (sprint 2)
// -------------------------------------------------------------------

/**
 * Liste over alle planer for innlogget bruker (aktiv + inaktive).
 * Brukes i "Mine planer"-meny.
 */
export async function listMyPlans() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const plans = await prisma.trainingPlan.findMany({
    where: { studentId: user.id },
    select: {
      id: true,
      title: true,
      isActive: true,
      aiGenerated: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      _count: { select: { TrainingPlanWeek: true } },
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    isActive: p.isActive,
    aiGenerated: p.aiGenerated,
    startDate: p.startDate.toISOString().slice(0, 10),
    endDate: p.endDate.toISOString().slice(0, 10),
    weekCount: p._count.TrainingPlanWeek,
  }));
}

/**
 * Arkiver plan (myk sletting via isActive: false).
 * Spilleren kan arkivere både aktive og inaktive planer.
 */
export async function archivePlan(planId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, studentId: user.id },
    select: { id: true },
  });
  if (!plan) throw new Error("Plan ikke funnet");

  await prisma.trainingPlan.update({
    where: { id: planId },
    data: { isActive: false, updatedAt: new Date() },
  });

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

/**
 * Aktiver en arkivert plan. Deaktiverer eventuell annen aktiv plan.
 */
export async function activatePlan(planId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, studentId: user.id },
    select: { id: true },
  });
  if (!plan) throw new Error("Plan ikke funnet");

  await prisma.$transaction([
    prisma.trainingPlan.updateMany({
      where: { studentId: user.id, isActive: true },
      data: { isActive: false, updatedAt: new Date() },
    }),
    prisma.trainingPlan.update({
      where: { id: planId },
      data: { isActive: true, updatedAt: new Date() },
    }),
  ]);

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

/**
 * Hard-slett plan (cascade fjerner uker + økter + logs).
 * Krever at planen er inaktiv.
 */
export async function deletePlan(planId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, studentId: user.id },
    select: { id: true, isActive: true },
  });
  if (!plan) throw new Error("Plan ikke funnet");
  if (plan.isActive) {
    throw new Error("Arkiver planen først før du sletter den.");
  }

  await prisma.trainingPlan.delete({ where: { id: planId } });

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

/**
 * Spilleren kopierer egen plan til ny. Beholder alle uker og økter.
 * Den nye planen blir aktiv hvis spilleren ikke har en aktiv plan,
 * ellers inaktiv (kan aktiveres senere).
 */
export async function duplicateOwnPlan(sourcePlanId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const source = await prisma.trainingPlan.findFirst({
    where: { id: sourcePlanId, studentId: user.id },
    include: {
      TrainingPlanWeek: {
        include: { TrainingPlanSession: true },
        orderBy: { weekNumber: "asc" },
      },
    },
  });
  if (!source) throw new Error("Plan ikke funnet");

  const hasActive = await prisma.trainingPlan.count({
    where: { studentId: user.id, isActive: true },
  });

  const newPlanId = nanoid();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.trainingPlan.create({
      data: {
        id: newPlanId,
        studentId: user.id,
        createdById: user.id,
        title: `${source.title} (kopi)`,
        description: source.description,
        goals: source.goals,
        periodType: source.periodType,
        startDate: source.startDate,
        endDate: source.endDate,
        isActive: hasActive === 0,
        aiGenerated: source.aiGenerated,
        updatedAt: now,
      },
    });

    for (const week of source.TrainingPlanWeek) {
      const newWeekId = nanoid();
      await tx.trainingPlanWeek.create({
        data: {
          id: newWeekId,
          planId: newPlanId,
          weekNumber: week.weekNumber,
          weekStart: week.weekStart,
          focus: week.focus,
          volumeLabel: week.volumeLabel,
          restDays: week.restDays,
        },
      });

      for (const session of week.TrainingPlanSession) {
        await tx.trainingPlanSession.create({
          data: {
            id: nanoid(),
            weekId: newWeekId,
            dayOfWeek: session.dayOfWeek,
            title: session.title,
            description: session.description,
            durationMinutes: session.durationMinutes,
            focusArea: session.focusArea,
            facilityId: session.facilityId,
            exercises: session.exercises ?? [],
            sortOrder: session.sortOrder,
          },
        });
      }
    }
  });

  revalidatePath("/portal/treningsplan");
  return { success: true, planId: newPlanId };
}

/**
 * Dupliser én økt innen samme uke. Ny økt får tittel + " (kopi)" og legges
 * til på slutten av samme dag (sortOrder = max + 1).
 */
export async function duplicateSession(sessionId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const source = await prisma.trainingPlanSession.findUnique({
    where: { id: sessionId },
    include: {
      TrainingPlanWeek: {
        select: {
          id: true,
          TrainingPlan: { select: { studentId: true } },
        },
      },
    },
  });
  if (!source) throw new Error("Økt ikke funnet");
  if (source.TrainingPlanWeek.TrainingPlan.studentId !== user.id) {
    throw new Error("Du eier ikke denne økten");
  }

  // Sjekk gruppeøkt
  const exercises = Array.isArray(source.exercises)
    ? (source.exercises as Record<string, unknown>[])
    : [];
  if (exercises.some((ex) => ex._groupSessionId)) {
    throw new Error("Gruppeøkter kan ikke dupliseres.");
  }

  // Beregn neste sortOrder
  const maxSortOrder = await prisma.trainingPlanSession.aggregate({
    where: {
      weekId: source.weekId,
      dayOfWeek: source.dayOfWeek,
    },
    _max: { sortOrder: true },
  });

  const newId = nanoid();
  await prisma.trainingPlanSession.create({
    data: {
      id: newId,
      weekId: source.weekId,
      dayOfWeek: source.dayOfWeek,
      title: `${source.title} (kopi)`,
      description: source.description,
      durationMinutes: source.durationMinutes,
      focusArea: source.focusArea,
      facilityId: source.facilityId,
      exercises: source.exercises ?? [],
      sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/portal/treningsplan");
  return { success: true, sessionId: newId };
}

/**
 * Reorder økter innen samme dag. `sessionIds` er listen i ønsket rekkefølge.
 */
export async function reorderSessionsInDay(
  weekId: string,
  dayOfWeek: number,
  sessionIds: string[]
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  // Verifiser eierskap
  const week = await prisma.trainingPlanWeek.findUnique({
    where: { id: weekId },
    include: { TrainingPlan: { select: { studentId: true } } },
  });
  if (!week) throw new Error("Uke ikke funnet");
  if (week.TrainingPlan.studentId !== user.id) {
    throw new Error("Du eier ikke denne planen");
  }

  // Verifiser at alle sessionIds tilhører riktig uke + dag
  const sessions = await prisma.trainingPlanSession.findMany({
    where: { id: { in: sessionIds }, weekId, dayOfWeek },
    select: { id: true },
  });
  if (sessions.length !== sessionIds.length) {
    throw new Error("Noen økter tilhører ikke denne uken/dagen");
  }

  await prisma.$transaction(
    sessionIds.map((id, idx) =>
      prisma.trainingPlanSession.update({
        where: { id },
        data: { sortOrder: idx },
      })
    )
  );

  revalidatePath("/portal/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// Epic 4.1: Fasilitet — hent tilgjengelige fasiliteter for spilleren
// -------------------------------------------------------------------

export async function listAvailableFacilities() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const facilities = await prisma.facility.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      Location: { select: { name: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return facilities.map((f) => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    locationName: f.Location?.name ?? null,
  }));
}

// -------------------------------------------------------------------
// Epic 4.3: Fri-dager — toggle hviledag for ukens dag
// -------------------------------------------------------------------

export async function toggleRestDay(weekId: string, dayOfWeek: number) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");
  if (dayOfWeek < 1 || dayOfWeek > 7) throw new Error("Ugyldig dag");

  const week = await prisma.trainingPlanWeek.findUnique({
    where: { id: weekId },
    include: { TrainingPlan: { select: { studentId: true } } },
  });
  if (!week) throw new Error("Uke ikke funnet");
  if (week.TrainingPlan.studentId !== user.id) {
    throw new Error("Du eier ikke denne planen");
  }

  const current = week.restDays ?? [];
  const isRest = current.includes(dayOfWeek);
  const next = isRest
    ? current.filter((d) => d !== dayOfWeek)
    : [...current, dayOfWeek].sort((a, b) => a - b);

  await prisma.trainingPlanWeek.update({
    where: { id: weekId },
    data: { restDays: next },
  });

  revalidatePath("/portal/treningsplan");
  return { success: true, isRest: !isRest };
}

// -------------------------------------------------------------------
// Epic 10: Avvis plan-justeringsforslag (persisteres i 7 dager)
// -------------------------------------------------------------------

const DISMISS_DURATION_DAYS = 7;

// -------------------------------------------------------------------
// Epic 4.2: Konflikt-sjekk for ny/oppdatert økt
// -------------------------------------------------------------------

export async function checkSessionConflicts(input: {
  date: string;
  startH: number;
  startM: number;
  durationMinutes: number;
  excludeSessionId?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) return { hasConflict: false, conflicts: [] };

  return detectSessionConflicts({
    userId: user.id,
    date: input.date,
    startH: input.startH,
    startM: input.startM,
    durationMinutes: input.durationMinutes,
    excludeSessionId: input.excludeSessionId,
  });
}

// -------------------------------------------------------------------
// Epic 7: Goal-tracking på plan-nivå
// -------------------------------------------------------------------

export interface PlanGoalProgress {
  id: string;
  goalType: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  targetValue: number | null;
  currentValue: number | null;
  /** 0-100, eller null hvis ikke beregnbart */
  progressPct: number | null;
  /** Dager igjen til targetDate, negativ hvis utløpt */
  daysRemaining: number | null;
  achievedAt: string | null;
  priority: number;
}

export interface PlanGoalsSummary {
  goals: PlanGoalProgress[];
  /** Antall mål oppnådd */
  achievedCount: number;
  /** Total antall aktive mål */
  totalCount: number;
}

/**
 * Hent mål for innlogget bruker og beregn progress mot HCP / TrackMan-data.
 * Brukes til å vise mål-kort på treningsplan-siden.
 */
export async function getPlanGoalsProgress(): Promise<PlanGoalsSummary> {
  const user = await requirePortalUser();
  if (!user?.id) return { goals: [], achievedCount: 0, totalCount: 0 };

  const [goals, profile, metrics] = await Promise.all([
    prisma.playerGoals.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: [{ priority: "asc" }, { targetDate: "asc" }],
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { UserGolfId: { select: { handicap: true } } },
    }),
    prisma.playerMetrics.findUnique({
      where: { userId: user.id },
      select: {
        last10DriverCarry: true,
        last10DriverSpeed: true,
        last10SevenIronCarry: true,
      },
    }),
  ]);

  const now = new Date();

  const result: PlanGoalProgress[] = goals.map((g) => {
    let currentValue = g.currentValue;
    let progressPct: number | null = null;

    // Beregn current basert på goalType
    if (g.goalType === "HCP" && profile?.UserGolfId?.handicap != null) {
      currentValue = profile.UserGolfId.handicap;
      // For HCP: lavere er bedre. progressPct beregnes fra startverdi (currentValue lagret) → target
      if (g.targetValue != null && g.currentValue != null) {
        const start = g.currentValue;
        const target = g.targetValue;
        if (start > target) {
          progressPct = Math.round(
            Math.max(0, Math.min(100, ((start - profile.UserGolfId.handicap) / (start - target)) * 100))
          );
        }
      }
    } else if (g.goalType === "DRIVER_SPEED" && metrics?.last10DriverSpeed != null) {
      currentValue = metrics.last10DriverSpeed;
      if (g.targetValue != null && g.currentValue != null) {
        const start = g.currentValue;
        const target = g.targetValue;
        if (target > start) {
          progressPct = Math.round(
            Math.max(0, Math.min(100, ((metrics.last10DriverSpeed - start) / (target - start)) * 100))
          );
        }
      }
    } else if (g.goalType === "DRIVER_CARRY" && metrics?.last10DriverCarry != null) {
      currentValue = metrics.last10DriverCarry;
      if (g.targetValue != null && g.currentValue != null) {
        const start = g.currentValue;
        const target = g.targetValue;
        if (target > start) {
          progressPct = Math.round(
            Math.max(0, Math.min(100, ((metrics.last10DriverCarry - start) / (target - start)) * 100))
          );
        }
      }
    } else if (g.targetValue != null && g.currentValue != null && g.targetValue !== g.currentValue) {
      // Generisk: fra currentValue mot targetValue
      const start = g.currentValue;
      const target = g.targetValue;
      const range = Math.abs(target - start);
      if (range > 0 && currentValue != null) {
        const closed = Math.abs(currentValue - start);
        progressPct = Math.round(Math.max(0, Math.min(100, (closed / range) * 100)));
      }
    }

    const daysRemaining = g.targetDate
      ? Math.ceil((g.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      id: g.id,
      goalType: g.goalType,
      title: g.title,
      description: g.description,
      targetDate: g.targetDate?.toISOString().slice(0, 10) ?? null,
      targetValue: g.targetValue,
      currentValue,
      progressPct,
      daysRemaining,
      achievedAt: g.achievedAt?.toISOString() ?? null,
      priority: g.priority,
    };
  });

  const achievedCount = result.filter((g) => g.achievedAt !== null).length;

  return {
    goals: result,
    achievedCount,
    totalCount: result.length,
  };
}

export async function dismissPlanAdjustment(planId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke autentisert");

  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, studentId: user.id },
    select: { id: true },
  });
  if (!plan) throw new Error("Plan ikke funnet");

  const now = new Date();
  const expires = addDays(now, DISMISS_DURATION_DAYS);

  // Slett gamle dismiss-rader for samme bruker/plan
  await prisma.dismissedAdjustment.deleteMany({
    where: { userId: user.id, planId },
  });

  await prisma.dismissedAdjustment.create({
    data: {
      id: nanoid(),
      userId: user.id,
      planId,
      dismissedAt: now,
      expiresAt: expires,
    },
  });

  revalidatePath("/portal/treningsplan");
  return { success: true, expiresAt: expires.toISOString() };
}

// -------------------------------------------------------------------
// Sprint 1 / Symmetri: Spiller-kommentar på plan
// -------------------------------------------------------------------

const PLAYER_COMMENT_MAX = 2000;

/**
 * Sett eller oppdater spiller-kommentaren på en plan. Kun plan-eier kan
 * kalle. Speiler `setPlanCoachFeedback` i admin-actions, men varsler
 * coachen som opprettet planen når kommentaren er ikke-tom.
 */
export async function setPlanPlayerComment(
  planId: string,
  comment: string | null
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke autentisert" };

  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    select: {
      id: true,
      title: true,
      studentId: true,
      createdById: true,
      User_TrainingPlan_studentIdToUser: { select: { name: true } },
    },
  });
  if (!plan) return { success: false, error: "Plan ikke funnet" };
  if (plan.studentId !== user.id) {
    return { success: false, error: "Kun plan-eier kan kommentere" };
  }

  const trimmed = (comment ?? "").trim().slice(0, PLAYER_COMMENT_MAX);
  const isClearing = trimmed.length === 0;

  await prisma.trainingPlan.update({
    where: { id: planId },
    data: {
      playerComment: isClearing ? null : trimmed,
      playerCommentAt: isClearing ? null : new Date(),
      updatedAt: new Date(),
    },
  });

  if (!isClearing && plan.createdById && plan.createdById !== user.id) {
    const { notifyPlanPlayerComment } = await import(
      "@/lib/portal/notifications/triggers"
    );
    await notifyPlanPlayerComment({
      planId: plan.id,
      planTitle: plan.title,
      coachId: plan.createdById,
      studentId: plan.studentId,
      studentName: plan.User_TrainingPlan_studentIdToUser?.name ?? null,
      commentPreview: trimmed,
    });
  }

  revalidatePath("/portal/treningsplan");
  revalidatePath("/admin/treningsplan");
  return { success: true };
}

// -------------------------------------------------------------------
// Sprint 2 / Forslags-modus: spilleren godkjenner/avslår forslag
// -------------------------------------------------------------------

/**
 * Hent ventende forslag for spillerens aktive plan.
 */
export async function listMyPendingSuggestions() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: user.id, isActive: true },
    select: { id: true },
  });
  if (!plan) return [];

  const { listPendingSuggestionsForPlan } = await import(
    "@/lib/portal/training/plan-suggestion-service"
  );
  return listPendingSuggestionsForPlan(plan.id);
}

/**
 * Spilleren godtar et forslag — diff appliseres på target og forslaget markeres ACCEPTED.
 */
export async function acceptSuggestion(
  suggestionId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke autentisert" };

  const suggestion = await prisma.planSuggestion.findUnique({
    where: { id: suggestionId },
    include: {
      TrainingPlan: {
        select: {
          id: true,
          title: true,
          studentId: true,
        },
      },
    },
  });
  if (!suggestion) return { success: false, error: "Forslag ikke funnet" };
  if (suggestion.TrainingPlan.studentId !== user.id) {
    return { success: false, error: "Kun plan-eier kan godta forslag" };
  }
  if (suggestion.status !== "PENDING") {
    return { success: false, error: "Forslaget er allerede behandlet" };
  }

  const { applySessionDiff } = await import(
    "@/lib/portal/training/plan-suggestion-service"
  );
  const diff = suggestion.diffJson as {
    after: Record<string, unknown>;
  };

  let targetLabel = "Treningsplanen";
  if (suggestion.targetType === "session" && suggestion.targetId) {
    const session = await prisma.trainingPlanSession.findUnique({
      where: { id: suggestion.targetId },
      select: { title: true },
    });
    if (session) targetLabel = session.title;

    await applySessionDiff(
      suggestion.targetId,
      diff.after as Record<string, never>
    );
  }
  // TODO Sprint 3: implementer "week", "plan", "distribution" targets

  await prisma.planSuggestion.update({
    where: { id: suggestionId },
    data: {
      status: "ACCEPTED",
      resolvedAt: new Date(),
      resolvedById: user.id,
    },
  });

  if (suggestion.proposedById !== user.id) {
    const { notifyPlanSuggestionResolved } = await import(
      "@/lib/portal/notifications/triggers"
    );
    await notifyPlanSuggestionResolved({
      planId: suggestion.planId,
      planTitle: suggestion.TrainingPlan.title,
      coachId: suggestion.proposedById,
      studentId: user.id,
      studentName: user.name ?? null,
      targetLabel,
      status: "ACCEPTED",
      rejectionReason: null,
    });
  }

  revalidatePath("/portal/treningsplan");
  revalidatePath("/admin/treningsplan");
  return { success: true };
}

/**
 * Spilleren avslår et forslag — markeres REJECTED med valgfri begrunnelse.
 */
export async function rejectSuggestion(
  suggestionId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke autentisert" };

  const suggestion = await prisma.planSuggestion.findUnique({
    where: { id: suggestionId },
    include: {
      TrainingPlan: { select: { id: true, title: true, studentId: true } },
    },
  });
  if (!suggestion) return { success: false, error: "Forslag ikke funnet" };
  if (suggestion.TrainingPlan.studentId !== user.id) {
    return { success: false, error: "Kun plan-eier kan avslå forslag" };
  }
  if (suggestion.status !== "PENDING") {
    return { success: false, error: "Forslaget er allerede behandlet" };
  }

  const trimmed = reason?.trim().slice(0, 500) || null;

  await prisma.planSuggestion.update({
    where: { id: suggestionId },
    data: {
      status: "REJECTED",
      resolvedAt: new Date(),
      resolvedById: user.id,
      rejectionReason: trimmed,
    },
  });

  let targetLabel = "Treningsplanen";
  if (suggestion.targetType === "session" && suggestion.targetId) {
    const session = await prisma.trainingPlanSession.findUnique({
      where: { id: suggestion.targetId },
      select: { title: true },
    });
    if (session) targetLabel = session.title;
  }

  if (suggestion.proposedById !== user.id) {
    const { notifyPlanSuggestionResolved } = await import(
      "@/lib/portal/notifications/triggers"
    );
    await notifyPlanSuggestionResolved({
      planId: suggestion.planId,
      planTitle: suggestion.TrainingPlan.title,
      coachId: suggestion.proposedById,
      studentId: user.id,
      studentName: user.name ?? null,
      targetLabel,
      status: "REJECTED",
      rejectionReason: trimmed,
    });
  }

  revalidatePath("/portal/treningsplan");
  revalidatePath("/admin/treningsplan");
  return { success: true };
}
