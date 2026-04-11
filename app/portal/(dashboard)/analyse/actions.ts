"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { subMonths, subDays, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// ── Types ──

export interface AnalyseStats {
  girPercent: number | null;
  fairwayPercent: number | null;
  puttsPerRound: number | null;
  scramblingPercent: number | null;
  girTrend: number | null;
  fairwayTrend: number | null;
  puttsTrend: number | null;
  scramblingTrend: number | null;
  roundCount: number;
}

export interface StrokesGainedData {
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
}

export interface TrackManStat {
  label: string;
  value: string;
  unit: string;
  club: string;
}

// ── Helpers ──

function avg(vals: (number | null | undefined)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null && v !== undefined);
  return valid.length > 0
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : null;
}

function safePercent(
  numerator: (number | null | undefined)[],
  denominator: (number | null | undefined)[]
): number | null {
  let totalNum = 0;
  let totalDen = 0;
  for (let i = 0; i < numerator.length; i++) {
    const n = numerator[i];
    const d = denominator[i];
    if (n != null && d != null && d > 0) {
      totalNum += n;
      totalDen += d;
    }
  }
  return totalDen > 0 ? (totalNum / totalDen) * 100 : null;
}

// ── Actions ──

/**
 * Henter handicap-entries for chart (allerede brukt)
 */
export async function getHandicapEntries(months = 12) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: entries } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .gte("date", subMonths(new Date(), months).toISOString())
    .order("date", { ascending: true });

  return entries || [];
}

/**
 * Legger til en handicap-entry manuelt
 */
export async function addHandicapEntry(data: {
  date: string;
  handicapIndex: number;
  source?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const supabase = await createServerSupabase();

  await supabase.from("HandicapEntry").insert({
    id: nanoid(),
    userId: user.id,
    date: new Date(data.date).toISOString(),
    handicapIndex: data.handicapIndex,
    source: data.source ?? "MANUAL",
  });

  revalidatePath("/analyse");
}

/**
 * Beregner GIR%, Fairway%, Putts/runde og Scrambling%
 * fra siste 20 runder, med trend vs. forrige 20.
 */
export async function getAnalyseStats(): Promise<AnalyseStats> {
  const user = await requirePortalUser();
  if (!user?.id) {
    return {
      girPercent: null,
      fairwayPercent: null,
      puttsPerRound: null,
      scramblingPercent: null,
      girTrend: null,
      fairwayTrend: null,
      puttsTrend: null,
      scramblingTrend: null,
      roundCount: 0,
    };
  }

  const supabase = await createServerSupabase();

  const { data: rounds } = await supabase
    .from("RoundStats")
    .select(
      "gir, girTotal, fairwaysHit, fairwaysTotal, totalPutts, upAndDownMade, upAndDownTotal, date"
    )
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(40);

  if (!rounds || rounds.length === 0) {
    return {
      girPercent: null,
      fairwayPercent: null,
      puttsPerRound: null,
      scramblingPercent: null,
      girTrend: null,
      fairwayTrend: null,
      puttsTrend: null,
      scramblingTrend: null,
      roundCount: 0,
    };
  }

  const recent = rounds.slice(0, 20);
  const previous = rounds.slice(20, 40);

  const girPercent = safePercent(
    recent.map((r) => r.gir),
    recent.map((r) => r.girTotal)
  );
  const fairwayPercent = safePercent(
    recent.map((r) => r.fairwaysHit),
    recent.map((r) => r.fairwaysTotal)
  );
  const puttsPerRound = avg(recent.map((r) => r.totalPutts));
  const scramblingPercent = safePercent(
    recent.map((r) => r.upAndDownMade),
    recent.map((r) => r.upAndDownTotal)
  );

  // Trends (current vs. previous period)
  let girTrend: number | null = null;
  let fairwayTrend: number | null = null;
  let puttsTrend: number | null = null;
  let scramblingTrend: number | null = null;

  if (previous.length > 0) {
    const prevGir = safePercent(
      previous.map((r) => r.gir),
      previous.map((r) => r.girTotal)
    );
    const prevFairway = safePercent(
      previous.map((r) => r.fairwaysHit),
      previous.map((r) => r.fairwaysTotal)
    );
    const prevPutts = avg(previous.map((r) => r.totalPutts));
    const prevScrambling = safePercent(
      previous.map((r) => r.upAndDownMade),
      previous.map((r) => r.upAndDownTotal)
    );

    if (girPercent != null && prevGir != null) girTrend = girPercent - prevGir;
    if (fairwayPercent != null && prevFairway != null)
      fairwayTrend = fairwayPercent - prevFairway;
    if (puttsPerRound != null && prevPutts != null)
      puttsTrend = puttsPerRound - prevPutts;
    if (scramblingPercent != null && prevScrambling != null)
      scramblingTrend = scramblingPercent - prevScrambling;
  }

  return {
    girPercent,
    fairwayPercent,
    puttsPerRound,
    scramblingPercent,
    girTrend,
    fairwayTrend,
    puttsTrend,
    scramblingTrend,
    roundCount: recent.length,
  };
}

/**
 * Henter Strokes Gained-gjennomsnitt fra siste 20 runder.
 */
export async function getStrokesGainedData(): Promise<StrokesGainedData> {
  const user = await requirePortalUser();
  if (!user?.id) {
    return {
      sgOffTheTee: null,
      sgApproach: null,
      sgAroundTheGreen: null,
      sgPutting: null,
    };
  }

  const supabase = await createServerSupabase();

  const { data: rounds } = await supabase
    .from("RoundStats")
    .select("sgOffTheTee, sgApproach, sgAroundTheGreen, sgPutting")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(20);

  if (!rounds || rounds.length === 0) {
    return {
      sgOffTheTee: null,
      sgApproach: null,
      sgAroundTheGreen: null,
      sgPutting: null,
    };
  }

  return {
    sgOffTheTee: avg(rounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(rounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(rounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(rounds.map((r) => r.sgPutting)),
  };
}

/**
 * Henter siste TrackMan-data (siste 5 sesjoner, gruppert per klubb).
 * Returnerer gj.snitt for de viktigste metrikker.
 */
export async function getTrackManStats(): Promise<TrackManStat[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: sessions } = await supabase
    .from("TrackmanSession")
    .select("club, averages, sessionDate")
    .eq("userId", user.id)
    .order("sessionDate", { ascending: false })
    .limit(10);

  if (!sessions || sessions.length === 0) return [];

  // Find latest driver and iron sessions
  const driverSession = sessions.find(
    (s) => s.club?.toLowerCase().includes("driver")
  );
  const ironSession = sessions.find(
    (s) =>
      s.club?.toLowerCase().includes("7") ||
      s.club?.toLowerCase().includes("iron")
  );

  const stats: TrackManStat[] = [];

  if (driverSession?.averages) {
    const avgs = driverSession.averages as Record<string, number>;
    if (avgs.clubSpeed != null) {
      stats.push({
        label: "Klubbhastighet",
        value: avgs.clubSpeed.toFixed(1),
        unit: "mph",
        club: "Driver",
      });
    }
    if (avgs.ballSpeed != null) {
      stats.push({
        label: "Ballhastighet",
        value: avgs.ballSpeed.toFixed(1),
        unit: "mph",
        club: "Driver",
      });
    }
    if (avgs.launchAngle != null) {
      stats.push({
        label: "Launch angle",
        value: avgs.launchAngle.toFixed(1),
        unit: "grader",
        club: "Driver",
      });
    }
  }

  if (ironSession?.averages) {
    const avgs = ironSession.averages as Record<string, number>;
    if (avgs.spinRate != null) {
      stats.push({
        label: "Spin rate",
        value: Math.round(avgs.spinRate).toString(),
        unit: "rpm",
        club: ironSession.club || "Jern",
      });
    }
  }

  // If we got no structured data, try generic fields from latest session
  if (stats.length === 0 && sessions[0]?.averages) {
    const avgs = sessions[0].averages as Record<string, number>;
    const club = sessions[0].club || "Ukjent";
    if (avgs.clubSpeed != null) {
      stats.push({
        label: "Klubbhastighet",
        value: avgs.clubSpeed.toFixed(1),
        unit: "mph",
        club,
      });
    }
    if (avgs.ballSpeed != null) {
      stats.push({
        label: "Ballhastighet",
        value: avgs.ballSpeed.toFixed(1),
        unit: "mph",
        club,
      });
    }
    if (avgs.spinRate != null) {
      stats.push({
        label: "Spin rate",
        value: Math.round(avgs.spinRate).toString(),
        unit: "rpm",
        club,
      });
    }
    if (avgs.launchAngle != null) {
      stats.push({
        label: "Launch angle",
        value: avgs.launchAngle.toFixed(1),
        unit: "grader",
        club,
      });
    }
  }

  return stats.slice(0, 4);
}

/**
 * Treningslogger for analyse (beholdt fra originalt)
 */
export async function getTrainingLogsForAnalyse(days = 90) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select(
      `*,
      TrainingPlanSession (weekId, focusArea, durationMinutes)`
    )
    .eq("userId", user.id)
    .gte("date", subDays(new Date(), days).toISOString())
    .order("date", { ascending: true });

  return logs || [];
}

/**
 * Plan vs. actual (beholdt fra originalt)
 */
export async function getPlanVsActual(weeks = 8) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const from = subDays(new Date(), weeks * 7);

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(
      `id,
      TrainingPlanWeek (
        id,
        weekNumber,
        weekStart,
        TrainingPlanSession (
          id,
          TrainingLog (id)
        )
      )`
    )
    .eq("studentId", user.id)
    .eq("isActive", true)
    .gte("TrainingPlanWeek.weekStart", from.toISOString())
    .single();

  if (!plan) return [];

  const weeksData =
    (plan.TrainingPlanWeek as {
      weekNumber: number;
      weekStart: string;
      TrainingPlanSession: { TrainingLog: { id: string }[] }[];
    }[]) || [];

  return weeksData.map((week) => ({
    weekNumber: week.weekNumber,
    weekStart: new Date(week.weekStart),
    planned: week.TrainingPlanSession.length,
    completed: week.TrainingPlanSession.filter(
      (s) => s.TrainingLog.length > 0
    ).length,
  }));
}

/**
 * Konsistens-data (beholdt fra originalt)
 */
export async function getConsistencyData(days = 84) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const from = subDays(startOfDay(new Date()), days);

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", user.id)
    .gte("date", from.toISOString())
    .order("date", { ascending: true });

  return (logs || []).map(
    (l) => new Date(l.date).toISOString().split("T")[0]
  );
}
