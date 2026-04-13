"use client";

import { useState, useMemo, useTransition } from "react";
import {
  NotebookPen,
  Plus,
  List,
  Calendar,
  Clock,
  Activity,
  Flame,
  RotateCcw,
  Loader2,
  Star,
  Target,
} from "lucide-react";
import { repeatLastSession } from "./actions";
import { LogSessionModal } from "@/components/portal/dagbok/log-session-modal";
import {
  HeroHeading,
  Shimmer,
  staggerContainer,
} from "@/components/portal/premium";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import { format, isToday, isSameDay, subDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { DagbokCalendar } from "./dagbok-calendar";
import { DagbokStats } from "./dagbok-stats";

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

const SUB_NAV_TABS = [
  { label: "Logg", href: "/portal/dagbok" },
  { label: "Treningsplan", href: "/portal/treningsplan" },
  { label: "Statistikk", href: "/portal/statistikk" },
];

function calculateStreak(logs: TrainingLogEntry[]): number {
  if (logs.length === 0) return 0;
  const logDates = new Set(logs.map((l) => format(new Date(l.date), "yyyy-MM-dd")));
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

export function DagbokClient({ initialLogs, loggedSessionIds, lastSession }: DagbokClientProps) {
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isPending, startTransition] = useTransition();
  const [quickLogSuccess, setQuickLogSuccess] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TrainingLogEntry | null>(null);

  void loggedSessionIds;
  const logs = initialLogs;

  const handleQuickLog = () => {
    startTransition(async () => {
      try {
        await repeatLastSession();
        setQuickLogSuccess(true);
        setTimeout(() => setQuickLogSuccess(false), 3000);
      } catch { /* silent */ }
    });
  };

  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const totalMinutes = logs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const ratedLogs = logs.filter((l) => l.rating != null);
  const avgRating: number | string =
    ratedLogs.length > 0
      ? Number((ratedLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / ratedLogs.length).toFixed(1))
      : "\u2013";

  const filters = useMemo(() => {
    const areas = new Set<string>();
    logs.forEach((l) => {
      const area = l.focusArea || l.TrainingPlanSession?.focusArea;
      if (area) areas.add(area);
    });
    return ["Alle", ...Array.from(areas).slice(0, 4)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (activeFilter === "Alle") return logs;
    return logs.filter(
      (l) => l.focusArea === activeFilter || l.TrainingPlanSession?.focusArea === activeFilter
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

  const heroActions = (
    <>
      {lastSession && (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleQuickLog}
          disabled={isPending}
          className="h-11 px-6 rounded-[20px] bg-white border border-portal-border text-portal-text text-[12px] font-semibold hover:bg-portal-hover transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {isPending ? "Logger\u2026" : "Gjenta siste"}
        </motion.button>
      )}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => { setEditingLog(null); setLogModalOpen(true); }}
        className="relative h-11 px-6 rounded-[20px] bg-accent-cta text-portal-text text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
      >
        <Shimmer />
        <Plus className="w-3.5 h-3.5 relative z-10" strokeWidth={2.5} />
        <span className="relative z-10">Logg ny okt</span>
      </motion.button>
    </>
  );

  return (
    <div className="space-y-10">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/dagbok" />

      <HeroHeading
        label="Din treningsdagbok"
        title={<>
          Logg og{" "}
          <span className="font-serif italic text-primary font-normal">spor</span>
          <span className="text-accent-cta">.</span>
        </>}
        description="Hold oversikt over aktiviteten din. Hver okt teller, og hver streak er et skritt naermere malet."
        actions={heroActions}
      />

      {quickLogSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium shadow-lg">
          Okt logget!
        </motion.div>
      )}

      {isEmpty && (
        <PremiumCard variant="default" padding="lg" className="text-center py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-primary/10">
              <NotebookPen className="w-8 h-8 text-primary" strokeWidth={1.75} />
            </div>
            <p className="text-[20px] font-semibold text-portal-text mb-2">Din treningsdagbok er tom</p>
            <p className="text-[13px] text-portal-muted mb-6 max-w-md leading-relaxed">
              Logg din forste treningsokt for a komme i gang. Alt du logger blir automatisk en del av fremdriften din.
            </p>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingLog(null); setLogModalOpen(true); }}
              className="relative h-11 px-6 rounded-[20px] bg-accent-cta text-portal-text text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group">
              <Shimmer />
              <Plus className="w-3.5 h-3.5 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Logg ny okt</span>
            </motion.button>
          </div>
        </PremiumCard>
      )}

      {!isEmpty && (
        <>
          {/* Stats Row */}
          <motion.div className="grid grid-cols-12 gap-4" initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="col-span-6 md:col-span-3">
              <PremiumCard variant="accent" padding="md" className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-portal-muted mb-1">Streak</p>
                    <p className="text-[28px] font-bold text-portal-text tabular-nums">{streak}</p>
                    <p className="text-[11px] text-portal-secondary">{streak === 1 ? "dag" : "dager"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent-cta/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-accent-cta" />
                  </div>
                </div>
              </PremiumCard>
            </div>
            <div className="col-span-6 md:col-span-3">
              <PremiumCard variant="default" padding="md" className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-portal-muted mb-1">Okter totalt</p>
                    <p className="text-[28px] font-bold text-portal-text tabular-nums">{logs.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-portal-hover flex items-center justify-center">
                    <Activity className="w-5 h-5 text-portal-secondary" />
                  </div>
                </div>
              </PremiumCard>
            </div>
            <div className="col-span-6 md:col-span-3">
              <PremiumCard variant="default" padding="md" className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-portal-muted mb-1">Timer totalt</p>
                    <p className="text-[28px] font-bold text-portal-text tabular-nums">{totalHours}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-portal-hover flex items-center justify-center">
                    <Clock className="w-5 h-5 text-portal-secondary" />
                  </div>
                </div>
              </PremiumCard>
            </div>
            <div className="col-span-6 md:col-span-3">
              <PremiumCard variant="default" padding="md" className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-portal-muted mb-1">Snitt vurdering</p>
                    <p className="text-[28px] font-bold text-portal-text tabular-nums">{avgRating}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-portal-hover flex items-center justify-center">
                    <Star className="w-5 h-5 text-portal-secondary" />
                  </div>
                </div>
              </PremiumCard>
            </div>
          </motion.div>

          {/* Filters + View Toggle */}
          <motion.div className="flex flex-wrap items-center justify-between gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex gap-1 p-1 rounded-full bg-portal-bg border border-portal-border shadow-sm">
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)}
                  className={cn("px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                    activeFilter === filter ? "bg-portal-text text-white shadow-sm" : "text-portal-muted hover:text-portal-text")}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-full bg-portal-bg border border-portal-border shadow-sm">
              <button onClick={() => setViewMode("list")}
                className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                  viewMode === "list" ? "bg-portal-text text-white shadow-sm" : "text-portal-muted hover:text-portal-text")}>
                <List className="w-3.5 h-3.5" /> Liste
              </button>
              <button onClick={() => setViewMode("calendar")}
                className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
                  viewMode === "calendar" ? "bg-portal-text text-white shadow-sm" : "text-portal-muted hover:text-portal-text")}>
                <Calendar className="w-3.5 h-3.5" /> Kalender
              </button>
            </div>
          </motion.div>

          {/* Liste / Kalender view */}
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredLogs.map((log, idx) => {
                const title = log.TrainingPlanSession?.title || log.focusArea || "Treningsokt";
                const area = log.focusArea || log.TrainingPlanSession?.focusArea || "Trening";
                const isCoaching = !!log.planSessionId;
                return (
                  <motion.div key={log.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * Math.min(idx, 6) }}
                    onClick={() => { setEditingLog(log); setLogModalOpen(true); }}
                    className="cursor-pointer group"
                    role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setEditingLog(log); setLogModalOpen(true); } }}>
                    <PremiumCard variant="default" padding="md" hover="lift" className="transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-portal-muted mb-1">{formatLogDate(log.date)}</p>
                          <p className="text-[16px] font-semibold text-portal-text truncate">{title}</p>
                        </div>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shrink-0 border",
                          isCoaching ? "bg-primary/10 text-primary border-primary/20" : "bg-primary-alt/10 text-primary-alt border-primary-alt/20")}>
                          {isCoaching ? "Coaching" : "Fullfort"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-5 mb-3 text-[11px] text-portal-muted">
                        {log.durationMinutes && (<span className="flex items-center gap-1.5 tabular-nums"><Clock className="w-3.5 h-3.5" />{log.durationMinutes} min</span>)}
                        <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" />{area}</span>
                        {log.rating != null && (<span className="flex items-center gap-1.5 tabular-nums"><Star className="w-3.5 h-3.5" />{log.rating}/10</span>)}
                      </div>
                      {log.notes && <p className="text-[13px] text-portal-secondary leading-relaxed line-clamp-2">{log.notes}</p>}
                    </PremiumCard>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <DagbokCalendar logs={filteredLogs} />
          )}

          {/* Stats section */}
          <DagbokStats logs={logs} />
        </>
      )}

      <LogSessionModal open={logModalOpen} onClose={() => { setLogModalOpen(false); setEditingLog(null); }} editLog={editingLog} />
    </div>
  );
}
