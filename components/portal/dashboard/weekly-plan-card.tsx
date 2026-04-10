"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PyramidLevel = "fys" | "tek" | "slag" | "spill" | "turn" | null;

interface DayPlan {
  day: string;
  date: string;
  sessions: { label: string; level: PyramidLevel }[];
  status: "done" | "today" | "upcoming" | "rest";
}

interface WeeklyPlanCardProps {
  weekLabel?: string;
  periodLabel?: string;
  days?: DayPlan[];
}

const PYRAMID_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  fys: { bg: "bg-[#FFFBEB]", border: "border-l-[#C48A32]", text: "text-[#92400E]" },
  tek: { bg: "bg-[#EFF6FF]", border: "border-l-[#007AFF]", text: "text-[#1E40AF]" },
  slag: { bg: "bg-[#EDF5F0]", border: "border-l-[#005840]", text: "text-[#0A1F18]" },
  spill: { bg: "bg-[#FAF5FF]", border: "border-l-[#AF52DE]", text: "text-[#6B21A8]" },
  turn: { bg: "bg-[#ECF0EF]", border: "border-l-[#0A1F18]", text: "text-[#0A1F18]" },
};

const defaultDays: DayPlan[] = [
  { day: "Man", date: "1", sessions: [{ label: "Styrke", level: "fys" }, { label: "Driver", level: "tek" }], status: "done" },
  { day: "Tir", date: "2", sessions: [{ label: "Putting", level: "slag" }, { label: "Approach", level: "slag" }], status: "done" },
  { day: "Ons", date: "3", sessions: [], status: "rest" },
  { day: "Tor", date: "4", sessions: [{ label: "Full swing", level: "tek" }, { label: "Naerspill", level: "slag" }], status: "today" },
  { day: "Fre", date: "5", sessions: [{ label: "Coaching", level: null }], status: "upcoming" },
  { day: "Lor", date: "6", sessions: [{ label: "9 hull", level: "spill" }], status: "upcoming" },
  { day: "Son", date: "7", sessions: [], status: "rest" },
];

export function WeeklyPlanCard({
  weekLabel = "Uke 14 / 2026",
  periodLabel = "Grunnperiode",
  days = defaultDays,
}: WeeklyPlanCardProps) {
  return (
    <div className="portal-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-[#0A1F18]">
            Ukens plan
          </h3>
          <p className="text-xs text-[#7A8C85] mt-0.5">
            {periodLabel} &middot; {weekLabel}
          </p>
        </div>
        <Link
          href="/portal/treningsplan"
          className="flex items-center gap-1 text-xs font-semibold text-[#0A1F18] hover:text-[#005840] transition-colors"
        >
          Apne planlegger
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Day cards grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <DayCard key={day.day} {...day} />
        ))}
      </div>

      {/* Pyramid distribution bar */}
      <div className="mt-5 pt-4 border-t border-[#D5DFDB]">
        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#7A8C85]">
          <span className="uppercase tracking-wide">Fordeling:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#C48A32]" />
            <span>FYS 15%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#007AFF]" />
            <span>TEK 25%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#005840]" />
            <span>SLAG 35%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#AF52DE]" />
            <span>SPILL 20%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#0A1F18]" />
            <span>TURN 5%</span>
          </div>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden mt-2">
          <div className="bg-[#C48A32]" style={{ width: "15%" }} />
          <div className="bg-[#007AFF]" style={{ width: "25%" }} />
          <div className="bg-[#005840]" style={{ width: "35%" }} />
          <div className="bg-[#AF52DE]" style={{ width: "20%" }} />
          <div className="bg-[#0A1F18]" style={{ width: "5%" }} />
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, sessions, status }: DayPlan) {
  const isToday = status === "today";
  const isDone = status === "done";
  const isRest = status === "rest";

  return (
    <div
      className={`rounded-xl p-2.5 min-h-[110px] flex flex-col transition-colors ${
        isToday
          ? "bg-[#0A1F18] text-white"
          : isDone
            ? "bg-[#EDF5F0]"
            : isRest
              ? "bg-[#ECF0EF]"
              : "bg-white border border-[#D5DFDB]"
      }`}
    >
      <span
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isToday ? "text-white/60" : "text-[#7A8C85]"
        }`}
      >
        {day}
      </span>

      <div className="flex-1 flex flex-col gap-1 mt-2">
        {sessions.length > 0
          ? sessions.map((s, i) => {
              if (isToday) {
                return (
                  <span
                    key={i}
                    className="text-[10px] font-medium text-white/80 truncate"
                  >
                    {s.label}
                  </span>
                );
              }
              const colors = s.level ? PYRAMID_COLORS[s.level] : null;
              return (
                <div
                  key={i}
                  className={`text-[10px] font-medium truncate pl-1.5 border-l-2 ${
                    colors
                      ? `${colors.border} ${colors.text}`
                      : "border-l-[#0A1F18] text-[#0A1F18]"
                  }`}
                >
                  {s.label}
                </div>
              );
            })
          : isRest && (
              <span
                className={`text-[10px] font-medium ${
                  isToday ? "text-white/40" : "text-[#A5B2AD]"
                }`}
              >
                Hvile
              </span>
            )}
      </div>

      {/* Status indicator */}
      <div className="mt-auto pt-1">
        {isDone && (
          <span className="text-[9px] font-bold text-[#005840]">
            Fullfort
          </span>
        )}
        {isToday && (
          <span className="inline-block text-[9px] font-bold bg-white text-[#0A1F18] px-1.5 py-0.5 rounded-full">
            I DAG
          </span>
        )}
      </div>
    </div>
  );
}
