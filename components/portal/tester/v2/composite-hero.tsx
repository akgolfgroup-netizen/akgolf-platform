import { TrendingUp } from "lucide-react";

interface CompositeHeroProps {
  /** Composite score 0-100 */
  score: number;
  /** Best test name */
  bestTestName: string | null;
  totalScore: number;
}

const RADIUS = 68;
const CIRC = 2 * Math.PI * RADIUS;

export function CompositeHero({
  score,
  bestTestName,
  totalScore,
}: CompositeHeroProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = CIRC - (CIRC * clamped) / 100;
  const grade =
    clamped >= 90 ? "A" : clamped >= 80 ? "A−" : clamped >= 70 ? "B+" : clamped >= 60 ? "B" : clamped >= 50 ? "C+" : "C";

  return (
    <section
      className="rounded-[22px] mb-6 grid items-center gap-7"
      style={{
        gridTemplateColumns: "1.2fr 1fr 1fr",
        background: "#0F2E23",
        border: "1.5px solid rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.10)",
        padding: "28px 32px",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#D1F843",
            fontWeight: 700,
          }}
        >
          Total fitness-score
        </div>
        <h2
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            margin: "4px 0 8px",
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.025em",
          }}
        >
          Du er{" "}
          <span style={{ color: "#D1F843" }}>
            {clamped >= 70 ? "test-ready" : "i utvikling"}
          </span>{" "}
          for sesongen.
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.55,
            maxWidth: "38ch",
          }}
        >
          Testene oppdateres etter hver gjennomføring. Beste test:{" "}
          <span style={{ color: "#fff", fontWeight: 600 }}>
            {bestTestName ?? "—"}
          </span>
          .
        </p>
      </div>

      <div className="text-center">
        <div className="relative" style={{ width: 160, height: 160, margin: "0 auto" }}>
          <svg
            width={160}
            height={160}
            viewBox="0 0 160 160"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={80}
              cy={80}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={12}
            />
            <circle
              cx={80}
              cy={80}
              r={RADIUS}
              fill="none"
              stroke="url(#testGrad)"
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="testGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D1F843" />
                <stop offset="100%" stopColor="#6FCBA1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div
                style={{
                  fontFamily: "'Inter Tight', Inter, sans-serif",
                  fontSize: 44,
                  fontWeight: 800,
                  color: "#D1F843",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(clamped)}
                <small
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    marginLeft: 1,
                  }}
                >
                  /100
                </small>
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                Composite
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-2"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}
        >
          Karakter: <strong style={{ color: "#fff" }}>{grade}</strong>
        </div>
      </div>

      <div
        className="rounded-2xl"
        style={{
          background: "rgba(0,0,0,0.18)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 8,
          }}
        >
          Total score (alle tester)
        </div>
        <div
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            fontSize: 32,
            color: "#fff",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {totalScore.toLocaleString("nb-NO")}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#6FCBA1",
            fontWeight: 700,
          }}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Trend stabil
        </div>
      </div>
    </section>
  );
}
