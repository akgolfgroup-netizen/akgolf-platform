"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";

export interface ChatContext {
  userName: string;
  handicap: number | null;
  recentRounds: {
    date: string;
    courseName: string | null;
    totalScore: number | null;
    sgTotal: number | null;
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  }[];
  recentTrainingLogs: {
    date: string;
    focusArea: string | null;
    durationMinutes: number | null;
    notes: string | null;
    rating: number | null;
  }[];
  activePlan: {
    title: string;
    periodType: string;
    startDate: string;
    endDate: string;
  } | null;
  trackmanAverages: {
    club: string;
    averages: Record<string, unknown>;
  }[];
  upcomingTournaments: {
    name: string;
    startDate: string;
    course: string | null;
  }[];
}

export async function getChatContext(): Promise<ChatContext> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const [
    { data: handicapEntry },
    { data: recentRounds },
    { data: recentLogs },
    { data: activePlan },
    { data: trackmanSessions },
    { data: tournamentPlans },
  ] = await Promise.all([
    supabase
      .from("HandicapEntry")
      .select("handicapIndex")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("RoundStats")
      .select("date, courseName, totalScore, sgTotal, sgOffTheTee, sgApproach, sgAroundTheGreen, sgPutting")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(10),
    supabase
      .from("TrainingLog")
      .select("date, focusArea, durationMinutes, notes, rating")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(20),
    supabase
      .from("TrainingPlan")
      .select("title, periodType, startDate, endDate")
      .eq("studentId", user.id)
      .eq("isActive", true)
      .order("createdAt", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("TrackmanSession")
      .select("club, averages")
      .eq("userId", user.id)
      .order("sessionDate", { ascending: false })
      .limit(5),
    supabase
      .from("PlayerTournamentPlan")
      .select(`
        Tournament (name, startDate, course)
      `)
      .eq("studentId", user.id)
      .gte("Tournament.startDate", new Date().toISOString())
      .order("Tournament.startDate", { ascending: true })
      .limit(3),
  ]);

  return {
    userName: user.name ?? "Spiller",
    handicap: handicapEntry?.handicapIndex ?? null,
    recentRounds: (recentRounds || []).map((r) => ({
      date: new Date(r.date).toISOString(),
      courseName: r.courseName,
      totalScore: r.totalScore,
      sgTotal: r.sgTotal,
      sgApproach: r.sgApproach,
      sgOffTheTee: r.sgOffTheTee,
      sgAroundTheGreen: r.sgAroundTheGreen,
      sgPutting: r.sgPutting,
    })),
    recentTrainingLogs: (recentLogs || []).map((l) => ({
      date: new Date(l.date).toISOString(),
      focusArea: l.focusArea,
      durationMinutes: l.durationMinutes,
      notes: l.notes,
      rating: l.rating,
    })),
    activePlan: activePlan
      ? {
          title: activePlan.title,
          periodType: activePlan.periodType,
          startDate: new Date(activePlan.startDate).toISOString(),
          endDate: new Date(activePlan.endDate).toISOString(),
        }
      : null,
    trackmanAverages: (trackmanSessions || []).map((t) => ({
      club: t.club,
      averages: t.averages as Record<string, unknown>,
    })),
    upcomingTournaments: (tournamentPlans || []).map((tp) => ({
      name: (tp.Tournament as { name: string }).name,
      startDate: new Date((tp.Tournament as { startDate: string }).startDate).toISOString(),
      course: (tp.Tournament as { course: string | null }).course,
    })),
  };
}

export async function getQuickInsight(): Promise<string> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const [
    { data: lastRound },
    { data: lastLog },
    { data: handicap },
  ] = await Promise.all([
    supabase
      .from("RoundStats")
      .select("date, totalScore, sgTotal, sgOffTheTee, sgApproach, sgAroundTheGreen, sgPutting")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("TrainingLog")
      .select("date, focusArea, rating")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("HandicapEntry")
      .select("handicapIndex")
      .eq("userId", user.id)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const parts: string[] = [];
  if (handicap) {
    parts.push(`Handicap: ${handicap.handicapIndex}`);
  }
  if (lastRound) {
    const sgParts: string[] = [];
    if (lastRound.sgOffTheTee !== null)
      sgParts.push(`Tee: ${lastRound.sgOffTheTee.toFixed(1)}`);
    if (lastRound.sgApproach !== null)
      sgParts.push(`Approach: ${lastRound.sgApproach.toFixed(1)}`);
    if (lastRound.sgAroundTheGreen !== null)
      sgParts.push(`Kortspill: ${lastRound.sgAroundTheGreen.toFixed(1)}`);
    if (lastRound.sgPutting !== null)
      sgParts.push(`Putting: ${lastRound.sgPutting.toFixed(1)}`);
    parts.push(`Siste runde: ${lastRound.totalScore ?? "?"} (SG: ${sgParts.join(", ")})`);
  }
  if (lastLog) {
    const daysAgo = Math.floor(
      (Date.now() - new Date(lastLog.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    parts.push(
      `Siste trening: ${daysAgo === 0 ? "i dag" : `${daysAgo} dager siden`} (${lastLog.focusArea ?? "generell"})`
    );
  }

  if (parts.length === 0) {
    return "Ingen data registrert enna. Logg din forste runde eller trening for a fa innsikt.";
  }

  return parts.join(" | ");
}
