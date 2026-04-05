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
// LEVEL BADGE CONFIG
// ════════════════════════════════════════════════════════════════

const LEVEL_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  nasjonal: {
    bg: "rgba(29,29,31,0.08)",
    text: "#1D1D1F",
    border: "rgba(29,29,31,0.15)",
  },
  internasjonal: {
    bg: "rgba(29,29,31,0.08)",
    text: "#1D1D1F",
    border: "rgba(29,29,31,0.15)",
  },
  regional: {
    bg: "rgba(59,130,246,0.08)",
    text: "#3B82F6",
    border: "rgba(59,130,246,0.2)",
  },
  lokal: {
    bg: "rgba(110,110,115,0.08)",
    text: "#6E6E73",
    border: "rgba(110,110,115,0.15)",
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
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
            Turneringer
          </h1>
          <p className="text-sm text-[var(--color-grey-500)] mt-1">
            {myTournaments.length} planlagte turneringer
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-grey-100)]">
          {([
            { key: "mine" as Tab, label: "Mine turneringer", count: myTournaments.length },
            { key: "alle" as Tab, label: "Alle turneringer", count: tournaments.length },
            { key: "pro" as Tab, label: "Pro Tour" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === tab.key
                  ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                  : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "ml-1.5 text-xs tabular-nums",
                  activeTab === tab.key
                    ? "text-[var(--color-grey-500)]"
                    : "text-[var(--color-grey-400)]"
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
                "p-2 rounded-lg border transition-colors",
                showFilters
                  ? "border-[var(--color-grey-900)] bg-[var(--color-grey-900)] text-white"
                  : "border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-grey-400)]"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
            <div className="flex p-1 rounded-lg bg-[var(--color-grey-100)]">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-[var(--color-grey-900)]"
                    : "text-[var(--color-grey-400)]"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "calendar"
                    ? "bg-white shadow-sm text-[var(--color-grey-900)]"
                    : "text-[var(--color-grey-400)]"
                )}
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && activeTab !== "pro" && (
        <div className="flex gap-2">
          {(["alle", "nasjonal", "regional", "lokal", "internasjonal"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                levelFilter === level
                  ? "bg-[var(--color-grey-900)] text-white border-[var(--color-grey-900)]"
                  : "bg-white text-[var(--color-grey-500)] border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
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
          <h2 className="text-sm font-semibold text-[var(--color-grey-500)] uppercase tracking-wider mb-3">
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
          <h2 className="text-sm font-semibold text-[var(--color-grey-500)] uppercase tracking-wider mb-3">
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
      className="w-full text-left bg-white border border-[var(--color-grey-200)] rounded-2xl p-4 hover:border-[var(--color-grey-300)] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: levelStyle.bg,
                color: levelStyle.text,
                borderColor: levelStyle.border,
              }}
            >
              {levelLabel}
            </span>
            {plan && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "#6E6E73"}15`,
                  color: GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "#6E6E73",
                }}
              >
                {GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.label ?? plan.goalType}
              </span>
            )}
            {plan?.isRegistered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(52,199,89,0.1)] text-[#34C759] border border-[rgba(52,199,89,0.2)]">
                <Check className="w-3 h-3" />
                Påmeldt
              </span>
            )}
            {tournament.series && (
              <span className="text-[10px] text-[var(--color-grey-400)]">
                {tournament.series}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-[var(--color-grey-900)] text-sm group-hover:text-[var(--color-brand)] transition-colors truncate">
            {tournament.name}
          </h3>

          {/* Meta */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {format(new Date(tournament.startDate), "d. MMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {[tournament.course, tournament.location].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && !deadlinePassed && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-grey-400)]">
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
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {plan && (
            <span className="text-xs font-medium text-[var(--color-grey-900)]">
              {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
            </span>
          )}
          {tournament.externalUrl && (
            <span className="p-1.5 rounded-lg text-[var(--color-grey-400)] group-hover:text-[var(--color-grey-600)] transition-colors">
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
    <div className="bg-white border border-[var(--color-grey-200)] rounded-2xl overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-grey-200)]">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-grey-500)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-semibold text-[var(--color-grey-900)] capitalize">
          {format(calendarMonth, "MMMM yyyy", { locale: nb })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-grey-500)] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-[var(--color-grey-100)]">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-semibold text-[var(--color-grey-400)] uppercase tracking-wider"
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
                "min-h-[80px] p-1.5 border-b border-r border-[var(--color-grey-100)] last:border-r-0",
                !isCurrentMonth && "bg-[var(--color-grey-100)]/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-6 h-6 text-xs rounded-full",
                  isToday && "bg-[var(--color-grey-900)] text-white font-semibold",
                  !isToday && isCurrentMonth && "text-[var(--color-grey-900)]",
                  !isCurrentMonth && "text-[var(--color-grey-300)]"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayTournaments.slice(0, 2).map((t) => {
                  const levelStyle = LEVEL_BADGE_STYLES[t.level] ?? LEVEL_BADGE_STYLES.lokal;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelect(t)}
                      className="w-full text-left px-1.5 py-0.5 text-[10px] font-medium rounded truncate transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: levelStyle.bg,
                        color: levelStyle.text,
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
                {dayTournaments.length > 2 && (
                  <span className="text-[9px] text-[var(--color-grey-400)] pl-1">
                    +{dayTournaments.length - 2} til
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
      {/* Tour toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setProTour("pga")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl border transition-colors",
            proTour === "pga"
              ? "bg-[var(--color-grey-900)] text-white border-[var(--color-grey-900)]"
              : "bg-white text-[var(--color-grey-500)] border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
          )}
        >
          PGA Tour
        </button>
        <button
          onClick={() => setProTour("euro")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl border transition-colors",
            proTour === "euro"
              ? "bg-[var(--color-grey-900)] text-white border-[var(--color-grey-900)]"
              : "bg-white text-[var(--color-grey-500)] border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
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
        "bg-white border border-[var(--color-grey-200)] rounded-2xl p-4 transition-colors",
        isPast && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(45,106,79,0.08)] text-[var(--color-brand)] border border-[rgba(45,106,79,0.15)]">
              <Globe className="w-3 h-3" />
              Pro Tour
            </span>
            {event.winner_name && (
              <span className="text-[10px] text-[var(--color-grey-400)]">
                Vinner: {event.winner_name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-[var(--color-grey-900)] text-sm">
            {event.event_name}
          </h3>

          <div className="mt-2 space-y-1">
            {startDate && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {format(startDate, "d. MMM yyyy", { locale: nb })}
                  {endDate && ` – ${format(endDate, "d. MMM", { locale: nb })}`}
                </span>
              </div>
            )}
            {(event.course || event.location) && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{[event.course, event.location].filter(Boolean).join(", ")}</span>
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-grey-200)] px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: levelStyle.bg,
                  color: levelStyle.text,
                  borderColor: levelStyle.border,
                }}
              >
                {levelLabel}
              </span>
              {plan?.isRegistered && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(52,199,89,0.1)] text-[#34C759]">
                  <Check className="w-3 h-3" />
                  Påmeldt
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-[var(--color-grey-900)] truncate">
              {tournament.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-grey-500)] transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
              <Calendar className="w-4 h-4 text-[var(--color-grey-400)]" />
              <span>
                {format(new Date(tournament.startDate), "d. MMMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <MapPin className="w-4 h-4 text-[var(--color-grey-400)]" />
                <span>
                  {[tournament.course, tournament.location].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && (
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <Clock className="w-4 h-4 text-[var(--color-grey-400)]" />
                <span>
                  Påmeldingsfrist:{" "}
                  {format(new Date(tournament.registrationDeadline), "d. MMMM yyyy", { locale: nb })}
                </span>
              </div>
            )}
            {tournament.numberOfHoles && (
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <Target className="w-4 h-4 text-[var(--color-grey-400)]" />
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
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-600)] hover:border-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Se turnering / meld deg på
            </a>
          )}

          {/* Divider */}
          <div className="border-t border-[var(--color-grey-100)]" />

          {/* Plan section */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-3">
              Min plan
            </h3>

            {/* Goal type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-[var(--color-grey-500)] mb-2 block">
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
                          : "border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-grey-300)]"
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
              <label className="text-xs font-medium text-[var(--color-grey-500)] mb-2 block">
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
                          ? "border-[var(--color-grey-900)] bg-[var(--color-grey-900)] text-white"
                          : "border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-grey-300)]"
                      )}
                    >
                      <div>{config.label}</div>
                      <div
                        className={cn(
                          "text-[10px] mt-0.5",
                          planLevel === key
                            ? "text-white/70"
                            : "text-[var(--color-grey-400)]"
                        )}
                      >
                        {config.description}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-xs font-medium text-[var(--color-grey-500)] mb-2 block">
                Notater
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tanker om turneringen, strategi, mål..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[var(--color-grey-200)] focus:border-[var(--color-grey-400)] focus:outline-none resize-none placeholder:text-[var(--color-grey-300)] text-[var(--color-grey-900)]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-grey-200)] px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-xl text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)] disabled:opacity-50 transition-colors"
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
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mb-4">
        <Trophy className="w-6 h-6 text-[var(--color-grey-300)]" />
      </div>
      <p className="text-sm text-[var(--color-grey-500)] max-w-xs">{message}</p>
    </div>
  );
}
