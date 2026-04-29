"use client";

import { CompareCard } from "./compare-card";
import {
  PEER_BENCHMARK,
  PYRAMID_BENCHMARK,
  percentile,
  type StatsAggregates,
} from "./stats-v2-helpers";

interface ComparisonGridProps {
  aggregates: StatsAggregates | null;
  trainingSessions30d: number;
}

/**
 * 6-korts sammenlignings-grid (Du vs Peer vs AK-pyramide).
 * Match a13-sammenligning.html.
 */
export function ComparisonGrid({
  aggregates,
  trainingSessions30d,
}: ComparisonGridProps) {
  return (
    <section className="col-span-12 mt-2">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
          >
            / Detaljert sammenligning
          </div>
          <h2
            className="mt-1.5 font-inter-tight text-[24px] font-bold tracking-[-0.025em]"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            Tre nivåer side om side
          </h2>
        </div>
        <div
          className="flex flex-wrap items-center gap-3 text-[11px]"
          style={{ color: "var(--color-ink-muted, #5C6B62)" }}
        >
          <Legend color="#005840" label="Du" />
          <Legend color="#6BB1FF" label="Peer (HCP 6–10)" />
          <Legend color="rgba(10, 31, 24, 0.2)" label="AK-pyramide median" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        <CompareCard
          title="Driver carry"
          subtitle="Meter · gjennomsnitt"
          percentile={
            aggregates?.avgDrivingDistance !== null && aggregates?.avgDrivingDistance !== undefined
              ? percentile(aggregates.avgDrivingDistance, PEER_BENCHMARK.drivingDistance)
              : 50
          }
          you={{
            value: aggregates?.avgDrivingDistance ?? 0,
            display: aggregates?.avgDrivingDistance
              ? `${Math.round(aggregates.avgDrivingDistance)} m`
              : "—",
          }}
          peer={{
            value: PEER_BENCHMARK.drivingDistance,
            display: `${PEER_BENCHMARK.drivingDistance} m`,
          }}
          pyramid={{
            value: PYRAMID_BENCHMARK.drivingDistance,
            display: `${PYRAMID_BENCHMARK.drivingDistance} m`,
          }}
          scaleMax={Math.max(
            aggregates?.avgDrivingDistance ?? 0,
            PEER_BENCHMARK.drivingDistance,
            PYRAMID_BENCHMARK.drivingDistance,
          ) * 1.15}
          delta={{
            value: aggregates?.avgDrivingDistance
              ? Math.round(aggregates.avgDrivingDistance - PEER_BENCHMARK.drivingDistance)
              : 0,
            suffix: " m",
          }}
        />

        <CompareCard
          title="SG · Off-the-tee"
          subtitle="Strokes Gained per runde"
          percentile={
            aggregates?.avgSgOffTheTee !== null && aggregates?.avgSgOffTheTee !== undefined
              ? percentile(aggregates.avgSgOffTheTee + 2, PEER_BENCHMARK.sgOffTheTee + 2)
              : 30
          }
          you={{
            value: (aggregates?.avgSgOffTheTee ?? 0) + 2,
            display:
              aggregates?.avgSgOffTheTee !== null && aggregates?.avgSgOffTheTee !== undefined
                ? `${aggregates.avgSgOffTheTee >= 0 ? "+" : ""}${aggregates.avgSgOffTheTee.toFixed(2)}`
                : "—",
          }}
          peer={{
            value: PEER_BENCHMARK.sgOffTheTee + 2,
            display: `+${PEER_BENCHMARK.sgOffTheTee.toFixed(1)}`,
          }}
          pyramid={{
            value: PYRAMID_BENCHMARK.sgOffTheTee + 2,
            display: `${PYRAMID_BENCHMARK.sgOffTheTee.toFixed(1)}`,
          }}
          scaleMax={4}
          delta={{
            value:
              aggregates?.avgSgOffTheTee !== null && aggregates?.avgSgOffTheTee !== undefined
                ? Number(
                    (aggregates.avgSgOffTheTee - PEER_BENCHMARK.sgOffTheTee).toFixed(1),
                  )
                : 0,
            suffix: " slag",
          }}
        />

        <CompareCard
          title="GIR-prosent"
          subtitle="Greens in regulation"
          percentile={
            aggregates?.avgGirPct !== null && aggregates?.avgGirPct !== undefined
              ? percentile(aggregates.avgGirPct, PEER_BENCHMARK.girPct)
              : 50
          }
          you={{
            value: aggregates?.avgGirPct ?? 0,
            display:
              aggregates?.avgGirPct !== null && aggregates?.avgGirPct !== undefined
                ? `${Math.round(aggregates.avgGirPct)} %`
                : "—",
          }}
          peer={{
            value: PEER_BENCHMARK.girPct,
            display: `${PEER_BENCHMARK.girPct} %`,
          }}
          pyramid={{
            value: PYRAMID_BENCHMARK.girPct,
            display: `${PYRAMID_BENCHMARK.girPct} %`,
          }}
          scaleMax={100}
          delta={{
            value:
              aggregates?.avgGirPct !== null && aggregates?.avgGirPct !== undefined
                ? Math.round(aggregates.avgGirPct - PEER_BENCHMARK.girPct)
                : 0,
            suffix: " %-poeng",
          }}
        />

        <CompareCard
          title="Putts per GIR"
          subtitle="Lavere er bedre"
          percentile={
            aggregates?.avgPuttsPerGir !== null && aggregates?.avgPuttsPerGir !== undefined
              ? percentile(aggregates.avgPuttsPerGir * 18, PEER_BENCHMARK.puttsPerRound, true)
              : 50
          }
          you={{
            value:
              aggregates?.avgPuttsPerGir !== null && aggregates?.avgPuttsPerGir !== undefined
                ? aggregates.avgPuttsPerGir * 18
                : 0,
            display:
              aggregates?.avgPuttsPerGir !== null && aggregates?.avgPuttsPerGir !== undefined
                ? (aggregates.avgPuttsPerGir * 18).toFixed(1)
                : "—",
          }}
          peer={{
            value: PEER_BENCHMARK.puttsPerRound,
            display: PEER_BENCHMARK.puttsPerRound.toFixed(1),
          }}
          pyramid={{
            value: PYRAMID_BENCHMARK.puttsPerRound,
            display: PYRAMID_BENCHMARK.puttsPerRound.toFixed(1),
          }}
          scaleMax={Math.max(
            aggregates?.avgPuttsPerGir
              ? aggregates.avgPuttsPerGir * 18
              : 0,
            PEER_BENCHMARK.puttsPerRound,
            PYRAMID_BENCHMARK.puttsPerRound,
          ) * 1.1}
          lowerIsBetter
          delta={{
            value:
              aggregates?.avgPuttsPerGir !== null && aggregates?.avgPuttsPerGir !== undefined
                ? Number(
                    (aggregates.avgPuttsPerGir * 18 - PEER_BENCHMARK.puttsPerRound).toFixed(1),
                  )
                : 0,
            suffix: " putt",
          }}
        />

        <CompareCard
          title="Scrambling-prosent"
          subtitle="Par fra rough/bunker"
          percentile={
            aggregates?.avgUpAndDownPct !== null && aggregates?.avgUpAndDownPct !== undefined
              ? percentile(aggregates.avgUpAndDownPct, PEER_BENCHMARK.scramblingPct)
              : 40
          }
          you={{
            value: aggregates?.avgUpAndDownPct ?? 0,
            display:
              aggregates?.avgUpAndDownPct !== null && aggregates?.avgUpAndDownPct !== undefined
                ? `${Math.round(aggregates.avgUpAndDownPct)} %`
                : "—",
          }}
          peer={{
            value: PEER_BENCHMARK.scramblingPct,
            display: `${PEER_BENCHMARK.scramblingPct} %`,
          }}
          pyramid={{
            value: PYRAMID_BENCHMARK.scramblingPct,
            display: `${PYRAMID_BENCHMARK.scramblingPct} %`,
          }}
          scaleMax={100}
          delta={{
            value:
              aggregates?.avgUpAndDownPct !== null && aggregates?.avgUpAndDownPct !== undefined
                ? Math.round(aggregates.avgUpAndDownPct - PEER_BENCHMARK.scramblingPct)
                : 0,
            suffix: " %-poeng",
          }}
        />

        <CompareCard
          title="Trening · 30 dager"
          subtitle="Antall økter logget"
          percentile={Math.min(95, Math.max(20, trainingSessions30d * 8 + 30))}
          you={{
            value: trainingSessions30d,
            display: `${trainingSessions30d} økter`,
          }}
          peer={{ value: 8, display: "8 økter" }}
          pyramid={{ value: 5, display: "5 økter" }}
          scaleMax={Math.max(trainingSessions30d, 12) * 1.2}
          delta={{
            value: trainingSessions30d - 8,
            suffix: " økter",
          }}
        />
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
