"use client";

import { MessageCircle } from "lucide-react";

interface PlanHeroProps {
  headline: string;
  highlight?: string;
  lede: string;
  monthLabel: string;
  monthPercent: number;
  hcpNow: string;
  hcpTarget: string;
  nextMilestone: string;
  onTalk?: () => void;
}

export function PlanHero({
  headline,
  highlight,
  lede,
  monthLabel,
  monthPercent,
  hcpNow,
  hcpTarget,
  nextMilestone,
  onTalk,
}: PlanHeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] p-8"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, rgba(209,248,67,0.18), transparent 50%), linear-gradient(135deg, rgba(13,46,35,0.95), rgba(10,31,24,1))",
        border: "1.5px solid rgba(209,248,67,0.25)",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-60px",
          right: "-60px",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(209,248,67,0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <h1
          className="m-0 max-w-[16ch] font-bold tracking-[-0.035em] text-white"
          style={{ fontSize: 44, lineHeight: 1.05 }}
        >
          {headline}
          {highlight ? (
            <>
              {" "}
              <span style={{ color: "#D1F843" }}>{highlight}</span>
            </>
          ) : null}
        </h1>
        <p
          className="mt-3.5 mb-6 max-w-[56ch] text-[15px]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {lede}
        </p>

        <div className="flex flex-wrap items-center gap-8">
          <PlanMetaItem label={monthLabel} value={`${Math.round(monthPercent)}%`} />
          <PlanMetaItem
            label="HCP nå → mål"
            value={
              <>
                {hcpNow} →{" "}
                <span style={{ color: "#D1F843" }}>{hcpTarget}</span>
              </>
            }
          />
          <PlanMetaItem label="Neste milestone" value={nextMilestone} />

          <div className="ml-auto">
            <button
              type="button"
              onClick={onTalk}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                background: "#D1F843",
                color: "#0A1F18",
                boxShadow: "0 0 0 1px rgba(209,248,67,0.5), 0 8px 24px rgba(209,248,67,0.18)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Snakk med coachen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanMetaItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="font-mono text-[9px] uppercase"
        style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </div>
      <div
        className="mt-0.5 text-[22px] font-bold tabular-nums tracking-[-0.02em] text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
    </div>
  );
}
