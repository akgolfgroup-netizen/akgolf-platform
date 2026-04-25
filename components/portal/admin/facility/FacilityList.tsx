"use client";

import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  SOURCE_BADGE,
  SOURCE_LABELS,
  type OverviewResponse,
} from "./types";

interface FacilityListProps {
  date: Date;
  onAddActivity: () => void;
}

export function FacilityList({ date, onAddActivity }: FacilityListProps) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
  const totalEvents = facilities.reduce((acc, f) => acc + f.events.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold capitalize text-on-surface">
            {format(date, "EEEE d. MMMM yyyy", { locale: nb })}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {totalEvents} bookinger fordelt på {facilities.length} fasiliteter
          </p>
        </div>
        <button
          onClick={onAddActivity}
          className="inline-flex items-center gap-2 rounded-full bg-on-surface px-4 py-2 text-sm font-medium text-surface hover:bg-inverse-surface"
        >
          <Icon name="add" size={16} />
          Ny aktivitet
        </button>
      </div>

      {loading && !data && (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-12 text-center text-sm text-on-surface-variant">
          <Icon name="progress_activity" size={20} className="mx-auto mb-2 animate-spin" />
          Henter bookinger…
        </div>
      )}

      {data && facilities.length === 0 && (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-12 text-center">
          <Icon name="event_busy" size={28} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-on-surface">Ingen fasiliteter</p>
        </div>
      )}

      <div className="space-y-3">
        {facilities.map((facility) => {
          const isEmpty = facility.events.length === 0;
          return (
            <div
              key={facility.id}
              className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-3">
                <div className="flex items-center gap-3">
                  <Icon name="place" size={18} className="text-on-surface-variant" />
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{facility.name}</div>
                    {facility.description && (
                      <div className="text-xs text-on-surface-variant">{facility.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="rounded-full bg-surface px-2 py-0.5 font-mono tabular-nums">
                    {facility.events.length}
                    {facility.capacity ? ` / ${facility.capacity}` : ""}
                  </span>
                </div>
              </div>

              {isEmpty ? (
                <div className="px-5 py-6 text-center text-xs text-on-surface-variant">
                  Ingen bookinger denne dagen
                </div>
              ) : (
                <ul className="divide-y divide-outline-variant/20">
                  {facility.events.map((ev) => (
                    <li
                      key={ev.id}
                      className="flex items-center gap-4 px-5 py-3 text-sm hover:bg-surface-variant/40"
                    >
                      <span className="w-24 shrink-0 font-mono text-xs tabular-nums text-on-surface">
                        {format(new Date(ev.startTime), "HH:mm")}
                        <span className="text-on-surface-variant">
                          {" – "}
                          {format(new Date(ev.endTime), "HH:mm")}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-on-surface">{ev.title}</div>
                        {ev.subtitle && (
                          <div className="truncate text-xs text-on-surface-variant">
                            {ev.subtitle}
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                          SOURCE_BADGE[ev.source],
                        )}
                      >
                        {SOURCE_LABELS[ev.source]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
