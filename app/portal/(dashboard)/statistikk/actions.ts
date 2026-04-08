"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";

export async function getRoundStats() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: rounds } = await supabase
    .from("Round")
    .select(`
      *,
      HoleScore(*),
      Course(name)
    `)
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(20);

  return rounds || [];
}

export async function getStatsAggregates() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  // Calculate aggregates from rounds
  const { data: rounds } = await supabase
    .from("Round")
    .select("totalScore, putts, fairwaysHit, gir")
    .eq("userId", user.id);

  if (!rounds || rounds.length === 0) {
    return {
      roundsPlayed: 0,
      avgScore: 0,
      avgPutts: 0,
      fairwayPercentage: 0,
      girPercentage: 0,
    };
  }

  const totalRounds = rounds.length;
  const avgScore = rounds.reduce((sum, r) => sum + (r.totalScore || 0), 0) / totalRounds;
  const avgPutts = rounds.reduce((sum, r) => sum + (r.putts || 0), 0) / totalRounds;
  const fairwayPercentage = rounds.reduce((sum, r) => sum + (r.fairwaysHit || 0), 0) / totalRounds;
  const girPercentage = rounds.reduce((sum, r) => sum + (r.gir || 0), 0) / totalRounds;

  return {
    roundsPlayed: totalRounds,
    avgScore: Math.round(avgScore * 10) / 10,
    avgPutts: Math.round(avgPutts * 10) / 10,
    fairwayPercentage: Math.round((fairwayPercentage / 14) * 100),
    girPercentage: Math.round((girPercentage / 18) * 100),
  };
}

export async function getTrainingAreaBreakdown() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  // TODO: Implementer treningsområde-oppsummering
  return {
    driving: { sessions: 0, avgScore: 0 },
    approach: { sessions: 0, avgScore: 0 },
    shortGame: { sessions: 0, avgScore: 0 },
    putting: { sessions: 0, avgScore: 0 },
  };
}

export async function getLatestHandicap() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: entry } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  return entry || null;
}

export async function getHandicapHistory() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: entries } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(20);

  return entries || [];
}

export async function getPlayerStatistics() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: stats } = await supabase
    .from("RoundStats")
    .select("*")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .single();

  const { data: rounds } = await supabase
    .from("Round")
    .select("*, HoleScore(*)")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(10);

  return {
    stats,
    recentRounds: rounds || [],
  };
}
