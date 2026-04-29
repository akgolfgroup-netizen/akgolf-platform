"use client";

import { useMemo } from "react";
import {
  FACILITIES,
  type FacilityBookingDTO,
  type FacilityName,
} from "@/app/admin/(authed)/fasiliteter/constants";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

const TYPE_COLORS: Record<string, string> = {
  Trening: "bg-primary-container text-on-primary-container",
  Coaching: "bg-secondary-fixed text-secondary-fixed-text",
  Turnering: "bg-tertiary-container text-on-tertiary-container",
  Event: "bg-surface-container-high text-on-surface",
  Vedlikehold: "bg-error-container text-on-surface",
};

interface FacilityCalendarProps {
  bookings: FacilityBookingDTO[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function FacilityCalendar({
  bookings,
  selectedDate,
  onSelectDate,
}: FacilityCalendarProps) {
  const days = useMemo(() => buildWeek(), []);

  const dayBookings = useMemo(
    () => bookings.filter((b) => b.date.startsWith(selectedDate)),
    [bookings, selectedDate],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <DayPicker days={days} selectedDate={selectedDate} onSelect={onSelectDate} />
      <Schedule bookings={dayBookings} />
    </div>
  );
}

function DayPicker({
  days,
  selectedDate,
  onSelect,
}: {
  days: { iso: string; label: string; weekday: string; isToday: boolean }[];
  selectedDate: string;
  onSelect: (iso: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {days.map((d) => {
        const active = d.iso === selectedDate;
        return (
          <li key={d.iso}>
            <button
              type="button"
              onClick={() => onSelect(d.iso)}
              className={
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors " +
                (active
                  ? "border-primary bg-primary text-surface"
                  : "border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant/60")
              }
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {d.weekday}
                </p>
                <p className="text-base font-semibold">{d.label}</p>
              </div>
              {d.isToday && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider " +
                    (active
                      ? "bg-secondary-fixed text-secondary-fixed-text"
                      : "bg-primary-container text-on-primary-container")
                  }
                >
                  I dag
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Schedule({ bookings }: { bookings: FacilityBookingDTO[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
      <div className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))] border-b border-outline-variant/20 bg-surface-container-low">
        <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/80">
          Tid
        </div>
        {FACILITIES.map((f) => (
          <div
            key={f}
            className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/80"
          >
            {f}
          </div>
        ))}
      </div>

      <div className="relative">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))] border-b border-outline-variant/15 last:border-b-0"
          >
            <div className="px-3 py-3 font-mono text-xs text-on-surface-variant/80">
              {String(hour).padStart(2, "0")}:00
            </div>
            {FACILITIES.map((f) => (
              <div
                key={f}
                className="relative min-h-[60px] border-l border-outline-variant/15 px-1 py-1"
              >
                {renderBlocks(bookings, f, hour)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderBlocks(
  bookings: FacilityBookingDTO[],
  facility: FacilityName,
  hour: number,
) {
  const items = bookings.filter((b) => {
    const start = parseHour(b.startTime);
    return b.facility === facility && start === hour;
  });

  return items.map((b) => {
    const start = parseTimeMinutes(b.startTime);
    const end = parseTimeMinutes(b.endTime);
    const duration = Math.max(15, end - start);
    const color = TYPE_COLORS[b.type] ?? "bg-primary-container text-on-primary-container";
    return (
      <div
        key={b.id}
        className={`pointer-events-auto absolute left-1 right-1 rounded-xl px-2 py-1 text-[11px] leading-tight shadow-card ${color}`}
        style={{
          top: 4,
          height: `${(duration / 60) * 60 - 6}px`,
        }}
        title={`${b.person} · ${b.type}`}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider opacity-70">
          {b.startTime}–{b.endTime}
        </p>
        <p className="mt-0.5 line-clamp-2 font-semibold">{b.person}</p>
      </div>
    );
  });
}

function parseHour(time: string): number {
  return Number(time.split(":")[0]);
}

function parseTimeMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function buildWeek() {
  const fmtLabel = new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "short" });
  const fmtWeekday = new Intl.DateTimeFormat("nb-NO", { weekday: "short" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return {
      iso,
      label: fmtLabel.format(d),
      weekday: fmtWeekday.format(d),
      isToday: i === 0,
    };
  });
}
