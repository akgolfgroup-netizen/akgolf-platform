"use client";

import { Sparkles } from "lucide-react";

interface StrategiAiSummaryProps {
  /** Bane-navn for tittel */
  courseName?: string;
  /** Hovedbeskjed (kort, fet) */
  headline?: string;
  /** Lengre beskrivelse */
  summary?: string;
  /** 3 nøkkel-tall i bunnrad */
  keys?: { value: string; label: string }[];
}

/**
 * AI-Coach banegjennomgang. Matcher .ai-card i a14-strategi.html.
 * Vises ved siden av CourseHero.
 */
export function StrategiAiSummary({
  courseName,
  headline,
  summary,
  keys,
}: StrategiAiSummaryProps) {
  const showHeadline =
    headline ?? (courseName ? `Plan for ${courseName}.` : "Velg bane først.");
  const showSummary =
    summary ??
    "AI-Coach lager forslag basert på dine swing-data, banens trekk og siste runder. Klikk «AI · regener strategi» for å oppdatere.";
  const showKeys = keys ?? [
    { value: "—", label: "Par 5 i 2" },
    { value: "—", label: "Vind-justering" },
    { value: "—", label: "Realistisk FW%" },
  ];

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 28px",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-50%",
          right: "-20%",
          width: "70%",
          height: "200%",
          background:
            "radial-gradient(ellipse at center, rgba(175,82,222,0.08), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col gap-3">
        <div
          className="inline-flex items-center gap-2.5"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#C99CF3",
            fontWeight: 700,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Coach · banegjennomgang
        </div>
        <h3
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            margin: 0,
            fontSize: 17,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
          }}
        >
          {showHeadline}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
          }}
        >
          {showSummary}
        </p>
        <div
          className="flex gap-3.5 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {showKeys.map((k, i) => (
            <div
              key={i}
              style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 1,
                }}
              >
                {k.value}
              </strong>
              {k.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
