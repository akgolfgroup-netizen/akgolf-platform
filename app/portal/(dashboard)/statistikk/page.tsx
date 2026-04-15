import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFilteredRoundStats,
  getFilteredAggregates,
  getWeeklyTrainingVolume,
  getLatestHandicap,
} from "./actions";
import { StatistikkClient } from "./statistikk-client";
import type { PeriodKey } from "./actions";

const VALID_PERIODS: PeriodKey[] = ["30d", "90d", "season", "1y"];

interface StatistikkPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function StatistikkPage({ searchParams }: StatistikkPageProps) {
  await requirePortalUser();

  const params = await searchParams;
  const period: PeriodKey = VALID_PERIODS.includes(params.period as PeriodKey)
    ? (params.period as PeriodKey)
    : "30d";

  const [rounds, aggregates, weeklyTraining, handicap] = await Promise.all([
    getFilteredRoundStats(period),
    getFilteredAggregates(period),
    getWeeklyTrainingVolume(period),
    getLatestHandicap(),
  ]);

  return (
    <StatistikkClient
      rounds={rounds}
      aggregates={aggregates}
      weeklyTraining={weeklyTraining}
      handicap={handicap?.handicapIndex ?? null}
      currentPeriod={period}
    />
  );
}
