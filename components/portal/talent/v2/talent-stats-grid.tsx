"use client";

import { Trophy, Target, TrendingUp, BarChart3 } from "lucide-react";

export interface TalentStatsGridProps {
  totalRounds: number;
  avgRound: number | null;
  bestRound: number | null;
  top3Count: number;
  top10Count: number;
  improvementPerYear: number | null;
  ageGroupPercentile: number | null;
  ageGroupSize: number | null;
  year: number;
}

function fmt(n: number | null, d = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("nb-NO", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function TalentStatsGrid({
  totalRounds,
  avgRound,
  bestRound,
  top3Count,
  top10Count,
  improvementPerYear,
  ageGroupPercentile,
  ageGroupSize,
  year,
}: TalentStatsGridProps) {
  const items = [
    {
      icon: Target,
      label: `Snittscore ${year}`,
      value: fmt(avgRound, 1),
      sub: `${totalRounds} turneringsrunder`,
    },
    {
      icon: BarChart3,
      label: "Beste runde",
      value: bestRound !== null ? `${bestRound}` : "—",
      sub: "Lavest score 18-hull",
    },
    {
      icon: Trophy,
      label: "Topp-plasseringer",
      value: `${top3Count}`,
      sub: `${top10Count} topp-10 totalt`,
    },
    {
      icon: TrendingUp,
      label: "Aldersgruppe-percentil",
      value:
        ageGroupPercentile !== null ? `${ageGroupPercentile}p` : "—",
      sub:
        ageGroupSize !== null
          ? `Av ${ageGroupSize} spillere`
          : "Mangler peer-data",
    },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          Nøkkeltall · sesong {year}
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          {improvementPerYear !== null
            ? `FORBEDRING ${improvementPerYear > 0 ? "+" : ""}${fmt(improvementPerYear, 2)} / ÅR`
            : "DATA SAMLES INN"}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                  {item.label}
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#D1F843]/15 text-[#D1F843] grid place-items-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="font-display text-[28px] font-extrabold leading-none tracking-[-0.03em] text-white tabular-nums">
                {item.value}
              </div>
              <div className="mt-2 text-[11px] text-white/50">{item.sub}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
