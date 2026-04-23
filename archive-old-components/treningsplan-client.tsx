"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import { PyramidTag } from "@/components/portal/treningsplan/ak-formula-tags";
import { toggleSessionComplete } from "./actions";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import { ManualPlanButton } from "@/components/portal/treningsplan/manual-plan-button";
import type { PyramidLevel } from "@/lib/portal/golf/ak-formula";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
interface SessionExercise {
  name: string;
  details: string;
}

interface DayData {
  dayName: string;
  dateISO: string;
  isToday: boolean;
  session: {
    id: string;
    title: string;
    duration: number;
    focusArea: string | null;
    pyramidLevel: PyramidLevel | null;
    completed: boolean;
    exercises: SessionExercise[];
  } | null;
}

interface TreningsplanClientProps {
  hasPlan: boolean;
  weekNumber: string;
  weekRange: string;
  weekOffset: number;
  weekDays: DayData[];
  canGenerate: boolean;
  userId: string;
}

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
const SUB_NAV_TABS = [
  { label: "Ukeplan", href: "/portal/treningsplan" },
  { label: "AI-plan", href: "/portal/treningsplan/ai" },
];

// ---------------------------------------------------------------------
// Week Day Selector — 7 days horizontal with activity dots
// ---------------------------------------------------------------------
function WeekDaySelector({
  weekDays,
  selectedIndex,
  onSelect,
}: {
  weekDays: DayData[];
  selectedIndex: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {weekDays.map((day, idx) => {
        const isSelected = idx === selectedIndex;
        const hasSession = !!day.session;
        const isCompleted = day.session?.completed ?? false;

        return (
          <button
            key={day.dayName}
            onClick={() => onSelect(idx)}
            className={`
              flex-1 flex flex-col items-center gap-1 py-3 px-1 rounded-xl
              transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isSelected
                ? "bg-on-surface text-surface shadow-[0_4px_12px_rgba(10,31,24,0.08)]"
                : "bg-surface-container-lowest text-on-surface hover:bg-surface"
              }
            `}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${
                isSelected ? "text-surface/70" : "text-on-surface-variant"
              }`}
            >
              {day.dayName}
            </span>
            <span
              className={`text-base font-semibold tabular-nums ${
                isSelected ? "text-surface" : "text-on-surface"
              }`}
            >
              {format(new Date(day.dateISO), "d", { locale: nb })}
            </span>
            <div className="h-1.5 flex items-center justify-center">
              {hasSession && (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCompleted
                      ? "bg-success"
                      : isSelected
                        ? "bg-surface-container-lowest/60"
                        : "bg-on-surface"
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------
// Today's Session Card — exercise list
// ---------------------------------------------------------------------
function TodaySessionCard({ day }: { day: DayData }) {
  const router = useRouter();
  const [isToggling, startToggle] = useTransition();

  if (!day.session) {
    return (
      <PremiumCard delay={0.1}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4">
            <Icon name="my_location" className="w-6 h-6 text-on-surface-variant" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">
            {day.dayName} {format(new Date(day.dateISO), "d. MMMM", { locale: nb })}
          </p>
          <p className="text-sm text-on-surface-variant">
            Ingen okt planlagt. Nyt hviledagen.
          </p>
        </div>
      </PremiumCard>
    );
  }

  const session = day.session;

  function handleToggleComplete() {
    startToggle(async () => {
      await toggleSessionComplete(session.id);
      router.refresh();
    });
  }

  return (
    <PremiumCard delay={0.1}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">
            Dagens okt
          </p>
          <h3 className="text-lg font-bold tracking-tight text-on-surface">
            {session.title}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            {session.pyramidLevel && (
              <PyramidTag level={session.pyramidLevel} />
            )}
            <span className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Icon name="schedule" className="w-3.5 h-3.5" />
              {session.duration} min
            </span>
          </div>
        </div>
        {session.completed ? (
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 hover:bg-success/20 transition-colors"
          >
            {isToggling ? (
              <Icon name="progress_activity" className="w-3.5 h-3.5 text-success animate-spin" />
            ) : (
              <Icon name="check_circle" className="w-3.5 h-3.5 text-success" />
            )}
            <span className="text-[11px] font-medium text-success">Fullfort</span>
          </button>
        ) : (
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors"
          >
            {isToggling ? (
              <Icon name="progress_activity" className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon name="check_circle" className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px] font-medium">Marker fullfort</span>
          </button>
        )}
      </div>

      {/* Exercise list */}
      {session.exercises.length > 0 && (
        <div className="space-y-0">
          {session.exercises.map((exercise, idx) => (
            <div
              key={`${exercise.name}-${idx}`}
              className={`flex items-start gap-4 py-4 ${
                idx < session.exercises.length - 1 ? "border-b border-outline-variant/30" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                <Icon name="fitness_center" className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">
                  {exercise.name}
                </p>
                {exercise.details && (
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                    {exercise.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {session.exercises.length === 0 && (
        <p className="text-xs text-on-surface-variant py-4">
          Ingen ovelser lagt til enna.
        </p>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-3 mt-5 pt-5 border-t border-outline-variant/30">
        <Link
          href={`/portal/treningsplan/${session.id}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full bg-secondary-fixed text-on-surface text-sm font-semibold
            transition-all duration-300 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] active:opacity-75"
        >
          <Icon name="play_arrow" className="w-4 h-4" />
          Start okt
        </Link>
        <Link
          href="/portal/bookinger"
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm font-semibold
            transition-all duration-300 hover:border-outline-variant/50"
        >
          <Icon name="calendar_today" className="w-4 h-4" />
          Book coaching
        </Link>
      </div>
    </PremiumCard>
  );
}

// ---------------------------------------------------------------------
// Weekly Focus Card
// ---------------------------------------------------------------------
function WeeklyFocusCard({ weekDays }: { weekDays: DayData[] }) {
  const focusAreas = weekDays
    .filter((d) => d.session?.focusArea)
    .map((d) => d.session!.focusArea!);

  const primaryFocus = focusAreas[0] ?? "Generell trening";
  const uniqueAreas = [...new Set(focusAreas)];

  return (
    <PremiumCard delay={0.2}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">
        Ukens fokusomrade
      </p>
      <h3 className="text-lg font-bold tracking-tight text-on-surface mb-4">
        {primaryFocus}
      </h3>
      {uniqueAreas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {uniqueAreas.map((area) => (
            <span
              key={area}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface text-on-surface-variant"
            >
              {area}
            </span>
          ))}
        </div>
      )}
      {uniqueAreas.length <= 1 && (
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Coach-anbefaling for denne uken. Fokuser pa {primaryFocus.toLowerCase()} for best mulig fremgang.
        </p>
      )}
    </PremiumCard>
  );
}

// ---------------------------------------------------------------------
// Progress Card — completed vs planned
// ---------------------------------------------------------------------
function ProgressCard({ weekDays }: { weekDays: DayData[] }) {
  const planned = weekDays.filter((d) => d.session).length;
  const completed = weekDays.filter((d) => d.session?.completed).length;
  const percentage = planned > 0 ? Math.round((completed / planned) * 100) : 0;

  return (
    <PremiumCard delay={0.3} >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
        Fremgang denne uken
      </p>

      {/* Big number */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-extrabold tracking-tight tabular-nums text-on-surface">
          {completed}
        </span>
        <span className="text-lg font-semibold text-on-surface-variant tabular-nums">
          / {planned}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[5px] bg-surface-variant/50 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-on-surface transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          {planned === 0
            ? "Ingen okter planlagt"
            : completed === planned
              ? "Alle okter fullfort!"
              : `${planned - completed} okter gjenstaar`}
        </span>
        {completed > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Icon name="trending_up" className="w-3.5 h-3.5" />
            {percentage}%
          </span>
        )}
      </div>
    </PremiumCard>
  );
}

// ---------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------
function EmptyState({
  weekNumber,
  canGenerate,
  userId,
}: {
  weekNumber: string;
  canGenerate: boolean;
  userId: string;
}) {
  return (
    <div className="space-y-8">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/treningsplan" />

      <div className="mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-2">
          Uke {weekNumber}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Treningsplan
        </h1>
      </div>

      <PremiumCard className="text-center">
        <div className="py-8">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5">
            <Icon name="calendar_today" className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h2 className="text-xl font-semibold text-on-surface mb-2">
            Din treningsplan er tom
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6 leading-relaxed">
            {canGenerate
              ? "Opprett en plan manuelt, eller la AI lage en personlig plan for deg."
              : "Kontakt din coach for a fa en personlig treningsplan."}
          </p>
          {canGenerate && (
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <ManualPlanButton studentId={userId} />
              <GeneratePlanButton studentId={userId} />
            </div>
          )}
        </div>
      </PremiumCard>
    </div>
  );
}

// ---------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------
export function TreningsplanClient({
  hasPlan,
  weekNumber,
  weekRange,
  weekOffset,
  weekDays,
  canGenerate,
  userId,
}: TreningsplanClientProps) {
  // Find initial selected day — today or first day with session
  const initialIndex = useMemo(() => {
    const todayIdx = weekDays.findIndex((d) => d.isToday);
    if (todayIdx >= 0) return todayIdx;
    const firstSession = weekDays.findIndex((d) => d.session);
    return firstSession >= 0 ? firstSession : 0;
  }, [weekDays]);

  const [selectedDay, setSelectedDay] = useState(initialIndex);

  if (!hasPlan) {
    return (
      <EmptyState
        weekNumber={weekNumber}
        canGenerate={canGenerate}
        userId={userId}
      />
    );
  }

  const currentDay = weekDays[selectedDay];

  return (
    <div className="space-y-8">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/treningsplan" />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-2">
            Uke {weekNumber}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Treningsplan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">{weekRange}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Week nav */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-surface-container-lowest border border-outline-variant/30">
            <Link
              href={`/portal/treningsplan?week=${weekOffset - 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
              aria-label="Forrige uke"
            >
              <Icon name="chevron_left" className="w-4 h-4" />
            </Link>
            {weekOffset !== 0 && (
              <Link
                href="/portal/treningsplan"
                className="h-9 px-3 rounded-full text-xs font-semibold text-on-surface hover:bg-surface transition-colors inline-flex items-center"
              >
                I dag
              </Link>
            )}
            <Link
              href={`/portal/treningsplan?week=${weekOffset + 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
              aria-label="Neste uke"
            >
              <Icon name="chevron_right" className="w-4 h-4" />
            </Link>
          </div>

          {canGenerate && (
            <>
              <ManualPlanButton studentId={userId} />
              <GeneratePlanButton studentId={userId} />
            </>
          )}
        </div>
      </div>

      {/* Week Day Selector */}
      <PremiumCard noHover delay={0}>
        <WeekDaySelector
          weekDays={weekDays}
          selectedIndex={selectedDay}
          onSelect={setSelectedDay}
        />
      </PremiumCard>

      {/* Two-column layout: Session + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left: Today's session */}
        <TodaySessionCard day={currentDay} />

        {/* Right: Focus + Progress stacked */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <WeeklyFocusCard weekDays={weekDays} />
          <ProgressCard weekDays={weekDays} />
        </div>
      </div>
    </div>
  );
}
