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
  Star,
} from "lucide-react";
import { repeatLastSession } from "./actions";
import { LogSessionModal } from "@/components/portal/dagbok/log-session-modal";
import { StreakMilestone } from "@/components/portal/gamification/streak-milestone";
import {
  HeroHeading,
  DarkStatCard,
  GlassCard,
  Shimmer,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
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
    count: `${count} ${count === 1 ? "økt" : "økter"}`,
    progress: Math.round((count / total) * 100),
  }));
}

export function DagbokClient({ initialLogs, loggedSessionIds, lastSession }: DagbokClientProps) {
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const [quickLogSuccess, setQuickLogSuccess] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TrainingLogEntry | null>(null);

  // loggedSessionIds er ikke brukt i nåværende visning, men beholdes i props for kompatibilitet
  void loggedSessionIds;

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

  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const streakDays = useMemo(() => getStreakDays(logs), [logs]);
  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, logs),
    [calendarMonth, logs]
  );
  const categories = useMemo(() => buildCategories(logs), [logs]);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const logsThisWeek = logs.filter(
    (l) => new Date(l.date) >= weekStart && new Date(l.date) <= now
  );
  const totalMinutes = logs.reduce(
    (sum, l) => sum + (l.durationMinutes || 0),
    0
  );
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const ratedLogs = logs.filter((l) => l.rating != null);
  const avgRating: number | string =
    ratedLogs.length > 0
      ? Number(
          (
            ratedLogs.reduce((sum, l) => sum + (l.rating || 0), 0) /
            ratedLogs.length
          ).toFixed(1)
        )
      : "–";

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
    if (isSameDay(d, yesterday)) return `I går, ${format(d, "HH:mm")}`;
    return format(d, "d. MMMM, HH:mm", { locale: nb });
  };

  const isEmpty = logs.length === 0;

  const heroTitle = (
    <>
      Logg og{" "}
      <span className="font-serif italic text-[var(--color-primary)] font-normal">
        spor
      </span>
      <span className="text-[var(--color-accent-cta)]">.</span>
    </>
  );

  const heroActions = (
    <>
      {lastSession && (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleQuickLog}
          disabled={isPending}
          className="h-11 px-6 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[var(--color-text)] text-[12px] font-semibold hover:bg-white transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          {isPending ? "Logger…" : "Gjenta siste"}
        </motion.button>
      )}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setEditingLog(null);
          setLogModalOpen(true);
        }}
        className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
      >
        <Shimmer />
        <Plus className="w-3.5 h-3.5 relative z-10" strokeWidth={2.5} />
        <span className="relative z-10">Logg ny økt</span>
      </motion.button>
    </>
  );

  return (
    <div className="space-y-10">
      <HeroHeading
        label="Din treningsdagbok"
        title={heroTitle}
        description="Hold oversikt over aktiviteten din. Hver økt teller, og hver streak er et skritt nærmere målet."
        actions={heroActions}
      />

      {/* Quick-log success toast */}
      {quickLogSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-[var(--color-success)] text-white text-sm font-medium shadow-lg"
        >
          Økt logget!
        </motion.div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <GlassCard variant="light" padding="lg" className="text-center py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[var(--color-primary)]/10">
              <NotebookPen className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.75} />
            </div>
            <p className="text-[20px] font-semibold text-[var(--color-grey-900)] mb-2">
              Din treningsdagbok er tom
            </p>
            <p className="text-[13px] text-[var(--color-muted)] mb-6 max-w-md leading-relaxed">
              Logg din første treningsøkt for å komme i gang. Alt du logger blir automatisk en del av fremdriften din.
            </p>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingLog(null);
                setLogModalOpen(true);
              }}
              className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
            >
              <Shimmer />
              <Plus className="w-3.5 h-3.5 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Logg ny økt</span>
            </motion.button>
          </div>
        </GlassCard>
      )}

      {/* Content - only shown when there are logs */}
      {!isEmpty && (
        <>
          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-12 gap-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="col-span-6 md:col-span-3">
              <DarkStatCard
                label="Denne uken"
                value={logsThisWeek.length}
                icon={Activity}
                variant="default"
                delay={0}
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <DarkStatCard
                label="Timer totalt"
                value={totalHours}
                decimals={1}
                icon={Clock}
                variant="default"
                delay={0.08}
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <DarkStatCard
                label="Streak"
                value={streak}
                unit={streak === 1 ? "dag" : "dager"}
                icon={Flame}
                variant="accent"
                delay={0.16}
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <DarkStatCard
                label="Snitt rating"
                value={avgRating}
                decimals={1}
                icon={Star}
                variant="default"
                delay={0.24}
              />
            </div>
          </motion.div>

          {/* Kalender + siste økter */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[var(--color-muted)]" />
              Oversikt
            </p>
            <div className="grid grid-cols-12 gap-4">
              {/* Kalender */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="col-span-12 lg:col-span-8"
              >
                <GlassCard variant="light" padding="lg" className="h-full">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[16px] font-semibold text-[var(--color-grey-900)] capitalize">
                      {format(calendarMonth, "MMMM yyyy", { locale: nb })}
                    </h3>
                    <div className="flex gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm">
                      <button
                        onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
                        aria-label="Forrige måned"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
                        aria-label="Neste måned"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, i) => (
                      <div
                        key={`${day}-${i}`}
                        className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] py-2"
                      >
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200",
                          day.otherMonth && "opacity-30",
                          day.today &&
                            "bg-[var(--color-accent-cta)]/15 border-2 border-[var(--color-accent-cta)]",
                          day.hasLog &&
                            !day.today &&
                            "bg-[var(--color-primary)]/8",
                          !day.today &&
                            !day.hasLog &&
                            "hover:bg-white/60"
                        )}
                      >
                        <span
                          className={cn(
                            "text-[13px] font-medium tabular-nums",
                            day.today
                              ? "text-[var(--color-primary)] font-semibold"
                              : "text-[var(--color-grey-900)]"
                          )}
                        >
                          {day.day}
                        </span>
                        {day.hasLog && (
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mt-0.5",
                              day.today
                                ? "bg-[var(--color-primary)]"
                                : "bg-[var(--color-primary)]"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Streak-kort */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="col-span-12 lg:col-span-4"
              >
                <GlassCard variant="light" padding="lg" className="h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-cta)]/15 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-grey-900)] text-[14px]">
                        Treningsstreak
                      </h3>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                        {streak > 0 ? "Fortsett det gode arbeidet" : "Start i dag"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-[64px] font-[300] text-[var(--color-grey-900)] leading-none tabular-nums tracking-[-0.04em]">
                      {streak}
                    </span>
                    <span className="text-[13px] text-[var(--color-muted)]">
                      {streak === 1 ? "dag på rad" : "dager på rad"}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mb-4">
                    {streakDays.map((d, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex-1 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors",
                          d.active &&
                            "bg-[var(--color-primary)] text-white",
                          d.today &&
                            !d.active &&
                            "bg-white border-2 border-[var(--color-accent-cta)] text-[var(--color-primary)]",
                          !d.active &&
                            !d.today &&
                            "bg-white/60 border border-[var(--color-grey-200)] text-[var(--color-muted)]"
                        )}
                      >
                        {d.day}
                      </div>
                    ))}
                  </div>
                  {streak > 0 && <StreakMilestone currentStreak={streak} />}
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* Kategorier */}
          {categories.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[var(--color-muted)]" />
                Treningskategorier
              </p>
              <GlassCard variant="light" padding="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 border border-white/80 hover:border-[var(--color-primary)]/20 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--color-primary)]/10">
                        <Target className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--color-grey-900)] truncate">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-muted)]">
                          {cat.count}
                        </p>
                        <div className="h-1 bg-[var(--color-grey-200)] rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--color-primary)]"
                            style={{ width: `${cat.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Filter Bar */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                    activeFilter === filter
                      ? "bg-[var(--color-grey-900)] text-white shadow-sm"
                      : "text-[var(--color-muted)] hover:text-[var(--color-grey-900)]"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                  viewMode === "list"
                    ? "bg-[var(--color-grey-900)] text-white shadow-sm"
                    : "text-[var(--color-muted)] hover:text-[var(--color-grey-900)]"
                )}
              >
                <List className="w-3.5 h-3.5" />
                Liste
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                  viewMode === "calendar"
                    ? "bg-[var(--color-grey-900)] text-white shadow-sm"
                    : "text-[var(--color-muted)] hover:text-[var(--color-grey-900)]"
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                Kalender
              </button>
            </div>
          </motion.div>

          {/* Log Entries */}
          <div className="space-y-3">
            {filteredLogs.map((log, idx) => {
              const title =
                log.TrainingPlanSession?.title ||
                log.focusArea ||
                "Treningsøkt";
              const area =
                log.focusArea ||
                log.TrainingPlanSession?.focusArea ||
                "Trening";
              const isCoaching = !!log.planSessionId;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * Math.min(idx, 6) }}
                  onClick={() => {
                    setEditingLog(log);
                    setLogModalOpen(true);
                  }}
                  className="cursor-pointer group relative rounded-[24px] overflow-hidden p-6 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-12px_rgba(10,31,24,0.1)] hover:border-[var(--color-primary)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,88,64,0.18)] transition-all duration-300 will-change-transform"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setEditingLog(log);
                      setLogModalOpen(true);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-1">
                        {formatLogDate(log.date)}
                      </p>
                      <p className="text-[16px] font-semibold text-[var(--color-grey-900)] truncate">
                        {title}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shrink-0",
                        isCoaching
                          ? "bg-[var(--color-ai)]/10 text-[var(--color-ai)] border border-[var(--color-ai)]/20"
                          : "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20"
                      )}
                    >
                      {isCoaching ? "Coaching" : "Fullført"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-5 mb-3 text-[11px] text-[var(--color-muted)]">
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
                        <Star className="w-3.5 h-3.5" />
                        {log.rating}/10
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-[13px] text-[var(--color-text)] leading-relaxed">
                      {log.notes}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Log Session Modal */}
      <LogSessionModal
        open={logModalOpen}
        onClose={() => {
          setLogModalOpen(false);
          setEditingLog(null);
        }}
        editLog={editingLog}
      />
    </div>
  );
}
