"use client";

import { Sparkles } from "lucide-react";

export interface ClubComparisonRow {
  club: string;
  carryPct: number;
  benchmarkPct: number;
  ballMph: string;
  spin: string;
  launch: string;
  shots30d: number;
  highlighted?: boolean;
}

export interface ClubComparisonCardProps {
  rows: ClubComparisonRow[];
  aiInsight?: string;
}

export function ClubComparisonCard({ rows, aiInsight }: ClubComparisonCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#121614] p-5">
      <div className="flex justify-between items-start gap-3 flex-wrap mb-3">
        <div>
          <h3 className="m-0 mb-1 text-[13px] font-bold text-[#F7FAF8]">
            Klubbesammenligning
          </h3>
          <div className="font-mono text-[10px] text-white/45 tracking-[0.10em] uppercase">
            CARRY VS BENCHMARK (TOUR-SNITT) · 30d MEDIAN
          </div>
        </div>
        <div className="flex gap-2 items-center text-[11px] text-white/65">
          <span className="inline-block w-[18px] h-1 bg-[#D1F843] rounded-sm" />
          Din carry
          <span className="inline-block w-0.5 h-2.5 bg-[#AF52DE] ml-2" />
          Tour-snitt
        </div>
      </div>

      <div className="grid grid-cols-[50px_1fr_70px_70px_70px_70px] gap-2.5 items-center font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase py-1.5 border-b border-white/10">
        <div>Klubbe</div>
        <div>Carry · m</div>
        <div>Ball mph</div>
        <div>Spin</div>
        <div>Launch°</div>
        <div className="font-sans text-[11px]">Slag 30d</div>
      </div>

      {rows.map((row) => (
        <div
          key={row.club}
          className={[
            "grid grid-cols-[50px_1fr_70px_70px_70px_70px] gap-2.5 items-center py-2.5 border-b border-white/[0.05] text-xs",
            row.highlighted ? "bg-[#D1F843]/[0.04] -mx-1 px-1 rounded-md" : "",
          ].join(" ")}
        >
          <div className="font-mono text-[#D1F843] font-bold text-xs">{row.club}</div>
          <div className="relative h-1.5 bg-white/[0.05] rounded-sm overflow-visible">
            <div
              className="h-full bg-[#D1F843] rounded-sm"
              style={{ width: `${Math.max(0, Math.min(100, row.carryPct))}%` }}
            />
            <span
              className="absolute -top-1 bottom-[-3px] w-0.5 bg-[#AF52DE]"
              style={{ left: `${Math.max(0, Math.min(100, row.benchmarkPct))}%` }}
            />
          </div>
          <div className="font-mono text-white/85">{row.ballMph}</div>
          <div className="font-mono text-white/85">{row.spin}</div>
          <div className="font-mono text-white/85">{row.launch}</div>
          <div className={row.highlighted ? "text-[#D1F843]" : "text-white/85"}>
            {row.shots30d}
            {row.highlighted ? " ●" : ""}
          </div>
        </div>
      ))}

      {aiInsight && (
        <div
          className="mt-4 p-3.5 rounded-xl border"
          style={{
            background: "rgba(175,82,222,0.08)",
            borderColor: "rgba(175,82,222,0.15)",
          }}
        >
          <div className="font-mono text-[10px] text-[#AF52DE] tracking-[0.14em] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            AI-ANALYSE
          </div>
          <div className="text-[13px] text-[#E6EAE8] mt-1 leading-[1.5]">{aiInsight}</div>
        </div>
      )}
    </div>
  );
}
