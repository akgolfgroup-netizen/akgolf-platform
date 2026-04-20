"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useMemo, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Globe } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { BentoCard, MonoLabel, GlassPanel } from "@/components/portal/patterns";
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
}

// ════════════════════════════════════════════════════════════════
// LEVEL BADGE CONFIG
// ════════════════════════════════════════════════════════════════

const LEVEL_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  nasjonal: {
    bg: "bg-on-surface",
    text: "text-surface",
    border: "border-black",
  },
  internasjonal: {
    bg: "bg-surface-variant",
    text: "text-surface",
    border: "border-outline-variant",
  },
  regional: {
    bg: "bg-secondary-fixed",
    text: "text-on-surface",
    border: "border-secondary-fixed",
  },
  lokal: {
    bg: "bg-surface",
    text: "text-on-surface-variant",
    border: "border-outline-variant/30",
  },
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export function TurneringerClient({
  tournaments,
  pgaSchedule,
  euroSchedule,
}: TurneringerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("mine");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [levelFilter, setLevelFilter] = useState<TournamentLevel | "alle">("alle");
  const [showFilters, setShowFilters] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [proTour, setProTour] = useState<ProTour>("pga");
  const [selectedTournament, setSelectedTournament] = useState<TournamentWithPlan | null>(null);

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


  const calendarTournaments = useMemo(() => {
    return filteredTournaments.filter((t) =>
      isSameMonth(new Date(t.startDate), calendarMonth)
    );
  }, [filteredTournaments, calendarMonth]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    const days: Date[] = [];
    const firstDayOfWeek = (start.getDay() + 6) % 7;

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      days.push(d);
    }
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      days.push(next);
    }
    return days;
  }, [calendarMonth]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">
          Turneringer
        </MonoLabel>
        <h1 className="text-2xl font-bold text-on-surface">Turneringer</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {myTournaments.length} planlagte turneringer
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/30">
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
                  ? "bg-secondary-fixed text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "ml-2 text-xs tabular-nums px-1.5 py-0.5 rounded-full",
                  activeTab === tab.key ? "bg-on-surface/10 text-on-surface" : "bg-surface text-on-surface-variant"
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
                  ? "bg-on-surface text-surface border-black shadow-sm"
                  : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50 hover:bg-surface-container-lowest"
              )}
            >
              <Icon name="filter_list" className="w-4 h-4" />
            </button>
            <div className="flex p-1 rounded-full bg-surface-container-lowest border border-outline-variant/30">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  viewMode === "list"
                    ? "bg-surface shadow-sm text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <Icon name="list" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  viewMode === "calendar"
                    ? "bg-surface shadow-sm text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <Icon name="calendar_today" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && activeTab !== "pro" && (
        <div className="flex gap-2 flex-wrap">
          {(["alle", "nasjonal", "regional", "lokal", "internasjonal"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300",
                levelFilter === level
                  ? "bg-secondary-fixed text-on-surface border-secondary-fixed shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-outline-variant/50"
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
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          calendarDays={calendarDays}
          calendarTournaments={calendarTournaments}
          onSelect={setSelectedTournament} />
      ) : (
        <ListView
          upcoming={upcomingTournaments}
          past={pastTournaments}
          showMine={activeTab === "mine"}
          onSelect={setSelectedTournament} />
      )}

      {/* Detail Modal */}
      {selectedTournament && (
        <TournamentDetailModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          onUpdated={() => {
            setSelectedTournament(null);
            router.refresh();
          }}
        />
      )}
    </section>
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
}: {
  upcoming: TournamentWithPlan[];
  past: TournamentWithPlan[];
  showMine: boolean;
  onSelect: (t: TournamentWithPlan) => void;
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
          <h2 className="text-xs font-semibold text-on-surface uppercase tracking-[0.14em] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
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
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-[0.14em] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-surface-variant/30" />
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
      className="w-full text-left bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-outline-variant/50 hover:shadow-sm transition-all duration-300 group"
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
                  backgroundColor: `${GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "#7A8C85"}15`,
                  color: GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.color ?? "#7A8C85",
                }}
              >
                {GOAL_TYPE_CONFIG[plan.goalType as GoalType]?.label ?? plan.goalType}
              </span>
            )}
            {plan?.isRegistered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-success-light text-success border border-success/20">
                <Icon name="check" className="w-3 h-3" />
                Påmeldt
              </span>
            )}
            {tournament.series && (
              <span className="text-[10px] text-on-surface-variant">
                {tournament.series}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-on-surface text-sm group-hover:text-on-surface-variant transition-colors truncate">
            {tournament.name}
          </h3>

          {/* Meta */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Icon name="calendar_today" className="w-3.5 h-3.5 flex-shrink-0 text-on-surface" />
              <span>
                {format(new Date(tournament.startDate), "d. MMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Icon name="location_on" className="w-3.5 h-3.5 flex-shrink-0 text-on-surface" />
                <span className="truncate">
                  {[tournament.course, tournament.location].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && !deadlinePassed && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Icon name="schedule" className="w-3.5 h-3.5 flex-shrink-0" />
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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-on-surface/10 text-on-surface">
              {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
            </span>
          )}
          {tournament.externalUrl && (
            <span className="p-2 rounded-full bg-surface text-on-surface-variant group-hover:bg-secondary-fixed group-hover:text-on-surface transition-all duration-300">
              <Icon name="open_in_new" className="w-3.5 h-3.5" />
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
  calendarMonth,
  setCalendarMonth,
  calendarDays,
  calendarTournaments,
  onSelect,
}: {
  calendarMonth: Date;
  setCalendarMonth: (d: Date) => void;
  calendarDays: Date[];
  calendarTournaments: TournamentWithPlan[];
  onSelect: (t: TournamentWithPlan) => void;
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
    <BentoCard variant="light" padding="none" className="overflow-hidden rounded-2xl">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-surface text-on-surface-variant transition-colors"
        >
          <Icon name="chevron_left" className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-semibold text-on-surface capitalize">
          {format(calendarMonth, "MMMM yyyy", { locale: nb })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-surface text-on-surface-variant transition-colors"
        >
          <Icon name="chevron_right" className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-outline-variant/30">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.14em]"
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
                "min-h-[90px] p-2 border-b border-r border-outline-variant/30 last:border-r-0",
                !isCurrentMonth && "bg-surface/50"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                  isToday && "bg-secondary-fixed text-on-surface font-semibold",
                  !isToday && isCurrentMonth && "text-on-surface",
                  !isCurrentMonth && "text-on-surface-variant"
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
                  <span className="text-[9px] text-on-surface-variant pl-1">
                    +{dayTournaments.length - 2} til
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </BentoCard>
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
      <div className="flex gap-2 p-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 w-fit">
        <button
          onClick={() => setProTour("pga")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
            proTour === "pga"
              ? "bg-secondary-fixed text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
          )}
        >
          PGA Tour
        </button>
        <button
          onClick={() => setProTour("euro")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
            proTour === "euro"
              ? "bg-secondary-fixed text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
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
        "bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 transition-all duration-300 hover:border-outline-variant/50 hover:shadow-sm",
        isPast && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-on-surface/10 text-on-surface border border-black/20">
              <Globe className="w-3 h-3" />
              Pro Tour
            </span>
            {event.winner_name && (
              <span className="text-[10px] text-on-surface-variant">
                Vinner: {event.winner_name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-on-surface text-sm">
            {event.event_name}
          </h3>

          <div className="mt-2 space-y-1">
            {startDate && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Icon name="calendar_today" className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {format(startDate, "d. MMM yyyy", { locale: nb })}
                  {endDate && ` – ${format(endDate, "d. MMM", { locale: nb })}`}
                </span>
              </div>
            )}
            {(event.course || event.location) && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Icon name="location_on" className="w-3.5 h-3.5 flex-shrink-0" />
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
  onClose,
  onUpdated,
}: {
  tournament: TournamentWithPlan;
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
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <GlassPanel variant="light" padding="none" className="w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest/80 backdrop-blur-[22px] border-b border-outline-variant/30 px-6 py-4 flex items-start justify-between rounded-t-[24px] z-10">
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
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-success-light text-success">
                  <Icon name="check" className="w-3 h-3" />
                  Påmeldt
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-on-surface truncate">
              {tournament.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface text-on-surface-variant transition-colors ml-2"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-on-surface-variant">
              <Icon name="calendar_today" className="w-4 h-4 text-on-surface-variant" />
              <span>
                {format(new Date(tournament.startDate), "d. MMMM yyyy", { locale: nb })}
                {tournament.endDate &&
                  ` – ${format(new Date(tournament.endDate), "d. MMMM", { locale: nb })}`}
              </span>
            </div>
            {(tournament.course || tournament.location) && (
              <div className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                <Icon name="location_on" className="w-4 h-4 text-on-surface-variant" />
                <span>
                  {[tournament.course, tournament.location].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {tournament.registrationDeadline && (
              <div className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                <Icon name="schedule" className="w-4 h-4 text-on-surface-variant" />
                <span>
                  Påmeldingsfrist:{" "}
                  {format(new Date(tournament.registrationDeadline), "d. MMMM yyyy", { locale: nb })}
                </span>
              </div>
            )}
            {tournament.numberOfHoles && (
              <div className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                <Icon name="my_location" className="w-4 h-4 text-on-surface-variant" />
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
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50 hover:text-on-surface transition-colors"
            >
              <Icon name="open_in_new" className="w-4 h-4" />
              Se turnering / meld deg på
            </a>
          )}

          {/* Divider */}
          <div className="border-t border-outline-variant/30" />

          {/* Plan section */}
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Min plan</h3>

            {/* Goal type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-on-surface-variant mb-2 block">
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
                          : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50"
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
              <label className="text-xs font-medium text-on-surface-variant mb-2 block">
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
                          ? "border-black bg-on-surface text-surface"
                          : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50"
                      )}
                    >
                      <div>{config.label}</div>
                      <div className={cn("text-[10px] mt-0.5", planLevel === key ? "text-surface/70" : "text-on-surface-variant")}>
                        {config.description}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-xs font-medium text-on-surface-variant mb-2 block">
                Notater
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tanker om turneringen, strategi, mål..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 focus:border-outline-variant/50 focus:outline-none resize-none placeholder:text-on-surface-variant text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-container-lowest/80 backdrop-blur-[22px] border-t border-outline-variant/30 px-6 py-4 flex items-center justify-end gap-3 rounded-b-[24px]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-secondary-fixed text-on-surface hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            {isPending && <Icon name="progress_activity" className="w-4 h-4 animate-spin" />}
            {plan ? "Oppdater plan" : "Legg til plan"}
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// EMPTY STATE
// ════════════════════════════════════════════════════════════════

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-[24px] bg-surface border border-outline-variant/30 flex items-center justify-center mb-4">
        <Icon name="emoji_events" className="w-7 h-7 text-on-surface" />
      </div>
      <p className="text-sm text-on-surface-variant max-w-xs">{message}</p>
    </div>
  );
}
