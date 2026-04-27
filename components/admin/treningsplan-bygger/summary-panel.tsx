"use client";

import { CircleDot, Sparkles, Target, Trophy } from "lucide-react";
import type { AllocationRow, PlanGoal } from "./types";

const GOAL_ICONS = {
  target: Target,
  "circle-dot": CircleDot,
  trophy: Trophy,
} as const;

type Props = {
  weekLabel: string;
  rows: AllocationRow[];
  aiText: string;
  goals: PlanGoal[];
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3.5 rounded-2xl border px-5 py-4"
      style={{ background: "#0D2E23", borderColor: "#1a4a3a" }}
    >
      {children}
    </div>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="m-0 mb-3 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
      {children}
    </h4>
  );
}

export function SummaryPanel({ weekLabel, rows, aiText, goals }: Props) {
  const total = rows.reduce((sum, r) => sum + r.hours, 0);
  return (
    <aside>
      <Card>
        <CardHeading>Tids-allokering · {weekLabel}</CardHeading>
        <div className="text-[12.5px]">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto] py-1.5"
              style={{
                borderTop:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span className="flex items-center gap-2 text-white/85">
                <span
                  className="block h-2 w-2 rounded-sm"
                  style={{ background: row.swatch }}
                />
                {row.label}
              </span>
              <span
                className="font-mono font-bold tabular-nums text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {row.hours.toFixed(1)} t
              </span>
            </div>
          ))}
          <div
            className="mt-1.5 grid grid-cols-[1fr_auto] py-2.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
          >
            <span className="font-bold text-white">Sum</span>
            <span className="font-mono font-bold" style={{ color: "#D1F843" }}>
              {total.toFixed(1)} t
            </span>
          </div>
        </div>
        <div
          className="mt-2.5 flex h-1.5 overflow-hidden rounded-sm"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {rows.map((row) => (
            <span
              key={row.label}
              className="block h-full"
              style={{ background: row.swatch, width: `${row.pct}%` }}
            />
          ))}
        </div>
      </Card>

      <Card>
        <CardHeading>Match-up med dataen</CardHeading>
        <div
          className="rounded-xl border px-3.5 py-3 text-[12.5px] leading-relaxed text-white"
          style={{
            background:
              "linear-gradient(160deg, rgba(209,248,67,0.10), rgba(13,46,35,0))",
            borderColor: "rgba(209,248,67,0.20)",
          }}
        >
          <div
            className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2} /> AI-NAV
          </div>
          {aiText}
        </div>
      </Card>

      <Card>
        <CardHeading>Mål for plan</CardHeading>
        <div className="text-[12.5px]">
          {goals.map((goal, i) => {
            const Icon = GOAL_ICONS[goal.iconName];
            return (
              <div
                key={goal.text}
                className="grid grid-cols-[1fr_auto] py-1.5"
                style={{
                  borderTop:
                    i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="flex items-center gap-2 text-white/85">
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                    style={{ color: goal.iconColor }}
                  />
                  {goal.text}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}
