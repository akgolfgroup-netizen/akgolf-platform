import { format, differenceInCalendarDays } from "date-fns";
import { nb } from "date-fns/locale";
import type { BookingViewModel } from "@/components/portal/booking/booking-types";

export function formatTimeRange(start: Date, duration: number): string {
  const end = new Date(start.getTime() + duration * 60_000);
  return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
}

export function dayPartShort(date: Date): {
  day: string;
  num: string;
  mo: string;
} {
  return {
    day: format(date, "EEE", { locale: nb }).replace(".", ""),
    num: format(date, "dd"),
    mo: format(date, "MMM", { locale: nb }).replace(".", ""),
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function nextLabel(date: Date): string {
  const days = differenceInCalendarDays(date, new Date());
  const time = format(date, "HH:mm");
  if (days <= 0) return `Neste · i dag · ${time}`;
  if (days === 1) return `Neste · i morgen · ${time}`;
  return `Neste · om ${days} dager · ${time}`;
}

export function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function dayLabel(date: Date): string {
  return format(date, "EEE d. MMM", { locale: nb })
    .replace(/\./g, "")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export interface DayGroup {
  key: string;
  label: string;
  bookings: BookingViewModel[];
}

export function groupByDay(bookings: BookingViewModel[]): DayGroup[] {
  const map = new Map<string, BookingViewModel[]>();
  for (const b of bookings) {
    const k = dayKey(b.startTime);
    const arr = map.get(k);
    if (arr) arr.push(b);
    else map.set(k, [b]);
  }
  return Array.from(map.entries()).map(([key, list]) => ({
    key,
    label: dayLabel(list[0].startTime),
    bookings: list,
  }));
}

// Konsistent farge på avatar basert på navn (deterministisk)
const AVATAR_COLORS = ["#D1F843", "#C896E8", "#6FCBA1", "#E8B967", "#F49283"];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
