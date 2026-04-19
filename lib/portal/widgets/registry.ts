/**
 * Widget Registry — metadata for alle tilgjengelige dashboard-widgets.
 *
 * Widget-komponenter mappes separat i `components/portal/widgets/widget-renderer.tsx`
 * for å unngå server/client import-problemer.
 */

export type WidgetId =
  | "plan-progress"
  | "next-competition"
  | "training-volume"
  | "season-plan"
  | "leaderboard"
  | "coaching-feedback"
  | "mental-trends"
  | "degradation-alert"
  | "module-addons"
  | "periodisering";

export type WidgetSize = "small" | "medium" | "large";

export interface WidgetDefinition {
  id: WidgetId;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  size: WidgetSize;
  category: "progress" | "competition" | "training" | "social" | "coaching";
}

export const WIDGET_REGISTRY: Record<WidgetId, WidgetDefinition> = {
  "plan-progress": {
    id: "plan-progress",
    title: "Plan-framgang",
    description: "Progresjon på aktiv treningsplan",
    icon: "trending-up",
    size: "medium",
    category: "progress",
  },
  "next-competition": {
    id: "next-competition",
    title: "Neste konkurranse",
    description: "Nedtelling og forberedelse",
    icon: "trophy",
    size: "small",
    category: "competition",
  },
  "training-volume": {
    id: "training-volume",
    title: "Treningstimer",
    description: "Timer per NGF-område",
    icon: "timer",
    size: "medium",
    category: "training",
  },
  "season-plan": {
    id: "season-plan",
    title: "Sesongplan",
    description: "12-måneders oversikt",
    icon: "calendar-days",
    size: "large",
    category: "progress",
  },
  leaderboard: {
    id: "leaderboard",
    title: "Rangering",
    description: "Sammenligning med andre spillere",
    icon: "medal",
    size: "medium",
    category: "social",
  },
  "coaching-feedback": {
    id: "coaching-feedback",
    title: "Coaching-feedback",
    description: "Siste tilbakemelding fra instruktør",
    icon: "message-square",
    size: "medium",
    category: "coaching",
  },
  "mental-trends": {
    id: "mental-trends",
    title: "Mental trender",
    description: "Fokus, selvtillit og progresjon",
    icon: "heart-pulse",
    size: "medium",
    category: "progress",
  },
  "degradation-alert": {
    id: "degradation-alert",
    title: "Nedgangsvarsel",
    description: "Teknikk-nedgang under press",
    icon: "alert-triangle",
    size: "medium",
    category: "training",
  },
  "module-addons": {
    id: "module-addons",
    title: "Tilleggsmoduler",
    description: "Tilgjengelige moduler og abonnement",
    icon: "puzzle",
    size: "medium",
    category: "progress",
  },
  periodisering: {
    id: "periodisering",
    title: "Periodisering",
    description: "Nåværende treningsfase",
    icon: "repeat",
    size: "medium",
    category: "training",
  },
};

/**
 * Henter widget-metadata etter ID.
 */
export function getWidgetDef(id: WidgetId): WidgetDefinition {
  const def = WIDGET_REGISTRY[id];
  if (!def) {
    throw new Error(`Ukjent widget: ${id}`);
  }
  return def;
}

/**
 * Default layout for Athletic Grid-view (portal-dashboard opt1).
 * Array av widget-IDer i ønsket rekkefølge.
 */
export const DEFAULT_DASHBOARD_LAYOUT: WidgetId[] = [
  "plan-progress",
  "next-competition",
  "training-volume",
  "season-plan",
  "leaderboard",
  "coaching-feedback",
  "mental-trends",
  "degradation-alert",
  "module-addons",
  "periodisering",
];

/**
 * Grid-størrelser per widget (for CSS grid-template-areas eller col-span).
 */
export const WIDGET_SIZE_CLASSES: Record<WidgetSize, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 md:col-span-2 row-span-1",
  large: "col-span-1 md:col-span-2 lg:col-span-3 row-span-2",
};
