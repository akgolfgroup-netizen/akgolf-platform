import { prisma } from "@/lib/portal/prisma";
import { ACHIEVEMENT_DEFINITIONS } from "./definitions";

/**
 * Idempotent achievement check — call after any action that might unlock achievements.
 * Returns list of newly unlocked achievement keys.
 */
export async function checkAchievements(userId: string): Promise<string[]> {
  // Ensure all definitions exist in DB
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievementDefinition.upsert({
      where: { key: def.key },
      create: {
        key: def.key,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category,
        threshold: def.threshold,
        tierRequired: def.tierRequired,
        sortOrder: def.sortOrder,
      },
      update: {},
    });
  }

  // Get all definitions + what user already has
  const [definitions, existing] = await Promise.all([
    prisma.achievementDefinition.findMany(),
    prisma.playerAchievement.findMany({
      where: { userId },
      select: { achievementDefinitionId: true },
    }),
  ]);

  const existingIds = new Set(existing.map((e) => e.achievementDefinitionId));
  const newlyUnlocked: string[] = [];

  // Gather player data for checks
  const [trainingCount, coachingCount, tournamentPlanCount, goalCount, roundCount, streak, handicap, underParRound] =
    await Promise.all([
      prisma.trainingLog.count({ where: { userId } }),
      prisma.coachingSession.count({ where: { studentId: userId } }),
      prisma.playerTournamentPlan.count({ where: { studentId: userId } }),
      prisma.goal.count({ where: { userId } }),
      prisma.roundStats.count({ where: { userId } }),
      getStreak(userId),
      getLatestHandicap(userId),
      prisma.roundStats.findFirst({
        where: { userId, scoreToPar: { lt: 0 } },
      }),
    ]);

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
      case "under_par": earned = underParRound !== null; break;
      case "hcp_under_20": earned = handicap !== null && handicap < 20; break;
      case "hcp_under_10": earned = handicap !== null && handicap < 10; break;
      case "hcp_under_5": earned = handicap !== null && handicap < 5; break;
      case "first_coaching": earned = coachingCount >= 1; break;
      case "coaching_10": earned = coachingCount >= 10; break;
      case "tournament_debut": earned = tournamentPlanCount >= 1; break;
      case "goal_setter": earned = goalCount >= 1; break;
    }

    if (earned) {
      await prisma.playerAchievement.create({
        data: { userId, achievementDefinitionId: def.id },
      });
      newlyUnlocked.push(def.key);
    }
  }

  return newlyUnlocked;
}

async function getStreak(userId: string): Promise<number> {
  const logs = await prisma.trainingLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  if (logs.length === 0) return 0;

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
  const entry = await prisma.handicapEntry.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
    select: { handicapIndex: true },
  });
  return entry?.handicapIndex ?? null;
}
