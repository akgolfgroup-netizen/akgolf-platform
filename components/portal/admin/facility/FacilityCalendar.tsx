"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/portal/patterns";
import {
  SOURCE_BADGE,
  SOURCE_LABELS,
  type FacilityWithEvents,
  type OverviewResponse,
} from "./types";

const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i); // 08:00 – 20:00
const HOUR_HEIGHT = 56; // px per time

interface FacilityCalendarProps {
  date: Date;
  onChangeDate: (date: Date) => void;
  onAddActivity: () => void;
}

export function FacilityCalendar({ date, onChangeDate, onAddActivity }: FacilityCalendarProps) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(today, i)),
    [today],
  );

  useEffect(() => {
    const from = startOfDay(date);
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);

    let cancelled = false;
    const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
    queueMicrotask(() => !cancelled && setLoading(true));
    fetch(`/api/portal/admin/facility-overview?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json: OverviewResponse) => !cancelled && setData(json))
      .catch(() => !cancelled && setData({ from: from.toISOString(), to: to.toISOString(), facilities: [] }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const facilities = data?.facilities ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr]">
      {/* Dagvelger */}
      <div className="space-y-2">
        <MonoLabel size="xs" uppercase className="block text-outline">
          Velg dag
        </MonoLabel>
        <div className="space-y-1">
          {days.map((d) => {
            const isActive = startOfDay(d).getTime() === startOfDay(date).getTime();
            return (
              <button
                key={d.toISOString()}
                onClick={() => onChangeDate(d)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "border-on-surface bg-on-surface text-surface"
                    : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-variant",
                )}
              >
                <div>
                  <div className="font-semibold capitalize">
                    {format(d, "EEE d. MMM", { locale: nb })}
                  </div>
                  <div
                    className={cn(
                      "text-[11px]",
                      isActive ? "text-surface/70" : "text-on-surface-variant",
                    )}
                  >
                    {format(d, "yyyy", { locale: nb })}
                  </div>
                </div>
                {isActive && <Icon name="chevron_right" size={16} />}
              </button>
            );
          })}
        </div>
        <button
          onClick={onAddActivity}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-fixed px-4 py-2 text-sm font-semibold text-on-secondary-fixed hover:brightness-95"
        >
          <Icon name="add" size={16} />
          Ny aktivitet
        </button>
      </div>

      {/* Timeplan */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-4 py-3">
          <h3 className="text-sm font-semibold capitalize text-on-surface">
            {format(date, "EEEE d. MMMM yyyy", { locale: nb })}
          </h3>
          {loading && (
            <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
              <Icon name="progress_activity" size={14} className="animate-spin" />
              Laster…
            </span>
          )}
        </div>

        {facilities.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-on-surface-variant">
            <Icon name="event_busy" size={24} className="mx-auto mb-2 opacity-50" />
            Ingen aktive fasiliteter
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `64px repeat(${facilities.length}, minmax(180px, 1fr))`,
              }}
            >
              {/* Header-rad: fasilitetsnavn */}
              <div className="sticky left-0 top-0 z-10 border-b border-r border-outline-variant/30 bg-surface-container-lowest" />
              {facilities.map((f) => (
                <div
                  key={f.id}
                  className="border-b border-outline-variant/30 px-3 py-2 text-xs font-semibold text-on-surface"
                >
                  {f.name}
                </div>
              ))}

              {/* Tid-kolonne + grid-celler */}
              <TimeColumn />
              {facilities.map((f) => (
                <FacilityColumn key={f.id} facility={f} day={date} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeColumn() {
  return (
    <div className="border-r border-outline-variant/30">
      {HOURS.map((h) => (
        <div
          key={h}
          className="flex items-start justify-end pr-2 pt-1 text-[10px] font-mono tabular-nums text-on-surface-variant"
          style={{ height: HOUR_HEIGHT }}
        >
          {h.toString().padStart(2, "0")}:00
        </div>
      ))}
    </div>
  );
}

function FacilityColumn({ facility, day }: { facility: FacilityWithEvents; day: Date }) {
  const dayStart = startOfDay(day).getTime();
  return (
    <div
      className="relative border-r border-outline-variant/30"
      style={{ height: HOURS.length * HOUR_HEIGHT }}
    >
      {/* Hour-grid lines */}
      {HOURS.map((h) => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t border-outline-variant/15"
          style={{ top: (h - HOURS[0]) * HOUR_HEIGHT }}
        />
      ))}

      {facility.events.map((ev) => {
        const start = new Date(ev.startTime).getTime();
        const end = new Date(ev.endTime).getTime();
        const startMin = (start - dayStart) / 60000;
        const endMin = (end - dayStart) / 60000;
        const firstHourMin = HOURS[0] * 60;
        const top = ((startMin - firstHourMin) / 60) * HOUR_HEIGHT;
        const height = Math.max(20, ((endMin - startMin) / 60) * HOUR_HEIGHT);

        if (top + height < 0 || top > HOURS.length * HOUR_HEIGHT) return null;

        return (
          <div
            key={ev.id}
            className={cn(
              "absolute left-1 right-1 overflow-hidden rounded-lg px-2 py-1.5 text-[11px]",
              SOURCE_BADGE[ev.source],
            )}
            style={{ top, height }}
            title={`${ev.title} · ${format(new Date(ev.startTime), "HH:mm")}–${format(new Date(ev.endTime), "HH:mm")}`}
          >
            <div className="font-mono text-[10px] tabular-nums opacity-80">
              {format(new Date(ev.startTime), "HH:mm")}
            </div>
            <div className="truncate font-medium">{ev.title}</div>
            {ev.subtitle && (
              <div className="truncate text-[10px] opacity-75">{ev.subtitle}</div>
            )}
            <div className="mt-1 inline-block rounded-full bg-black/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
              {SOURCE_LABELS[ev.source]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
