export interface PyramidLevel {
  level: string;
  name: string;
  desc: string;
  hcpRange: string;
  population: number;
  isYou?: boolean;
}

interface PyramidCardProps {
  levels: PyramidLevel[];
  yourLevelLabel: string;
  /** Description shown next to the pyramid */
  description: string;
  stats: { label: string; value: string; smallSuffix?: string; accent?: boolean }[];
}

export function PyramidCard({
  levels,
  yourLevelLabel,
  description,
  stats,
}: PyramidCardProps) {
  return (
    <section
      className="rounded-2xl"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 28px",
      }}
    >
      <div className="grid gap-7" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="flex flex-col gap-1.5 py-3.5">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="grid items-center gap-3 px-3 py-2 rounded-lg"
              style={{
                gridTemplateColumns: "32px 1fr 80px 60px",
                border: lvl.isYou
                  ? "1px solid rgba(209,248,67,0.40)"
                  : "1px solid rgba(255,255,255,0.04)",
                background: lvl.isYou
                  ? "rgba(209,248,67,0.06)"
                  : "rgba(255,255,255,0.02)",
                boxShadow: lvl.isYou
                  ? "0 0 0 1px rgba(209,248,67,0.20)"
                  : undefined,
              }}
            >
              <div
                className="grid place-items-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: lvl.isYou ? "#D1F843" : "rgba(255,255,255,0.05)",
                  color: lvl.isYou ? "#0A1F18" : "rgba(255,255,255,0.7)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {lvl.level}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: lvl.isYou ? "#fff" : "rgba(255,255,255,0.85)",
                    fontWeight: lvl.isYou ? 700 : 500,
                  }}
                >
                  {lvl.name}
                </div>
                <small
                  style={{
                    display: "block",
                    fontSize: 10.5,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 400,
                    marginTop: 1,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {lvl.desc}
                </small>
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {lvl.hcpRange}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "right",
                }}
              >
                {lvl.population}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              margin: 0,
              marginBottom: 10,
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Du er på{" "}
            <em style={{ fontStyle: "normal", color: "#D1F843" }}>
              {yourLevelLabel}.
            </em>
          </h4>
          <p
            style={{
              margin: 0,
              marginBottom: 16,
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[10px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  padding: "12px 14px",
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
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: s.accent ? "#D1F843" : "#fff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.value}
                  {s.smallSuffix ? (
                    <small
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        marginLeft: 4,
                        fontWeight: 500,
                        letterSpacing: 0,
                      }}
                    >
                      {s.smallSuffix}
                    </small>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
