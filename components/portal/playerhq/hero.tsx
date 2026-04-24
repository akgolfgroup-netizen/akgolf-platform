"use client";

import { Icon } from "@/components/ui/icon";

type PillTone = "dark" | "accent" | "hatch" | "outline";

interface KpiPillProps {
  label: string;
  value: string;
  tone: PillTone;
  wide?: boolean;
}

export function KpiPill({ label, value, tone, wide }: KpiPillProps) {
  const baseW = wide ? 260 : 170;

  if (tone === "dark") {
    return (
      <div
        className="flex flex-col gap-0.5 rounded-full bg-on-surface px-4 py-2 text-white"
        style={{ minWidth: baseW }}
      >
        <span className="text-[10px] font-medium opacity-65 tracking-[-0.005em] lowercase">{label}</span>
        <span className="text-sm font-semibold tabular-nums">{value}</span>
      </div>
    );
  }

  if (tone === "accent") {
    return (
      <div
        className="flex flex-col gap-0.5 rounded-full px-4 py-2"
        style={{ minWidth: baseW, background: "var(--color-secondary-fixed)", color: "var(--color-on-secondary-fixed)" }}
      >
        <span className="text-[10px] font-medium opacity-65 tracking-[-0.005em]">{label}</span>
        <span className="text-sm font-bold tabular-nums">{value}</span>
      </div>
    );
  }

  if (tone === "hatch") {
    return (
      <div
        className="relative flex flex-col gap-0.5 overflow-hidden rounded-full px-4 py-2"
        style={{
          minWidth: baseW,
          background:
            "repeating-linear-gradient(135deg, rgba(28,28,22,0.13) 0 1.5px, transparent 1.5px 9px), var(--color-surface-container-low)",
        }}
      >
        <span className="text-[10px] font-medium tracking-[-0.005em] text-on-surface-variant">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-on-surface">{value}</span>
      </div>
    );
  }

  // outline
  return (
    <div
      className="relative flex flex-col gap-0.5 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low px-4 py-2"
      style={{ minWidth: baseW }}
    >
      <span className="text-[10px] font-medium tracking-[-0.005em] text-on-surface-variant">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-on-surface">{value}</span>
    </div>
  );
}

interface HeadlineStatProps {
  icon: string;
  value: string;
  label: string;
  accent?: boolean;
}

export function HeadlineStat({ icon, value, label, accent }: HeadlineStatProps) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span
        className="mb-2.5 inline-flex h-7 w-7 items-center justify-center self-end rounded-full"
        style={{
          background: accent ? "var(--color-secondary-fixed)" : "rgba(28,28,22,0.08)",
        }}
      >
        <Icon name={icon} size={14} className="text-on-surface" />
      </span>
      <div>
        <div
          className="text-[46px] font-medium leading-none tabular-nums text-on-surface"
          style={{ letterSpacing: "-0.03em" }}
        >
          {value}
        </div>
        <div className="mt-0.5 text-[11px] font-medium tracking-[-0.005em] text-on-surface-variant">
          {label}
        </div>
      </div>
    </div>
  );
}

interface PlayerHQHeroProps {
  userName: string | null;
  fairwayPct?: number;
  girPct?: number;
  scramblingPct?: number;
  scoringAvg?: number | null;
  roundsCount: number;
  sessionsCount: number;
  handicapTrend: number | null;
}

export function PlayerHQHero({
  userName,
  fairwayPct,
  girPct,
  scramblingPct,
  scoringAvg,
  roundsCount,
  sessionsCount,
  handicapTrend,
}: PlayerHQHeroProps) {
  const first = userName?.split(" ")[0] ?? "spiller";
  const fmtPct = (n?: number) => (typeof n === "number" ? `${Math.round(n)}%` : "—");
  const fmtAvg = (n?: number | null) =>
    typeof n === "number" ? n.toFixed(1) : "—";
  const trendLabel = handicapTrend != null
    ? (handicapTrend <= 0 ? `${handicapTrend.toFixed(1)}` : `+${handicapTrend.toFixed(1)}`)
    : "—";

  return (
    <section className="grid items-end gap-10 pb-6" style={{ gridTemplateColumns: "1fr auto" }}>
      <div>
        <h1
          className="mb-4 font-headline text-on-surface"
          style={{
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 18px",
          }}
        >
          Velkommen tilbake,{" "}
          <em className="italic font-medium">{first}</em>
        </h1>

        <div className="flex flex-wrap items-center gap-1.5">
          <KpiPill label="Fairways" value={fmtPct(fairwayPct)} tone="dark" />
          <KpiPill label="GIR" value={fmtPct(girPct)} tone="accent" />
          <KpiPill label="Scrambling" value={fmtPct(scramblingPct)} tone="hatch" />
          <KpiPill label="Scoring avg" value={fmtAvg(scoringAvg)} tone="outline" wide />
        </div>
      </div>

      <div className="flex items-end gap-7 pb-1">
        <HeadlineStat icon="flag" value={String(roundsCount)} label="Runder" />
        <HeadlineStat icon="exercise" value={String(sessionsCount)} label="Økter" />
        <HeadlineStat icon="trending_down" value={trendLabel} label="HCP ↓" accent />
      </div>
    </section>
  );
}
