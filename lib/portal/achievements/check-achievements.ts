import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { ACHIEVEMENT_DEFINITIONS } from "./definitions";

export interface UnlockedAchievement {
  key: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Idempotent achievement check — call after any action that might unlock achievements.
 * Returns list of newly unlocked achievements with details.
 */
export async function checkAchievements(userId: string): Promise<UnlockedAchievement[]> {
  const supabase = createServiceClient();
  
  // Ensure all definitions exist in DB
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    const { error } = await supabase
      .from("AchievementDefinition")
      .upsert({
        id: randomUUID(),
        key: def.key,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category,
        threshold: def.threshold,
        tierRequired: def.tierRequired,
        sortOrder: def.sortOrder,
      }, {
        onConflict: "key",
        ignoreDuplicates: false, // Update on conflict
      });
    
    if (error) {
      console.error(`[Achievements] Failed to upsert definition ${def.key}:`, error);
    }
  }

  // Get all definitions + what user already has
  const [definitionsRes, existingRes] = await Promise.all([
    supabase.from("AchievementDefinition").select("*"),
    supabase
      .from("PlayerAchievement")
      .select("achievementDefinitionId")
      .eq("userId", userId),
  ]);

  const definitions = definitionsRes.data || [];
  const existing = existingRes.data || [];

  const existingIds = new Set(existing.map((e) => e.achievementDefinitionId));
  const newlyUnlocked: UnlockedAchievement[] = [];

  // Gather player data for checks
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [
    trainingCountRes,
    coachingCountRes,
    tournamentPlanCountRes,
    goalCountRes,
    roundCountRes,
    underParRoundRes,
  ] = await Promise.all([
    supabase.from("TrainingLog").select("id", { count: "exact" }).eq("userId", userId),
    supabase.from("CoachingSession").select("id", { count: "exact" }).eq("studentId", userId),
    supabase.from("PlayerTournamentPlan").select("id", { count: "exact" }).eq("studentId", userId),
    supabase.from("Goal").select("id", { count: "exact" }).eq("userId", userId),
    supabase.from("RoundStats").select("id", { count: "exact" }).eq("userId", userId),
    supabase
      .from("RoundStats")
      .select("id")
      .eq("userId", userId)
      .lt("scoreToPar", 0)
      .limit(1)
      .single(),
  ]);

  const trainingCount = trainingCountRes.count || 0;
  const coachingCount = coachingCountRes.count || 0;
  const tournamentPlanCount = tournamentPlanCountRes.count || 0;
  const goalCount = goalCountRes.count || 0;
  const roundCount = roundCountRes.count || 0;
  const streak = await getStreak(userId);
  const handicap = await getLatestHandicap(userId);

  for (const def of definitions) {
    if (existingIds.has(def.id)) continue;

    let earned = false;

    switch (def.key) {
      case "first_training": earned = trainingCount >= 1; break;
      case "training_10": earned = trainingCount >= 10; break;
      case "training_50": earned = trainingCount >= 50; break;
      case "training_100": earned = trainingCount >= 100; break;
      case "week_streak": earned = streak >= 7; break;
      case "month_streak": earned = streak >= 30; break;
      case "first_round": earned = roundCount >= 1; break;
      case "under_par": earned = underParRoundRes.data !== null; break;
      case "hcp_under_20": earned = handicap !== null && handicap < 20; break;
      case "hcp_under_10": earned = handicap !== null && handicap < 10; break;
      case "hcp_under_5": earned = handicap !== null && handicap < 5; break;
      case "first_coaching": earned = coachingCount >= 1; break;
      case "coaching_10": earned = coachingCount >= 10; break;
      case "tournament_debut": earned = tournamentPlanCount >= 1; break;
      case "goal_setter": earned = goalCount >= 1; break;
    }

    if (earned) {
      const { error } = await supabase
        .from("PlayerAchievement")
        .insert({
          id: randomUUID(),
          userId,
          achievementDefinitionId: def.id,
        });
      
      if (!error) {
        newlyUnlocked.push({
          key: def.key,
          title: def.title,
          description: def.description,
          icon: def.icon,
        });
      }
    }
  }

  return newlyUnlocked;
}

async function getStreak(userId: string): Promise<number> {
  const supabase = createServiceClient();
  
  const { data: logs, error } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false });

  if (error || !logs || logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ].sort().reverse();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

async function getLatestHandicap(userId: string): Promise<number | null> {
  const supabase = createServiceClient();
  
  const { data: entry, error } = await supabase
    .from("HandicapEntry")
    .select("handicapIndex")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error || !entry) return null;
  return entry.handicapIndex;
}
