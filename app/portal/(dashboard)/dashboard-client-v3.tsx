"use client";

/**
 * Dashboard Client — Heritage-migrering 2026-04-19.
 *
 * Fjernet ViewSwitcher med 5 varianter ("Athletic Grid / Focus Today / Data Rich /
 * Progress Story / Command Center"). Heritage har én fast dashboard-layout
 * (dashboard_mission_control). AthleticGridView brukes som default.
 *
 * De andre views-filene (focus-today-view, data-rich-view, etc.) er ikke slettet
 * — kan gjenoppdages som eksperimentelle varianter om ønskelig. Men default-
 * visning er nå Heritage-oriented.
 */

import { AthleticGridView } from "./dashboard-views/athletic-grid-view";
import type { DashboardV3Props } from "./dashboard-types";

export function DashboardClientV3(props: DashboardV3Props) {
  return <AthleticGridView {...props} />;
}
