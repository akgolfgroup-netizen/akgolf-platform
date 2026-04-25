/**
 * Felles typer for fasilitets-bookingkartet (Kart/Kalender/Liste).
 */

export type EventSource = "BOOKING" | "ACTIVITY" | "TRAINING_PLAN";

export interface FacilityEvent {
  id: string;
  source: EventSource;
  facilityId: string;
  title: string;
  subtitle: string | null;
  startTime: string;
  endTime: string;
  color: string | null;
  status: string | null;
}

export interface FacilityWithEvents {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  sortOrder: number;
  events: FacilityEvent[];
}

export interface OverviewResponse {
  from: string;
  to: string;
  facilities: FacilityWithEvents[];
}

/** Kart-soner — én polygon per fysisk område på flyfotoet. */
export interface MapZone {
  id: string;
  label: string;
  /** Slugs som mappes inn i denne sonen. */
  facilitySlugs: string[];
  /** SVG points for polygon (viewBox 0 0 100 100). */
  points: string;
}

export const GFGK_MAP_ZONES: MapZone[] = [
  {
    id: "driving-range",
    label: "Driving Range",
    facilitySlugs: ["driving-range-1", "driving-range-2"],
    points: "47,28 95,18 95,52 52,46",
  },
  {
    id: "puttinggreen",
    label: "Puttinggreen",
    facilitySlugs: ["puttinggreen"],
    points: "62,2 95,0 95,16 65,18",
  },
  {
    id: "naerspill",
    label: "Nærspillsområde",
    facilitySlugs: ["naerspillsomrade"],
    points: "8,30 28,32 28,52 8,50",
  },
  {
    id: "klubbhus",
    label: "Klubbhus",
    facilitySlugs: ["klubbrommet", "uteomrade-klubbhus", "juniorrommet"],
    points: "44,38 60,38 60,66 44,66",
  },
  {
    id: "korthullsbane",
    label: "9-hullsbanen",
    facilitySlugs: ["9-hullsbanen", "9-hullsbanen-trening"],
    points: "5,50 42,52 42,82 5,82",
  },
];

/** Aggregert beleggsstatus for en sone i kartvisning. */
export type ZoneLoad = "free" | "busy" | "full";

export function classifyLoad(events: number, capacity: number | null): ZoneLoad {
  if (!capacity || capacity <= 0) {
    if (events === 0) return "free";
    return events >= 4 ? "full" : "busy";
  }
  const ratio = events / capacity;
  if (ratio >= 0.85) return "full";
  if (ratio >= 0.5) return "busy";
  return "free";
}

export const ZONE_COLORS: Record<ZoneLoad, { fill: string; stroke: string; ring: string }> = {
  free: { fill: "rgba(21, 66, 18, 0.45)", stroke: "#d2f000", ring: "rgba(210, 240, 0, 0.65)" },
  busy: { fill: "rgba(196, 138, 50, 0.55)", stroke: "#f4c772", ring: "rgba(244, 199, 114, 0.65)" },
  full: { fill: "rgba(186, 26, 26, 0.55)", stroke: "#ff8a80", ring: "rgba(255, 138, 128, 0.7)" },
};

export const SOURCE_LABELS: Record<EventSource, string> = {
  BOOKING: "Coaching",
  ACTIVITY: "Aktivitet",
  TRAINING_PLAN: "Gruppeplan",
};

export const SOURCE_BADGE: Record<EventSource, string> = {
  BOOKING: "bg-primary text-on-primary",
  ACTIVITY: "bg-secondary-fixed text-on-secondary-fixed",
  TRAINING_PLAN: "bg-on-surface text-surface",
};
