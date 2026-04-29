import { COLORS, SubHeader } from "./primitives";
import type { KpiBlock } from "./types";

/**
 * Trening-seksjonen: 4 KPIer + 4-ukers bar-graf med farger.
 * Mock — bytt ut med ekte TrainingLog/HRV-data senere.
 */
export function TrainingCardLong({ kpis }: { kpis: KpiBlock[] }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-[12px]">
        {kpis.map((k) => (
          <TrainKpi key={k.label} k={k} />
        ))}
      </div>
      <SubHeader>Fysisk aktivitet · 4 uker</SubHeader>
      <ActivityBars />
      <div
        className="mt-[6px] flex gap-[14px] font-mono text-[11px]"
        style={{ color: COLORS.textSubtle }}
      >
        <BarLegend swatch={COLORS.success} label="Trening" />
        <BarLegend swatch={COLORS.warn} label="Lett aktivitet" />
        <BarLegend swatch={COLORS.accent} label="Topp-økt" />
      </div>
    </div>
  );
}

function ActivityBars() {
  // Hardcoded fra mockup — 28 dager × farge
  const bars: Array<{ x: number; y: number; height: number; color: string }> = [
    { x: 0, y: 20, height: 20, color: COLORS.warn },
    { x: 25, y: 10, height: 30, color: COLORS.success },
    { x: 50, y: 30, height: 10, color: "rgba(255,255,255,0.12)" },
    { x: 75, y: 5, height: 35, color: COLORS.success },
    { x: 100, y: 15, height: 25, color: COLORS.success },
    { x: 125, y: 25, height: 15, color: COLORS.warn },
    { x: 150, y: 35, height: 5, color: "rgba(255,255,255,0.12)" },

    { x: 180, y: 10, height: 30, color: COLORS.success },
    { x: 205, y: 15, height: 25, color: COLORS.success },
    { x: 230, y: 25, height: 15, color: COLORS.warn },
    { x: 255, y: 5, height: 35, color: COLORS.success },
    { x: 280, y: 20, height: 20, color: COLORS.warn },
    { x: 305, y: 35, height: 5, color: "rgba(255,255,255,0.12)" },
    { x: 330, y: 10, height: 30, color: COLORS.success },

    { x: 360, y: 20, height: 20, color: COLORS.warn },
    { x: 385, y: 40, height: 0, color: "rgba(255,255,255,0.12)" },
    { x: 410, y: 35, height: 5, color: "rgba(255,255,255,0.12)" },
    { x: 435, y: 15, height: 25, color: COLORS.success },
    { x: 460, y: 25, height: 15, color: COLORS.warn },
    { x: 485, y: 20, height: 20, color: COLORS.warn },
    { x: 510, y: 10, height: 30, color: COLORS.success },

    { x: 540, y: 5, height: 35, color: COLORS.success },
    { x: 565, y: 10, height: 30, color: COLORS.success },
    { x: 590, y: 15, height: 25, color: COLORS.success },
    { x: 615, y: 25, height: 15, color: COLORS.warn },
    { x: 640, y: 0, height: 40, color: COLORS.accent },
    { x: 665, y: 10, height: 30, color: COLORS.success },
    { x: 690, y: 20, height: 20, color: COLORS.warn },
  ];

  const labels: { x: number; label: string }[] = [
    { x: 0, label: "UKE 14" },
    { x: 180, label: "UKE 15" },
    { x: 360, label: "UKE 16" },
    { x: 540, label: "UKE 17" },
  ];

  return (
    <svg viewBox="0 0 720 80" className="block h-[80px] w-full">
      {labels.map((l) => (
        <text
          key={l.x}
          x={l.x}
          y={14}
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="JetBrains Mono"
        >
          {l.label}
        </text>
      ))}
      <g transform="translate(0, 30)">
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={20}
            height={b.height}
            fill={b.color}
            rx={2}
          />
        ))}
      </g>
    </svg>
  );
}

function BarLegend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="rounded-[2px]"
        style={{ width: 8, height: 8, background: swatch }}
      />
      {label}
    </span>
  );
}

function TrainKpi({ k }: { k: KpiBlock }) {
  const trendColor =
    k.trend === "up"
      ? COLORS.success
      : k.trend === "down"
        ? COLORS.danger
        : COLORS.textSubtle;
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
        className="mt-[4px] text-[20px] font-bold tabular-nums tracking-[-0.02em]"
        style={{ color: COLORS.textPrimary }}
      >
        {k.value}
        {k.subText ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: COLORS.textSubtle }}
          >
            {k.subText}
          </small>
        ) : null}
        {k.trendLabel ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: trendColor }}
          >
            {k.trendLabel}
          </small>
        ) : null}
      </div>
    </div>
  );
}

export const TRAINING_KPIS: KpiBlock[] = [
  { label: "Søvn snitt 30d", value: "7.2t", trend: "up", trendLabel: "↗" },
  { label: "Hvilepuls", value: "52" },
  { label: "Trening 30d", value: "14", subText: "økter" },
  { label: "Skadestatus", value: "Mild rygg", trend: "down" },
];
