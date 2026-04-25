/**
 * View-registry — mapping av skjermer til tilgjengelige views.
 *
 * Hver portal- og MC-skjerm har opptil 5 views (Opt 1–5).
 * Default view settes per bruker i UserPreferences (fallback: opt1).
 *
 * Regler:
 * - Lucide-ikonnavn som string (ikke komponenter — server-safe)
 * - Norsk bokmål for labels
 * - ScreenId = rute-basert identifikator
 */

export type ViewId = "opt1" | "opt2" | "opt3" | "opt4" | "opt5";

export interface ViewDefinition {
  id: ViewId;
  label: string;
  icon: string; // Lucide icon name (f.eks. "layout-grid", "list", "bar-chart-3")
  description?: string;
}

export type ScreenId =
  // Portal — strategiske
  | "portal-dashboard"
  | "portal-planlegger"
  | "portal-kalender"
  | "portal-runde-live"
  | "portal-runde-oppsummering"
  | "portal-statistikk"
  | "portal-mental"
  | "portal-onboarding"
  // Portal — bonus
  | "portal-ai-coach"
  | "portal-analyse"
  | "portal-apper"
  | "portal-abonnement"
  | "portal-bag"
  | "portal-benchmark"
  | "portal-bookinger"
  | "portal-coaching-historikk"
  | "portal-dagbok"
  | "portal-meldinger"
  | "portal-ovelser"
  | "portal-profil"
  | "portal-sammenligning"
  | "portal-sosialt"
  | "portal-spill"
  | "portal-strategi"
  | "portal-tester-decade"
  | "portal-trackman"
  | "portal-trackman-tester"
  | "portal-turneringer"
  | "portal-turneringsplan"
  // CoachHQ — strategiske
  | "mc-dashboard"
  | "mc-kalender"
  | "mc-bookinger"
  | "mc-elever"
  | "mc-elev-detalj"
  | "mc-rapporter"
  | "mc-fasiliteter"
  | "mc-tilgjengelighet"
  // CoachHQ — bonus
  | "mc-agenter"
  | "mc-ai-assistent"
  | "mc-analytics"
  | "mc-denne-uken"
  | "mc-epostmaler"
  | "mc-focus"
  | "mc-godkjenninger"
  | "mc-kapasitet"
  | "mc-meldinger"
  | "mc-mission-board"
  | "mc-notifikasjoner"
  | "mc-okonomi"
  | "mc-okter"
  | "mc-treningsplan"
  | "mc-turneringer";

export interface ScreenViews {
  screenId: ScreenId;
  label: string;
  views: ViewDefinition[];
}

const DEFAULT_VIEWS: ViewDefinition[] = [
  { id: "opt1", label: "Standard", icon: "layout-grid", description: "Klassisk oversikt" },
  { id: "opt2", label: "Alternativ 1", icon: "list" },
  { id: "opt3", label: "Alternativ 2", icon: "bar-chart-3" },
  { id: "opt4", label: "Alternativ 3", icon: "columns-3" },
  { id: "opt5", label: "Alternativ 4", icon: "command" },
];

/**
 * Registry over skjermer og deres tilgjengelige views.
 * Utvides etter hvert som views implementeres per skjerm.
 */
export const VIEW_REGISTRY: Record<ScreenId, ScreenViews> = {
  // Portal — Dashboard (5 views fra wireframe)
  "portal-dashboard": {
    screenId: "portal-dashboard",
    label: "Dashboard",
    views: [
      { id: "opt1", label: "Athletic Grid", icon: "layout-grid", description: "Kraftfull oversikt med KPI-kort" },
      { id: "opt2", label: "Focus Today", icon: "target", description: "Dagens fokus og neste steg" },
      { id: "opt3", label: "Data Rich", icon: "bar-chart-3", description: "Tall-tung med grafer og trend" },
      { id: "opt4", label: "Progress Story", icon: "trending-up", description: "Visuell progresjon over tid" },
      { id: "opt5", label: "Command Center", icon: "command", description: "Hurtighandlinger og status" },
    ],
  },

  // Portal — Treningsplanlegger
  "portal-planlegger": {
    screenId: "portal-planlegger",
    label: "Treningsplanlegger",
    views: DEFAULT_VIEWS,
  },

  // Portal — Kalender
  "portal-kalender": {
    screenId: "portal-kalender",
    label: "Kalender",
    views: DEFAULT_VIEWS,
  },

  // Portal — Runde-tracking
  "portal-runde-live": {
    screenId: "portal-runde-live",
    label: "Runde-tracking",
    views: DEFAULT_VIEWS,
  },

  // Portal — Runde-oppsummering
  "portal-runde-oppsummering": {
    screenId: "portal-runde-oppsummering",
    label: "Runde-oppsummering",
    views: DEFAULT_VIEWS,
  },

  // Portal — Statistikk (v3.1 design-canvas: 2 unike views)
  "portal-statistikk": {
    screenId: "portal-statistikk",
    label: "Statistikk",
    views: [
      {
        id: "opt1",
        label: "Performance Report",
        icon: "bar-chart-3",
        description: "SG-radar, horisontale barer, konsistensheatmap, AI-narrativ",
      },
      {
        id: "opt2",
        label: "Course Hero",
        icon: "image",
        description: "Tiltet bane-hero + glass drawer + SG-ring",
      },
    ],
  },

  // Portal — Mental
  "portal-mental": {
    screenId: "portal-mental",
    label: "Mental game",
    views: DEFAULT_VIEWS,
  },

  // Portal — Onboarding
  "portal-onboarding": {
    screenId: "portal-onboarding",
    label: "Onboarding",
    views: DEFAULT_VIEWS,
  },

  // Portal — AI-coach
  "portal-ai-coach": {
    screenId: "portal-ai-coach",
    label: "AI-coach",
    views: DEFAULT_VIEWS,
  },

  // Portal — Analyse
  "portal-analyse": {
    screenId: "portal-analyse",
    label: "Analyse",
    views: DEFAULT_VIEWS,
  },

  // Portal — Apper
  "portal-apper": {
    screenId: "portal-apper",
    label: "Apper",
    views: DEFAULT_VIEWS,
  },

  // Portal — Abonnement
  "portal-abonnement": {
    screenId: "portal-abonnement",
    label: "Abonnement",
    views: DEFAULT_VIEWS,
  },

  // Portal — Bag
  "portal-bag": {
    screenId: "portal-bag",
    label: "Bag",
    views: DEFAULT_VIEWS,
  },

  // Portal — Benchmark
  "portal-benchmark": {
    screenId: "portal-benchmark",
    label: "Benchmark",
    views: DEFAULT_VIEWS,
  },

  // Portal — Bookinger
  "portal-bookinger": {
    screenId: "portal-bookinger",
    label: "Bookinger",
    views: DEFAULT_VIEWS,
  },

  // Portal — Coaching-historikk
  "portal-coaching-historikk": {
    screenId: "portal-coaching-historikk",
    label: "Coaching-historikk",
    views: DEFAULT_VIEWS,
  },

  // Portal — Min Trening
  "portal-dagbok": {
    screenId: "portal-dagbok",
    label: "Min Trening",
    views: DEFAULT_VIEWS,
  },

  // Portal — Meldinger
  "portal-meldinger": {
    screenId: "portal-meldinger",
    label: "Meldinger",
    views: DEFAULT_VIEWS,
  },

  // Portal — Øvelser
  "portal-ovelser": {
    screenId: "portal-ovelser",
    label: "Øvelser",
    views: DEFAULT_VIEWS,
  },

  // Portal — Profil
  "portal-profil": {
    screenId: "portal-profil",
    label: "Profil",
    views: DEFAULT_VIEWS,
  },

  // Portal — Sammenligning
  "portal-sammenligning": {
    screenId: "portal-sammenligning",
    label: "Sammenligning",
    views: DEFAULT_VIEWS,
  },

  // Portal — Sosialt
  "portal-sosialt": {
    screenId: "portal-sosialt",
    label: "Sosialt",
    views: DEFAULT_VIEWS,
  },

  // Portal — Spill
  "portal-spill": {
    screenId: "portal-spill",
    label: "Spill",
    views: DEFAULT_VIEWS,
  },

  // Portal — Strategi
  "portal-strategi": {
    screenId: "portal-strategi",
    label: "Strategi",
    views: DEFAULT_VIEWS,
  },

  // Portal — Tester DECADE
  "portal-tester-decade": {
    screenId: "portal-tester-decade",
    label: "Tester DECADE",
    views: DEFAULT_VIEWS,
  },

  // Portal — TrackMan
  "portal-trackman": {
    screenId: "portal-trackman",
    label: "TrackMan",
    views: DEFAULT_VIEWS,
  },

  // Portal — TrackMan-tester
  "portal-trackman-tester": {
    screenId: "portal-trackman-tester",
    label: "TrackMan-tester",
    views: DEFAULT_VIEWS,
  },

  // Portal — Turneringer
  "portal-turneringer": {
    screenId: "portal-turneringer",
    label: "Turneringer",
    views: DEFAULT_VIEWS,
  },

  // Portal — Turneringsplan
  "portal-turneringsplan": {
    screenId: "portal-turneringsplan",
    label: "Turneringsplan",
    views: DEFAULT_VIEWS,
  },

  // CoachHQ — Dashboard
  "mc-dashboard": {
    screenId: "mc-dashboard",
    label: "MC Dashboard",
    views: [
      { id: "opt1", label: "Oversikt", icon: "layout-grid", description: "Helikopter-view av hele virksomheten" },
      { id: "opt2", label: "Fokus-mode", icon: "target", description: "Dagens oppgaver og prioriteringer" },
      { id: "opt3", label: "KPI-drilldown", icon: "bar-chart-3", description: "Dypdykk i nøkkeltall" },
      { id: "opt4", label: "Action-mode", icon: "zap", description: "Hurtighandlinger og CMD+K" },
      { id: "opt5", label: "Tidsfokus", icon: "clock", description: "Kun i dag — ren og minimalistisk" },
    ],
  },

  // CoachHQ — Kalender
  "mc-kalender": {
    screenId: "mc-kalender",
    label: "MC Kalender",
    views: [
      { id: "opt1", label: "Ukesvisning", icon: "calendar-days", description: "Gantt timeline — standard uke" },
      { id: "opt2", label: "Resource-view", icon: "users", description: "Instruktør-grid" },
      { id: "opt3", label: "Kapasitet", icon: "gauge", description: "Capacity heatmap" },
      { id: "opt4", label: "Kanban", icon: "columns-3", description: "Drag-drop kanban-stil" },
      { id: "opt5", label: "Dag-fokus", icon: "clock", description: "Dag-visning med swim-lanes" },
    ],
  },

  // CoachHQ — Bookinger
  "mc-bookinger": {
    screenId: "mc-bookinger",
    label: "MC Bookinger",
    views: [
      { id: "opt1", label: "Smart liste", icon: "list", description: "Liste med filtre" },
      { id: "opt2", label: "Kalender", icon: "calendar-days", description: "Kalender-embed i liste" },
      { id: "opt3", label: "Kanban", icon: "columns-3", description: "Pending/Confirmed/Completed" },
      { id: "opt4", label: "Tabell", icon: "table-2", description: "Sorterbare kolonner" },
      { id: "opt5", label: "Timeline", icon: "arrow-right-left", description: "Kronologisk timeline" },
    ],
  },

  // CoachHQ — Elever
  "mc-elever": {
    screenId: "mc-elever",
    label: "MC Elever",
    views: [
      { id: "opt1", label: "Grid-kort", icon: "layout-grid", description: "Elev-kort i grid" },
      { id: "opt2", label: "Tabell", icon: "table-2", description: "Bulk-håndtering" },
      { id: "opt3", label: "Segmenter", icon: "pie-chart", description: "Grupper etter HCP/aktivitet" },
      { id: "opt4", label: "Kart", icon: "map-pin", description: "Geografisk visning" },
      { id: "opt5", label: "Pipeline", icon: "arrow-right-left", description: "Status-tracker" },
    ],
  },

  // CoachHQ — Elev-detalj
  "mc-elev-detalj": {
    screenId: "mc-elev-detalj",
    label: "MC Elev-detalj",
    views: DEFAULT_VIEWS,
  },

  // CoachHQ — Rapporter
  "mc-rapporter": {
    screenId: "mc-rapporter",
    label: "MC Rapporter",
    views: DEFAULT_VIEWS,
  },

  // CoachHQ — Fasiliteter
  "mc-fasiliteter": {
    screenId: "mc-fasiliteter",
    label: "MC Fasiliteter",
    views: DEFAULT_VIEWS,
  },

  // CoachHQ — Tilgjengelighet
  "mc-tilgjengelighet": {
    screenId: "mc-tilgjengelighet",
    label: "MC Tilgjengelighet",
    views: DEFAULT_VIEWS,
  },

  // CoachHQ — bonus
  "mc-agenter": {
    screenId: "mc-agenter",
    label: "MC Agenter",
    views: DEFAULT_VIEWS,
  },
  "mc-ai-assistent": {
    screenId: "mc-ai-assistent",
    label: "MC AI-assistent",
    views: DEFAULT_VIEWS,
  },
  "mc-analytics": {
    screenId: "mc-analytics",
    label: "MC Analytics",
    views: DEFAULT_VIEWS,
  },
  "mc-denne-uken": {
    screenId: "mc-denne-uken",
    label: "MC Denne uken",
    views: DEFAULT_VIEWS,
  },
  "mc-epostmaler": {
    screenId: "mc-epostmaler",
    label: "MC E-postmaler",
    views: DEFAULT_VIEWS,
  },
  "mc-focus": {
    screenId: "mc-focus",
    label: "MC Focus",
    views: DEFAULT_VIEWS,
  },
  "mc-godkjenninger": {
    screenId: "mc-godkjenninger",
    label: "MC Godkjenninger",
    views: DEFAULT_VIEWS,
  },
  "mc-kapasitet": {
    screenId: "mc-kapasitet",
    label: "MC Kapasitet",
    views: DEFAULT_VIEWS,
  },
  "mc-meldinger": {
    screenId: "mc-meldinger",
    label: "MC Meldinger",
    views: DEFAULT_VIEWS,
  },
  "mc-mission-board": {
    screenId: "mc-mission-board",
    label: "MC Mission board",
    views: DEFAULT_VIEWS,
  },
  "mc-notifikasjoner": {
    screenId: "mc-notifikasjoner",
    label: "MC Notifikasjoner",
    views: DEFAULT_VIEWS,
  },
  "mc-okonomi": {
    screenId: "mc-okonomi",
    label: "MC Økonomi",
    views: DEFAULT_VIEWS,
  },
  "mc-okter": {
    screenId: "mc-okter",
    label: "MC Økter",
    views: DEFAULT_VIEWS,
  },
  "mc-treningsplan": {
    screenId: "mc-treningsplan",
    label: "MC Treningsplan",
    views: DEFAULT_VIEWS,
  },
  "mc-turneringer": {
    screenId: "mc-turneringer",
    label: "MC Turneringer",
    views: DEFAULT_VIEWS,
  },
};

/**
 * Henter views for en gitt skjerm.
 * Kaster feil hvis skjermen ikke finnes i registry (utviklingsfeil).
 */
export function getScreenViews(screenId: ScreenId): ScreenViews {
  const config = VIEW_REGISTRY[screenId];
  if (!config) {
    throw new Error(`Ukjent skjerm: ${screenId}. Legg til i VIEW_REGISTRY.`);
  }
  return config;
}

/**
 * Sjekker om et view-id er gyldig for en gitt skjerm.
 */
export function isValidView(screenId: ScreenId, viewId: string): viewId is ViewId {
  const config = VIEW_REGISTRY[screenId];
  if (!config) return false;
  return config.views.some((v) => v.id === viewId);
}

/**
 * Henter default view for en skjerm (alltid opt1 som fallback).
 */
 
export function getDefaultViewId(_screenId: ScreenId): ViewId {
  return "opt1";
}

/**
 * Henter label for et spesifikt view.
 */
export function getViewLabel(screenId: ScreenId, viewId: ViewId): string {
  const config = VIEW_REGISTRY[screenId];
  const view = config?.views.find((v) => v.id === viewId);
  return view?.label ?? viewId;
}

