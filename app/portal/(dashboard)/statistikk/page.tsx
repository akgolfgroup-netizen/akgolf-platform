import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFilteredRoundStats,
  computeAggregates,
  getLatestHandicap,
  getGolfProfileSummary,
  getHcpForecast,
} from "./actions";
import { StatsV2Client } from "@/components/portal/statistikk/v2/stats-v2-client";
import type { PeriodKey } from "./actions";
import { getPlayerUSI } from "@/lib/portal/usi/actions";

export const metadata: Metadata = {
  title: "Statistikk | AK Golf",
  description:
    "Din golfstatistikk og progresjon. Strokes Gained, handicap-trend og benchmarks.",
  openGraph: {
    title: "Statistikk | AK Golf",
    description:
      "Din golfstatistikk og progresjon. Strokes Gained, handicap-trend og benchmarks.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statistikk | PlayersHQ",
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

  // Hver kall kan feile uavhengig — siden skal aldri 500'e fordi en data-kilde
  // mangler. Bruk .catch() per kall og fall tilbake til tom-state.
  const safe = <T,>(p: Promise<T>, label: string, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error(`[statistikk] ${label} failed:`, err);
      return fallback;
    });

  const emptyProfile = {
    roundCount30d: 0,
    avgScore30d: null,
    scoreTrend: "flat" as const,
    handicap: null,
    trainingSessions30d: 0,
    trainingMinutes30d: 0,
    streak: 0,
    topFocusAreas: [],
    trackManBestCarry: null,
    trackManBestBallSpeed: null,
    combinedInsights: [
      "Registrer runder og treningsøkter for å få personlige innsikter.",
    ],
  };

  const emptyHcpForecast = {
    history: [],
    currentHcp: null,
    predicted30d: null,
    predicted90d: null,
    ci30d: null,
    ci90d: null,
    trainingMinutes30d: 0,
    trainingSessions30d: 0,
    trendSlopePerWeek: 0,
  };

  // Aggregater deriveres fra samme rounds-fetch — ingen duplikat DB-query.
  const [rounds, handicap, profile, usiData, hcpForecast] = await Promise.all([
    safe(getFilteredRoundStats(period), "getFilteredRoundStats", []),
    safe(getLatestHandicap(), "getLatestHandicap", null),
    safe(getGolfProfileSummary(), "getGolfProfileSummary", emptyProfile),
    // getPlayerUSI(true, true) skriver til DB. Hvis brukeren ikke har data
    // (sgDims.sampleSize === 0) returnerer compute null — men selve write kan
    // krasje. Bruk read-only varianten her — persist gjøres i bakgrunnsjobb.
    safe(getPlayerUSI(false, false), "getPlayerUSI", null),
    safe(getHcpForecast(), "getHcpForecast", emptyHcpForecast),
  ]);

  const aggregates = computeAggregates(rounds);

  return (
    <StatsV2Client
      rounds={rounds}
      aggregates={aggregates}
      handicap={handicap?.handicapIndex ?? null}
      currentPeriod={period}
      hcpForecast={hcpForecast}
      usi={usiData?.usi ?? null}
      trainingSessions30d={profile.trainingSessions30d}
      streak={profile.streak}
    />
  );
}
