import {
  generateWeekFromForecast,
  type ForecastPlanSession,
} from "@/lib/ai/forecast-plan-allocator";
import type { RootCause } from "@/lib/portal/predictions/generate-coaching-forecast";
import type { ForecastDataV2 } from "./forecast-types";

export function buildWeekFromForecast(
  forecast: ForecastDataV2,
): ForecastPlanSession[] {
  return generateWeekFromForecast({
    modelVersion: forecast.modelVersion,
    generatedAt: new Date(forecast.generatedAt),
    currentState: {
      scoreAvg: forecast.currentScoreAvg,
      sgTotal: forecast.currentSgTotal,
      sgOtt: forecast.currentSgOtt,
      sgApp: forecast.currentSgApp,
      sgArg: forecast.currentSgArg,
      sgPutt: forecast.currentSgPutt,
      category: forecast.currentCategory,
      sampleSize: 0,
      confidence: "medium",
    },
    target: {
      scoreAvg: forecast.targetScoreAvg,
      category: forecast.targetCategory,
      deadlineWeeks: 0,
      requiredSgDelta: forecast.requiredSgDelta,
    },
    allocations: Object.entries(forecast.deltaAllocationJson).map(
      ([category, deltaSg]) => ({
        category: category as "OTT" | "APP" | "ARG" | "PUTT",
        deltaSg,
        share: deltaSg / (forecast.requiredSgDelta || 1),
        estimatedHours: forecast.hoursPerCategoryJson[category]?.hours ?? 0,
        ci95Low: forecast.hoursPerCategoryJson[category]?.ci95Low ?? 0,
        ci95High: forecast.hoursPerCategoryJson[category]?.ci95High ?? 0,
        rootCause: (forecast.rootCauseJson[category] ?? "blandet") as
          | "teknisk"
          | "fysisk"
          | "mental"
          | "taktisk"
          | "blandet",
        techTactMentalPhys:
          forecast.techTactMentalPhysJson[category] ?? {
            tek: 0.25,
            tak: 0.25,
            mental: 0.25,
            fys: 0.25,
          },
      }),
    ),
    primaryFocusCategory: forecast.primaryFocusCategory as
      | "OTT"
      | "APP"
      | "ARG"
      | "PUTT",
    estimatedTotalHours: forecast.estimatedTotalHours,
    estimatedHoursCi95Low: forecast.estimatedHoursCi95Low,
    estimatedHoursCi95High: forecast.estimatedHoursCi95High,
    requiredHoursPerWeek: forecast.estimatedHoursPerWeek,
    probabilityOfSuccess: forecast.probabilityOfSuccess,
    confidenceInterval95: forecast.confidenceInterval95,
    monteCarloRuns: forecast.monteCarloRuns,
    rootCauseSummary: forecast.rootCauseJson as Record<string, RootCause>,
    assumptions: forecast.assumptionsJson,
    recommendations: forecast.recommendationsJson,
  });
}
