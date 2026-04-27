"use client";

import { Rocket, MessageCircle, Download } from "lucide-react";

const BANDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"] as const;

export interface TalentHeroProps {
  level: (typeof BANDS)[number];
  targetLevel: (typeof BANDS)[number];
  percentile: number;
  hcpCurrent: number;
  hcpTarget: number;
  hcpTrend90d: number;
  description: string;
}

export function TalentHero({
  level,
  targetLevel,
  percentile,
  hcpCurrent,
  hcpTarget,
  hcpTrend90d,
  description,
}: TalentHeroProps) {
  const currentIdx = BANDS.indexOf(level);
  const targetIdx = BANDS.indexOf(targetLevel);

  return (
    <section
      className="relative overflow-hidden rounded-[22px] border-[1.5px] px-8 py-7 mb-6 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]"
      style={{
        background:
          "radial-gradient(circle at 80% 25%, rgba(209,248,67,0.12), transparent 55%), #0D2E23",
        borderColor: "rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.10)",
      }}
    >
      <div>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2.5">
          USI · nåværende bånd
        </div>
        <h2 className="font-display m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.025em] text-white">
          Du er <em className="not-italic text-[#D1F843]">nivå {level}</em>
          <br />
          på vei mot {targetLevel} innen 12 mnd.
        </h2>
        <p className="mt-3 text-sm leading-[1.6] text-white/70 max-w-[50ch]">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1F843] bg-[#D1F843] px-3.5 py-2 text-sm font-semibold text-[#0A1F18] transition hover:bg-[#C7EE3F]">
            <Rocket className="w-3.5 h-3.5" strokeWidth={2.4} />
            Se utviklingsplan
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <MessageCircle className="w-3.5 h-3.5" />
            Diskuter med coach
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/5">
            <Download className="w-3.5 h-3.5" />
            Eksporter
          </button>
        </div>
      </div>

      <BandRibbon
        currentIdx={currentIdx}
        targetIdx={targetIdx}
        percentile={percentile}
        hcpCurrent={hcpCurrent}
        hcpTarget={hcpTarget}
        hcpTrend90d={hcpTrend90d}
      />
    </section>
  );
}

function BandRibbon({
  currentIdx,
  targetIdx,
  percentile,
  hcpCurrent,
  hcpTarget,
  hcpTrend90d,
}: {
  currentIdx: number;
  targetIdx: number;
  percentile: number;
  hcpCurrent: number;
  hcpTarget: number;
  hcpTrend90d: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-4">
      <div className="flex items-end justify-between mb-3.5">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
          USI-bånd · A til K
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.10em] text-[#D1F843] bg-[#D1F843]/[0.18] px-2 py-0.5 rounded">
          {percentile}. percentil
        </span>
      </div>

      <div className="grid grid-cols-11 gap-[3px] mb-7 mt-5">
        {BANDS.map((band, idx) => {
          const isYou = idx === currentIdx;
          const isTarget = idx === targetIdx;
          const isPassed = idx > currentIdx;
          return (
            <div
              key={band}
              className={[
                "relative h-[38px] rounded-md grid place-items-center font-mono text-[11px] font-bold transition",
                isYou
                  ? "bg-[#D1F843] text-[#0A1F18] scale-110 shadow-[0_0_16px_rgba(209,248,67,0.40)]"
                  : isTarget
                    ? "border-[1.5px] border-dashed border-[#D1F843]/40 bg-[#D1F843]/10 text-[#D1F843]/85"
                    : isPassed
                      ? "bg-white/10 text-white/65"
                      : "bg-white/[0.04] text-white/45",
              ].join(" ")}
            >
              {band}
              {isYou && (
                <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold tracking-[0.14em] text-[#D1F843]">
                  DU
                </span>
              )}
              {isTarget && (
                <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] font-bold tracking-[0.10em] text-[#D1F843]/85">
                  MÅL 12mnd
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
        <RibbonStat label="Nåværende" value={`HCP ${hcpCurrent.toFixed(1)}`} />
        <RibbonStat label={`For nivå ${BANDS[targetIdx]}`} value={`HCP ${hcpTarget.toFixed(1)}`} />
        <RibbonStat
          label="Trend 90d"
          value={`${hcpTrend90d > 0 ? "+" : ""}${hcpTrend90d.toFixed(1)}`}
        />
      </div>
    </div>
  );
}

function RibbonStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px] text-white/55">
      <strong className="block text-white text-sm font-bold mb-0.5">{value}</strong>
      {label}
    </div>
  );
}
