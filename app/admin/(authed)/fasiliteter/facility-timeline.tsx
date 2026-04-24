"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/portal/patterns";

type ViewMode = "day" | "week" | "month";

interface FacilityEvent {
  id: string;
  source: "BOOKING" | "ACTIVITY" | "TRAINING_PLAN";
  facilityId: string;
  title: string;
  subtitle: string | null;
  startTime: string;
  endTime: string;
  color: string | null;
  status: string | null;
}

interface FacilityWithEvents {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  sortOrder: number;
  events: FacilityEvent[];
}

interface OverviewResponse {
  from: string;
  to: string;
  facilities: FacilityWithEvents[];
}

const SOURCE_COLORS: Record<FacilityEvent["source"], string> = {
  BOOKING: "bg-success-text text-surface",
  ACTIVITY: "bg-warning text-surface",
  TRAINING_PLAN: "bg-on-surface text-surface",
};

const SOURCE_LABELS: Record<FacilityEvent["source"], string> = {
  BOOKING: "Booking",
  ACTIVITY: "Aktivitet",
  TRAINING_PLAN: "Gruppeplan",
};

export default function FacilityTimeline() {
  const [view, setView] = useState<ViewMode>("day");
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [from, to] = useMemo(() => {
    if (view === "day") return [startOfDay(anchorDate), endOfDay(anchorDate)];
    if (view === "week")
      return [
        startOfWeek(anchorDate, { weekStartsOn: 1 }),
        endOfWeek(anchorDate, { weekStartsOn: 1 }),
      ];
    return [startOfMonth(anchorDate), endOfMonth(anchorDate)];
  }, [view, anchorDate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      });
      const res = await fetch(`/api/portal/admin/facility-overview?${params}`);
      if (res.ok) {
        setData((await res.json()) as OverviewResponse);
      }
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sanntids-refresh hvert 60 sek for dagsvisning
  useEffect(() => {
    if (view !== "day") return;
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, [view, fetchData]);

  const navigate = (direction: -1 | 1) => {
    if (view === "day") setAnchorDate(direction === -1 ? subDays(anchorDate, 1) : addDays(anchorDate, 1));
    else if (view === "week")
      setAnchorDate(direction === -1 ? subWeeks(anchorDate, 1) : addWeeks(anchorDate, 1));
    else setAnchorDate(direction === -1 ? subMonths(anchorDate, 1) : addMonths(anchorDate, 1));
  };

  const headerLabel = useMemo(() => {
    if (view === "day") return format(anchorDate, "EEEE d. MMMM yyyy", { locale: nb });
    if (view === "week")
      return `Uke ${format(anchorDate, "w")} · ${format(from, "d. MMM", { locale: nb })} – ${format(to, "d. MMM yyyy", { locale: nb })}`;
    return format(anchorDate, "MMMM yyyy", { locale: nb });
  }, [view, anchorDate, from, to]);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <MonoLabel size="xs" uppercase className="text-outline block">
            Tidslinje
          </MonoLabel>
          <h3 className="text-sm font-semibold text-on-surface">{headerLabel}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-surface border border-outline-variant/30 overflow-hidden">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  view === v
                    ? "bg-on-surface text-surface"
                    : "text-on-surface-variant hover:bg-surface-variant"
                )}
              >
                {v === "day" ? "Dag" : v === "week" ? "Uke" : "Måned"}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant"
            aria-label="Forrige"
          >
            <Icon name="chevron_left" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAnchorDate(new Date())}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant"
          >
            I dag
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant"
            aria-label="Neste"
          >
            <Icon name="chevron_right" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && !data && (
        <div className="py-10 text-center text-sm text-on-surface-variant">
          <Icon name="progress_activity" className="w-4 h-4 animate-spin inline mr-2" />
          Henter oversikt…
        </div>
      )}

      {data && (
        <div className="divide-y divide-outline-variant/30">
          {data.facilities.map((f) => (
            <FacilityRow key={f.id} facility={f} view={view} from={from} to={to} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FacilityRowProps {
  facility: FacilityWithEvents;
  view: ViewMode;
  from: Date;
  to: Date;
}

function FacilityRow({ facility, view, from, to }: FacilityRowProps) {
  // Sanntidstatus for "nå"
  const now = new Date();
  const current = facility.events.find(
    (e) => new Date(e.startTime) <= now && new Date(e.endTime) > now
  );

  return (
    <div className="p-4">
      <div className="flex items-start gap-4">
        <div className="w-48 shrink-0">
          <div className="text-sm font-semibold text-on-surface">{facility.name}</div>
          {facility.capacity && (
            <div className="text-xs text-on-surface-variant">Kapasitet {facility.capacity}</div>
          )}
          {current && (
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-text/10 text-success-text text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success-text animate-pulse" />
              Aktiv nå
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {facility.events.length === 0 ? (
            <div className="text-xs text-on-surface-variant py-2">Ingen aktivitet</div>
          ) : view === "day" ? (
            <DayTimeline events={facility.events} from={from} to={to} />
          ) : (
            <EventList events={facility.events} />
          )}
        </div>
      </div>
    </div>
  );
}

function DayTimeline({ events, from, to }: { events: FacilityEvent[]; from: Date; to: Date }) {
  const totalMs = to.getTime() - from.getTime();
  const hours = Array.from({ length: 14 }, (_, i) => 6 + i); // 06 - 19
  return (
    <div className="relative">
      <div className="grid grid-cols-14 text-[10px] text-on-surface-variant mb-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
        {hours.map((h) => (
          <div key={h} className="tabular-nums">{h.toString().padStart(2, "0")}</div>
        ))}
      </div>
      <div className="relative h-10 bg-surface rounded-lg border border-outline-variant/30 overflow-hidden">
        {events.map((ev) => {
          const s = new Date(ev.startTime).getTime();
          const e = new Date(ev.endTime).getTime();
          const left = Math.max(0, ((s - from.getTime()) / totalMs) * 100);
          const width = Math.max(1, ((e - s) / totalMs) * 100);
          return (
            <div
              key={ev.id}
              className={cn(
                "absolute top-1 bottom-1 rounded px-1.5 text-[10px] font-medium flex items-center truncate",
                SOURCE_COLORS[ev.source]
              )}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${ev.title} · ${format(new Date(ev.startTime), "HH:mm")}-${format(new Date(ev.endTime), "HH:mm")}`}
            >
              {ev.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventList({ events }: { events: FacilityEvent[] }) {
  return (
    <div className="space-y-1.5">
      {events.map((ev) => (
        <div key={ev.id} className="flex items-center gap-3 text-sm">
          <span className="w-28 tabular-nums text-xs text-on-surface-variant">
            {format(new Date(ev.startTime), "EEE d. MMM HH:mm", { locale: nb })}
          </span>
          <span className="flex-1 truncate text-on-surface">{ev.title}</span>
          {ev.subtitle && (
            <span className="text-xs text-on-surface-variant hidden md:inline">{ev.subtitle}</span>
          )}
          <span
            className={cn(
              "px-2 py-0.5 text-[10px] font-medium rounded-full",
              SOURCE_COLORS[ev.source]
            )}
          >
            {SOURCE_LABELS[ev.source]}
          </span>
        </div>
      ))}
    </div>
  );
}
