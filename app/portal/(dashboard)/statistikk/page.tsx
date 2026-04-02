import { requirePortalUser } from "@/lib/portal/auth";
import {
  getRoundStats,
  getStatsAggregates,
  getTrainingAreaBreakdown,
  getLatestHandicap,
} from "./actions";
import { StatistikkClient } from "./statistikk-client";

export default async function StatistikkPage() {
  await requirePortalUser();

  const [rounds, aggregates, breakdown, handicap] = await Promise.all([
    getRoundStats(),
    getStatsAggregates(),
    getTrainingAreaBreakdown(),
    getLatestHandicap(),
  ]);

  return (
    <StatistikkClient
      rounds={rounds}
      aggregates={aggregates}
      breakdown={breakdown}
      handicap={handicap}
    />
  );
}
