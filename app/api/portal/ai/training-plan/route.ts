import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateTrainingPlan } from "@/lib/portal/ai/training-plan";
import { isStaff } from "@/lib/portal/rbac";
import { addDays, format, startOfISOWeek } from "date-fns";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
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
      studentId,
      createdById: user.id,
      title: result.title,
      goals,
      periodType,
      startDate: planStart,
      endDate: addDays(planStart, durationWeeks * 7 - 1),
      isActive: true,
      aiGenerated: true,
      weeks: {
        create: result.weeks.map((w) => {
          const weekStart = addDays(planStart, (w.weekNumber - 1) * 7);
          return {
            weekNumber: w.weekNumber,
            weekStart,
            focus: w.focus,
            volumeLabel: w.volumeLabel,
            sessions: {
              create: w.sessions.map((s, idx) => ({
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
    include: { weeks: { include: { sessions: true } } },
  });

  return NextResponse.json(plan);
}
