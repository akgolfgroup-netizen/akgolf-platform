import { requirePortalUser } from "@/lib/portal/auth";
import { getStatsAggregates, getTrainingAreaBreakdown, getRoundStats } from "./actions";
import { getHandicapHistory } from "@/app/portal/(dashboard)/profil/actions";
import { StatistikkClient } from "./statistikk-client";

export default async function StatistikkPage() {
  await requirePortalUser();

  const [aggregates, handicapHistory, areaBreakdown, recentRounds] = await Promise.all([
    getStatsAggregates(),
    getHandicapHistory(12),
    getTrainingAreaBreakdown(),
    getRoundStats(3),
  ]);

  const currentHandicap = handicapHistory.length > 0
    ? handicapHistory[handicapHistory.length - 1].handicapIndex
    : null;

  const previousHandicap = handicapHistory.length > 1
    ? handicapHistory[0].handicapIndex
    : currentHandicap;

  const handicapTrend = currentHandicap && previousHandicap
    ? previousHandicap - currentHandicap
    : 0;

  // Use real data from aggregates, fallback to 0 if no data
  const sgData = {
    teeTotal: aggregates?.avgSgOffTheTee ?? 0,
    approach: aggregates?.avgSgApproach ?? 0,
    naerspill: aggregates?.avgSgAroundTheGreen ?? 0,
    putting: aggregates?.avgSgPutting ?? 0,
  };

  // Calculate total training minutes and focus area distribution
  const totalMinutes = areaBreakdown.reduce((sum, a) => sum + a.minutes, 0);
  const focusAreas = areaBreakdown
    .map((a, idx) => ({
      name: a.area,
      percent: totalMinutes > 0 ? Math.round((a.minutes / totalMinutes) * 100) : 0,
      color: idx === 0 ? "bg-[var(--apple-gold-500)]"
           : idx === 1 ? "bg-blue-500"
           : idx === 2 ? "bg-green-500"
           : "bg-purple-500",
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4);

  // Ensure we have 4 areas for display
  while (focusAreas.length < 4) {
    const defaultAreas = ["Putting", "Nærespill", "Approach", "Tee Total"];
    const colors = ["bg-[var(--apple-gold-500)]", "bg-blue-500", "bg-green-500", "bg-purple-500"];
    const existingNames = focusAreas.map(a => a.name);
    for (const name of defaultAreas) {
      if (!existingNames.includes(name) && focusAreas.length < 4) {
        focusAreas.push({ name, percent: 0, color: colors[focusAreas.length] });
      }
    }
  }

  // Identify weakest area for AI recommendation
  const nonZeroSg = Object.entries(sgData).filter(([, v]) => v !== 0);
  const weakestArea = nonZeroSg.length > 0
    ? nonZeroSg.sort((a, b) => a[1] - b[1])[0]
    : null;
  const weakestAreaName = weakestArea
    ? { teeTotal: "Tee Total", approach: "Approach", naerspill: "Nærespill", putting: "Putting" }[weakestArea[0]] ?? null
    : null;

  // Format recent rounds
  const formattedRounds = recentRounds.map(round => {
    const date = new Date(round.playedAt);
    const diff = round.totalScore - (round.coursePar ?? 72);
    return {
      date: date.getDate().toString(),
      month: date.toLocaleDateString("nb-NO", { month: "short" }).replace(".", ""),
      course: round.courseName ?? "Ukjent bane",
      par: round.coursePar ?? 72,
      score: round.totalScore,
      diff: diff >= 0 ? `+${diff}` : `${diff}`,
    };
  });

  // Calculate stats
  const roundsCount = aggregates?.roundCount ?? 0;
  const bestScore = aggregates?.bestScore ?? null;
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <StatistikkClient
      currentHandicap={currentHandicap}
      handicapTrend={handicapTrend}
      sgData={sgData}
      focusAreas={focusAreas}
      recentRounds={formattedRounds}
      roundsCount={roundsCount}
      bestScore={bestScore}
      totalHours={totalHours}
      weakestAreaName={weakestAreaName}
    />
  );
}
