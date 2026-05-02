"use client";

import { useMemo } from "react";
import { format, startOfWeek, addDays, differenceInDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Download, Plus } from "lucide-react";
import { HeroStreak } from "./hero-streak";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: Date;
  streakFreezesRemaining: number;
}

import { MilestoneCard } from "./milestone-card";
import { Heatmap90d } from "./heatmap-90d";
import { VolumeCards } from "./volume-cards";
import { TimelineList, type TimelineEntry } from "./timeline-list";

export interface DagbokV2Log {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
}

interface DagbokV2ClientProps {
  logs: DagbokV2Log[];
  streakData: StreakData;
  planProgress: {
    weekTitle: string;
    loggedCount: number;
    plannedCount: number;
  } | null;
  onLogClick?: () => void;
}

export function DagbokV2Client({
  logs,
  streakData,
  planProgress,
}: DagbokV2ClientProps) {
  const now = new Date();

  const within = useMemo(() => {
    const limit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    return logs.filter((l) => new Date(l.date) >= limit);
  }, [logs, now]);

  const sessions90d = within.length;
  const minutes90d = within.reduce((acc, l) => acc + (l.durationMinutes ?? 0), 0);
  const hours90d = Math.round(minutes90d / 60);

  const rounds90d = within.filter((l) => {
    const fa = (l.focusArea ?? "").toLowerCase();
    return fa.includes("round") || fa.includes("runde") || fa.includes("spill");
  }).length;

  const heatmapEntries = within.map((l) => ({
    date: new Date(l.date).toISOString().slice(0, 10),
    minutes: l.durationMinutes ?? 0,
  }));

  const pyramid = useMemo(() => {
    const buckets: Record<string, number> = {
      Turnering: 0,
      Spill: 0,
      Slag: 0,
      Teknikk: 0,
      Fysisk: 0,
    };
    for (const l of within) {
      const fa = (l.focusArea ?? "").toUpperCase();
      const m = l.durationMinutes ?? 0;
      if (fa.includes("TURN")) buckets.Turnering += m;
      else if (fa.includes("SPILL") || fa.includes("ROUND")) buckets.Spill += m;
      else if (fa.includes("FYS") || fa.includes("STRENGTH") || fa.includes("PHYSICAL"))
        buckets.Fysisk += m;
      else if (fa.includes("TECH") || fa.includes("TEKNIKK")) buckets.Teknikk += m;
      else buckets.Slag += m;
    }
    const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
    const colors: Record<string, string> = {
      Turnering: "var(--color-ink)",
      Spill: "var(--color-primary)",
      Slag: "var(--color-success)",
      Teknikk: "var(--color-data-sage-light)",
      Fysisk: "var(--color-line-soft)",
    };
    return Object.entries(buckets).map(([name, mins]) => ({
      name,
      pct: Math.round((mins / total) * 100),
      color: colors[name],
    }));
  }, [within]);

  const weekly = useMemo(() => {
    const weeks = 8;
    const out: { week: string; hours: number; start: Date }[] = [];
    const monday = startOfWeek(now, { weekStartsOn: 1 });
    for (let i = weeks - 1; i >= 0; i--) {
      const start = addDays(monday, -7 * i);
      const end = addDays(start, 7);
      const totalMin = within
        .filter((l) => {
          const d = new Date(l.date);
          return d >= start && d < end;
        })
        .reduce((s, l) => s + (l.durationMinutes ?? 0), 0);
      out.push({ week: `U${format(start, "II", { locale: nb })}`, hours: totalMin / 60, start });
    }
    return out;
  }, [within, now]);

  const weeklyAvg = weekly.reduce((s, w) => s + w.hours, 0) / Math.max(1, weekly.length);

  const typeDistribution = useMemo(() => {
    const colors = ["var(--color-ink)", "var(--color-success)", "var(--color-accent)", "var(--color-ai)", "var(--color-line-soft)"];
    const total = pyramid.reduce((s, p) => s + p.pct, 0) || 1;
    return pyramid.map((p, i) => ({
      name: p.name,
      pct: Math.round((p.pct / total) * 100),
      color: colors[i] ?? "var(--color-line-soft)",
    }));
  }, [pyramid]);

  const timeline: TimelineEntry[] = useMemo(() => {
    return logs.slice(0, 5).map((l) => {
      const fa = (l.focusArea ?? "").toUpperCase();
      const variant: TimelineEntry["variant"] = fa.includes("CHIP")
        ? "chip"
        : fa.includes("SPILL") || fa.includes("ROUND")
          ? "round"
          : "default";
      const dur = l.durationMinutes ? `${l.durationMinutes} min` : null;
      return {
        id: l.id,
        date: new Date(l.date),
        title: l.focusArea ? `${l.focusArea}${dur ? ` · ${dur}` : ""}` : `Økt${dur ? ` · ${dur}` : ""}`,
        meta: l.notes ?? "Ingen notater",
        tags: [fa || null, l.rating !== null ? `RATING ${l.rating}/5` : null].filter(Boolean) as string[],
        variant,
      };
    });
  }, [logs]);

  const completionLabel = planProgress
    ? `${planProgress.loggedCount} av ${planProgress.plannedCount} økter denne uken`
    : `${streakData.currentStreak} dager på rad`;

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = differenceInDays(now, yearStart) + 1;
  const expectedSessions = Math.round((dayOfYear / 365) * 400);
  const weeksAhead = Math.round((within.length - expectedSessions) / 8);

  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10 p-6 lg:p-7 bg-surface">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-[22px] font-bold tracking-tight text-ink font-[family-name:var(--font-inter-tight)]">
            Dagbok
          </div>
          <div className="text-xs text-ink-muted mt-0.5">
            Volum, streak og konsistens · siste 90 dager
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="px-2.5 py-1 rounded-full bg-card border border-line text-xs flex items-center gap-1.5 text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {completionLabel}
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-line bg-card text-sm font-medium hover:bg-surface-soft transition-colors flex items-center gap-1.5 text-ink-muted"
          >
            <Download className="w-3.5 h-3.5" /> Eksporter
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-accent text-ink text-sm font-semibold flex items-center gap-1.5 hover:bg-accent-deep transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Logg økt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-5">
        <HeroStreak
          streakDays={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          sessions90d={sessions90d}
          hours90d={hours90d}
          rounds90d={rounds90d}
        />
        <MilestoneCard
          goalSessions={400}
          currentSessions={within.length}
          goalRounds={52}
          weeksAhead={weeksAhead}
        />
      </div>

      <Heatmap90d entries={heatmapEntries} />

      <div className="mt-4">
        <VolumeCards
          pyramid={pyramid}
          weekly={weekly.map((w) => ({ week: w.week, hours: w.hours }))}
          weeklyAvg={weeklyAvg}
          typeDistribution={typeDistribution}
          totalSessions={sessions90d}
        />
      </div>

      <TimelineList entries={timeline} />
    </div>
  );
}
