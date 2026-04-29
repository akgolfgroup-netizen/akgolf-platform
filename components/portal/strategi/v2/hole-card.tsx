import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  Sparkles,
} from "lucide-react";

export type StrategyTone = "safe" | "aggr" | "layup";

export interface HoleCardData {
  holeNumber: number;
  par: number;
  lengthMeter: number;
  hcp: number;
  name?: string;
  subtitle?: string;
  tone?: StrategyTone;
  isAutoSuggestion?: boolean;
  shots: { label: string; value: string; small?: string }[];
  missSide?: string;
  missDirection?: "left" | "right" | "up" | "down" | "ok";
}

const tonePillStyles: Record<StrategyTone, { bg: string; color: string; border: string }> = {
  safe: {
    bg: "rgba(42,125,90,0.20)",
    color: "#6FCBA1",
    border: "rgba(42,125,90,0.30)",
  },
  aggr: {
    bg: "rgba(232,93,78,0.18)",
    color: "#F49283",
    border: "rgba(232,93,78,0.30)",
  },
  layup: {
    bg: "rgba(196,138,50,0.22)",
    color: "#E8B967",
    border: "rgba(196,138,50,0.30)",
  },
};

const toneLabel: Record<StrategyTone, string> = {
  safe: "Trygg",
  aggr: "Aggressiv",
  layup: "Layup",
};

function MissIcon({ dir }: { dir: HoleCardData["missDirection"] }) {
  switch (dir) {
    case "left":
      return <ArrowLeft className="w-3.5 h-3.5" />;
    case "right":
      return <ArrowRight className="w-3.5 h-3.5" />;
    case "up":
      return <ArrowUp className="w-3.5 h-3.5" />;
    case "down":
      return <ArrowDown className="w-3.5 h-3.5" />;
    case "ok":
    default:
      return <Check className="w-3.5 h-3.5" />;
  }
}

export function HoleCard({ hole }: { hole: HoleCardData }) {
  const tone = hole.tone ?? "safe";
  const tStyle = tonePillStyles[tone];
  const isAi = hole.isAutoSuggestion;

  return (
    <div
      className="rounded-2xl relative grid"
      style={{
        gridTemplateColumns: "70px 1fr",
        gap: 18,
        padding: "18px 20px",
        background: isAi
          ? "linear-gradient(160deg, rgba(175,82,222,0.04), rgba(13,46,35,0)), #0F2E23"
          : "#0F2E23",
        border: isAi
          ? "1px solid rgba(175,82,222,0.30)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {isAi ? (
        <span
          className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(175,82,222,0.22)",
            border: "1px solid rgba(175,82,222,0.40)",
            color: "#D4AAF7",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <Sparkles className="w-2.5 h-2.5" /> Auto
        </span>
      ) : null}

      <div
        className="text-center flex flex-col justify-center gap-1 pr-4"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            fontSize: 30,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {hole.holeNumber}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 600,
          }}
        >
          PAR {hole.par}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#D1F843",
            fontWeight: 600,
          }}
        >
          {hole.lengthMeter} m
        </div>
        <div
          className="self-center mt-1 px-1.5 py-0.5 rounded"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          HCP {hole.hcp}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.005em",
              }}
            >
              {hole.name ?? `Hull ${hole.holeNumber}`}
            </div>
            {hole.subtitle ? (
              <small
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                {hole.subtitle}
              </small>
            ) : null}
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 flex-shrink-0"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
              background: tStyle.bg,
              color: tStyle.color,
              border: `1px solid ${tStyle.border}`,
            }}
          >
            {toneLabel[tone]}
          </span>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          {hole.shots.map((s, i) => (
            <div
              key={i}
              className="rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "7px 9px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#fff",
                  fontWeight: 600,
                  marginTop: 2,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
                {s.small ? (
                  <small
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 500,
                      marginLeft: 4,
                    }}
                  >
                    {s.small}
                  </small>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {hole.missSide ? (
          <div
            className="flex justify-between items-center rounded-lg px-2.5 py-1.5"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.08)",
              fontSize: 11.5,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Miss-side
            </span>
            <span
              className="flex items-center gap-1.5"
              style={{ color: "#fff", fontWeight: 600 }}
            >
              <span style={{ color: "#D1F843", display: "inline-flex" }}>
                <MissIcon dir={hole.missDirection ?? "ok"} />
              </span>
              {hole.missSide}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
