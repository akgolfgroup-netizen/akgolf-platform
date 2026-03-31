"use client";

import { useState } from "react";
import {
  NotebookPen,
  List,
  Calendar,
  Clock,
  Activity,
  Target,
  Smile,
  Meh,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
} from "lucide-react";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleCard } from "@/components/portal/apple/apple-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

interface DisplayLog {
  id: string;
  day: string;
  month: string;
  date: string;
  title: string;
  type: string;
  status: string;
  statusVariant: "info" | "success";
  duration: string;
  intensity: string;
  focus: string;
  mood: "good" | "challenging";
  notes: string;
}

interface CalendarDay {
  day: number;
  otherMonth: boolean;
  hasLog: boolean;
  today: boolean;
}

interface StreakDay {
  day: string;
  active: boolean;
  today: boolean;
}

interface Category {
  name: string;
  count: string;
  color: string;
  bgColor: string;
  progress: number;
}

interface Stats {
  sessionsThisWeek: number;
  hoursTotal: string;
  streak: number;
  avgIntensity: string;
}

interface DagbokClientProps {
  displayLogs: DisplayLog[];
  stats: Stats;
  categories: Category[];
  calendarDays: CalendarDay[];
  streakDays: StreakDay[];
  monthName: string;
}

const weekDayLabels = ["M", "T", "O", "T", "F", "L", "S"];

export function DagbokClient({
  displayLogs,
  stats,
  categories,
  calendarDays,
  streakDays,
  monthName,
}: DagbokClientProps) {
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const filters = ["Alle", "Putting", "Nærespill", "Approach", "Tee Total"];

  const filteredLogs = activeFilter === "Alle"
    ? displayLogs
    : displayLogs.filter(log => log.focus.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FC] via-[#F0F4F8] to-[#F5F5F7] relative">
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
            <h1 className="text-[32px] font-bold text-[var(--apple-gray-950)] tracking-tight mb-1">
              Treningsdagbok
            </h1>
            <p className="text-[15px] text-[var(--apple-gray-500)]">
              Hold oversikt over treningsaktiviteten din
            </p>
          </div>
          <AppleButton variant="primary" icon={Plus}>
            Logg ny økt
          </AppleButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <StatCard
            label="Denne uken"
            value={String(stats.sessionsThisWeek)}
            icon={Calendar}
            size="sm"
          />
          <StatCard
            label="Timer totalt"
            value={stats.hoursTotal}
            icon={Clock}
            size="sm"
          />
          <StatCard
            label="Streak"
            value={String(stats.streak)}
            icon={Flame}
            iconColor="text-orange-500"
            iconBg="bg-orange-50"
            size="sm"
          />
          <StatCard
            label="Snitt intensitet"
            value={stats.avgIntensity}
            icon={Activity}
            iconColor="text-green-500"
            iconBg="bg-green-50"
            size="sm"
          />
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid gap="md">
          {/* Calendar Card - 8 columns */}
          <BentoCard
            span={8}
            title={monthName}
            action={
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-[var(--apple-gray-200)] bg-white flex items-center justify-center hover:bg-[var(--apple-gray-100)] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[var(--apple-gray-600)]" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-[var(--apple-gray-200)] bg-white flex items-center justify-center hover:bg-[var(--apple-gray-100)] transition-colors">
                  <ChevronRight className="w-4 h-4 text-[var(--apple-gray-600)]" />
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-7 gap-2">
              {weekDayLabels.map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--apple-gray-500)] py-2"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200",
                    day.otherMonth && "opacity-30",
                    day.today &&
                      "bg-[var(--apple-gold-50)] border-2 border-[var(--apple-gold-400)]",
                    day.hasLog && !day.today && "bg-green-50",
                    !day.today && !day.hasLog && "hover:bg-[var(--apple-gray-100)]"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      day.today
                        ? "text-[var(--apple-gold-700)] font-semibold"
                        : "text-[var(--apple-gray-900)]"
                    )}
                  >
                    {day.day}
                  </span>
                  {day.hasLog && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Recent Logs Card - 4 columns */}
          <BentoCard
            span={4}
            title="Siste økter"
            action={
              <button className="text-[13px] font-medium text-[var(--apple-gold-600)] hover:text-[var(--apple-gold-700)] flex items-center gap-1">
                Se alle
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-3">
              {displayLogs.slice(0, 3).map((log) => (
                <motion.div
                  key={log.id}
                  className="flex gap-4 p-4 bg-[var(--apple-gray-50)] rounded-xl cursor-pointer hover:bg-[var(--apple-gray-100)] transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-[var(--apple-gray-900)] leading-none">
                      {log.day}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-[var(--apple-gray-500)]">
                      {log.month}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--apple-gold-600)]">
                      {log.type.replace("_", " ")}
                    </span>
                    <p className="text-sm font-medium text-[var(--apple-gray-900)] truncate">
                      {log.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--apple-gray-500)]">
                      <Clock className="w-3 h-3" />
                      {log.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
              {displayLogs.length === 0 && (
                <p className="text-sm text-[var(--apple-gray-500)] text-center py-4">
                  Ingen økter ennå
                </p>
              )}
            </div>
          </BentoCard>

          {/* Categories Card - 6 columns */}
          <BentoCard span={6} title="Treningskategorier">
            <div className="grid grid-cols-2 gap-3">
              {categories.length > 0 ? categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 p-4 bg-[var(--apple-gray-50)] rounded-xl hover:bg-[var(--apple-gray-100)] transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <Target className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--apple-gray-900)]">
                      {cat.name}
                    </p>
                    <p className="text-xs text-[var(--apple-gray-500)]">
                      {cat.count}
                    </p>
                    <div className="h-1 bg-[var(--apple-gray-200)] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${cat.progress}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[var(--apple-gray-500)] col-span-2 text-center py-4">
                  Logg økter for å se kategorier
                </p>
              )}
            </div>
          </BentoCard>

          {/* Streak Card - 6 columns */}
          <BentoCard span={6} variant="gradient" title="Treningsstreak">
            <div className="flex items-center gap-6 mb-5">
              <span className="text-7xl font-bold text-[var(--apple-gold-500)] leading-none">
                {stats.streak}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--apple-gray-900)] mb-1">
                  dager på rad
                </h3>
                <p className="text-sm text-[var(--apple-gray-500)]">
                  {stats.streak > 0 ? "Fortsett den gode innsatsen!" : "Start din streak i dag!"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {streakDays.map((d, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold",
                    d.active && "bg-green-100 text-green-600",
                    d.today &&
                      "bg-[var(--apple-gold-100)] text-[var(--apple-gold-700)] border-2 border-[var(--apple-gold-400)]",
                    !d.active &&
                      !d.today &&
                      "bg-[var(--apple-gray-100)] text-[var(--apple-gray-400)]"
                  )}
                >
                  {d.day}
                </div>
              ))}
            </div>
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
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeFilter === filter
                    ? "bg-white shadow-sm text-[var(--apple-gray-900)]"
                    : "text-[var(--apple-gray-500)] hover:text-[var(--apple-gray-900)]"
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
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                viewMode === "list"
                  ? "bg-white border border-[var(--apple-gray-200)] text-[var(--apple-gray-900)] shadow-sm"
                  : "text-[var(--apple-gray-500)] hover:bg-white/50"
              )}
            >
              <List className="w-4 h-4" />
              Liste
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                viewMode === "calendar"
                  ? "bg-white border border-[var(--apple-gray-200)] text-[var(--apple-gray-900)] shadow-sm"
                  : "text-[var(--apple-gray-500)] hover:bg-white/50"
              )}
            >
              <Calendar className="w-4 h-4" />
              Kalender
            </button>
          </div>
        </motion.div>

        {/* Log Entries */}
        <div className="space-y-4">
          {filteredLogs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + idx * 0.05 }}
            >
              <AppleCard hover padding="md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-[var(--apple-gray-500)] mb-0.5">
                      {log.date}
                    </p>
                    <p className="text-base font-semibold text-[var(--apple-gray-900)]">
                      {log.title}
                    </p>
                  </div>
                  <AppleBadge variant={log.statusVariant} size="sm">
                    {log.status}
                  </AppleBadge>
                </div>
                <div className="flex gap-5 mb-3 text-xs text-[var(--apple-gray-500)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {log.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    {log.intensity}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    {log.focus}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1.5",
                      log.mood === "good" ? "text-green-500" : "text-orange-500"
                    )}
                  >
                    {log.mood === "good" ? (
                      <Smile className="w-3.5 h-3.5" />
                    ) : (
                      <Meh className="w-3.5 h-3.5" />
                    )}
                    {log.mood === "good" ? "God følelse" : "Utfordrende"}
                  </span>
                </div>
                {log.notes && (
                  <p className="text-sm text-[var(--apple-gray-600)] leading-relaxed">
                    {log.notes}
                  </p>
                )}
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredLogs.length === 0 && (
          <AppleCard className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <NotebookPen className="w-12 h-12 text-[var(--apple-gray-300)] mb-4" />
              <p className="text-base font-medium text-[var(--apple-gray-900)] mb-1">
                Ingen treningslogger ennå
              </p>
              <p className="text-sm text-[var(--apple-gray-500)]">
                Logg din første treningsøkt for å komme i gang
              </p>
            </div>
          </AppleCard>
        )}
      </div>
    </div>
  );
}
