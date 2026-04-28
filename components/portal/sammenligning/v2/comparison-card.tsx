import { TrendingUp, TrendingDown } from "lucide-react";

export interface ComparisonRow {
  label: "Du" | "Peer" | "Pyramide";
  value: string;
  /** Bar fill width in % (0-100) */
  pct: number;
}

interface ComparisonCardProps {
  title: string;
  subtitle: string;
  /** Percentile string like "82" or "23" */
  percentile: number;
  rows: ComparisonRow[];
  deltaLabel: string;
  /** Text shown next to trend arrow, e.g. "+17 yds (+7.0%)" */
  deltaValue: string;
  /** Whether delta is positive (green) or negative (red) */
  deltaPositive: boolean;
}

const swatchColor: Record<ComparisonRow["label"], string> = {
  Du: "#D1F843",
  Peer: "#6BB1FF",
  Pyramide: "rgba(255,255,255,0.30)",
};

const fillColor: Record<ComparisonRow["label"], string> = {
  Du: "#D1F843",
  Peer: "#6BB1FF",
  Pyramide: "rgba(255,255,255,0.30)",
};

export function ComparisonCard({
  title,
  subtitle,
  percentile,
  rows,
  deltaLabel,
  deltaValue,
  deltaPositive,
}: ComparisonCardProps) {
  const percVariant =
    percentile >= 50 ? "good" : percentile >= 30 ? "below" : "way-below";

  const percStyles: Record<string, { bg: string; color: string }> = {
    good: { bg: "rgba(209,248,67,0.18)", color: "#D1F843" },
    below: { bg: "rgba(196,138,50,0.22)", color: "#E8B967" },
    "way-below": { bg: "rgba(184,66,51,0.22)", color: "#F49283" },
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              marginTop: 2,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </div>
        </div>
        <span
          className="px-2 py-1 rounded-md font-bold"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            background: percStyles[percVariant].bg,
            color: percStyles[percVariant].color,
          }}
        >
          {percentile}. PERC
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span
                className="flex items-center gap-1.5"
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: swatchColor[row.label],
                    display: "inline-block",
                  }}
                />
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#fff",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.value}
              </span>
            </div>
            <div
              style={{
                height: 12,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(0, Math.min(100, row.pct))}%`,
                  background: fillColor[row.label],
                  borderRadius: "inherit",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 pt-3.5 flex justify-between items-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {deltaLabel}
        </span>
        <span
          className="inline-flex items-center gap-1"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            color: deltaPositive ? "#6FCBA1" : "#F49283",
          }}
        >
          {deltaPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {deltaValue}
        </span>
      </div>
    </div>
  );
}
