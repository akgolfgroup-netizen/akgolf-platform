import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds, getLastSession } from "./actions";
import { getActivePlan } from "@/app/portal/(dashboard)/treningsplan/actions";
import { DagbokClient } from "./dagbok-client";
import { isWithinInterval, endOfISOWeek, startOfISOWeek } from "date-fns";

export default async function DagbokPage() {
  await requirePortalUser();

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
    const now = new Date();
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

  return (
    <DagbokClient
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
    />
  );
}
