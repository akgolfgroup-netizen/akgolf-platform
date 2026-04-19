"use client";

import type { WidgetId } from "@/lib/portal/widgets/registry";
import { PlanProgressWidget } from "./plan-progress-widget";
import { NextCompetitionWidget } from "./next-competition-widget";
import { TrainingVolumeWidget } from "./training-volume-widget";
import { SeasonPlanWidget } from "./season-plan-widget";
import { LeaderboardWidget } from "./leaderboard-widget";
import { CoachingFeedbackWidget } from "./coaching-feedback-widget";
import { MentalTrendsWidget } from "./mental-trends-widget";
import { DegradationAlertWidget } from "./degradation-alert-widget";
import { ModuleAddonsWidget } from "./module-addons-widget";
import { PeriodiseringWidget } from "./periodisering-widget";

/**
 * WidgetRenderer — mapper widget-ID til riktig komponent.
 *
 * Brukes av WidgetGrid for å rendre innhold i hver widget-base.
 */
export function WidgetRenderer({ widgetId }: { widgetId: WidgetId }) {
  switch (widgetId) {
    case "plan-progress":
      return <PlanProgressWidget />;
    case "next-competition":
      return <NextCompetitionWidget />;
    case "training-volume":
      return <TrainingVolumeWidget />;
    case "season-plan":
      return <SeasonPlanWidget />;
    case "leaderboard":
      return <LeaderboardWidget />;
    case "coaching-feedback":
      return <CoachingFeedbackWidget />;
    case "mental-trends":
      return <MentalTrendsWidget />;
    case "degradation-alert":
      return <DegradationAlertWidget />;
    case "module-addons":
      return <ModuleAddonsWidget />;
    case "periodisering":
      return <PeriodiseringWidget />;
    default:
      return null;
  }
}
