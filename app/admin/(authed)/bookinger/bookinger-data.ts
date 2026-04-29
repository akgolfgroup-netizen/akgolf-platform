import { format, startOfDay, isSameDay, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import type { AdminBooking } from "./actions";
import type { BookingDayGroup, BookingRow, BookingStatus } from "@/components/admin/bookinger/booking-types";

const PALETTE = ["#6FB3FF", "#6FCBA1", "#C896E8", "#D1F843", "#E8B967", "#F49283", "#A5B2AD"];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsOf(nameOrEmail: string): string {
  const parts = nameOrEmail.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function statusOf(b: AdminBooking, now: Date): BookingStatus {
  const start = new Date(b.startTime);
  const end = new Date(b.endTime);
  if (b.status === "CONFIRMED" && start <= now && now <= end) return "live";
  if (b.status === "CONFIRMED") return "confirmed";
  if (b.status === "PENDING") return "pending";
  if (b.status === "CANCELLED" || b.status === "NO_SHOW") return "cancelled";
  return "confirmed";
}

function dayLabel(date: Date, now: Date): string {
  if (isSameDay(date, now)) return "I dag";
  if (isSameDay(date, addDays(now, 1))) return "I morgen";
  return format(date, "EEEE", { locale: nb }).replace(/^./, (c) => c.toUpperCase());
}

function dayDividerLabel(date: Date, now: Date): string {
  const day = format(date, "EEEE d. MMMM", { locale: nb }).toUpperCase();
  if (isSameDay(date, now)) return `I DAG · ${day}`;
  if (isSameDay(date, addDays(now, 1))) return `I MORGEN · ${day}`;
  return day;
}

function durationLabel(b: AdminBooking): string {
  const minutes = b.ServiceType?.duration ?? Math.round((+new Date(b.endTime) - +new Date(b.startTime)) / 60000);
  return `${minutes} min`;
}

export function toRow(b: AdminBooking, now: Date): BookingRow {
  const start = new Date(b.startTime);
  const playerName = b.User?.name ?? b.User?.email ?? "Ukjent spiller";
  const coachName = b.Instructor?.User?.name ?? "—";
  return {
    id: b.id,
    dayLabel: dayLabel(start, now),
    dayShort: format(start, "dd MMM", { locale: nb }).toUpperCase(),
    time: format(start, "HH:mm"),
    duration: durationLabel(b),
    player: {
      initials: initialsOf(playerName),
      name: playerName,
      sub: "",
      color: colorFor(playerName),
    },
    coach: { name: coachName, tag: "" },
    location: b.Location?.name ?? "—",
    status: statusOf(b, now),
    type: b.ServiceType?.name ?? "—",
  };
}

export function groupBookingsByDay(bookings: AdminBooking[], now: Date): BookingDayGroup[] {
  const map = new Map<string, AdminBooking[]>();
  for (const b of bookings) {
    const key = format(new Date(b.startTime), "yyyy-MM-dd");
    const list = map.get(key) ?? [];
    list.push(b);
    map.set(key, list);
  }
  const sortedKeys = Array.from(map.keys()).sort();
  return sortedKeys.map((key) => {
    const date = new Date(`${key}T12:00:00`);
    const items = (map.get(key) ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      label: dayDividerLabel(date, now),
      count: items.length,
      rows: items.map((b) => toRow(b, now)),
    };
  });
}

export interface BookingStats {
  todayCount: number;
  weekCount: number;
  pendingCount: number;
  cancelledLast30: number;
  noShowLast30: number;
}

export function computeStats(bookings: AdminBooking[], now: Date): BookingStats {
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 7);
  const thirtyAgo = addDays(today, -30);

  let todayCount = 0;
  let weekCount = 0;
  let pendingCount = 0;
  let cancelled30 = 0;
  let noShow30 = 0;

  for (const b of bookings) {
    const start = new Date(b.startTime);
    if (start >= today && start < tomorrow && b.status !== "CANCELLED") todayCount++;
    if (start >= weekStart && start < weekEnd && b.status !== "CANCELLED") weekCount++;
    if (b.status === "PENDING") pendingCount++;
    if (b.status === "CANCELLED" && start >= thirtyAgo) cancelled30++;
    if (b.status === "NO_SHOW" && start >= thirtyAgo) noShow30++;
  }

  return {
    todayCount,
    weekCount,
    pendingCount,
    cancelledLast30: cancelled30,
    noShowLast30: noShow30,
  };
}

export function coachFilters(bookings: AdminBooking[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const b of bookings) {
    const name = b.Instructor?.User?.name;
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));
}
