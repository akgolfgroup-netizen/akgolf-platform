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

interface CompareConfig {
  key: string;
  title: string;
  subtitle: string;
  /**
   * Henter raw-verdi fra aggregates. null = mangler data.
   * trainingSessions30d sendes som ekstra parameter for kortet som ikke har
   * sin egen aggregat-felt.
   */
  getValue: (a: StatsAggregates | null, sessions30d: number) => number | null;
  /** Hvordan verdien skal vises i UI ("215 m", "+0.34", "52 %"). */
  formatDisplay: (v: number) => string;
  /** Peer-benchmark for sammenligning. */
  peerValue: number;
  formatPeer: (v: number) => string;
  /** Pyramide-benchmark. */
  pyramidValue: number;
  formatPyramid: (v: number) => string;
  /** Skala-maks for stablete barer. */
  scaleMax: (
    you: number | null,
    peerVal: number,
    pyramidVal: number,
  ) => number;
  lowerIsBetter?: boolean;
  /**
   * Beregner percentil med riktig retning. SG har positiv-shift (+2)
   * for at percentile-formelen skal handtere negative tall.
   */
  percentileTransform?: (you: number, peer: number) => number;
  /** Default-percentil nar verdi mangler. */
  defaultPercentile: number;
  /** Delta-formattering. */
  deltaSuffix: string;
  formatDelta: (you: number, peer: number) => number;
}

const COMPARE_CONFIGS: CompareConfig[] = [
  {
    key: "drivingDistance",
    title: "Driver carry",
    subtitle: "Meter · gjennomsnitt",
    getValue: (a) => a?.avgDrivingDistance ?? null,
    formatDisplay: (v) => `${Math.round(v)} m`,
    peerValue: PEER_BENCHMARK.drivingDistance,
    formatPeer: (v) => `${v} m`,
    pyramidValue: PYRAMID_BENCHMARK.drivingDistance,
    formatPyramid: (v) => `${v} m`,
    scaleMax: (you, peer, pyramid) => Math.max(you ?? 0, peer, pyramid) * 1.15,
    defaultPercentile: 50,
    deltaSuffix: " m",
    formatDelta: (you, peer) => Math.round(you - peer),
  },
  {
    key: "sgOffTheTee",
    title: "SG · Off-the-tee",
    subtitle: "Strokes Gained per runde",
    getValue: (a) => a?.avgSgOffTheTee ?? null,
    // SG-tall har egen formattering (+/- prefix og 2 desimaler)
    formatDisplay: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`,
    peerValue: PEER_BENCHMARK.sgOffTheTee,
    formatPeer: (v) => `+${v.toFixed(1)}`,
    pyramidValue: PYRAMID_BENCHMARK.sgOffTheTee,
    formatPyramid: (v) => `${v.toFixed(1)}`,
    scaleMax: () => 4,
    // SG kan vaere negativ — shift med +2 sa percentile/scaleMax handterer alle verdier positivt
    percentileTransform: (you, peer) => percentile(you + 2, peer + 2),
    defaultPercentile: 30,
    deltaSuffix: " slag",
    formatDelta: (you, peer) => Number((you - peer).toFixed(1)),
  },
  {
    key: "girPct",
    title: "GIR-prosent",
    subtitle: "Greens in regulation",
    getValue: (a) => a?.avgGirPct ?? null,
    formatDisplay: (v) => `${Math.round(v)} %`,
    peerValue: PEER_BENCHMARK.girPct,
    formatPeer: (v) => `${v} %`,
    pyramidValue: PYRAMID_BENCHMARK.girPct,
    formatPyramid: (v) => `${v} %`,
    scaleMax: () => 100,
    defaultPercentile: 50,
    deltaSuffix: " %-poeng",
    formatDelta: (you, peer) => Math.round(you - peer),
  },
  {
    key: "puttsPerRound",
    title: "Putts per GIR",
    subtitle: "Lavere er bedre",
    // avgPuttsPerGir er per-GIR — multipliser med 18 for sammenligning mot puttsPerRound
    getValue: (a) =>
      a?.avgPuttsPerGir !== null && a?.avgPuttsPerGir !== undefined
        ? a.avgPuttsPerGir * 18
        : null,
    formatDisplay: (v) => v.toFixed(1),
    peerValue: PEER_BENCHMARK.puttsPerRound,
    formatPeer: (v) => v.toFixed(1),
    pyramidValue: PYRAMID_BENCHMARK.puttsPerRound,
    formatPyramid: (v) => v.toFixed(1),
    scaleMax: (you, peer, pyramid) => Math.max(you ?? 0, peer, pyramid) * 1.1,
    lowerIsBetter: true,
    percentileTransform: (you, peer) => percentile(you, peer, true),
    defaultPercentile: 50,
    deltaSuffix: " putt",
    formatDelta: (you, peer) => Number((you - peer).toFixed(1)),
  },
  {
    key: "scramblingPct",
    title: "Scrambling-prosent",
    subtitle: "Par fra rough/bunker",
    getValue: (a) => a?.avgUpAndDownPct ?? null,
    formatDisplay: (v) => `${Math.round(v)} %`,
    peerValue: PEER_BENCHMARK.scramblingPct,
    formatPeer: (v) => `${v} %`,
    pyramidValue: PYRAMID_BENCHMARK.scramblingPct,
    formatPyramid: (v) => `${v} %`,
    scaleMax: () => 100,
    defaultPercentile: 40,
    deltaSuffix: " %-poeng",
    formatDelta: (you, peer) => Math.round(you - peer),
  },
  {
    key: "trainingSessions",
    title: "Trening · 30 dager",
    subtitle: "Antall økter logget",
    getValue: (_, sessions) => sessions,
    formatDisplay: (v) => `${Math.round(v)} økter`,
    peerValue: 8,
    formatPeer: (v) => `${v} økter`,
    pyramidValue: 5,
    formatPyramid: (v) => `${v} økter`,
    scaleMax: (you) => Math.max(you ?? 0, 12) * 1.2,
    // Trening har en egen percentil-formel (linear bonus per okt)
    percentileTransform: (you) => Math.min(95, Math.max(20, you * 8 + 30)),
    defaultPercentile: 50,
    deltaSuffix: " økter",
    formatDelta: (you, peer) => Math.round(you - peer),
  },
];

/**
 * 6-korts sammenlignings-grid (Du vs Peer vs AK-pyramide).
 * Match a13-sammenligning.html.
 *
 * Kortene er konfigurert via COMPARE_CONFIGS — legg til en ny entry der for
 * a vise et nytt mal uten a copy-paste 30+ JSX-linjer.
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
        {COMPARE_CONFIGS.map((cfg) => {
          const youValue = cfg.getValue(aggregates, trainingSessions30d);
          const hasYou = youValue !== null;

          const computedPercentile = hasYou
            ? cfg.percentileTransform
              ? cfg.percentileTransform(youValue, cfg.peerValue)
              : percentile(youValue, cfg.peerValue, cfg.lowerIsBetter)
            : cfg.defaultPercentile;

          // For SG: + 2 shift sa stablete barer ikke blir negative
          const isSg = cfg.key === "sgOffTheTee";
          const youBarValue = hasYou ? (isSg ? youValue + 2 : youValue) : 0;
          const peerBarValue = isSg ? cfg.peerValue + 2 : cfg.peerValue;
          const pyramidBarValue = isSg
            ? cfg.pyramidValue + 2
            : cfg.pyramidValue;

          return (
            <CompareCard
              key={cfg.key}
              title={cfg.title}
              subtitle={cfg.subtitle}
              percentile={computedPercentile}
              you={{
                value: youBarValue,
                display: hasYou ? cfg.formatDisplay(youValue) : "—",
              }}
              peer={{
                value: peerBarValue,
                display: cfg.formatPeer(cfg.peerValue),
              }}
              pyramid={{
                value: pyramidBarValue,
                display: cfg.formatPyramid(cfg.pyramidValue),
              }}
              scaleMax={cfg.scaleMax(
                youValue,
                cfg.peerValue,
                cfg.pyramidValue,
              )}
              lowerIsBetter={cfg.lowerIsBetter}
              delta={{
                value: hasYou ? cfg.formatDelta(youValue, cfg.peerValue) : 0,
                suffix: cfg.deltaSuffix,
              }}
            />
          );
        })}
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
