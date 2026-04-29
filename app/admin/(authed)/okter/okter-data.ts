import { format, isSameDay, addDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import type { SessionItem } from "./actions";

export type SessionRowStatus = "done" | "live" | "upcoming" | "cancelled";

export type SessionRow = {
  id: string;
  date: Date;
  dayLabel: string;
  timeLabel: string;
  iconKind: "iron" | "driver" | "short" | "putt" | "bunker" | "tempo";
  player: { name: string; sub: string; initials: string; color: string };
  type: { title: string; sub: string };
  coach: { name: string; tag: string };
  durationMin: number;
  status: SessionRowStatus;
  tags: SessionTag[];
};

export type SessionTag = {
  label: string;
  variant: "default" | "pr" | "video" | "tm";
};

export type SessionDayGroup = {
  label: string;
  count: number;
  rows: SessionRow[];
};

const PALETTE = ["#6FB3FF", "#6FCBA1", "#C896E8", "#D1F843", "#E8B967", "#F49283", "#A5B2AD"];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsOf(name: string): string {
  const parts = name.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function inferIcon(serviceName: string): SessionRow["iconKind"] {
  const n = serviceName.toLowerCase();
  if (n.includes("driver")) return "driver";
  if (n.includes("iron") || n.includes("jern")) return "iron";
  if (n.includes("bunker")) return "bunker";
  if (n.includes("putt")) return "putt";
  if (n.includes("chip") || n.includes("short")) return "short";
  return "tempo";
}

function statusOf(item: SessionItem, now: Date): SessionRowStatus {
  if (item.status === "CANCELLED" || item.status === "NO_SHOW") return "cancelled";
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  if (item.status === "COMPLETED") return "done";
  if (start <= now && now <= end) return "live";
  if (start > now) return "upcoming";
  return "done";
}

function tagsFor(item: SessionItem, status: SessionRowStatus): SessionTag[] {
  const tags: SessionTag[] = [];
  if (status === "done") tags.push({ label: "FULLFØRT", variant: "default" });
  if (status === "cancelled") tags.push({ label: "AVLYST", variant: "default" });
  if (item.adminNotes && item.adminNotes.length > 0) {
    tags.push({ label: "NOTAT", variant: "video" });
  }
  return tags;
}

function dayDividerLabel(date: Date, now: Date): string {
  const day = format(date, "EEEE d. MMMM", { locale: nb }).toUpperCase();
  if (isSameDay(date, now)) return `I DAG · ${day}`;
  if (isSameDay(date, addDays(now, 1))) return `I MORGEN · ${day}`;
  return day;
}

export function toRow(item: SessionItem, now: Date): SessionRow {
  const playerName = item.student?.name ?? item.student?.email ?? "Ukjent spiller";
  const coachName = item.instructor?.name ?? "—";
  const status = statusOf(item, now);
  const minutes = item.service?.duration ?? Math.round(
    (+new Date(item.endTime) - +new Date(item.startTime)) / 60000,
  );
  return {
    id: item.id,
    date: new Date(item.startTime),
    dayLabel: format(item.startTime, "dd MMM", { locale: nb }),
    timeLabel: format(item.startTime, "HH:mm"),
    iconKind: inferIcon(item.service?.name ?? ""),
    player: {
      name: playerName,
      sub: "",
      initials: initialsOf(playerName),
      color: colorFor(playerName),
    },
    type: { title: item.service?.name ?? "Økt", sub: "" },
    coach: { name: coachName, tag: "" },
    durationMin: minutes,
    status,
    tags: tagsFor(item, status),
  };
}

export function groupSessions(items: SessionItem[], now: Date): SessionDayGroup[] {
  const map = new Map<string, SessionItem[]>();
  for (const it of items) {
    const key = format(new Date(it.startTime), "yyyy-MM-dd");
    const list = map.get(key) ?? [];
    list.push(it);
    map.set(key, list);
  }
  const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
  return sortedKeys.map((k) => {
    const date = new Date(`${k}T12:00:00`);
    const list = (map.get(k) ?? []).sort((a, b) =>
      b.startTime.toString().localeCompare(a.startTime.toString()),
    );
    return {
      label: dayDividerLabel(date, now),
      count: list.length,
      rows: list.map((it) => toRow(it, now)),
    };
  });
}

export type CoachHeatRow = { name: string; cells: number[] };

export function buildHeatmap(items: SessionItem[], now: Date): CoachHeatRow[] {
  const today = startOfDay(now);
  const start = addDays(today, -27);
  const map = new Map<string, Map<string, number>>();
  for (const it of items) {
    const day = format(new Date(it.startTime), "yyyy-MM-dd");
    if (new Date(it.startTime) < start) continue;
    const coach = it.instructor?.name ?? "Ukjent";
    const inner = map.get(coach) ?? new Map<string, number>();
    inner.set(day, (inner.get(day) ?? 0) + 1);
    map.set(coach, inner);
  }
  const rows: CoachHeatRow[] = [];
  for (const [coach, days] of map.entries()) {
    const cells = Array.from({ length: 28 }).map((_, i) => {
      const dayKey = format(addDays(start, i), "yyyy-MM-dd");
      return days.get(dayKey) ?? 0;
    });
    rows.push({ name: coach, cells });
  }
  return rows.sort((a, b) => {
    const aSum = a.cells.reduce((s, n) => s + n, 0);
    const bSum = b.cells.reduce((s, n) => s + n, 0);
    return bSum - aSum;
  });
}
