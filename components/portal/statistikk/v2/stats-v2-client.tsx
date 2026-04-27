"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { X } from "lucide-react";
import type { RoundStats } from "@prisma/client";
import { StatRow, ExpandedStatRow } from "./stat-row";

interface StatsV2ClientProps {
  rounds: RoundStats[];
  aggregates: {
    roundCount: number;
    avgScore: number | null;
    avgSgTotal: number | null;
    avgGirPct: number | null;
    avgPuttsPerGir: number | null;
    avgUpAndDownPct: number | null;
    avgFairwayPct: number | null;
    avgDrivingDistance: number | null;
  } | null;
  handicap: number | null;
}

const TABS = ["Statistikk", "Notater", "Slag"] as const;

/**
 * Pixel-naer reskin av stats-v2.html (handoff 2026-04-27).
 *
 * Course-aerial-bakgrunn med tilta perspektiv + drawer-panel pa hoyre.
 */
export function StatsV2Client({
  rounds,
  aggregates,
  handicap,
}: StatsV2ClientProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Statistikk");

  const last = rounds[0];
  const score = last?.totalScore ?? null;
  const sgTotal = aggregates?.avgSgTotal ?? null;
  const dateLabel = last
    ? format(new Date(last.date), "d. MMM yyyy", { locale: nb })
    : "—";
  const courseName = last?.courseName ?? "Bane";

  return (
    <div
      className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10 relative min-h-screen overflow-hidden"
      style={{ background: "#0A1F18" }}
    >
      {/* Tilted course-aerial bg */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform:
            "perspective(1400px) rotateX(8deg) rotateZ(-3deg) scale(1.15)",
          transformOrigin: "30% 60%",
        }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, #2A7D5A 0%, #0A1F18 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(10,15,12,0.15) 0%, rgba(10,15,12,0.55) 55%, rgba(10,15,12,0.88) 100%)",
          }}
        />
      </div>

      {/* Top-left breadcrumb */}
      <div
        className="absolute top-10 left-10 z-30 px-4 py-2 rounded-full text-white text-xs flex items-center gap-2.5 backdrop-blur-md border border-white/10"
        style={{ background: "rgba(12,22,17,0.62)" }}
      >
        <span className="text-white/55">
          Runde {rounds.length} — {courseName}
        </span>
        <span className="opacity-30">·</span>
        <strong className="font-semibold">{dateLabel}</strong>
      </div>

      {/* Floating chips */}
      <div
        className="absolute top-[42%] left-[22%] px-3.5 py-1.5 rounded-full bg-white/95 text-[#0A1F18] text-xs font-semibold z-20"
        style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
      >
        242 m
      </div>
      <div
        className="absolute top-[58%] left-[14%] px-3.5 py-1.5 rounded-full bg-white/95 text-[#0A1F18] text-xs font-semibold z-20"
        style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
      >
        23 m
      </div>
      <div
        className="absolute top-[38%] left-[8%] px-3.5 py-1.5 rounded-full bg-[#0A1F18] text-white text-xs font-semibold z-20"
        style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
      >
        Hull 2
      </div>

      {/* Drawer */}
      <div
        className="absolute top-6 right-6 bottom-6 w-[460px] z-40 p-5 overflow-y-auto flex flex-col gap-3 rounded-2xl border border-white/10 backdrop-blur-2xl"
        style={{ background: "rgba(12,22,17,0.62)" }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex gap-1 p-1 bg-white/[0.06] rounded-full">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-semibold",
                  activeTab === t
                    ? "bg-[#0A1F18] text-white"
                    : "text-white/60",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="p-1.5 rounded-full bg-white/[0.06] text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="px-4 py-3.5 rounded-2xl bg-[#D1F843] text-[#0A1F18]">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase opacity-70">
              Score
            </div>
            <div className="text-[34px] font-bold tracking-tight tabular-nums leading-none">
              {score ?? "—"}
            </div>
            <div className="text-[11px] mt-1 opacity-60">
              {handicap !== null ? `HCP ${handicap.toFixed(1)}` : "Siste runde"}
            </div>
          </div>
          <div className="px-4 py-3.5 rounded-2xl bg-[#0A1F18] border border-white/10 text-white">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/55">
              Strokes Gained
            </div>
            <div className="text-[34px] font-bold tracking-tight tabular-nums leading-none text-[#D1F843]">
              {sgTotal !== null ? sgTotal.toFixed(2) : "—"}
            </div>
            <div className="text-[11px] mt-1 text-white/55">
              vs scratch baseline
            </div>
          </div>
        </div>

        <StatRow
          label="Gjennomsnittsscore"
          value={
            aggregates?.avgScore !== null && aggregates?.avgScore !== undefined
              ? aggregates.avgScore.toFixed(1)
              : "—"
          }
        />
        <StatRow
          label="Antall runder"
          value={aggregates?.roundCount ?? 0}
        />
        <StatRow
          label="Putts per GIR"
          value={
            aggregates?.avgPuttsPerGir !== null && aggregates?.avgPuttsPerGir !== undefined
              ? aggregates.avgPuttsPerGir.toFixed(1)
              : "—"
          }
        />

        <ExpandedStatRow
          label="Kortspill"
          sub="Innenfor 50 meter"
          value={
            aggregates?.avgUpAndDownPct !== null && aggregates?.avgUpAndDownPct !== undefined
              ? `${aggregates.avgUpAndDownPct.toFixed(0)}%`
              : "—"
          }
          left={{
            eyebrow: "Up & down",
            main: (
              <>
                {aggregates?.avgUpAndDownPct !== null && aggregates?.avgUpAndDownPct !== undefined
                  ? aggregates.avgUpAndDownPct.toFixed(0)
                  : "—"}
                <span className="text-sm opacity-55">%</span>
              </>
            ),
          }}
          right={{
            eyebrow: "GIR",
            main: (
              <>
                {aggregates?.avgGirPct !== null && aggregates?.avgGirPct !== undefined
                  ? aggregates.avgGirPct.toFixed(0)
                  : "—"}
                <span className="text-sm opacity-55">%</span>
              </>
            ),
          }}
        />

        <ExpandedStatRow
          label="Approach"
          sub="Fra 100–200m"
          value={aggregates?.roundCount ?? 0}
          left={{
            eyebrow: "Fairway %",
            main: (
              <>
                {aggregates?.avgFairwayPct !== null && aggregates?.avgFairwayPct !== undefined
                  ? aggregates.avgFairwayPct.toFixed(0)
                  : "—"}
                <span className="text-sm opacity-55">%</span>
              </>
            ),
          }}
          right={{
            eyebrow: "Avg drive",
            main: (
              <>
                {aggregates?.avgDrivingDistance !== null && aggregates?.avgDrivingDistance !== undefined
                  ? Math.round(aggregates.avgDrivingDistance)
                  : "—"}
                <span className="text-sm opacity-55">m</span>
              </>
            ),
          }}
        />

        <div className="mt-2">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 mb-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" /> Per runde
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {rounds.slice(0, 9).map((r, idx) => (
              <button
                key={r.id ?? idx}
                type="button"
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs font-medium",
                  idx === 1
                    ? "bg-[#0A1F18] text-white"
                    : "bg-white/[0.06] text-white/75",
                ].join(" ")}
              >
                Runde {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
