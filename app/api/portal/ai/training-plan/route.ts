import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateTrainingPlan } from "@/lib/portal/ai/training-plan";
import { isStaff } from "@/lib/portal/rbac";
import { addDays } from "date-fns";
import { nanoid } from "nanoid";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  // Rate limiting per user
  const rateLimit = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt og prøv igjen." },
      { status: 429 }
    );
  }

  const { studentId, goals, periodType, durationWeeks, startDate } =
    await req.json();

  if (!studentId || !goals || !periodType || !durationWeeks || !startDate) {
    return NextResponse.json({ error: "Mangler påkrevde felt" }, { status: 400 });
  }

  const result = await generateTrainingPlan({
    goals,
    periodType,
    durationWeeks,
    startDate,
  });

  // Deactivate existing plans
  await prisma.trainingPlan.updateMany({
    where: { studentId, isActive: true },
    data: { isActive: false },
  });

  const planStart = new Date(startDate);

  const plan = await prisma.trainingPlan.create({
    data: {
      id: nanoid(),
      studentId,
      createdById: user.id,
      title: result.title,
      goals,
      periodType,
      startDate: planStart,
      endDate: addDays(planStart, durationWeeks * 7 - 1),
      isActive: true,
      aiGenerated: true,
      updatedAt: new Date(),
      TrainingPlanWeek: {
        create: result.weeks.map((w) => {
          const weekStart = addDays(planStart, (w.weekNumber - 1) * 7);
          return {
            id: nanoid(),
            weekNumber: w.weekNumber,
            weekStart,
            focus: w.focus,
            volumeLabel: w.volumeLabel,
            TrainingPlanSession: {
              create: w.sessions.map((s, idx) => ({
                id: nanoid(),
                dayOfWeek: s.dayOfWeek,
                title: s.title,
                description: s.description,
                durationMinutes: s.durationMinutes,
                focusArea: s.focusArea,
                exercises: s.exercises,
                sortOrder: idx,
              })),
            },
          };
        }),
      },
    },
    include: { TrainingPlanWeek: { include: { TrainingPlanSession: true } } },
  });

  return NextResponse.json(plan);
}
