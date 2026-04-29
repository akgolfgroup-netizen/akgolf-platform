import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds, getLastSession } from "./actions";
import { getActivePlan } from "@/app/portal/(dashboard)/treningsplan/actions";
import { TrainingDiaryClient } from "./training-diary-client";
import { DagbokV2Client } from "@/components/portal/dagbok/v2/dagbok-v2-client";
import { isWithinInterval, endOfISOWeek, startOfISOWeek } from "date-fns";

export const metadata: Metadata = {
  title: "Min Trening | PlayersHQ",
  description:
    "Din treningsdagbok i PlayersHQ. Logg økter, følg planen og se utvikling over tid.",
  openGraph: {
    title: "Min Trening | PlayersHQ",
    description:
      "Din treningsdagbok i PlayersHQ. Logg økter, følg planen og se utvikling over tid.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Min Trening | PlayersHQ",
    description:
      "Din treningsdagbok i PlayersHQ. Logg økter, følg planen og se utvikling over tid.",
  },
};

export const dynamic = "force-dynamic";

interface MinTreningPageProps {
  searchParams: Promise<{ v?: string }>;
}

export default async function MinTreningPage({ searchParams }: MinTreningPageProps) {
  await requirePortalUser();
  const params = await searchParams;

  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const [logs, loggedSessionIds, lastSession, activePlan] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
    getLastSession(),
    getActivePlan(),
  ]);

  // Beregn plan-progress for inneværende uke
  let planProgress: { weekTitle: string; loggedCount: number; plannedCount: number } | null = null;
  if (activePlan) {
    const weeks = (activePlan.TrainingPlanWeek as unknown as { weekStart: string; focus: string | null; TrainingPlanSession: { id: string }[] }[]) || [];
    const now = new Date(nowMs);
    const currentWeek = weeks.find((w) =>
      isWithinInterval(now, {
        start: startOfISOWeek(new Date(w.weekStart)),
        end: endOfISOWeek(new Date(w.weekStart)),
      })
    );
    if (currentWeek) {
      const sessions = currentWeek.TrainingPlanSession || [];
      const plannedCount = sessions.length;
      const loggedCount = sessions.filter((s) => loggedSessionIds.includes(s.id)).length;
      planProgress = {
        weekTitle: currentWeek.focus || activePlan.title || "Denne uken",
        loggedCount,
        plannedCount,
      };
    }
  }

  // Calculate streak data
  const calculateStreak = () => {
    if (logs.length === 0) return { current: 0, longest: 0, lastDate: new Date(nowMs), freezes: 1 };

    const logDates = new Set(logs.map(l => new Date(l.date).toISOString().split("T")[0]));
    const sortedDates = Array.from(logDates).sort();

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date(nowMs).toISOString().split("T")[0];
    const yesterday = new Date(nowMs - 86400000).toISOString().split("T")[0];
    
    let checkDate = logDates.has(today) ? today : yesterday;
    if (logDates.has(checkDate)) {
      while (logDates.has(checkDate)) {
        currentStreak++;
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        checkDate = prevDate.toISOString().split("T")[0];
      }
    }
    
    // Calculate longest streak
    let longestStreak = 1;
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    return {
      current: currentStreak,
      longest: Math.max(longestStreak, currentStreak),
      lastDate: new Date(sortedDates[sortedDates.length - 1]),
      freezes: 1, // 1 freeze per week
    };
  };

  const streakData = calculateStreak();

  if (params.v === "2") {
    return (
      <DagbokV2Client
        logs={logs.map((l) => ({
          id: l.id,
          date: l.date,
          durationMinutes: l.durationMinutes,
          focusArea: l.focusArea,
          notes: l.notes,
          rating: l.rating,
        }))}
        streakData={{
          currentStreak: streakData.current,
          longestStreak: streakData.longest,
          lastTrainingDate: streakData.lastDate,
          streakFreezesRemaining: streakData.freezes,
        }}
        planProgress={planProgress}
      />
    );
  }

  return (
    <TrainingDiaryClient
      initialLogs={logs.map((log) => {
        const tps = Array.isArray(log.TrainingPlanSession)
          ? log.TrainingPlanSession[0] ?? null
          : log.TrainingPlanSession ?? null;
        return {
          id: log.id,
          date: log.date,
          durationMinutes: log.durationMinutes,
          focusArea: log.focusArea,
          notes: log.notes,
          rating: log.rating,
          intensity: log.rating, // Using rating as intensity for now
          type: log.focusArea || "OTHER",
          deviatedFromPlan: false,
          deviationReason: null,
          planSessionId: null,
          TrainingPlanSession: tps
            ? {
                id: tps.id,
                title: tps.title,
                focusArea: tps.focusArea,
                durationMinutes: tps.durationMinutes,
              }
            : null,
        };
      })}
      loggedSessionIds={loggedSessionIds}
      lastSession={lastSession}
      planProgress={planProgress}
      streakData={{
        currentStreak: streakData.current,
        longestStreak: streakData.longest,
        lastTrainingDate: streakData.lastDate,
        streakFreezesRemaining: streakData.freezes,
      }}
    />
  );
}
