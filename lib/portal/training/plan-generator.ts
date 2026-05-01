// VERIFY: Plan-generator — tar allokerings-output og genererer TrainingPlan
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 4.3, Fase 5

import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { addWeeks, startOfISOWeek, format } from "date-fns";
import { computeAllocation, type AllocationInput } from "@/lib/portal/allocation/engine";
import { resolveCSTarget } from "@/lib/portal/golf/clubspeed-resolver";
import type { PlannedExercise } from "./session-exercise-types";

export interface GeneratePlanOptions {
  userId: string;
  hcp: number;
  weeklyHours: number;
  age: number;
  goal: string;
  horizonWeeks: number;
  startDate?: Date;
  homeCourseHoles?: Array<{ hole: number; par: number; lengthMeters: number }>;
  homeCourseDriverCarry?: number;
  weakestArea?: string;
  title?: string;
  createdById: string;
}

/** Genererer en TrainingPlan basert på allokeringsmotor-output */
export async function generatePlan(opts: GeneratePlanOptions): Promise<string> {
  const start = opts.startDate ?? new Date();
  const weekStart = startOfISOWeek(start);

  // 1. Beregn allokering
  const allocInput: AllocationInput = {
    userId: opts.userId,
    hcp: opts.hcp,
    weeklyHours: opts.weeklyHours,
    age: opts.age,
    goal: opts.goal,
    homeCourseHoles: opts.homeCourseHoles,
    homeCourseDriverCarry: opts.homeCourseDriverCarry,
    weakestArea: opts.weakestArea,
    planHorizonWeeks: opts.horizonWeeks,
    startDate: weekStart,
  };

  const allocation = computeAllocation(allocInput);

  // 2. Deaktiver eksisterende aktive planer
  await prisma.trainingPlan.updateMany({
    where: { studentId: opts.userId, isActive: true },
    data: { isActive: false },
  });

  // 3. Opprett plan
  const planId = nanoid();
  const endDate = addWeeks(weekStart, opts.horizonWeeks);

  await prisma.trainingPlan.create({
    data: {
      id: planId,
      studentId: opts.userId,
      createdById: opts.createdById,
      title: opts.title ?? `Treningsplan uke ${format(weekStart, "w")}`,
      description: allocation.rationale.join("\n"),
      periodType: "PREPARATION",
      startDate: weekStart,
      endDate,
      isActive: true,
      aiGenerated: false,
      pyramidDistribution: {
        fysisk: allocation.weeks[0]?.allocation.fysisk ?? 20,
        teknikk: allocation.weeks[0]?.allocation.teknikk ?? 20,
        slag: allocation.weeks[0]?.allocation.slag
          ? Object.values(allocation.weeks[0].allocation.slag).reduce((a, b) => a + b, 0)
          : 20,
        spill: allocation.weeks[0]?.allocation.spill
          ? Object.values(allocation.weeks[0].allocation.spill).reduce((a, b) => a + b, 0)
          : 20,
        mental: allocation.weeks[0]?.allocation.mental ?? 20,
      },
      updatedAt: new Date(),
    },
  });

  // 4. Hent øvelser fra DB
  const exerciseDefs = await prisma.exerciseDefinition.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      name: true,
      area: true,
      lPhase: true,
      minDurationMinutes: true,
      maxDurationMinutes: true,
      csTargetMin: true,
      csTargetMax: true,
      clubKey: true,
      distanceBucket: true,
    },
  });

  // 5. For hver uke: opprett uke + økter
  for (let w = 0; w < allocation.weeks.length; w++) {
    const weekAlloc = allocation.weeks[w];
    const weekId = nanoid();

    await prisma.trainingPlanWeek.create({
      data: {
        id: weekId,
        planId,
        weekNumber: parseInt(format(weekAlloc.weekStart, "I")),
        weekStart: weekAlloc.weekStart,
        focus: `${weekAlloc.phase}${weekAlloc.triggers.length > 0 ? " — " + weekAlloc.triggers.join(", ") : ""}`,
      },
    });

    // Konverter %-fordeling til timer/uke
    const totalMinutes = opts.weeklyHours * 60;
    const sessionCount = opts.weeklyHours <= 3 ? 2 : opts.weeklyHours <= 6 ? 3 : 4;
    const minutesPerSession = Math.round(totalMinutes / sessionCount);

    // Fordel økter på områder
    const areaMinutes: Record<string, number> = {
      fysisk: Math.round(totalMinutes * (weekAlloc.allocation.fysisk / 100)),
      teknikk: Math.round(totalMinutes * (weekAlloc.allocation.teknikk / 100)),
      slag: Math.round(totalMinutes * (Object.values(weekAlloc.allocation.slag).reduce((a, b) => a + b, 0) / 100)),
      spill: Math.round(totalMinutes * (Object.values(weekAlloc.allocation.spill).reduce((a, b) => a + b, 0) / 100)),
      mental: Math.round(totalMinutes * (weekAlloc.allocation.mental / 100)),
    };

    // Lag økter
    const sessionDefs = buildSessionsFromAllocation(areaMinutes, minutesPerSession, sessionCount, w);

    for (let s = 0; s < sessionDefs.length; s++) {
      const sess = sessionDefs[s];
      const matchedExercises = matchExercises(sess.focusArea, exerciseDefs);

      const plannedExercises: PlannedExercise[] = [];
      for (let idx = 0; idx < matchedExercises.length; idx++) {
        const ex = matchedExercises[idx];
        const csTarget = ex.clubKey
          ? await resolveCSTarget(ex.id, opts.userId, opts.hcp).catch(() => null)
          : null;

        plannedExercises.push({
          id: nanoid(),
          exerciseDefinitionId: ex.id,
          name: ex.name,
          area: ex.area ?? undefined,
          lPhase: (ex.lPhase as "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO" | undefined) ?? undefined,
          cs: csTarget ? `${csTarget.carryMin}-${csTarget.carryMax}m` : undefined,
          durationMinutes: ex.minDurationMinutes ?? Math.round(sess.duration / matchedExercises.length),
          sortOrder: idx,
        });
      }

      await prisma.trainingPlanSession.create({
        data: {
          id: nanoid(),
          weekId,
          dayOfWeek: sess.dayOfWeek,
          title: sess.title,
          description: sess.description,
          durationMinutes: sess.duration,
          focusArea: sess.focusArea,
          exercises: plannedExercises as unknown as import("@prisma/client").Prisma.InputJsonValue,
          sortOrder: s,
        },
      });
    }
  }

  // 6. Lagre allokering i PlayerAllocation
  await prisma.playerAllocation.create({
    data: {
      userId: opts.userId,
      validFrom: weekStart,
      validTo: endDate,
      weeklyHours: opts.weeklyHours,
      weeks: allocation.weeks.map((w) => ({
        weekStart: w.weekStart.toISOString(),
        phase: w.phase,
        triggers: w.triggers,
        allocation: w.allocation,
      })) as unknown as import("@prisma/client").Prisma.InputJsonValue,
      source: allocation.source,
      rationale: allocation.rationale,
      inputSnapshot: allocInput as unknown as import("@prisma/client").Prisma.InputJsonValue,
    },
  });

  return planId;
}

interface SessionDef {
  dayOfWeek: number;
  title: string;
  description: string;
  duration: number;
  focusArea: string;
}

function buildSessionsFromAllocation(
  areaMinutes: Record<string, number>,
  minutesPerSession: number,
  sessionCount: number,
  weekIndex: number,
): SessionDef[] {
  // Roter startdager basert på ukeindeks for variasjon
  const baseDays = [1, 3, 5, 6]; // Man, Ons, Fre, Lør
  const days = baseDays.slice(0, sessionCount);

  const sessions: SessionDef[] = [];
  const areas = ["teknikk", "slag", "spill", "fysisk", "mental"] as const;

  for (let i = 0; i < sessionCount; i++) {
    const dayOfWeek = days[i];
    // Roter primært fokus
    const primaryArea = areas[(weekIndex + i) % areas.length];
    const areaName = areaMinutes[primaryArea] > 0 ? primaryArea : "teknikk";

    sessions.push({
      dayOfWeek,
      title: sessionTitle(areaName),
      description: `Fokus: ${areaName}. Auto-generert fra allokeringsmotor.`,
      duration: minutesPerSession,
      focusArea: areaName.toUpperCase(),
    });
  }

  return sessions;
}

function sessionTitle(area: string): string {
  switch (area) {
    case "fysisk": return "Fysisk trening & mobilitet";
    case "teknikk": return "Teknikk — full sving & grunnlag";
    case "slag": return "Slagspill — approach & lengde";
    case "spill": return "Nærspill & putting";
    case "mental": return "Mental trening & strategi";
    default: return "Allround økt";
  }
}

function matchExercises(
  focusArea: string,
  exercises: Array<{
    id: string;
    name: string;
    area: string;
    lPhase: string | null;
    minDurationMinutes: number;
    maxDurationMinutes: number;
    csTargetMin: number | null;
    csTargetMax: number | null;
    clubKey: string | null;
    distanceBucket: string | null;
  }>,
) {
  // Match øvelser basert på fokusområde
  const areaMap: Record<string, string[]> = {
    FYSISK: ["FYS"],
    TEKNIKK: ["TEK"],
    SLAG: ["SLAG"],
    SPILL: ["SPILL"],
    MENTAL: ["MENTAL"],
  };

  const targetCodes = areaMap[focusArea] ?? ["TEK"];
  const matched = exercises.filter((e) =>
    targetCodes.some((code) => e.area.includes(code))
  );

  // Ta maks 4 øvelser per økt, sorter etter variasjon
  return matched.length > 0
    ? matched.slice(0, 4)
    : exercises.slice(0, 4);
}
