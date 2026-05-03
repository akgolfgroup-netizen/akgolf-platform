"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import {
  calculateDegradation,
  getTekSlagSpillGap,
  getEnvironmentDistribution,
} from "@/lib/portal/training/degradation-service";
import {
  getAllLPhasesForUser,
  setLPhaseForShotType,
} from "@/lib/portal/training/l-phase-service";
import type { ShotType, LPhase } from "@/lib/portal/training/l-phase-types";

// =============================================================================
// AUTH HELPER
// =============================================================================

async function requireStaff() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }
  return user;
}

// =============================================================================
// TRAINING PLAN
// =============================================================================

export async function getStudentTrainingPlan(studentId: string) {
  await requireStaff();
  const supabase = await createServerSupabase();

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      id,
      title,
      description,
      goals,
      periodType,
      startDate,
      endDate,
      aiGenerated,
      createdAt,
      TrainingPlanWeek (
        id,
        weekNumber,
        weekStart,
        focus,
        volumeLabel,
        TrainingPlanSession (
          id,
          dayOfWeek,
          title,
          description,
          durationMinutes,
          focusArea,
          exercises,
          sortOrder
        )
      )
    `)
    .eq("studentId", studentId)
    .eq("isActive", true)
    .order("createdAt", { ascending: false })
    .single();

  return plan;
}

// =============================================================================
// TRAINING LOGS
// =============================================================================

export async function getStudentTrainingLogs(studentId: string, limit = 20) {
  await requireStaff();
  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select(`
      id,
      date,
      durationMinutes,
      focusArea,
      exercises,
      notes,
      rating,
      deviatedFromPlan,
      deviationReason,
      primaryLPhase,
      primaryEnvironment,
      primaryPressLevel,
      coachFeedback,
      coachId,
      TrainingLogExercises (
        id,
        name,
        lPhase,
        clubSpeed,
        environment,
        pressLevel,
        successRate,
        score,
        actualSets,
        actualReps,
        notes,
        coachFeedback
      )
    `)
    .eq("userId", studentId)
    .order("date", { ascending: false })
    .limit(limit);

  return logs || [];
}

// =============================================================================
// ROUND STATS (from RoundStats model)
// =============================================================================

export async function getStudentRoundStats(studentId: string, limit = 10) {
  await requireStaff();
  const supabase = createServiceClient();

  const { data: rounds } = await supabase
    .from("RoundStats")
    .select("*")
    .eq("userId", studentId)
    .order("date", { ascending: false })
    .limit(limit);

  return rounds || [];
}

// =============================================================================
// ROUNDS (from Round model with hole-by-hole)
// =============================================================================

export async function getStudentRounds(studentId: string, limit = 10) {
  await requireStaff();
  const supabase = createServiceClient();

  const { data: rounds } = await supabase
    .from("Round")
    .select(`
      *,
      Course (name, par),
      HoleResult (
        holeNumber,
        par,
        score,
        scoreToPar,
        putts,
        fairwayHit,
        gir
      )
    `)
    .eq("userId", studentId)
    .order("date", { ascending: false })
    .limit(limit);

  return rounds || [];
}

// =============================================================================
// DEGRADATION (Foundation Method)
// =============================================================================

export async function getStudentDegradation(studentId: string) {
  await requireStaff();

  const shotTypes: ShotType[] = ["DRIVER", "IRON", "WEDGE", "PUTT"];

  const [curves, gaps, envDistribution] = await Promise.all([
    Promise.all(shotTypes.map((st) => calculateDegradation(studentId, st))),
    Promise.all(shotTypes.map((st) => getTekSlagSpillGap(studentId, st))),
    getEnvironmentDistribution(studentId),
  ]);

  return { curves, gaps, envDistribution };
}

// =============================================================================
// L-PHASES
// =============================================================================

export async function getStudentLPhases(studentId: string) {
  await requireStaff();

  const phaseMap = await getAllLPhasesForUser(studentId);

  // Convert Map to serializable array
  const phases: {
    shotType: string;
    lPhase: string;
    setAt: Date;
    setBy: string | null;
    notes: string | null;
  }[] = [];

  for (const [shotType, entry] of phaseMap.entries()) {
    phases.push({
      shotType,
      lPhase: entry.lPhase,
      setAt: entry.setAt,
      setBy: entry.setBy,
      notes: entry.notes,
    });
  }

  return phases;
}

export async function setStudentLPhase(
  studentId: string,
  shotType: string,
  lPhase: string
) {
  const user = await requireStaff();

  await setLPhaseForShotType(
    studentId,
    shotType as ShotType,
    lPhase as LPhase,
    user.id,
    `Satt av coach via CoachHQ`
  );

  return { success: true };
}

// =============================================================================
// TRACKMAN SESSIONS
// =============================================================================

export async function getStudentTrackManSessions(
  studentId: string,
  limit = 5
) {
  await requireStaff();
  const supabase = createServiceClient();

  const { data: sessions } = await supabase
    .from("TrackmanSession")
    .select("id, sessionDate, club, shots, averages")
    .eq("userId", studentId)
    .order("sessionDate", { ascending: false })
    .limit(limit);

  return sessions || [];
}

// =============================================================================
// COACH NOTE ON TRAINING LOG
// =============================================================================

export async function addCoachNote(
  studentId: string,
  logId: string,
  note: string
) {
  const user = await requireStaff();
  const supabase = await createServerSupabase();

  // Verify the log belongs to the student
  const { data: log } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", logId)
    .eq("userId", studentId)
    .single();

  if (!log) {
    throw new Error("Treningslogg ikke funnet");
  }

  const { data: updated } = await supabase
    .from("TrainingLog")
    .update({
      coachFeedback: note,
      coachId: user.id,
    })
    .eq("id", logId)
    .select("id, coachFeedback, coachId")
    .single();

  return updated;
}
