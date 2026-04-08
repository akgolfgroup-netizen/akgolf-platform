"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSkillLevelByHandicap } from "@/lib/portal/golf/skill-levels";

export async function getPeerComparisonData() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  // Get current user's handicap to determine peer group
  const { data: latestHandicap } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestHandicap) return null;

  const skillLevel = getSkillLevelByHandicap(Math.round(latestHandicap.handicapIndex));
  if (!skillLevel) return null;

  // Get user's stats (last 10 rounds)
  const { data: myRounds } = await supabase
    .from("RoundStats")
    .select("*")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(10);

  if (!myRounds || myRounds.length === 0) return null;

  // Get all users in same handicap range
  const { data: peerUsers } = await supabase
    .from("HandicapEntry")
    .select("userId")
    .gte("handicapIndex", skillLevel.handicapRange[0])
    .lte("handicapIndex", skillLevel.handicapRange[1])
    .neq("userId", user.id);

  const peerUserIds = [...new Set((peerUsers || []).map((p) => p.userId))];

  // Get peer rounds
  const { data: peerRounds } = peerUserIds.length > 0
    ? await supabase
        .from("RoundStats")
        .select("*")
        .in("userId", peerUserIds)
        .order("date", { ascending: false })
        .limit(100)
    : { data: [] };

  function avg(vals: (number | null)[]): number | null {
    const valid = vals.filter((v): v is number => v !== null);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  }

  function pct(made: number, total: number): number | null {
    return total > 0 ? Math.round((made / total) * 100) : null;
  }

  const myStats = {
    sgTotal: avg(myRounds.map((r) => r.sgTotal)),
    sgOffTheTee: avg(myRounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(myRounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(myRounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(myRounds.map((r) => r.sgPutting)),
    avgScore: avg(myRounds.map((r) => r.totalScore)),
    fairwayPct: pct(
      myRounds.reduce((s, r) => s + (r.fairwaysHit ?? 0), 0),
      myRounds.reduce((s, r) => s + (r.fairwaysTotal ?? 0), 0)
    ),
    girPct: pct(
      myRounds.reduce((s, r) => s + (r.gir ?? 0), 0),
      myRounds.reduce((s, r) => s + (r.girTotal ?? 0), 0)
    ),
    puttsPerGir: avg(myRounds.map((r) => r.puttsPerGir)),
  };

  const myRoundStats = peerRounds || [];
  const peerStats = {
    sgTotal: avg(myRoundStats.map((r) => r.sgTotal)),
    sgOffTheTee: avg(myRoundStats.map((r) => r.sgOffTheTee)),
    sgApproach: avg(myRoundStats.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(myRoundStats.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(myRoundStats.map((r) => r.sgPutting)),
    avgScore: avg(myRoundStats.map((r) => r.totalScore)),
    fairwayPct: pct(
      myRoundStats.reduce((s, r) => s + (r.fairwaysHit ?? 0), 0),
      myRoundStats.reduce((s, r) => s + (r.fairwaysTotal ?? 0), 0)
    ),
    girPct: pct(
      myRoundStats.reduce((s, r) => s + (r.gir ?? 0), 0),
      myRoundStats.reduce((s, r) => s + (r.girTotal ?? 0), 0)
    ),
    puttsPerGir: avg(myRoundStats.map((r) => r.puttsPerGir)),
  };

  // Count categories where player is above average
  const sgCategories = ["sgOffTheTee", "sgApproach", "sgAroundTheGreen", "sgPutting"] as const;
  const aboveCount = sgCategories.filter((k) => {
    const mine = myStats[k];
    const theirs = peerStats[k];
    return mine !== null && theirs !== null && mine > theirs;
  }).length;

  return {
    skillLevel,
    handicap: latestHandicap.handicapIndex,
    peerCount: peerUserIds.length,
    myStats,
    peerStats,
    myRoundCount: myRounds.length,
    peerRoundCount: myRoundStats.length,
    aboveAverageCount: aboveCount,
    totalSGCategories: sgCategories.length,
  };
}
