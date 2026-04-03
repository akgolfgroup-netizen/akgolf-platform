"use client";

import { useState, useMemo, useTransition } from "react";
import {
  NotebookPen,
  Plus,
  List,
  Calendar,
  Clock,
  Activity,
  Target,
  ChevronLeft,
  ChevronRight,
  Flame,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { repeatLastSession } from "./actions";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleCard } from "@/components/portal/apple/apple-card";
import { StreakMilestone } from "@/components/portal/gamification/streak-milestone";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  subMonths,
  addMonths,
  differenceInCalendarDays,
  startOfDay,
  subDays,
} from "date-fns";
import { nb } from "date-fns/locale";

interface TrainingLogEntry {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
  planSessionId: string | null;
  TrainingPlanSession: {
    id: string;
    title: string;
    focusArea: string | null;
    durationMinutes: number | null;
  } | null;
}

interface DagbokClientProps {
  initialLogs: TrainingLogEntry[];
  loggedSessionIds: string[];
  lastSession?: { focusArea: string | null; durationMinutes: number | null } | null;
}

const weekDays = ["M", "T", "O", "T", "F", "L", "S"];

function calculateStreak(logs: TrainingLogEntry[]): number {
  if (logs.length === 0) return 0;

  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );

  const today = startOfDay(new Date());
  let streak = 0;
  let checkDate = today;

  // If today has no log, start checking from yesterday
  if (!logDates.has(format(checkDate, "yyyy-MM-dd"))) {
    checkDate = subDays(checkDate, 1);
  }

  while (logDates.has(format(checkDate, "yyyy-MM-dd"))) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }

  return streak;
}

function getStreakDays(logs: TrainingLogEntry[]) {
  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );
  const today = new Date();
  // Get Monday of the current week
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(today, { weekStartsOn: 1 }),
  });

  return days.map((d) => ({
    day: weekDays[d.getDay() === 0 ? 6 : d.getDay() - 1],
    active: logDates.has(format(d, "yyyy-MM-dd")),
    today: isToday(d),
  }));
}

function buildCalendarDays(month: Date, logs: TrainingLogEntry[]) {
  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((d) => ({
    date: d,
    day: d.getDate(),
    otherMonth: !isSameMonth(d, month),
    hasLog: logDates.has(format(d, "yyyy-MM-dd")),
    today: isToday(d),
  }));
}

function buildCategories(logs: TrainingLogEntry[]) {
  const counts: Record<string, number> = {};
  for (const log of logs) {
    const area = log.focusArea || log.TrainingPlanSession?.focusArea || "Annet";
    counts[area] = (counts[area] || 0) + 1;
  }

  const total = logs.length || 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, 4).map(([name, count]) => ({
    name,
    count: `${count} ${count === 1 ? "okt" : "okter"}`,
    progress: Math.round((count / total) * 100),
  }));
}

export function DagbokClient({ initialLogs, loggedSessionIds, lastSession }: DagbokClientProps) {
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const [quickLogSuccess, setQuickLogSuccess] = useState(false);

  const logs = initialLogs;

  const handleQuickLog = () => {
    startTransition(async () => {
      try {
        await repeatLastSession();
        setQuickLogSuccess(true);
        setTimeout(() => setQuickLogSuccess(false), 3000);
      } catch {
        // Handle error silently
      }
    });
  };

  // Compute stats
  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const streakDays = useMemo(() => getStreakDays(logs), [logs]);
  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, logs),
    [calendarMonth, logs]
  );
  const categories = useMemo(() => buildCategories(logs), [logs]);

  // Stats calculations
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const logsThisWeek = logs.filter(
    (l) => new Date(l.date) >= weekStart && new Date(l.date) <= now
  );
  const totalMinutes = logs.reduce(
    (sum, l) => sum + (l.durationMinutes || 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgRating =
    logs.filter((l) => l.rating != null).length > 0
      ? (
          logs.reduce((sum, l) => sum + (l.rating || 0), 0) /
          logs.filter((l) => l.rating != null).length
        ).toFixed(1)
      : "-";

  // Filter logs for display
  const filters = useMemo(() => {
    const areas = new Set<string>();
    logs.forEach((l) => {
      const area =
        l.focusArea || l.TrainingPlanSession?.focusArea;
      if (area) areas.add(area);
    });
    return ["Alle", ...Array.from(areas).slice(0, 4)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (activeFilter === "Alle") return logs;
    return logs.filter(
      (l) =>
        l.focusArea === activeFilter ||
        l.TrainingPlanSession?.focusArea === activeFilter
    );
  }, [logs, activeFilter]);

  const formatLogDate = (date: Date | string) => {
    const d = new Date(date);
    if (isToday(d)) return `I dag, ${format(d, "HH:mm")}`;
    const yesterday = subDays(new Date(), 1);
    if (isSameDay(d, yesterday)) return `I gar, ${format(d, "HH:mm")}`;
    return format(d, "d. MMMM, HH:mm", { locale: nb });
  };

  const isEmpty = logs.length === 0;

  return (
    // MERK: Bruker white i stedet for --color-grey-050 som ikke eksisterer
    // Se gotchas.md #36 for liste over gyldige CSS-tokens
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-grey-100)] via-white to-[var(--color-grey-100)] relative">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-start justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-tight mb-1">
              Treningsdagbok
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)]">
              Hold oversikt over treningsaktiviteten din
            </p>
          </div>
          <div className="flex gap-2">
            {lastSession && (
              <AppleButton
                variant="secondary"
                icon={isPending ? Loader2 : RotateCcw}
                onClick={handleQuickLog}
                disabled={isPending}
              >
                {isPending ? "Logger..." : "Gjenta siste"}
              </AppleButton>
            )}
            <AppleButton variant="primary" icon={Plus}>
              Logg ny okt
            </AppleButton>
          </div>
        </motion.div>

        {/* Quick-log success toast */}
        {quickLogSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-[#16a34a] text-white text-sm font-medium shadow-lg"
          >
            Okt logget!
          </motion.div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AppleCard className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <NotebookPen className="w-12 h-12 text-[var(--color-grey-300)] mb-4" />
                <p className="text-base font-medium text-[var(--color-grey-900)] mb-1">
                  Din treningsdagbok er tom
                </p>
                <p className="text-sm text-[var(--color-grey-500)] mb-6">
                  Logg din forste treningsokt for a komme i gang
                </p>
                <AppleButton variant="primary" icon={Plus}>
                  Logg ny okt
                </AppleButton>
              </div>
            </AppleCard>
          </motion.div>
        )}

        {/* Content - only shown when there are logs */}
        {!isEmpty && (
          <>
            {/* Stats Row */}
            <motion.div
              className="grid grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <StatCard
                label="Denne uken"
                value={String(logsThisWeek.length)}
                icon={Calendar}
                size="sm"
              />
              <StatCard
                label="Timer totalt"
                value={totalHours}
                icon={Clock}
                size="sm"
              />
              <StatCard
                label="Streak"
                value={String(streak)}
                icon={Flame}
                size="sm"
              />
              <StatCard
                label="Snitt vurdering"
                value={avgRating}
                icon={Activity}
                size="sm"
              />
            </motion.div>

            {/* Bento Grid */}
            <BentoGrid gap="md">
              {/* Calendar Card - 8 columns */}
              <BentoCard
                span={8}
                title={format(calendarMonth, "MMMM yyyy", { locale: nb })}
                action={
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCalendarMonth(subMonths(calendarMonth, 1))
                      }
                      className="w-8 h-8 rounded-lg border border-[var(--color-grey-200)] bg-white flex items-center justify-center hover:bg-[var(--color-grey-100)] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-[var(--color-grey-600)]" />
                    </button>
                    <button
                      onClick={() =>
                        setCalendarMonth(addMonths(calendarMonth, 1))
                      }
                      className="w-8 h-8 rounded-lg border border-[var(--color-grey-200)] bg-white flex items-center justify-center hover:bg-[var(--color-grey-100)] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-[var(--color-grey-600)]" />
                    </button>
                  </div>
                }
              >
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => (
                    <div
                      key={`${day}-${i}`}
                      className="text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--color-grey-500)] py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors duration-200",
                        day.otherMonth && "opacity-30",
                        day.today &&
                          "bg-[var(--color-grey-100)] border-2 border-[var(--color-grey-400)]",
                        day.hasLog &&
                          !day.today &&
                          "bg-[var(--color-grey-200)]",
                        !day.today &&
                          !day.hasLog &&
                          "hover:bg-[var(--color-grey-100)]"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium",
                          day.today
                            ? "text-[var(--color-grey-900)] font-semibold"
                            : "text-[var(--color-grey-900)]"
                        )}
                      >
                        {day.day}
                      </span>
                      {day.hasLog && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-grey-900)] mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </BentoCard>

              {/* Recent Logs Card - 4 columns */}
              <BentoCard
                span={4}
                title="Siste okter"
                action={
                  <button className="text-[13px] font-medium text-[var(--color-grey-900)] hover:text-[var(--color-grey-900)] flex items-center gap-1">
                    Se alle
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              >
                <div className="space-y-3">
                  {logs.slice(0, 3).map((log) => {
                    const d = new Date(log.date);
                    const title =
                      log.TrainingPlanSession?.title ||
                      log.focusArea ||
                      "Treningsokt";
                    const area =
                      log.focusArea ||
                      log.TrainingPlanSession?.focusArea ||
                      "Trening";
                    return (
                      <motion.div
                        key={log.id}
                        className="flex gap-4 p-4 bg-[var(--color-grey-100)] rounded-xl cursor-pointer hover:bg-[var(--color-grey-200)] transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-[var(--color-grey-900)] leading-none">
                            {d.getDate()}
                          </span>
                          <span className="text-[10px] font-semibold uppercase text-[var(--color-grey-500)]">
                            {format(d, "MMM", { locale: nb })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-grey-900)]">
                            {area}
                          </span>
                          <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                            {title}
                          </p>
                          {log.durationMinutes && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-grey-500)]">
                              <Clock className="w-3 h-3" />
                              {log.durationMinutes} min
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                  {logs.length === 0 && (
                    <p className="text-sm text-[var(--color-grey-500)] text-center py-4">
                      Ingen okter logget enna
                    </p>
                  )}
                </div>
              </BentoCard>

              {/* Categories Card - 6 columns */}
              <BentoCard span={6} title="Treningskategorier">
                {categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-center gap-3 p-4 bg-[var(--color-grey-100)] rounded-xl hover:bg-[var(--color-grey-200)] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[var(--color-grey-200)]">
                          <Target className="w-5 h-5 text-[var(--color-grey-600)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--color-grey-900)]">
                            {cat.name}
                          </p>
                          <p className="text-xs text-[var(--color-grey-500)]">
                            {cat.count}
                          </p>
                          <div className="h-1 bg-[var(--color-grey-200)] rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--color-grey-900)]"
                              style={{ width: `${cat.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-grey-500)] text-center py-4">
                    Ingen kategorier enna
                  </p>
                )}
              </BentoCard>

              {/* Streak Card - 6 columns */}
              <BentoCard span={6} variant="gradient" title="Treningsstreak">
                <div className="flex items-center gap-6 mb-5">
                  <span className="text-7xl font-bold text-[var(--color-grey-900)] leading-none">
                    {streak}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-grey-900)] mb-1">
                      {streak === 1 ? "dag pa rad" : "dager pa rad"}
                    </h3>
                    <p className="text-sm text-[var(--color-grey-500)]">
                      {streak > 0
                        ? "Fortsett den gode innsatsen!"
                        : "Start en streak ved a logge trening!"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {streakDays.map((d, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold",
                        d.active &&
                          "bg-[var(--color-grey-900)] text-white",
                        d.today &&
                          !d.active &&
                          "bg-[var(--color-grey-100)] text-[var(--color-grey-900)] border-2 border-[var(--color-grey-400)]",
                        !d.active &&
                          !d.today &&
                          "bg-[var(--color-grey-100)] text-[var(--color-grey-400)]"
                      )}
                    >
                      {d.day}
                    </div>
                  ))}
                </div>
                {streak > 0 && <StreakMilestone currentStreak={streak} />}
              </BentoCard>
            </BentoGrid>

            {/* Filter Bar */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex gap-1 p-1 rounded-xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      activeFilter === filter
                        ? "bg-white shadow-sm text-[var(--color-grey-900)]"
                        : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200",
                    viewMode === "list"
                      ? "bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-900)] shadow-sm"
                      : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)]"
                  )}
                >
                  <List className="w-4 h-4" />
                  Liste
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200",
                    viewMode === "calendar"
                      ? "bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-900)] shadow-sm"
                      : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)]"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  Kalender
                </button>
              </div>
            </motion.div>

            {/* Log Entries */}
            <div className="space-y-4">
              {filteredLogs.map((log, idx) => {
                const title =
                  log.TrainingPlanSession?.title ||
                  log.focusArea ||
                  "Treningsokt";
                const area =
                  log.focusArea ||
                  log.TrainingPlanSession?.focusArea ||
                  "Trening";
                const isCoaching = !!log.planSessionId;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + idx * 0.05 }}
                  >
                    <AppleCard hover padding="md">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-[var(--color-grey-500)] mb-0.5">
                            {formatLogDate(log.date)}
                          </p>
                          <p className="text-base font-semibold text-[var(--color-grey-900)]">
                            {title}
                          </p>
                        </div>
                        <AppleBadge
                          variant={isCoaching ? "info" : "success"}
                          size="sm"
                        >
                          {isCoaching ? "Coaching" : "Fullfort"}
                        </AppleBadge>
                      </div>
                      <div className="flex gap-5 mb-3 text-xs text-[var(--color-grey-500)]">
                        {log.durationMinutes && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {log.durationMinutes} min
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {area}
                        </span>
                        {log.rating != null && (
                          <span className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            {log.rating}/10
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-sm text-[var(--color-grey-600)] leading-relaxed">
                          {log.notes}
                        </p>
                      )}
                    </AppleCard>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
