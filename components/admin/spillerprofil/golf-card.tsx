import { COLORS, GoalCard, Panel, PanelHead, Pill, SgBar, SubHeader } from "./primitives";
import type { GoalRow, KpiBlock, SgRow } from "./types";

/**
 * Strokes Gained-tabell + summert total. Gjenbrukes i tabs (Oversikt + Golf).
 */
export function StrokesGainedPanel({
  rows,
  totalSg,
  sub = "vs. HCP-snitt",
  title = "Strokes Gained · 30d",
  labelWidth,
}: {
  rows: SgRow[];
  totalSg: number;
  sub?: string;
  title?: string;
  labelWidth?: number;
}) {
  return (
    <Panel>
      <PanelHead title={title} sub={sub} />
      {rows.map((row) => (
        <SgBar key={row.label} row={row} labelWidth={labelWidth ?? 110} />
      ))}
      <div
        className="mt-[12px] flex justify-between border-t border-dashed pt-[12px] text-[12px]"
        style={{ borderColor: COLORS.line }}
      >
        <span style={{ color: COLORS.textSubtle }}>Total SG</span>
        <span
          className="font-mono font-semibold"
          style={{ color: totalSg >= 0 ? COLORS.success : COLORS.danger }}
        >
          {totalSg >= 0 ? "+" : "−"}
          {Math.abs(totalSg).toFixed(2)} / runde
        </span>
      </div>
    </Panel>
  );
}

/**
 * HCP-tidslinje (12 mnd) som SVG. Mocked verdier — bytt ut med ekte
 * HandicapEntry-data senere.
 */
export function HcpTimelineSvg({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg viewBox="0 0 360 140" className="block h-[140px] w-full">
        <line x1="0" y1="40" x2="360" y2="40" stroke="rgba(255,255,255,0.05)" />
        <line x1="0" y1="80" x2="360" y2="80" stroke="rgba(255,255,255,0.05)" />
        <line
          x1="0"
          y1="100"
          x2="360"
          y2="100"
          stroke="rgba(209,248,67,0.4)"
          strokeDasharray="3 4"
        />
        <text
          x="356"
          y="98"
          fill="rgba(209,248,67,0.6)"
          fontSize="9"
          fontFamily="JetBrains Mono"
          textAnchor="end"
        >
          MÅL: 3.5
        </text>
        <path
          d="M 0 30 L 60 38 L 120 50 L 180 60 L 240 75 L 300 88 L 360 95 L 360 140 L 0 140 Z"
          fill="rgba(209,248,67,0.10)"
        />
        <polyline
          points="0,30 60,38 120,50 180,60 240,75 300,88 360,95"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="2"
        />
        <circle cx="300" cy="88" r="3" fill={COLORS.accent} />
        <circle cx="360" cy="95" r="3" fill={COLORS.accent} />
        <text x="0" y="135" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
          MAI 24
        </text>
        <text
          x="356"
          y="135"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="JetBrains Mono"
          textAnchor="end"
        >
          APR 25
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 720 180" className="block h-[180px] w-full">
      <line x1="0" y1="40" x2="720" y2="40" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="80" x2="720" y2="80" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="120" x2="720" y2="120" stroke="rgba(255,255,255,0.05)" />
      <line
        x1="0"
        y1="135"
        x2="720"
        y2="135"
        stroke="rgba(209,248,67,0.4)"
        strokeDasharray="3 4"
      />
      <text
        x="710"
        y="132"
        fill="rgba(209,248,67,0.6)"
        fontSize="9"
        fontFamily="JetBrains Mono"
        textAnchor="end"
      >
        MÅL: HCP 3.5
      </text>
      <path
        d="M 0 50 L 60 55 L 120 60 L 180 70 L 240 78 L 300 88 L 360 95 L 420 100 L 480 108 L 540 113 L 600 118 L 660 122 L 720 125 L 720 180 L 0 180 Z"
        fill="rgba(209,248,67,0.10)"
      />
      <polyline
        points="0,50 60,55 120,60 180,70 240,78 300,88 360,95 420,100 480,108 540,113 600,118 660,122 720,125"
        fill="none"
        stroke={COLORS.accent}
        strokeWidth="2"
      />
      <circle cx="540" cy="113" r="4" fill={COLORS.accent} />
      <circle cx="600" cy="118" r="4" fill={COLORS.accent} />
      <circle cx="660" cy="122" r="4" fill={COLORS.accent} />
      <text
        x="600"
        y="108"
        fill={COLORS.accent}
        fontSize="9"
        fontFamily="JetBrains Mono"
        textAnchor="middle"
      >
        ★ PR
      </text>
      <text x="4" y="44" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        8.0
      </text>
      <text x="4" y="84" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        6.0
      </text>
      <text x="4" y="124" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        4.2
      </text>
      <text x="0" y="170" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        MAI 24
      </text>
      <text x="240" y="170" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        SEP
      </text>
      <text x="480" y="170" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
        JAN 25
      </text>
      <text
        x="720"
        y="170"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="JetBrains Mono"
        textAnchor="end"
      >
        APR 25
      </text>
    </svg>
  );
}

/**
 * Aktive mål-panel.
 */
export function ActiveGoalsPanel({ goals }: { goals: GoalRow[] }) {
  return (
    <Panel>
      <PanelHead
        title="Aktive mål"
        sub={`${goals.filter((g) => g.percent >= 50).length} / ${goals.length} på sporet`}
        right={<Pill tone="accent">Mission Board →</Pill>}
      />
      <div className="flex flex-col gap-[10px]">
        {goals.map((g) => (
          <GoalCard key={g.name} goal={g} />
        ))}
      </div>
    </Panel>
  );
}

/**
 * Golf-kortet brukt i d8 long page (Strokes Gained venstre, HCP + mål høyre).
 */
export function GolfCardLong({
  sg,
  totalSg,
  goals,
}: {
  sg: SgRow[];
  totalSg: number;
  goals: GoalRow[];
}) {
  return (
    <div className="grid grid-cols-2 gap-[14px]">
      <div>
        <SubHeader first>Strokes Gained · 30d (vs. HCP-snitt)</SubHeader>
        {sg.map((row) => (
          <SgBar key={row.label} row={row} labelWidth={110} />
        ))}
        <div
          className="mt-[14px] flex justify-between border-t border-dashed pt-[12px] text-[12px]"
          style={{ borderColor: COLORS.line }}
        >
          <span style={{ color: COLORS.textSubtle }}>Total SG</span>
          <span
            className="font-mono font-semibold"
            style={{ color: totalSg >= 0 ? COLORS.success : COLORS.danger }}
          >
            {totalSg >= 0 ? "+" : "−"}
            {Math.abs(totalSg).toFixed(2)} / runde
          </span>
        </div>
      </div>
      <div>
        <SubHeader first>HCP-utvikling · 12 mnd</SubHeader>
        <HcpTimelineSvg compact />
        <SubHeader>Aktive mål</SubHeader>
        <div className="flex flex-col gap-[8px]">
          {goals.slice(0, 2).map((g) => (
            <GoalCard key={g.name} goal={g} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bare en KPI-strip med 4 stat-blocks. */
export function KpiStrip({ kpis }: { kpis: KpiBlock[] }) {
  return (
    <div className="grid grid-cols-4 gap-[12px]">
      {kpis.map((k) => (
        <StatBlockInline key={k.label} k={k} />
      ))}
    </div>
  );
}

function StatBlockInline({ k }: { k: KpiBlock }) {
  const trendColor =
    k.trend === "up" ? COLORS.success : k.trend === "down" ? COLORS.danger : COLORS.textSubtle;
  return (
    <div
      className="rounded-[10px] px-[14px] py-[12px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: COLORS.textTertiary }}
      >
        {k.label}
      </div>
      <div
        className="mt-[4px] text-[22px] font-bold tabular-nums tracking-[-0.02em]"
        style={{ color: COLORS.textPrimary }}
      >
        {k.value}
        {k.subText ? (
          <small
            className="ml-[4px] text-[11px] font-medium"
            style={{ color: COLORS.textSubtle }}
          >
            {k.subText}
          </small>
        ) : null}
        {k.trendLabel ? (
          <small
            className="ml-[4px] text-[11px] font-medium"
            style={{ color: trendColor }}
          >
            {k.trendLabel}
          </small>
        ) : null}
      </div>
    </div>
  );
}
