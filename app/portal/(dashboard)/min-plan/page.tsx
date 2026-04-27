import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getLatestForecast } from "@/lib/portal/predictions/coaching-forecast-service";
import { MinPlanV2Client } from "@/components/portal/min-plan/v2/min-plan-v2-client";

export default async function MinPlanPage() {
  const user = await requirePortalUser();
  const forecast = await getLatestForecast(prisma, user.id);

  const serializedForecast = forecast
    ? {
        ...forecast,
        generatedAt: forecast.generatedAt.toISOString(),
        deadline: forecast.deadline.toISOString(),
        actualOutcomeMeasuredAt:
          forecast.actualOutcomeMeasuredAt?.toISOString() ?? null,
        deltaAllocationJson: (forecast.deltaAllocationJson ?? {}) as Record<
          string,
          number
        >,
        hoursPerCategoryJson: (forecast.hoursPerCategoryJson ?? {}) as Record<
          string,
          { hours: number; ci95Low: number; ci95High: number }
        >,
        techTactMentalPhysJson:
          (forecast.techTactMentalPhysJson ?? {}) as Record<
            string,
            { tek: number; tak: number; mental: number; fys: number }
          >,
        rootCauseJson: (forecast.rootCauseJson ?? {}) as Record<string, string>,
        recommendationsJson: (forecast.recommendationsJson ?? []) as string[],
        assumptionsJson: (forecast.assumptionsJson ?? []) as string[],
        confidenceInterval95: (forecast.confidenceInterval95 ?? [0, 0]) as [
          number,
          number,
        ],
      }
    : null;

  return (
    <MinPlanV2Client forecast={serializedForecast} userName={user.name} />
  );
}
