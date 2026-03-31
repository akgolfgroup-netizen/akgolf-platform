import { requirePortalUser } from "@/lib/portal/auth";
import {
  getRoundStats,
  getStatsAggregates,
  getTrainingAreaBreakdown,
} from "./actions";
import { StatistikkClient } from "./statistikk-client";

export default async function StatistikkPage() {
  await requirePortalUser();

  const [rounds, aggregates, breakdown] = await Promise.all([
    getRoundStats(),
    getStatsAggregates(),
    getTrainingAreaBreakdown(),
  ]);

  return (
    <StatistikkClient
      rounds={rounds}
      aggregates={aggregates}
      breakdown={breakdown}
    />
  );
}
