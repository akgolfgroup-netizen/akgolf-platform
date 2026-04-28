import type { CalendarBooking } from "./actions";

export type CoachKey = "coach-1" | "coach-2" | "coach-3" | "coach-4" | "coach-other";

export const COACH_COLORS: Record<CoachKey, { dot: string; bg: string; bar: string }> = {
  "coach-1": { dot: "#6FB3FF", bg: "rgba(0,122,255,0.20)", bar: "#6FB3FF" },
  "coach-2": { dot: "#C896E8", bg: "rgba(175,82,222,0.20)", bar: "#C896E8" },
  "coach-3": { dot: "#E8B967", bg: "rgba(196,138,50,0.20)", bar: "#E8B967" },
  "coach-4": { dot: "#6FCBA1", bg: "rgba(42,125,90,0.22)", bar: "#6FCBA1" },
  "coach-other": { dot: "#A5B2AD", bg: "rgba(255,255,255,0.05)", bar: "rgba(255,255,255,0.20)" },
};

export type CoachLegendItem = {
  id: string;
  name: string;
  count: number;
  key: CoachKey;
};

export function buildCoachMap(bookings: CalendarBooking[]): Map<string, CoachKey> {
  const counts = new Map<string, { id: string; name: string; count: number }>();
  for (const b of bookings) {
    const id = b.instructor.id;
    const name = b.instructor.user.name ?? "Coach";
    const c = counts.get(id) ?? { id, name, count: 0 };
    c.count++;
    counts.set(id, c);
  }
  const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
  const map = new Map<string, CoachKey>();
  const keys: CoachKey[] = ["coach-1", "coach-2", "coach-3", "coach-4"];
  sorted.forEach((c, i) => {
    map.set(c.id, keys[i] ?? "coach-other");
  });
  return map;
}

export function buildLegend(
  bookings: CalendarBooking[],
  coachMap: Map<string, CoachKey>,
): CoachLegendItem[] {
  const counts = new Map<string, { id: string; name: string; count: number }>();
  for (const b of bookings) {
    const id = b.instructor.id;
    const name = b.instructor.user.name ?? "Coach";
    const c = counts.get(id) ?? { id, name, count: 0 };
    c.count++;
    counts.set(id, c);
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      name: c.name,
      count: c.count,
      key: coachMap.get(c.id) ?? "coach-other",
    }));
}

export type WeekStats = {
  total: number;
  utilization: number;
  pending: number;
  freeHours: number;
  revenueKr: number;
};

export function computeWeekStats(bookings: CalendarBooking[]): WeekStats {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const totalMinutes = bookings.reduce(
    (sum, b) => sum + (b.serviceType.duration ?? 60),
    0,
  );
  // 4 coaches * 5 days * 8 working hours = 160h capacity by default
  const capacityMin = 4 * 5 * 8 * 60;
  const utilization = Math.min(100, Math.round((totalMinutes / capacityMin) * 100));
  const freeHours = Math.max(0, Math.round((capacityMin - totalMinutes) / 60));
  return {
    total,
    utilization,
    pending,
    freeHours,
    revenueKr: 0,
  };
}
