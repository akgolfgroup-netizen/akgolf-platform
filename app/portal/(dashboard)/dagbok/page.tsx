import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds, getLastSession } from "./actions";
import { getActivePlan } from "@/app/portal/(dashboard)/treningsplan/actions";
import { DagbokV2Client } from "@/components/portal/dagbok/v2/dagbok-v2-client";
import { isWithinInterval, endOfISOWeek, startOfISOWeek } from "date-fns";

export const metadata: Metadata = {
  title: "Dagbok | AK Golf",
  description:
    "Din treningsdagbok i AK Golf. Logg økter, følg planen og se utvikling over tid.",
  openGraph: {
    title: "Dagbok | AK Golf",
    description:
      "Din treningsdagbok i AK Golf. Logg økter, følg planen og se utvikling over tid.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dagbok | AK Golf",
    description:
      "Din treningsdagbok i AK Golf. Logg økter, følg planen og se utvikling over tid.",
  },
};

export const dynamic = "force-dynamic";

export default async function DagbokPage() {
  await requirePortalUser();

  const nowMs = Date.now();
  const [logs, loggedSessionIds, lastSession, activePlan] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
    getLastSession(),
    getActivePlan(),
  ]);

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
      planProgress = {
        weekTitle: currentWeek.focus || activePlan.title || "Denne uken",
        loggedCount: sessions.filter((s) => loggedSessionIds.includes(s.id)).length,
        plannedCount: sessions.length,
      };
    }
  }

  const calculateStreak = () => {
    if (logs.length === 0) return { current: 0, longest: 0, lastDate: new Date(nowMs), freezes: 1 };
    const logDates = new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0]));
    const sortedDates = Array.from(logDates).sort();
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
      freezes: 1,
    };
  };

  const streakData = calculateStreak();

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
