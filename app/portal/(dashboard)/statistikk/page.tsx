import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFilteredRoundStats,
  getFilteredAggregates,
  getWeeklyTrainingVolume,
  getLatestHandicap,
  getGolfProfileSummary,
} from "./actions";
import { StatistikkClient } from "./statistikk-client";
import type { PeriodKey } from "./actions";
import { getPlayerUSI, getLatestTrainingPrescription } from "@/lib/portal/usi/actions";

export const metadata: Metadata = {
  title: "Statistikk | AK Golf Portal",
  description:
    "Din golfstatistikk og progresjon. Strokes Gained, handicap-trend og benchmarks.",
  openGraph: {
    title: "Statistikk | AK Golf Portal",
    description:
      "Din golfstatistikk og progresjon. Strokes Gained, handicap-trend og benchmarks.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statistikk | AK Golf Portal",
    description:
      "Din golfstatistikk og progresjon. Strokes Gained, handicap-trend og benchmarks.",
  },
};

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

  const [rounds, aggregates, weeklyTraining, handicap, profile, usiData, prescription] = await Promise.all([
    getFilteredRoundStats(period),
    getFilteredAggregates(period),
    getWeeklyTrainingVolume(period),
    getLatestHandicap(),
    getGolfProfileSummary(),
    getPlayerUSI(true, true),
    getLatestTrainingPrescription(),
  ]);

  return (
    <StatistikkClient
      rounds={rounds}
      aggregates={aggregates}
      weeklyTraining={weeklyTraining}
      handicap={handicap?.handicapIndex ?? null}
      currentPeriod={period}
      profile={profile}
      usi={usiData?.usi ?? null}
      prescription={prescription}
    />
  );
}
