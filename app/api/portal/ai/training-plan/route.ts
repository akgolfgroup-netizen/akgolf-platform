import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
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

  const supabase = await createServerSupabase();

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
  const { error: deactivateError } = await supabase
    .from("TrainingPlan")
    .update({ isActive: false })
    .eq("studentId", studentId)
    .eq("isActive", true);

  if (deactivateError) {
    console.error("Failed to deactivate existing plans:", deactivateError);
  }

  const planStart = new Date(startDate);
  const planId = nanoid();

  // Create the training plan
  const { data: plan, error: planError } = await supabase
    .from("TrainingPlan")
    .insert({
      id: planId,
      studentId,
      createdById: user.id,
      title: result.title,
      goals: goals,
      periodType,
      startDate: planStart.toISOString().split("T")[0],
      endDate: addDays(planStart, durationWeeks * 7 - 1).toISOString().split("T")[0],
      isActive: true,
      aiGenerated: true,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (planError || !plan) {
    return NextResponse.json(
      { error: "Failed to create training plan" },
      { status: 500 }
    );
  }

  // Create weeks and sessions
  const weeks = [];
  for (const w of result.weeks) {
    const weekId = nanoid();
    const weekStart = addDays(planStart, (w.weekNumber - 1) * 7);

    // Insert week
    const { data: week, error: weekError } = await supabase
      .from("TrainingPlanWeek")
      .insert({
        id: weekId,
        planId: planId,
        weekNumber: w.weekNumber,
        weekStart: weekStart.toISOString().split("T")[0],
        focus: w.focus,
        volumeLabel: w.volumeLabel,
      })
      .select()
      .single();

    if (weekError) {
      console.error("Failed to create week:", weekError);
      continue;
    }

    // Insert sessions for this week
    const sessions = [];
    for (let idx = 0; idx < w.sessions.length; idx++) {
      const s = w.sessions[idx];
      const sessionId = nanoid();

      const { data: session, error: sessionError } = await supabase
        .from("TrainingPlanSession")
        .insert({
          id: sessionId,
          weekId: weekId,
          dayOfWeek: s.dayOfWeek,
          title: s.title,
          description: s.description,
          durationMinutes: s.durationMinutes,
          focusArea: s.focusArea,
          exercises: s.exercises,
          sortOrder: idx,
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Failed to create session:", sessionError);
      } else {
        sessions.push(session);
      }
    }

    weeks.push({
      ...week,
      TrainingPlanSession: sessions,
    });
  }

  return NextResponse.json({
    ...plan,
    TrainingPlanWeek: weeks,
  });
}
