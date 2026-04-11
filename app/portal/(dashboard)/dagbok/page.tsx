import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs } from "./actions";
import Link from "next/link";
import { format, isToday, isYesterday, subDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { ActivityTimeline } from "@/components/portal/heritage/activity-timeline";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { Plus, Filter, BookOpen, Trophy, Target, Calendar } from "lucide-react";

interface TrainingLogEntry {
  id: string;
  date: Date;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  energyLevel: "high" | "medium" | "low" | null;
  type: "range" | "course" | "putting" | "coaching" | "fitness";
  completed: boolean;
}

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

export default async function DagbokPage() {
  const user = await requirePortalUser();
  const logs = await getTrainingLogs();

  const streak = calculateStreak(logs as TrainingLogEntry[]);

  // Transform logs for ActivityTimeline
  const timelineItems = (logs as TrainingLogEntry[]).map((log) => ({
    id: log.id,
    type: log.type || "range",
    title: log.focusArea || "Treningsøkt",
    date: new Date(log.date),
    duration: log.durationMinutes || undefined,
    notes: log.notes || undefined,
    energyLevel: log.energyLevel || "medium",
    completed: log.completed ?? true,
  }));

  // Stats
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);
  const avgRating =
    logs.length > 0
      ? logs.reduce((sum, log) => sum + (log.rating || 0), 0) / logs.filter((l) => l.rating).length
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Treningsdagbok</h1>
          <p className="text-[var(--color-muted)] mt-1">Logg og spor din treningsaktivitet</p>
        </div>
        <Link
          href="/portal/dagbok/ny"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-alt)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Logg økt
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-300)]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Streak</p>
              <p className="text-3xl font-bold text-[var(--color-text)] mt-1">{streak}</p>
              <p className="text-xs text-[var(--color-grey-500)] mt-0.5">dager på rad</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-cta)]/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-300)]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Økter</p>
              <p className="text-3xl font-bold text-[var(--color-text)] mt-1">{totalSessions}</p>
              <p className="text-xs text-[var(--color-grey-500)] mt-0.5">totalt</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-300)]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Timer</p>
              <p className="text-3xl font-bold text-[var(--color-text)] mt-1">
                {(totalMinutes / 60).toFixed(1)}
              </p>
              <p className="text-xs text-[var(--color-grey-500)] mt-0.5">totalt</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-300)]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Snitt</p>
              <p className="text-3xl font-bold text-[var(--color-text)] mt-1">
                {avgRating > 0 ? avgRating.toFixed(1) : "-"}
              </p>
              <p className="text-xs text-[var(--color-grey-500)] mt-0.5">av 5 stjerner</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-[var(--color-warning)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction
          href="/portal/dagbok/ny?type=range"
          icon={Target}
          label="Range-trening"
          description="Logg teknisk trening"
        />
        <QuickAction
          href="/portal/dagbok/ny?type=course"
          icon={BookOpen}
          label="Bane-runde"
          description="Logg spill på bane"
        />
        <QuickAction
          href="/portal/dagbok/ny?type=putting"
          icon={Target}
          label="Putting"
          description="Logg putting-trening"
        />
      </div>

      {/* Activity Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Aktivitetshistorikk</h2>
          <button className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>

        {timelineItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[var(--color-grey-300)]/50">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[var(--color-grey-300)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-1">Ingen aktiviteter ennå</h3>
            <p className="text-sm text-[var(--color-muted)] mb-4">Start med å logge din første treningsøkt</p>
            <Link
              href="/portal/dagbok/ny"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-alt)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Logg første økt
            </Link>
          </div>
        ) : (
          <ActivityTimeline items={timelineItems} />
        )}
      </div>
    </div>
  );
}
