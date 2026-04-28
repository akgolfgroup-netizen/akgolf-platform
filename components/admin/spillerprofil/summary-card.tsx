import { Sparkles } from "lucide-react";
import { COLORS, SubHeader } from "./primitives";
import type { KpiBlock } from "./types";

/**
 * Sammendrag-kort: 4 stat-blocks + AI-tekst-blokk.
 */
export function SummaryCardLong({ kpis }: { kpis: KpiBlock[] }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-[12px]">
        {kpis.map((k) => (
          <SumKpi key={k.label} k={k} />
        ))}
      </div>
      <SubHeader>AI-sammendrag</SubHeader>
      <div
        className="rounded-[10px] p-[14px] text-[13px] leading-[1.6]"
        style={{
          background: "rgba(175,82,222,0.10)",
          border: "1px solid rgba(175,82,222,0.25)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <Sparkles
          className="mr-[6px] inline h-3.5 w-3.5 -translate-y-px"
          style={{ color: COLORS.violet }}
        />
        Sofie er i{" "}
        <strong style={{ color: COLORS.accent }}>topp 5%</strong> av Performance-spillerne siste 30 dager. Putting har eksplodert (+0.26 SG) etter tempo-fokus i april.{" "}
        <strong style={{ color: COLORS.warn }}>Around-green</strong> er nå svakeste ledd — anbefaler 2 ukers short-game-blokk før klubbmesterskapet 4. mai.
      </div>
    </div>
  );
}

function SumKpi({ k }: { k: KpiBlock }) {
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
