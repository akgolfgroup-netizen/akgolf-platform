"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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

  const plan = await prisma.trainingPlan.findFirst({
    where: {
      studentId,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      goals: true,
      periodType: true,
      startDate: true,
      endDate: true,
      aiGenerated: true,
      createdAt: true,
      TrainingPlanWeek: {
        select: {
          id: true,
          weekNumber: true,
          weekStart: true,
          focus: true,
          volumeLabel: true,
          TrainingPlanSession: {
            select: {
              id: true,
              dayOfWeek: true,
              title: true,
              description: true,
              durationMinutes: true,
              focusArea: true,
              exercises: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { weekNumber: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return plan;
}

// =============================================================================
// TRAINING LOGS
// =============================================================================

export async function getStudentTrainingLogs(studentId: string, limit = 20) {
  await requireStaff();

  const logs = await prisma.trainingLog.findMany({
    where: { userId: studentId },
    select: {
      id: true,
      date: true,
      durationMinutes: true,
      focusArea: true,
      exercises: true,
      notes: true,
      rating: true,
      deviatedFromPlan: true,
      deviationReason: true,
      primaryLPhase: true,
      primaryEnvironment: true,
      primaryPressLevel: true,
      coachFeedback: true,
      coachId: true,
      TrainingLogExercises: {
        select: {
          id: true,
          name: true,
          lPhase: true,
          clubSpeed: true,
          environment: true,
          pressLevel: true,
          successRate: true,
          score: true,
          actualSets: true,
          actualReps: true,
          notes: true,
          coachFeedback: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return logs;
}

// =============================================================================
// ROUND STATS (from RoundStats model)
// =============================================================================

export async function getStudentRoundStats(studentId: string, limit = 10) {
  await requireStaff();

  const rounds = await prisma.roundStats.findMany({
    where: { userId: studentId },
    select: {
      id: true,
      date: true,
      courseName: true,
      totalScore: true,
      scoreToPar: true,
      sgTotal: true,
      sgOffTheTee: true,
      sgApproach: true,
      sgAroundTheGreen: true,
      sgPutting: true,
      fairwaysHit: true,
      fairwaysTotal: true,
      gir: true,
      girTotal: true,
      totalPutts: true,
      drivingDistance: true,
      notes: true,
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return rounds;
}

// =============================================================================
// ROUNDS (from Round model with hole-by-hole)
// =============================================================================

export async function getStudentRounds(studentId: string, limit = 10) {
  await requireStaff();

  const rounds = await prisma.round.findMany({
    where: { userId: studentId },
    select: {
      id: true,
      date: true,
      totalScore: true,
      scoreToPar: true,
      sgTotal: true,
      sgOffTheTee: true,
      sgApproach: true,
      sgShortGame: true,
      sgPutting: true,
      fairwaysHit: true,
      fairwaysTotal: true,
      girCount: true,
      totalPutts: true,
      isComplete: true,
      Course: {
        select: {
          name: true,
          par: true,
        },
      },
      HoleResult: {
        select: {
          holeNumber: true,
          par: true,
          score: true,
          scoreToPar: true,
          putts: true,
          fairwayHit: true,
          gir: true,
        },
        orderBy: { holeNumber: "asc" },
      },
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return rounds;
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
    `Satt av coach via Mission Control`
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

  const sessions = await prisma.trackmanSession.findMany({
    where: { userId: studentId },
    select: {
      id: true,
      sessionDate: true,
      club: true,
      shots: true,
      averages: true,
    },
    orderBy: { sessionDate: "desc" },
    take: limit,
  });

  return sessions;
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

  // Verify the log belongs to the student
  const log = await prisma.trainingLog.findFirst({
    where: { id: logId, userId: studentId },
    select: { id: true },
  });

  if (!log) {
    throw new Error("Treningslogg ikke funnet");
  }

  const updated = await prisma.trainingLog.update({
    where: { id: logId },
    data: {
      coachFeedback: note,
      coachId: user.id,
    },
    select: {
      id: true,
      coachFeedback: true,
      coachId: true,
    },
  });

  return updated;
}
