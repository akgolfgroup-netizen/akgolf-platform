"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Check, Sparkles } from "lucide-react";

/* ── Types ── */

type PyramidLevel = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

interface CalendarSession {
  id: string;
  title: string;
  durationMinutes: number | null;
  focusArea: string | null;
  pyramidLevel: PyramidLevel | null;
  completed: boolean;
  exerciseCount: number;
}

interface CalendarDay {
  id: string;
  dayName: string;
  dateNum: string;
  date: string;
  isToday: boolean;
  isRest: boolean;
  sessions: CalendarSession[];
}

interface TrainingCalendarProps {
  weekNumber: string;
  weekLabel: string;
  periodLabel?: string;
  periodWeeksRemaining?: number;
  days: CalendarDay[];
  canGenerate: boolean;
}

/* ── Pyramid Colors (CSS vars) ── */

const PYRAMID_CSS: Record<PyramidLevel, { border: string; bg: string; text: string }> = {
  FYS: { border: "border-l-[var(--pyramid-fys)]", bg: "bg-[var(--pyramid-fys-light)]", text: "text-[var(--pyramid-fys-text)]" },
  TEK: { border: "border-l-[var(--pyramid-tek)]", bg: "bg-[var(--pyramid-tek-light)]", text: "text-[var(--pyramid-tek-text)]" },
  SLAG: { border: "border-l-[var(--pyramid-slag)]", bg: "bg-[var(--pyramid-slag-light)]", text: "text-[var(--pyramid-slag-text)]" },
  SPILL: { border: "border-l-[var(--pyramid-spill)]", bg: "bg-[var(--pyramid-spill-light)]", text: "text-[var(--pyramid-spill-text)]" },
  TURN: { border: "border-l-[var(--pyramid-turn)]", bg: "bg-[var(--pyramid-turn-light)]", text: "text-[var(--pyramid-turn-text)]" },
};

/* ── Animation ── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerGrid = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const staggerCol = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* ── Component ── */

export function TrainingCalendar({
  weekNumber,
  weekLabel,
  periodLabel,
  periodWeeksRemaining,
  days,
  canGenerate,
}: TrainingCalendarProps) {
  // Calculate pyramid distribution
  const distribution = calculateDistribution(days);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#0A1F18]">
            Treningsplan
          </h1>
          <p className="text-sm text-[#7A8C85] mt-1">
            {periodLabel && (
              <span className="text-[#0A1F18] font-medium">{periodLabel}</span>
            )}
            {periodLabel && " · "}
            {weekLabel}
            {periodWeeksRemaining != null && periodWeeksRemaining > 0 && (
              <span> · {periodWeeksRemaining} uker igjen</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#D5DFDB] rounded-xl overflow-hidden">
            <button className="px-3 py-2 hover:bg-[#ECF0EF] transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#7A8C85]" />
            </button>
            <span className="px-3 py-2 text-xs font-semibold text-[#0A1F18] border-x border-[#D5DFDB]">
              Uke {weekNumber}
            </span>
            <button className="px-3 py-2 hover:bg-[#ECF0EF] transition-colors">
              <ChevronRight className="w-4 h-4 text-[#7A8C85]" />
            </button>
          </div>
          {canGenerate && (
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#AF52DE] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" />
              Generer plan
            </button>
          )}
        </div>
      </div>

      {/* ── 7-Column Calendar Grid ── */}
      <motion.div
        className="grid grid-cols-7 gap-2"
        initial="hidden"
        animate="visible"
        variants={staggerGrid}
      >
        {days.map((day) => (
          <motion.div key={day.id} variants={staggerCol} className="flex flex-col">
            {/* Day header */}
            <div
              className={`text-center py-2 mb-2 rounded-lg ${
                day.isToday ? "bg-[#0A1F18]" : ""
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wide block ${
                  day.isToday ? "text-white/60" : "text-[#7A8C85]"
                }`}
              >
                {day.dayName}
              </span>
              <span
                className={`text-lg font-bold tabular-nums block mt-0.5 ${
                  day.isToday ? "text-white" : "text-[#0A1F18]"
                }`}
              >
                {day.dateNum}
              </span>
            </div>

            {/* Session blocks */}
            <div className="flex flex-col gap-1.5 min-h-[140px]">
              {day.isRest && day.sessions.length === 0 ? (
                <div className="flex-1 rounded-xl bg-[#ECF0EF] flex items-center justify-center">
                  <span className="text-xs text-[#A5B2AD]">Hvile</span>
                </div>
              ) : day.sessions.length === 0 ? (
                <div className="flex-1 rounded-xl border border-dashed border-[#D5DFDB] flex items-center justify-center">
                  <span className="text-xs text-[#A5B2AD]">&ndash;</span>
                </div>
              ) : (
                day.sessions.map((session) => (
                  <SessionBlock key={session.id} session={session} />
                ))
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Pyramid Distribution Bar ── */}
      {distribution.total > 0 && (
        <div className="portal-card !p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="portal-label">Pyramidefordeling</span>
            <span className="text-xs text-[#7A8C85]">{distribution.total} min totalt</span>
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden">
            {distribution.levels.map((level) =>
              level.pct > 0 ? (
                <div
                  key={level.id}
                  className="transition-all duration-500"
                  style={{
                    width: `${level.pct}%`,
                    backgroundColor: `var(--pyramid-${level.id.toLowerCase()})`,
                  }}
                />
              ) : null
            )}
          </div>
          <div className="flex gap-4 mt-2.5">
            {distribution.levels.map((level) =>
              level.pct > 0 ? (
                <div key={level.id} className="flex items-center gap-1.5 text-[10px] text-[#7A8C85] font-semibold">
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: `var(--pyramid-${level.id.toLowerCase()})` }}
                  />
                  {level.id} {Math.round(level.pct)}%
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Session Block ── */

function SessionBlock({ session }: { session: CalendarSession }) {
  const level = session.pyramidLevel;
  const colors = level ? PYRAMID_CSS[level] : null;
  const isCoaching = !level && session.focusArea === null;

  if (isCoaching || !colors) {
    // Coaching session — dark block
    return (
      <Link
        href={`/portal/treningsplan/${session.id}`}
        className="rounded-xl bg-[#0A1F18] text-white p-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <span className="text-[10px] font-bold uppercase tracking-wide text-white/50 block">
          Coaching
        </span>
        <span className="text-xs font-semibold mt-1 block truncate">
          {session.title}
        </span>
        {session.durationMinutes && (
          <span className="flex items-center gap-1 text-[10px] text-white/40 mt-1.5">
            <Clock className="w-3 h-3" />
            {session.durationMinutes} min
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/portal/treningsplan/${session.id}`}
      className={`rounded-xl p-3 border-l-[3px] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer ${colors.border} ${
        session.completed ? "bg-[#EDF5F0]" : colors.bg
      }`}
    >
      <span className={`text-[10px] font-bold uppercase tracking-wide block ${colors.text}`}>
        {level}
      </span>
      <span className="text-xs font-semibold text-[#0A1F18] mt-1 block truncate">
        {session.title}
      </span>
      <div className="flex items-center gap-2 mt-1.5">
        {session.durationMinutes && (
          <span className="flex items-center gap-1 text-[10px] text-[#7A8C85]">
            <Clock className="w-3 h-3" />
            {session.durationMinutes} min
          </span>
        )}
        {session.exerciseCount > 0 && (
          <span className="text-[10px] text-[#7A8C85]">
            {session.exerciseCount} ov.
          </span>
        )}
      </div>
      {session.completed && (
        <span className="flex items-center gap-1 text-[9px] font-bold text-[#005840] mt-1.5">
          <Check className="w-3 h-3" />
          Fullfort
        </span>
      )}
    </Link>
  );
}

/* ── Distribution Calculator ── */

function calculateDistribution(days: CalendarDay[]) {
  const counts: Record<string, number> = { FYS: 0, TEK: 0, SLAG: 0, SPILL: 0, TURN: 0 };
  let total = 0;

  for (const day of days) {
    for (const session of day.sessions) {
      const mins = session.durationMinutes || 0;
      total += mins;
      if (session.pyramidLevel && session.pyramidLevel in counts) {
        counts[session.pyramidLevel] += mins;
      }
    }
  }

  const levels = Object.entries(counts).map(([id, mins]) => ({
    id,
    mins,
    pct: total > 0 ? (mins / total) * 100 : 0,
  }));

  return { levels, total };
}
