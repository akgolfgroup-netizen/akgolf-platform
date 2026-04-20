"use client";

/**
 * SG Ring — Pattern P-01 (v3.1)
 *
 * 4 konsentriske ringer for Strokes Gained:
 * Off-tee (sage), Approach (lime), Short game (coral), Putt (blue).
 *
 * Brukes i dashboard V2 Night Ops, V5 Cockpit, Statistikk, Analyse.
 * Kilde: /tmp/ak-golf-design/screens/dashboard-v2-night.html linje 268-298
 */

interface SGRingProps {
  offTee: number;
  approach: number;
  short: number;
  putt: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLegend?: boolean;
}

const SIZE_MAP = {
  sm: { box: 140, strokeWidth: 5, innerFont: 24 },
  md: { box: 180, strokeWidth: 6, innerFont: 32 },
  lg: { box: 240, strokeWidth: 7, innerFont: 42 },
};

const RADII = [82, 68, 54, 40];
const CIRCUMFERENCES = RADII.map((r) => 2 * Math.PI * r);

const COLORS = {
  approach: "var(--color-data-lime)",
  offTee: "var(--color-data-sage)",
  short: "var(--color-data-coral)",
  putt: "var(--color-data-blue)",
};

/**
 * Mapper en SG-verdi (typisk -2 til +2) til en ring-dashoffset.
 * Positive verdier fyller med klokka, negative teller motsatt (shown som "mangel").
 */
function valueToOffset(value: number, circumference: number): number {
  // Normaliser til 0-1 basert på [-2, +2]-skala, clamp
  const normalized = Math.max(0, Math.min(1, (value + 2) / 4));
  return circumference * (1 - normalized);
}

export function SGRing({
  offTee,
  approach,
  short,
  putt,
  size = "md",
  className = "",
  showLegend = true,
}: SGRingProps) {
  const { box, strokeWidth, innerFont } = SIZE_MAP[size];
  const total = offTee + approach + short + putt;
  const totalSign = total >= 0 ? "+" : "";

  const values = [approach, offTee, short, putt];
  const colors = [COLORS.approach, COLORS.offTee, COLORS.short, COLORS.putt];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        style={{ width: box, height: box }}
        className="relative"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {RADII.map((radius, i) => (
            <g key={radius}>
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={strokeWidth}
              />
              {/* Value ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={colors[i]}
                strokeWidth={strokeWidth}
                strokeDasharray={CIRCUMFERENCES[i]}
                strokeDashoffset={valueToOffset(values[i], CIRCUMFERENCES[i])}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.8s var(--ease-spring)",
                }}
              />
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            style={{ fontSize: innerFont }}
            className="font-semibold tracking-tight tabular-nums leading-none"
          >
            {totalSign}
            {total.toFixed(2)}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant mt-1">
            SG · Total
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="grid grid-cols-2 gap-2.5 mt-4 w-full max-w-[240px]">
          <LegendRow color={COLORS.approach} label="Approach" value={approach} />
          <LegendRow color={COLORS.offTee} label="Off-tee" value={offTee} />
          <LegendRow color={COLORS.short} label="Short" value={short} />
          <LegendRow color={COLORS.putt} label="Putt" value={putt} />
        </div>
      )}
    </div>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  const sign = value >= 0 ? "+" : "";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ background: color }}
      />
      <div className="text-[11px] text-on-surface-variant/60">{label}</div>
      <div className="font-mono text-[13px] font-semibold tabular-nums ml-auto">
        {sign}
        {value.toFixed(2)}
      </div>
    </div>
  );
}
