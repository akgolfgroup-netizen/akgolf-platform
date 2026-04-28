interface IzofHeroProps {
  /** Average focus score 0-10 */
  focusAvg: number;
  /** Average confidence 0-10 */
  confidenceAvg: number;
  /** Total rounds logged */
  totalRounds: number;
}

export function IzofHero({
  focusAvg,
  confidenceAvg,
  totalRounds,
}: IzofHeroProps) {
  // Use focusAvg as arousal proxy 0-10
  const arousal = Math.max(0, Math.min(10, focusAvg));
  const inZone = arousal >= 5.5 && arousal <= 7;
  const markerLeftPct = Math.max(2, Math.min(96, (arousal / 10) * 100));

  return (
    <section
      className="rounded-[22px] mb-6 grid gap-8"
      style={{
        gridTemplateColumns: "1.1fr 1fr",
        background:
          "radial-gradient(circle at 75% 30%, rgba(175,82,222,0.10), transparent 55%), #0F2E23",
        border: "1.5px solid rgba(175,82,222,0.30)",
        boxShadow: "0 0 32px rgba(175,82,222,0.10)",
        padding: "28px 32px",
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
            color: "#D4AAF7",
            fontWeight: 700,
          }}
        >
          IZOF · I dag
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
          Du er{" "}
          <em style={{ fontStyle: "normal", color: "#D4AAF7" }}>
            {inZone ? "i sonen" : arousal < 5.5 ? "underaktivert" : "overaktivert"}
          </em>
          .<br />
          {inZone
            ? "Bra dag for skills-trening."
            : arousal < 5.5
            ? "Aktiver med pust og bevegelse."
            : "Roe ned med rolig fokus-arbeid."}
        </h2>
        <p
          className="mt-3"
          style={{
            margin: 0,
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            maxWidth: "50ch",
          }}
        >
          Optimal arousal er 5.5–7.0 for de fleste spillere. Tallene under er
          basert på dine{" "}
          <span style={{ color: "#fff", fontWeight: 600 }}>{totalRounds}</span>{" "}
          loggede runder.
        </p>
      </div>

      <div
        className="rounded-2xl"
        style={{
          background: "rgba(0,0,0,0.18)",
          border: "1px solid rgba(175,82,222,0.20)",
          padding: "22px 24px",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 700,
            }}
          >
            Arousal · selvrapport
          </span>
          <span
            className="inline-flex items-center gap-1.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: inZone ? "#D1F843" : "#E8B967",
              fontWeight: 700,
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: 7,
                height: 7,
                background: inZone ? "#D1F843" : "#E8B967",
                boxShadow: inZone
                  ? "0 0 8px rgba(209,248,67,0.6)"
                  : "0 0 8px rgba(232,185,103,0.6)",
              }}
            />
            {arousal.toFixed(1)} / 10
          </span>
        </div>

        <div
          className="relative"
          style={{
            height: 28,
            borderRadius: 14,
            background:
              "linear-gradient(to right, #6BB1FF 0%, #D1F843 35%, #D1F843 65%, #F49283 100%)",
            margin: "6px 0 8px",
          }}
        >
          <div
            className="absolute"
            style={{
              top: 0,
              bottom: 0,
              left: "30%",
              right: "30%",
              background: "rgba(255,255,255,0.10)",
              borderLeft: "1.5px dashed rgba(255,255,255,0.50)",
              borderRight: "1.5px dashed rgba(255,255,255,0.50)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: -6,
              bottom: -6,
              left: `${markerLeftPct}%`,
              width: 4,
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 0 12px rgba(255,255,255,0.7)",
            }}
          />
        </div>

        <div
          className="grid mt-3.5"
          style={{
            gridTemplateColumns: "30% 40% 30%",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
            Underaktivert
          </span>
          <span
            style={{ textAlign: "center", color: "#D1F843", fontWeight: 700 }}
          >
            Optimal sone
          </span>
          <span style={{ textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
            Overaktivert
          </span>
        </div>

        <div
          className="grid gap-3 mt-3.5 pt-3"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <FootStat label="Fokus snitt" value={focusAvg.toFixed(1)} />
          <FootStat label="Selvtillit" value={confidenceAvg.toFixed(1)} />
          <FootStat label="Runder" value={String(totalRounds)} />
        </div>
      </div>
    </section>
  );
}

function FootStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
      <strong
        style={{
          display: "block",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </strong>
      {label}
    </div>
  );
}
