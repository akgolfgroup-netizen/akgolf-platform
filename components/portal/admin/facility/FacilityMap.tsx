"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  GFGK_MAP_ZONES,
  ZONE_COLORS,
  classifyLoad,
  type FacilityWithEvents,
  type MapZone,
  type OverviewResponse,
} from "./types";

interface ZoneStats {
  zone: MapZone;
  events: number;
  capacity: number | null;
  facilities: FacilityWithEvents[];
}

interface FacilityMapProps {
  date: Date;
  onAddActivity: (facilityId: string) => void;
}

export function FacilityMap({ date, onAddActivity }: FacilityMapProps) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  useEffect(() => {
    const from = new Date(date);
    from.setHours(0, 0, 0, 0);
    const to = new Date(date);
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

  const zoneStats = useMemo<ZoneStats[]>(() => {
    if (!data) return [];
    return GFGK_MAP_ZONES.map((zone) => {
      const facilities = data.facilities.filter((f) =>
        zone.facilitySlugs.some((slug) => f.name.toLowerCase().includes(slug.split("-")[0])),
      );
      const events = facilities.reduce((acc, f) => acc + f.events.length, 0);
      const capacity = facilities.reduce<number | null>((acc, f) => {
        if (f.capacity == null) return acc;
        return (acc ?? 0) + f.capacity;
      }, null);
      return { zone, events, capacity, facilities };
    });
  }, [data]);

  const active = zoneStats.find((z) => z.zone.id === activeZone);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-on-surface">
      <div className="relative aspect-[1300/1480] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/admin/gfgk-aerial.jpg)" }}
          aria-label="Flyfoto av Gamle Fredrikstad Golfklubb"
        />
        <div className="absolute inset-0 bg-on-surface/15" />

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {zoneStats.map(({ zone, events, capacity }) => {
            const load = classifyLoad(events, capacity);
            const color = ZONE_COLORS[load];
            const isActive = zone.id === activeZone;
            return (
              <polygon
                key={zone.id}
                points={zone.points}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={isActive ? 0.6 : 0.3}
                style={{
                  cursor: "pointer",
                  filter: isActive ? `drop-shadow(0 0 6px ${color.ring})` : undefined,
                  transition: "filter 0.2s, stroke-width 0.2s",
                }}
                onClick={() => setActiveZone(zone.id)}
              />
            );
          })}
        </svg>

        {/* Sone-etiketter */}
        <div className="pointer-events-none absolute inset-0">
          {zoneStats.map(({ zone, events, capacity }) => {
            const load = classifyLoad(events, capacity);
            const center = polygonCenter(zone.points);
            return (
              <div
                key={zone.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${center.x}%`, top: `${center.y}%` }}
              >
                <div className="flex flex-col items-center gap-1 rounded-full bg-on-surface/85 px-3 py-1 backdrop-blur-md">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-surface">
                    {zone.label}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono tabular-nums",
                      load === "free" && "text-secondary-fixed",
                      load === "busy" && "text-[#f4c772]",
                      load === "full" && "text-[#ff8a80]",
                    )}
                  >
                    {events} {capacity ? `/ ${capacity}` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-on-surface/80 px-3 py-1.5 text-xs text-surface backdrop-blur-md">
            <Icon name="progress_activity" size={14} className="animate-spin" />
            Henter belegg…
          </div>
        )}

        {/* Legende */}
        <div className="absolute left-4 top-4 flex flex-col gap-1 rounded-xl bg-on-surface/80 px-3 py-2 text-[11px] text-surface backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary-fixed" /> Ledig
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f4c772]" /> Nesten fullt
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff8a80]" /> Fullt
          </div>
        </div>

        {/* Detaljpanel */}
        {active && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-on-surface/85 p-5 text-surface shadow-card backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-surface/60">
                  {format(date, "EEEE d. MMMM", { locale: nb })}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{active.zone.label}</h3>
                <p className="mt-1 text-sm text-surface/75">
                  {active.events} bookinger
                  {active.capacity != null && ` av ${active.capacity} plasser`}
                </p>
              </div>
              <button
                onClick={() => setActiveZone(null)}
                className="rounded-full p-1 text-surface/70 hover:bg-surface/10 hover:text-surface"
                aria-label="Lukk"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {active.facilities.length === 0 ? (
                <p className="text-sm text-surface/60">Ingen registrerte bookinger.</p>
              ) : (
                active.facilities.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-white/10 bg-surface/5 p-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{f.name}</span>
                      <span className="font-mono text-xs text-surface/70">
                        {f.events.length}
                        {f.capacity ? ` / ${f.capacity}` : ""}
                      </span>
                    </div>
                    {f.events.slice(0, 2).map((e) => (
                      <div key={e.id} className="mt-1 truncate text-xs text-surface/70">
                        {format(new Date(e.startTime), "HH:mm")} · {e.title}
                      </div>
                    ))}
                    {f.events.length > 2 && (
                      <div className="mt-1 text-xs text-surface/50">
                        + {f.events.length - 2} til
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onAddActivity(active.facilities[0]?.id ?? "")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-fixed px-4 py-2 text-sm font-semibold text-on-secondary-fixed hover:brightness-95"
            >
              <Icon name="add" size={16} />
              Book nå
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function polygonCenter(points: string): { x: number; y: number } {
  const pts = points
    .trim()
    .split(/\s+/)
    .map((p) => p.split(",").map(Number));
  const n = pts.length || 1;
  const sum = pts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
  return { x: sum[0] / n, y: sum[1] / n };
}
