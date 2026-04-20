"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, List, BarChart3 } from "lucide-react";
import { repeatLastSession } from "./actions";
import { LogSessionModal } from "@/components/portal/dagbok/log-session-modal";
import { StreakCard, StreakData } from "@/components/portal/dagbok/streak-card";
import { ActivityHeatmap } from "@/components/portal/dagbok/activity-heatmap";
import { WeeklyStats } from "@/components/portal/dagbok/weekly-stats";
import { VolumePyramid } from "@/components/portal/dagbok/volume-pyramid";
import { MonthCalendar } from "@/components/portal/dagbok/month-calendar";
import { RecentSessionsList } from "@/components/portal/dagbok/recent-sessions-list";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/portal/patterns";

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

interface TrainingDiaryClientProps {
  initialLogs: TrainingLogEntry[];
  loggedSessionIds: string[];
  lastSession?: { focusArea: string | null; durationMinutes: number | null } | null;
  planProgress: { weekTitle: string; loggedCount: number; plannedCount: number } | null;
  streakData: StreakData;
}

const SUB_NAV_TABS = [
  { label: "Logg", href: "/portal/dagbok" },
  { label: "Treningsplan", href: "/portal/treningsplan" },
  { label: "Statistikk", href: "/portal/statistikk" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function TrainingDiaryClient({
  initialLogs,
  loggedSessionIds,
  lastSession,
  planProgress,
  streakData,
}: TrainingDiaryClientProps) {
  const [isPending, setIsPending] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TrainingLogEntry | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "calendar" | "stats">("overview");

  const logs = initialLogs;

  // Convert logs for activity heatmap
  const activityData = useMemo(() => {
    return logs.map(log => ({
      date: new Date(log.date),
      minutes: log.durationMinutes || 0,
      type: log.type,
    }));
  }, [logs]);

  // Convert logs for session list
  const sessionData = useMemo(() => {
    return logs.map(log => ({
      id: log.id,
      date: log.date,
      type: log.focusArea || "OTHER",
      focusArea: log.focusArea,
      durationMinutes: log.durationMinutes,
      rating: log.rating,
    }));
  }, [logs]);

  const handleQuickLog = async () => {
    setIsPending(true);
    try {
      await repeatLastSession();
      // Refresh would happen here in a real app
      window.location.reload();
    } catch {
      // Silent fail
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectSession = (session: TrainingLogEntry) => {
    const log = logs.find(l => l.id === session.id);
    if (log) {
      setEditingLog(log);
      setLogModalOpen(true);
    }
  };

  const isEmpty = logs.length === 0;

  return (
    <div className="space-y-8">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/dagbok" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Din treningsdagbok</MonoLabel>
        <h1 className="text-2xl font-bold text-black">
          Logg og{" "}
          <span className="font-serif italic text-black font-normal">spor</span>
          <span className="text-accent-cta">.</span>
        </h1>
        <p className="text-[13px] text-on-surface-variant max-w-xl">
          Hold oversikt over aktiviteten din. Hver økt teller, og hver streak er et skritt nærmere målet.
        </p>
        
        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {lastSession && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleQuickLog}
              disabled={isPending}
              className="h-11 px-6 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[12px] font-semibold hover:border-outline-variant/50 transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <Icon name="progress_activity" className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon name="restart_alt" className="w-3.5 h-3.5" />
              )}
              {isPending ? "Logger…" : "Gjenta siste"}
            </motion.button>
          )}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditingLog(null); setLogModalOpen(true); }}
            className="relative h-11 px-6 rounded-full bg-secondary-fixed text-on-surface text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(10,31,24,0.12)] hover:shadow-[0_12px_32px_rgba(10,31,24,0.16)] transition-shadow"
          >
            <Icon name="add" className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Logg ny økt</span>
          </motion.button>
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="flex gap-1 p-1 rounded-full bg-surface-container-lowest border border-outline-variant/30 shadow-sm w-fit">
        {[
          { id: "overview", label: "Oversikt", icon: BarChart3 },
          { id: "calendar", label: "Kalender", icon: Calendar },
          { id: "stats", label: "Liste", icon: List },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors duration-200",
              activeView === view.id
                ? "bg-black text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <view.icon className="w-3.5 h-3.5" />
            {view.label}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <PremiumCard variant="default" padding="lg" className="text-center py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-black/10">
              <Icon name="bar_chart" className="w-8 h-8 text-black" strokeWidth={1.75} />
            </div>
            <p className="text-[20px] font-semibold text-black mb-2">Din treningsdagbok er tom</p>
            <p className="text-[13px] text-on-surface-variant mb-6 max-w-md leading-relaxed">
              Logg din første treningsøkt for å komme i gang. Alt du logger blir automatisk en del av fremdriften din.
            </p>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingLog(null); setLogModalOpen(true); }}
              className="relative h-11 px-6 rounded-full bg-secondary-fixed text-on-surface text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(10,31,24,0.12)]"
            >
              <Icon name="add" className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Logg ny økt</span>
            </motion.button>
          </div>
        </PremiumCard>
      ) : (
        <>
          {activeView === "overview" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Bento Grid - Top Row: Streak + Weekly Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <StreakCard 
                    data={streakData} 
                    onUseFreeze={() => alert("Streak freeze brukt!")}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <WeeklyStats sessions={sessionData} />
                </motion.div>
              </div>

              {/* Bento Grid - Middle Row: Heatmap + Recent Sessions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Icon name="monitoring"Heatmap data={activityData} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <RecentSessionsList 
                    sessions={sessionData}
                    onSelectSession={handleSelectSession}
                  />
                </motion.div>
              </div>

              {/* Monthly Calendar */}
              <motion.div variants={itemVariants}>
                <MonthCalendar 
                  sessions={sessionData}
                  onSelectDate={(date, sessions) => {
                    if (sessions.length > 0) {
                      handleSelectSession(sessions[0] as unknown as TrainingLogEntry);
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {activeView === "calendar" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <MonthCalendar 
                sessions={sessionData}
                onSelectDate={(date, sessions) => {
                  if (sessions.length > 0) {
                    handleSelectSession(sessions[0] as unknown as TrainingLogEntry);
                  }
                }}
              />
            </motion.div>
          )}

          {activeView === "stats" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeeklyStats sessions={sessionData} />
                <Icon name="monitoring"Heatmap data={activityData} />
              </div>
              <VolumePyramid
                sessions={sessionData.map((s) => ({
                  durationMinutes: s.durationMinutes,
                  focusArea: s.focusArea,
                }))}
              />
              <RecentSessionsList
                sessions={sessionData}
                onSelectSession={handleSelectSession}
                maxItems={20}
              />
            </motion.div>
          )}
        </>
      )}

      <LogSessionModal 
        open={logModalOpen} 
        onClose={() => { setLogModalOpen(false); setEditingLog(null); }} 
        editLog={editingLog} 
      />
    </div>
  );
}
