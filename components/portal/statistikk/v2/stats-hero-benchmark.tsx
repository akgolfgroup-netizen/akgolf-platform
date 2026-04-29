import { TrendingUp } from "lucide-react";

interface StatsHeroBenchmarkProps {
  percentile: number | null;
  peerLabel: string;
  peerCount: number | null;
  delta90d: number | null;
  headline: string;
  lede: string;
}

/**
 * Hero benchmark-kort — match a13-sammenligning.html.
 * Mørk gradient med stort percentil-dial og lede-tekst.
 */
export function StatsHeroBenchmark({
  percentile,
  peerLabel,
  peerCount,
  delta90d,
  headline,
  lede,
}: StatsHeroBenchmarkProps) {
  const pct = percentile ?? 0;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, pct / 100)));

  return (
    <section
      className="col-span-12 relative overflow-hidden rounded-2xl border p-7 lg:p-8 text-white"
      style={{
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.06) 0%, rgba(13,46,35,0) 60%), linear-gradient(135deg, #0A1F18 0%, #0F2E22 60%, #1A3F30 100%)",
        borderColor: "rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.10)",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-80px",
          right: "-60px",
          width: "320px",
          height: "320px",
          background:
            "radial-gradient(circle, rgba(209, 248, 67, 0.18), transparent 70%)",
        }}
      />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#D1F843" }}
          >
            Total benchmark
          </div>
          <h2 className="mt-2.5 text-[28px] font-bold leading-[1.18] tracking-[-0.025em] text-balance">
            {headline}
          </h2>
          <p
            className="mt-3 max-w-[50ch] text-sm leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {lede}
          </p>
        </div>

        <div className="flex items-center gap-6 justify-self-end">
          <div className="relative h-[180px] w-[180px] lg:h-[200px] lg:w-[200px]">
            <svg
              className="h-full w-full"
              viewBox="0 0 200 200"
              style={{ transform: "rotate(-90deg)" }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="dial-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D1F843" />
                  <stop offset="100%" stopColor="#6FCBA1" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="14"
              />
              {percentile !== null ? (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="url(#dial-gradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              ) : null}
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div
                  className="text-[44px] lg:text-5xl font-bold leading-none tabular-nums tracking-[-0.04em]"
                  style={{
                    color: "#D1F843",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {percentile !== null ? Math.round(percentile) : "—"}
                  {percentile !== null ? (
                    <span className="text-lg align-top">%</span>
                  ) : null}
                </div>
                <div
                  className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Percentil
                </div>
              </div>
            </div>
          </div>

          <div
            className="text-xs leading-[1.65] hidden sm:block"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <strong className="text-white">
              Topp {percentile !== null ? Math.max(0, 100 - Math.round(percentile)) : "—"} %
            </strong>
            <br />
            av {peerLabel}
            {peerCount !== null ? (
              <>
                <br />
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  (n = {peerCount} spillere)
                </span>
              </>
            ) : null}
            {delta90d !== null && delta90d !== 0 ? (
              <div
                className="mt-2.5 inline-flex items-center gap-1 font-mono text-[13px] font-bold"
                style={{
                  color: delta90d > 0 ? "#6FCBA1" : "#F49283",
                }}
              >
                <TrendingUp
                  className="h-3.5 w-3.5"
                  style={{
                    transform: delta90d < 0 ? "rotate(180deg)" : undefined,
                  }}
                />
                {delta90d > 0 ? "+" : ""}
                {delta90d} percentiler · 90d
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
