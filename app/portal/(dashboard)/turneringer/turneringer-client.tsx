"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Trophy,
  Target,
  ExternalLink,
  List,
  CalendarDays,
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  Check,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { TOURNAMENT_LEVEL_CONFIG, GOAL_TYPE_CONFIG, PLAN_LEVEL_CONFIG } from "@/modules/tournament-planner/constants";
import type { TournamentWithPlan, GoalType, PlanLevel, TournamentLevel } from "@/modules/tournament-planner";
import type { TourScheduleEvent } from "@/lib/portal/datagolf/client";
import { registerForTournament } from "./actions";

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

type Tab = "mine" | "alle" | "pro";
type ViewMode = "list" | "calendar";
type ProTour = "pga" | "euro";

interface TurneringerClientProps {
  tournaments: TournamentWithPlan[];
  pgaSchedule: TourScheduleEvent[];
  euroSchedule: TourScheduleEvent[];
  userId: string;
}

// ════════════════════════════════════════════════════════════════
// LEVEL BADGE CONFIG — med Tailwind-tokens
// ════════════════════════════════════════════════════════════════

/* ════════════════════════════════════════════════════════════════
 * LEVEL BADGES — AK Golf Brand Colors
 * ════════════════════════════════════════════════════════════════ */
const LEVEL_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  nasjonal: {
    bg: "bg-[#154212]",
    text: "text-white",
    border: "border-[#154212]",
  },
  internasjonal: {
    bg: "bg-[#1c1c16]",
    text: "text-white",
    border: "border-[#1c1c16]",
  },
  regional: {
    bg: "bg-[#d2f000]",
    text: "text-[#0f2f0d]",
    border: "border-[#d2f000]",
  },
  lokal: {
    bg: "bg-[#f7f3ea]",
    text: "text-[#5a5a52]",
    border: "border-[#154212]/10",
  },
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export function TurneringerClient({
  tournaments,
  pgaSchedule,
  euroSchedule,
  userId,
}: TurneringerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("mine");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [levelFilter, setLevelFilter] = useState<TournamentLevel | "alle">("alle");
  const [showFilters, setShowFilters] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [proTour, setProTour] = useState<ProTour>("pga");
  const [selectedTournament, setSelectedTournament] = useState<TournamentWithPlan | null>(null);

  // ── Filtered tournaments ──────────────────────────────────────

  const myTournaments = useMemo(
    () => tournaments.filter((t) => t.playerPlan),
    [tournaments]
  );

  const filteredTournaments = useMemo(() => {
    const source = activeTab === "mine" ? myTournaments : tournaments;
    if (levelFilter === "alle") return source;
    return source.filter((t) => t.level === levelFilter);
  }, [tournaments, myTournaments, activeTab, levelFilter]);

  const upcomingTournaments = useMemo(
    () => filteredTournaments.filter((t) => isAfter(new Date(t.startDate), new Date())),
    [filteredTournaments]
  );

  const pastTournaments = useMemo(
    () => filteredTournaments.filter((t) => isBefore(new Date(t.startDate), new Date())),
    [filteredTournaments]
  );

  const proSchedule = proTour === "pga" ? pgaSchedule : euroSchedule;

  // ── Calendar helpers ──────────────────────────────────────────

  const calendarTournaments = useMemo(() => {
    return filteredTournaments.filter((t) =>
      isSameMonth(new Date(t.startDate), calendarMonth)
    );
  }, [filteredTournaments, calendarMonth]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    const days: Date[] = [];
    const firstDayOfWeek = (start.getDay() + 6) % 7; // Monday-start

    // Pad start
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      days.push(d);
    }
    // Month days
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    // Pad end to fill last week
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      days.push(next);
    }
    return days;
  }, [calendarMonth]);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-portal-text">Turneringer</h1>
          <p className="text-sm text-portal-secondary mt-1">
            {myTournaments.length} planlagte turneringer
          </p>
        </div>
      </div>

      {/* Tab Navigation — Modern Pill-tabs med Lime Accent */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1.5 rounded-full bg-[#f7f3ea] border border-[#154212]/8">
          {([
            { key: "mine" as Tab, label: "Mine turneringer", count: myTournaments.length },
            { key: "alle" as Tab, label: "Alle turneringer", count: tournaments.length },
            { key: "pro" as Tab, label: "Pro Tour" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-5 py-2.5 text-[13px] font-semibold rounded-full transition-all duration-300",
                activeTab === tab.key
                  ? "bg-[#d2f000] text-[#0f2f0d] shadow-[0_2px_12px_rgba(210,240,0,0.4)]"
                  : "text-[#5a5a52] hover:text-[#1c1c16] hover:bg-white/50"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "ml-2 text-xs tabular-nums px-1.5 py-0.5 rounded-full",
                  activeTab === tab.key ? "bg-[#0f2f0d]/10 text-[#0f2f0d]" : "bg-[#154212]/10 text-[#5a5a52]"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View toggle + filters (not for Pro tab) */}
        {activeTab !== "pro" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "p-2.5 rounded-full border transition-all duration-300",
                showFilters
                  ? "bg-[#154212] text-white border-[#154212] shadow-[0_2px_12px_rgba(21,66,18,0.3)]"
                  : "border-[#154212]/15 text-[#5a5a52] hover:border-[#154212]/30 hover:bg-white"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
            <div className="flex p-1 rounded-full bg-[#f7f3ea] border border-[#154212]/8">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-[#1c1c16]"
                    : "text-[#5a5a52] hover:text-[#1c1c16]"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  viewMode === "calendar"
                    ? "bg-white shadow-sm text-[#1c1c16]"
                    : "text-[#5a5a52] hover:text-[#1c1c16]"
                )}
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters — Modern Pill Chips */}
      {showFilters && activeTab !== "pro" && (
        <div className="flex gap-2 flex-wrap">
          {(["alle", "nasjonal", "regional", "lokal", "internasjonal"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300",
                levelFilter === level
                  ? "bg-[#d2f000] text-[#0f2f0d] border-[#d2f000] shadow-[0_2px_8px_rgba(210,240,0,0.3)]"
                  : "bg-white text-[#5a5a52] border-[#154212]/10 hover:border-[#d2f000]/50"
              )}
            >
              {level === "alle"
                ? "Alle nivåer"
                : TOURNAMENT_LEVEL_CONFIG[level]?.label ?? level}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === "pro" ? (
        <ProTourSection
          pgaSchedule={pgaSchedule}
          euroSchedule={euroSchedule}
          proTour={proTour}
          setProTour={setProTour}
        />
      ) : viewMode === "calendar" ? (
        <CalendarView
          tournaments={filteredTournaments}
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          calendarDays={calendarDays}
          calendarTournaments={calendarTournaments}
          onSelect={setSelectedTournament}
          userId={userId}
        />
      ) : (
        <ListView
          upcoming={upcomingTournaments}
          past={pastTournaments}
          showMine={activeTab === "mine"}
          onSelect={setSelectedTournament}
          userId={userId}
        />
      )}

      {/* Detail Modal */}
      {selectedTournament && (
        <TournamentDetailModal
          tournament={selectedTournament}
          userId={userId}
          onClose={() => setSelectedTournament(null)}
          onUpdated={() => {
            setSelectedTournament(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// LIST VIEW
// ════════════════════════════════════════════════════════════════

function ListView({
  upcoming,
  past,
  showMine,
  onSelect,
  userId,
}: {
  upcoming: TournamentWithPlan[];
  past: TournamentWithPlan[];
  showMine: boolean;
  onSelect: (t: TournamentWithPlan) => void;
  userId: string;
}) {
  if (upcoming.length === 0 && past.length === 0) {
    return (
      <EmptyState
        message={
          showMine
            ? "Du har ingen planlagte turneringer ennå. Gå til \"Alle turneringer\" for å legge til."
            : "Ingen turneringer funnet."
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[#154212] uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d2f000]" />
            Kommende
          </h2>
          <div className="space-y-2">
            {upcoming.map((t) => (
              <TournamentListCard
                key={t.id}
                tournament={t}
                onClick={() => onSelect(t)}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[#5a5a52] uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5a5a52]/30" />
            Tidligere
          </h2>
          <div className="space-y-2 opacity-60">
            {past.map((t) => (
              <TournamentListCard
                key={t.id}
                tournament={t}
                onClick={() => onSelect(t)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TOURNAMENT LIST CARD
// ════════════════════════════════════════════════════════════════

function TournamentListCard({
  tournament,
  onClick,
}: {
  tournament: TournamentWithPlan;
  onClick: () => void;
}) {
  const plan = tournament.playerPlan;
  const levelStyle = LEVEL_BADGE_STYLES[tournament.level] ?? LEVEL_BADGE_STYLES.lokal;
  const levelLabel =
    TOURNAMENT_LEVEL_CONFIG[tournament.level as keyof typeof TOURNAMENT_LEVEL_CONFIG]?.label ??
    tournament.level;

  const deadlinePassed = tournament.registrationDeadline
    ? isBefore(new Date(tournament.registrationDeadline), new Date())
    : false;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-[#154212]/8 rounded-[24px] p-5 hover:border-[#d2f000]/40 hover:shadow-portal-card-hover transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border",
                levelStyle.bg,
                levelStyle.text,
                levelStyle.border
              )}
            >
              {levelLabel}
            </span>
            {plan && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "var(--color-portal-secondary)"}15`,
                  color: GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "var(--color-portal-secondary)",
                }}
              >
                {GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.label ?? plan.goalType}
              </span>
            )}
            {plan?.isRegistered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-success-light text-success-text border border-success/20">
                <Check className="w-3 h-3" />
                Påmeldt
              </span>
            )}
            {tournament.series && (
              <span className="text-[10px] text-portal-muted">
                {tournament.series}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-[#1c1c16] text-sm group-hover:text-[#154212] transition-colors truncate">
            {tournament.name}
          </h3>

          {/* Meta */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#5a5a52]">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#154212]" />
              <span>
                {format(new Date(tournament.startDate), "d. MMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2 text-xs text-[#5a5a52]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#154212]" />
                <span className="truncate">
                  {[tournament.course, tournament.location].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && !deadlinePassed && (
              <div className="flex items-center gap-2 text-xs text-[#8a8a82]">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Påmeldingsfrist:{" "}
                  {format(new Date(tournament.registrationDeadline), "d. MMM", { locale: nb })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side — plan info */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {plan && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#154212]/10 text-[#154212]">
              {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
            </span>
          )}
          {tournament.externalUrl && (
            <span className="p-2 rounded-full bg-[#f7f3ea] text-[#5a5a52] group-hover:bg-[#d2f000] group-hover:text-[#0f2f0d] transition-all duration-300">
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
// CALENDAR VIEW
// ════════════════════════════════════════════════════════════════

function CalendarView({
  tournaments,
  calendarMonth,
  setCalendarMonth,
  calendarDays,
  calendarTournaments,
  onSelect,
  userId,
}: {
  tournaments: TournamentWithPlan[];
  calendarMonth: Date;
  setCalendarMonth: (d: Date) => void;
  calendarDays: Date[];
  calendarTournaments: TournamentWithPlan[];
  onSelect: (t: TournamentWithPlan) => void;
  userId: string;
}) {
  const prevMonth = () => {
    const d = new Date(calendarMonth);
    d.setMonth(d.getMonth() - 1);
    setCalendarMonth(d);
  };
  const nextMonth = () => {
    const d = new Date(calendarMonth);
    d.setMonth(d.getMonth() + 1);
    setCalendarMonth(d);
  };

  const tournamentsOnDay = (day: Date) =>
    calendarTournaments.filter((t) => isSameDay(new Date(t.startDate), day));

  const weekdays = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];

  return (
    <PremiumCard noHover radius="large" className="p-0 overflow-hidden border-[#154212]/10">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#154212]/8">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-[#f7f3ea] text-[#5a5a52] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-semibold text-[#1c1c16] capitalize">
          {format(calendarMonth, "MMMM yyyy", { locale: nb })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-[#f7f3ea] text-[#5a5a52] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-[#154212]/8">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[10px] font-semibold text-[#5a5a52] uppercase tracking-[0.1em]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, calendarMonth);
          const isToday = isSameDay(day, new Date());
          const dayTournaments = tournamentsOnDay(day);

          return (
            <div
              key={i}
              className={cn(
                "min-h-[90px] p-2 border-b border-r border-[#154212]/8 last:border-r-0",
                !isCurrentMonth && "bg-[#f7f3ea]/50"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                  isToday && "bg-[#d2f000] text-[#0f2f0d] font-semibold",
                  !isToday && isCurrentMonth && "text-[#1c1c16]",
                  !isCurrentMonth && "text-[#8a8a82]"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {dayTournaments.slice(0, 2).map((t) => {
                  const levelStyle = LEVEL_BADGE_STYLES[t.level] ?? LEVEL_BADGE_STYLES.lokal;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelect(t)}
                      className={cn(
                        "w-full text-left px-2 py-1 text-[10px] font-medium rounded-lg truncate transition-colors hover:opacity-80",
                        levelStyle.bg,
                        levelStyle.text
                      )}
                    >
                      {t.name}
                    </button>
                  );
                })}
                {dayTournaments.length > 2 && (
                  <span className="text-[9px] text-[#8a8a82] pl-1">
                    +{dayTournaments.length - 2} til
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}

// ════════════════════════════════════════════════════════════════
// PRO TOUR SECTION
// ════════════════════════════════════════════════════════════════

function ProTourSection({
  pgaSchedule,
  euroSchedule,
  proTour,
  setProTour,
}: {
  pgaSchedule: TourScheduleEvent[];
  euroSchedule: TourScheduleEvent[];
  proTour: ProTour;
  setProTour: (t: ProTour) => void;
}) {
  const schedule = proTour === "pga" ? pgaSchedule : euroSchedule;

  return (
    <div className="space-y-4">
      {/* Tour toggle — Modern Pills */}
      <div className="flex gap-2 p-1.5 rounded-full bg-[#f7f3ea] border border-[#154212]/8 w-fit">
        <button
          onClick={() => setProTour("pga")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
            proTour === "pga"
              ? "bg-[#d2f000] text-[#0f2f0d] shadow-[0_2px_12px_rgba(210,240,0,0.4)]"
              : "text-[#5a5a52] hover:text-[#1c1c16] hover:bg-white/50"
          )}
        >
          PGA Tour
        </button>
        <button
          onClick={() => setProTour("euro")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
            proTour === "euro"
              ? "bg-[#d2f000] text-[#0f2f0d] shadow-[0_2px_12px_rgba(210,240,0,0.4)]"
              : "text-[#5a5a52] hover:text-[#1c1c16] hover:bg-white/50"
          )}
        >
          DP World Tour
        </button>
      </div>

      {schedule.length === 0 ? (
        <EmptyState message="Ingen kommende turneringer funnet for denne touren." />
      ) : (
        <div className="space-y-2">
          {schedule.map((event) => (
            <ProTournamentCard key={event.event_id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProTournamentCard({ event }: { event: TourScheduleEvent }) {
  const startDate = event.start_date ? parseISO(event.start_date) : null;
  const endDate = event.end_date ? parseISO(event.end_date) : null;
  const isPast = startDate ? isBefore(startDate, new Date()) : false;

  return (
    <div
      className={cn(
        "bg-white border border-[#154212]/8 rounded-[24px] p-5 transition-all duration-300 hover:border-[#d2f000]/40 hover:shadow-portal-card-hover",
        isPast && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Globe className="w-3 h-3" />
              Pro Tour
            </span>
            {event.winner_name && (
              <span className="text-[10px] text-portal-muted">
                Vinner: {event.winner_name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-[#1c1c16] text-sm">
            {event.event_name}
          </h3>

          <div className="mt-2 space-y-1">
            {startDate && (
              <div className="flex items-center gap-2 text-xs text-portal-secondary">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {format(startDate, "d. MMM yyyy", { locale: nb })}
                  {endDate && ` – ${format(endDate, "d. MMM", { locale: nb })}`}
                </span>
              </div>
            )}
            {(event.course || event.location) && (
              <div className="flex items-center gap-2 text-xs text-portal-secondary">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{[event.course, event.location].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TOURNAMENT DETAIL MODAL
// ════════════════════════════════════════════════════════════════

function TournamentDetailModal({
  tournament,
  userId,
  onClose,
  onUpdated,
}: {
  tournament: TournamentWithPlan;
  userId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [goalType, setGoalType] = useState<GoalType>(
    (tournament.playerPlan?.goalType as GoalType) ?? "prestasjon"
  );
  const [planLevel, setPlanLevel] = useState<PlanLevel>(
    (tournament.playerPlan?.planLevel as PlanLevel) ?? "A"
  );
  const [notes, setNotes] = useState(tournament.playerPlan?.notes ?? "");

  const plan = tournament.playerPlan;
  const levelStyle = LEVEL_BADGE_STYLES[tournament.level] ?? LEVEL_BADGE_STYLES.lokal;
  const levelLabel =
    TOURNAMENT_LEVEL_CONFIG[tournament.level as keyof typeof TOURNAMENT_LEVEL_CONFIG]?.label ??
    tournament.level;

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await registerForTournament({
        tournamentId: tournament.id,
        goalType,
        planLevel,
        notes: notes || undefined,
      });
      if (result.success) {
        onUpdated();
      }
    });
  }, [tournament.id, goalType, planLevel, notes, onUpdated]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-portal-border px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border",
                  levelStyle.bg,
                  levelStyle.text,
                  levelStyle.border
                )}
              >
                {levelLabel}
              </span>
              {plan?.isRegistered && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-success-light text-success-text">
                  <Check className="w-3 h-3" />
                  Påmeldt
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-portal-text truncate">
              {tournament.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-portal-hover text-portal-secondary transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-portal-secondary">
              <Calendar className="w-4 h-4 text-portal-muted" />
              <span>
                {format(new Date(tournament.startDate), "d. MMMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2.5 text-sm text-portal-secondary">
                <MapPin className="w-4 h-4 text-portal-muted" />
                <span>
                  {[tournament.course, tournament.location].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && (
              <div className="flex items-center gap-2.5 text-sm text-portal-secondary">
                <Clock className="w-4 h-4 text-portal-muted" />
                <span>
                  Påmeldingsfrist:{" "}
                  {format(new Date(tournament.registrationDeadline), "d. MMMM yyyy", { locale: nb })}
                </span>
              </div>
            )}
            {tournament.numberOfHoles && (
              <div className="flex items-center gap-2.5 text-sm text-portal-secondary">
                <Target className="w-4 h-4 text-portal-muted" />
                <span>{tournament.numberOfHoles} hull</span>
              </div>
            )}
          </div>

          {/* External links */}
          {tournament.externalUrl && (
            <a
              href={tournament.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[20px] border border-portal-border text-portal-secondary hover:border-primary hover:text-portal-text transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Se turnering / meld deg på
            </a>
          )}

          {/* Divider */}
          <div className="border-t border-portal-border" />

          {/* Plan section */}
          <div>
            <h3 className="text-sm font-semibold text-portal-text mb-3">Min plan</h3>

            {/* Goal type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-portal-secondary mb-2 block">
                Mål
              </label>
              <div className="flex gap-2">
                {(Object.entries(GOAL_TYPE_CONFIG) as [GoalType, { color: string; label: string; tooltip: string }][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setGoalType(key)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium rounded-xl border transition-all",
                        goalType === key
                          ? "border-2 shadow-sm"
                          : "border-portal-border text-portal-secondary hover:border-primary"
                      )}
                      style={
                        goalType === key
                          ? {
                              borderColor: config.color,
                              color: config.color,
                              backgroundColor: `${config.color}08`,
                            }
                          : undefined
                      }
                      title={config.tooltip}
                    >
                      {config.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Plan level */}
            <div className="mb-4">
              <label className="text-xs font-medium text-portal-secondary mb-2 block">
                Prioritet
              </label>
              <div className="flex gap-2">
                {(Object.entries(PLAN_LEVEL_CONFIG) as [PlanLevel, { label: string; description: string }][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setPlanLevel(key)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center",
                        planLevel === key
                          ? "border-primary bg-primary text-white"
                          : "border-portal-border text-portal-secondary hover:border-primary"
                      )}
                    >
                      <div>{config.label}</div>
                      <div className={cn("text-[10px] mt-0.5", planLevel === key ? "text-white/70" : "text-portal-muted")}>
                        {config.description}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-xs font-medium text-portal-secondary mb-2 block">
                Notater
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tanker om turneringen, strategi, mål..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-portal-border focus:border-primary focus:outline-none resize-none placeholder:text-portal-muted text-portal-text"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-portal-border px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-[20px] text-portal-secondary hover:text-portal-text transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[20px] bg-primary text-white hover:bg-primary-alt disabled:opacity-50 transition-colors"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {plan ? "Oppdater plan" : "Legg til plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// EMPTY STATE
// ════════════════════════════════════════════════════════════════

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-[24px] bg-[#f7f3ea] border border-[#154212]/10 flex items-center justify-center mb-4">
        <Trophy className="w-7 h-7 text-[#154212]" />
      </div>
      <p className="text-sm text-[#5a5a52] max-w-xs">{message}</p>
    </div>
  );
}
