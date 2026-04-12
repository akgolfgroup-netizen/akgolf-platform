import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds, getLastSession } from "./actions";
import { DagbokClient } from "./dagbok-client";

export default async function DagbokPage() {
  await requirePortalUser();

  const [logs, loggedSessionIds, lastSession] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
    getLastSession(),
  ]);

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
    />
  );
}
