import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";

export type SessionLevel = "fys" | "tek" | "slag" | "spill" | "turn";

export interface SessionBlock {
  id: string;
  title: string;
  meta: string; // e.g. "07:00 · 25 MIN · FYS"
  level: SessionLevel | "ai-suggest";
  date: Date;
}

export const LEVEL_COLORS: Record<SessionLevel, { fg: string; bg: string }> = {
  fys: { fg: "#6FCBA1", bg: "rgba(111,203,161,0.12)" },
  tek: { fg: "#7AB8E0", bg: "rgba(122,184,224,0.12)" },
  slag: { fg: "#E0C77A", bg: "rgba(224,199,122,0.12)" },
  spill: { fg: "#D49A6A", bg: "rgba(212,154,106,0.12)" },
  turn: { fg: "#C589E8", bg: "rgba(197,137,232,0.12)" },
};

export const LEVEL_LABELS: Record<SessionLevel, string> = {
  fys: "FYS",
  tek: "TEK",
  slag: "SLAG",
  spill: "SPILL",
  turn: "TURN",
};

export function eventToLevel(ev: CalendarEvent): SessionLevel {
  if (ev.type === "tournament") return "turn";
  if (ev.type === "coaching") return "tek";
  if (ev.type === "booking") return "tek";
  // Training: try heuristic on title
  const t = ev.title.toLowerCase();
  if (t.includes("mobility") || t.includes("fysisk") || t.includes("styrke")) return "fys";
  if (t.includes("putt") || t.includes("chip") || t.includes("wedge")) return "slag";
  if (t.includes("hull") || t.includes("runde") || t.includes("course")) return "spill";
  return "tek";
}

export function formatTime(d: Date): string {
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function durationMinutes(start: Date, end?: Date): number | null {
  if (!end) return null;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

export interface ExerciseTemplate {
  id: string;
  title: string;
  level: SessionLevel;
  durationLabel: string;
  location: string;
  detail: string;
}

export interface WeekTemplate {
  id: string;
  title: string;
  meta: string;
  tags: SessionLevel[];
}
