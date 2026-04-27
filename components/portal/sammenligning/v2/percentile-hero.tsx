import { TrendingUp } from "lucide-react";

interface PercentileHeroProps {
  /** Percentile value (0-100) */
  percentile: number;
  /** Strongest area label (e.g. "greens og approach") */
  strongest?: string;
  /** Weakest area label (e.g. "SG Off-the-tee 23. percentil") */
  opportunity?: string;
  /** Peer count and group label */
  peerLabel?: string;
  /** Trend delta (e.g. +7) */
  delta90d?: number;
}

const RADIUS = 84;
const CIRC = 2 * Math.PI * RADIUS;

export function PercentileHero({
  percentile,
  strongest = "greens og approach",
  opportunity,
  peerLabel = "peer-gruppen",
  delta90d,
}: PercentileHeroProps) {
  const clamped = Math.max(0, Math.min(100, percentile));
  const offset = CIRC - (CIRC * clamped) / 100;
  const topPct = 100 - Math.round(clamped);

  return (
    <section
      className="rounded-[22px] p-7 mb-6 grid gap-8"
      style={{
        gridTemplateColumns: "1.1fr 1fr",
        border: "1.5px solid rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.10)",
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.05), rgba(13,46,35,0)), #0F2E23",
      }}
    >
      <div>
        <div
          className="mb-2.5"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#D1F843",
            fontWeight: 700,
          }}
        >
          Total benchmark
        </div>
        <h2
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}
        >
          Du ligger over{" "}
          <em style={{ fontStyle: "normal", color: "#D1F843" }}>
            {Math.round(clamped)} % av spillere
          </em>{" "}
          i din peer-gruppe.
        </h2>
        <p
          className="mt-3"
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            maxWidth: "50ch",
          }}
        >
          Sterkest på {strongest}.
          {opportunity ? ` Hovedmulighet: ${opportunity}.` : ""}
        </p>
      </div>

      <div className="flex items-center gap-6 justify-end">
        <div className="relative" style={{ width: 200, height: 200 }}>
          <svg
            width={200}
            height={200}
            viewBox="0 0 200 200"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={100}
              cy={100}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={14}
            />
            <circle
              cx={100}
              cy={100}
              r={RADIUS}
              fill="none"
              stroke="url(#percGrad)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="percGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D1F843" />
                <stop offset="100%" stopColor="#6FCBA1" />
              </linearGradient>
            </defs>
          </svg>
          <div
            className="absolute inset-0 grid place-items-center text-center"
          >
            <div>
              <div
                style={{
                  fontFamily: "'Inter Tight', Inter, sans-serif",
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#D1F843",
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {Math.round(clamped)}
                <small style={{ fontSize: 18 }}>%</small>
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Percentil
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#fff" }}>Topp {topPct} %</strong> av {peerLabel}
          {delta90d !== undefined ? (
            <div
              className="mt-1.5 inline-flex items-center gap-1"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: delta90d >= 0 ? "#6FCBA1" : "#F49283",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {delta90d >= 0 ? "+" : ""}
              {delta90d} percentiler · 90d
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
