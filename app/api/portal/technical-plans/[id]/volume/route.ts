/**
 * GET /api/portal/technical-plans/[id]/volume
 *
 * Returnerer volum-assessment for en teknisk plan:
 * - Timer denne uken vs mål
 * - Reps per fase vs target
 * - Spacing-evaluering
 * - Anbefalinger
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import {
  getWeeklyTarget,
  assessSessionVolume,
  assessSpacing,
} from "@/lib/portal/training-research/volume-engine";
import {
  getPlayerCategory,
  getVolumeStatus,
  getRepsStatus,
  getSpacingStatus,
  VOLUME_LIMITS,
} from "@/lib/portal/training-research/constants";

function getWeekStart(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { id } = await params;

  const supabase = createServiceClient();

  // Hent plan med tilgangssjekk
  const { data: plan, error: planError } = await supabase
    .from("technical_plans")
    .select("player_id, coach_id, player_category, status")
    .eq("id", id)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.player_id !== user.id && plan.coach_id !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  // Hent faser med sessions
  const { data: phases } = await supabase
    .from("technical_plan_phases")
    .select(
      `
      id, title, status, area,
      target_reps, target_hours, target_balls,
      completed_reps, completed_hours, completed_balls,
      sessions:technical_plan_sessions(created_at, reps_done, hours_done, balls_done, data_quality)
    `
    )
    .eq("plan_id", id)
    .order("order", { ascending: true });

  if (!phases) {
    return NextResponse.json({ error: "Ingen faser funnet" }, { status: 404 });
  }

  // Bestem spillerkategori
  const category = (plan.player_category as
    | "BEGINNER"
    | "CLUB"
    | "SEMI_ELITE"
    | "ELITE_JUNIOR"
    | "PRO") ?? "BEGINNER";
  const weeklyTarget = getWeeklyTarget(category);

  // Beregn denne ukens volum
  const weekStart = getWeekStart(new Date());
  let weekHours = 0;
  let weekReps = 0;
  let weekBalls = 0;
  const allSessionDates: Date[] = [];

  for (const phase of phases) {
    const sessions = (phase.sessions as Array<{
      created_at: string;
      reps_done: number;
      hours_done: number;
      balls_done: number;
    }> | null) ?? [];

    for (const s of sessions) {
      const sessionDate = new Date(s.created_at);
      allSessionDates.push(sessionDate);

      if (sessionDate >= weekStart) {
        weekHours += s.hours_done ?? 0;
        weekReps += s.reps_done ?? 0;
        weekBalls += s.balls_done ?? 0;
      }
    }
  }

  // Volum-status
  const volumeStatus = getVolumeStatus(category, weekHours);
  const spacing = assessSpacing(allSessionDates);

  // Per-fase volum
  const phaseVolumes = phases.map((p) => {
    const sessions = (p.sessions as Array<{
      created_at: string;
      reps_done: number;
      hours_done: number;
      balls_done: number;
      data_quality: string;
    }> | null) ?? [];

    const totalReps = sessions.reduce((sum, s) => sum + (s.reps_done ?? 0), 0);
    const totalHours = sessions.reduce((sum, s) => sum + (s.hours_done ?? 0), 0);
    const totalBalls = sessions.reduce((sum, s) => sum + (s.balls_done ?? 0), 0);
    const lastSession = sessions.length > 0
      ? new Date(sessions[sessions.length - 1].created_at)
      : null;

    return {
      phaseId: p.id,
      title: p.title,
      status: p.status,
      targetReps: p.target_reps,
      targetHours: p.target_hours,
      targetBalls: p.target_balls,
      completedReps: totalReps,
      completedHours: Math.round(totalHours * 10) / 10,
      completedBalls: totalBalls,
      progressPct: p.target_reps > 0
        ? Math.min(100, Math.round((totalReps / p.target_reps) * 100))
        : 0,
      repsStatus: getRepsStatus(category, totalReps),
      lastSession: lastSession?.toISOString() ?? null,
      sessionCount: sessions.length,
    };
  });

  return NextResponse.json({
    weekly: {
      hours: Math.round(weekHours * 10) / 10,
      reps: weekReps,
      balls: weekBalls,
      targetHours: weeklyTarget.targetHours,
      targetReps: weeklyTarget.repsPerBlock * weeklyTarget.sessionsPerWeek,
      status: volumeStatus,
    },
    spacing: {
      ok: spacing.ok,
      gaps: spacing.gaps,
      warning: spacing.warning,
    },
    phases: phaseVolumes,
    category,
    limits: VOLUME_LIMITS[category],
  });
}
