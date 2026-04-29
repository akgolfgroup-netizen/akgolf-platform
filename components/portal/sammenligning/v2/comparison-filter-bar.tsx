"use client";

import { Users, Layers, Download } from "lucide-react";

export type ComparePeriod = "30d" | "90d" | "season" | "all";

interface ComparisonFilterBarProps {
  period: ComparePeriod;
  onPeriodChange?: (next: ComparePeriod) => void;
  peerLabel: string;
  dataTypeLabel?: string;
  onExport?: () => void;
  exportDisabled?: boolean;
}

const PERIOD_LABEL: Record<ComparePeriod, string> = {
  "30d": "30d",
  "90d": "90d",
  season: "Sesong",
  all: "Alle",
};

const PERIODS: ComparePeriod[] = ["30d", "90d", "season", "all"];

/**
 * Filter-rad for /portal/sammenligning. Matcher a13-sammenligning.html.
 * Pixel-nær versjon av .cmp-filter med fire kolonner.
 */
export function ComparisonFilterBar({
  period,
  onPeriodChange,
  peerLabel,
  dataTypeLabel = "Alle stats",
  onExport,
  exportDisabled,
}: ComparisonFilterBarProps) {
  return (
    <div
      className="grid gap-3.5 mb-6"
      style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}
    >
      <FilterShell label="Periode">
        <div className="flex gap-1 mt-1.5">
          {PERIODS.map((p) => {
            const active = p === period;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange?.(p)}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  background: active ? "rgba(209,248,67,0.18)" : "transparent",
                  border: `1px solid ${
                    active ? "rgba(209,248,67,0.30)" : "rgba(255,255,255,0.06)"
                  }`,
                  color: active ? "#D1F843" : "rgba(255,255,255,0.6)",
                  cursor: onPeriodChange ? "pointer" : "default",
                }}
              >
                {PERIOD_LABEL[p]}
              </button>
            );
          })}
        </div>
      </FilterShell>

      <FilterShell label="Sammenlign mot">
        <div
          className="flex items-center gap-2 text-white text-sm font-semibold"
          style={{ marginTop: 2 }}
        >
          <Users className="w-3.5 h-3.5" style={{ color: "#D1F843" }} />
          {peerLabel}
        </div>
      </FilterShell>

      <FilterShell label="Datatype">
        <div
          className="flex items-center gap-2 text-white text-sm font-semibold"
          style={{ marginTop: 2 }}
        >
          <Layers className="w-3.5 h-3.5" style={{ color: "#D1F843" }} />
          {dataTypeLabel}
        </div>
      </FilterShell>

      <button
        type="button"
        onClick={onExport}
        disabled={exportDisabled}
        className="inline-flex items-center gap-2 px-4 rounded-xl text-xs font-semibold disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <Download className="w-3.5 h-3.5" />
        Eksporter
      </button>
    </div>
  );
}

function FilterShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
