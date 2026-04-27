interface MoodDay {
  /** Day label (Man/Tir/...) */
  day: string;
  /** Day number (1-31) */
  num: number;
  /** Score 0-10, null = empty */
  score: number | null;
  isToday?: boolean;
}

interface MoodWeekProps {
  days: MoodDay[];
}

function faceFor(score: number | null): string {
  if (score === null) return "—";
  if (score >= 8) return ":D";
  if (score >= 7) return ":)";
  if (score >= 5) return ":|";
  if (score >= 3) return ":(";
  return ":(";
}

export function MoodWeek({ days }: MoodWeekProps) {
  return (
    <section
      className="rounded-2xl"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "22px 24px",
      }}
    >
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map((d, i) => {
          const empty = d.score === null;
          return (
            <div
              key={i}
              className="rounded-xl text-center"
              style={{
                background: d.isToday
                  ? "rgba(209,248,67,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: d.isToday
                  ? "1px solid rgba(209,248,67,0.30)"
                  : "1px solid rgba(255,255,255,0.05)",
                padding: "12px 8px",
                opacity: empty ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {d.day}
                {d.isToday ? " · i dag" : ""}
              </div>
              <div
                className="mt-0.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {d.num}
              </div>
              <div
                className="mt-1.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 16,
                  color: empty ? "rgba(255,255,255,0.30)" : "#fff",
                  fontWeight: 700,
                }}
              >
                {faceFor(d.score)}
              </div>
              <div
                className="mt-1.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: empty ? "rgba(255,255,255,0.30)" : "#D1F843",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {empty ? "—" : d.score?.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
