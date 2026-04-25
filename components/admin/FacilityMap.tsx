"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  FACILITIES,
  FACILITY_CAPACITY,
  type FacilityBookingDTO,
  type FacilityName,
} from "@/app/admin/(authed)/fasiliteter/actions";

const STATUS_COLORS = {
  free: "#2A7D5A",
  busy: "#C48A32",
  full: "#B84233",
} as const;

type ZoneStatus = keyof typeof STATUS_COLORS;

interface Zone {
  name: FacilityName;
  points: string;
  labelX: number;
  labelY: number;
  icon: string;
}

const ZONES: Zone[] = [
  {
    name: "Driving Range",
    points: "8,38 52,30 56,58 12,66",
    labelX: 30,
    labelY: 49,
    icon: "sports_golf",
  },
  {
    name: "Putting Green",
    points: "62,28 78,26 82,40 64,42",
    labelX: 72,
    labelY: 34,
    icon: "golf_course",
  },
  {
    name: "Short Game Area",
    points: "60,46 84,44 88,60 62,62",
    labelX: 74,
    labelY: 53,
    icon: "flag",
  },
  {
    name: "Klubbhus",
    points: "70,68 88,66 90,82 72,84",
    labelX: 80,
    labelY: 75,
    icon: "home",
  },
  {
    name: "Korthullsbane",
    points: "10,72 56,68 60,90 14,92",
    labelX: 33,
    labelY: 81,
    icon: "park",
  },
];

interface FacilityMapProps {
  bookings: FacilityBookingDTO[];
  onAddBooking: (facility: FacilityName) => void;
  selectedDate: string;
}

function statusFromLoad(load: number, capacity: number): ZoneStatus {
  const ratio = load / capacity;
  if (ratio >= 1) return "full";
  if (ratio >= 0.7) return "busy";
  return "free";
}

export function FacilityMap({ bookings, onAddBooking, selectedDate }: FacilityMapProps) {
  const [selected, setSelected] = useState<FacilityName | null>(null);

  const loadByFacility = useMemo(() => {
    const map: Record<string, FacilityBookingDTO[]> = {};
    for (const f of FACILITIES) map[f] = [];
    for (const b of bookings) {
      if (b.date.startsWith(selectedDate) && map[b.facility]) {
        map[b.facility].push(b);
      }
    }
    return map;
  }, [bookings, selectedDate]);

  const selectedZone = ZONES.find((z) => z.name === selected);
  const selectedBookings = selected ? loadByFacility[selected] ?? [] : [];
  const selectedCapacity = selected ? FACILITY_CAPACITY[selected] : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-on-surface shadow-card-hover">
      <div className="relative aspect-[16/10] w-full">
        <picture>
          <source srcSet="/admin/gfgk-aerial.jpg" type="image/jpeg" />
          <img
            src="/admin/gfgk-aerial-placeholder.svg"
            alt="GFGK flyfoto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-on-surface/10 via-transparent to-on-surface/40" />

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {ZONES.map((zone) => {
            const load = loadByFacility[zone.name]?.length ?? 0;
            const capacity = FACILITY_CAPACITY[zone.name];
            const status = statusFromLoad(load, capacity);
            const fill = STATUS_COLORS[status];
            const isActive = selected === zone.name;
            return (
              <g
                key={zone.name}
                className="cursor-pointer transition-opacity"
                onClick={() => setSelected(zone.name)}
              >
                <polygon
                  points={zone.points}
                  fill={fill}
                  fillOpacity={isActive ? 0.7 : 0.42}
                  stroke={fill}
                  strokeWidth={isActive ? 0.6 : 0.3}
                  strokeLinejoin="round"
                />
                <text
                  x={zone.labelX}
                  y={zone.labelY}
                  textAnchor="middle"
                  className="pointer-events-none fill-surface font-headline"
                  fontSize="2.2"
                  fontWeight="600"
                  style={{ paintOrder: "stroke", stroke: "rgba(28,28,22,0.6)", strokeWidth: 0.4 }}
                >
                  {zone.name}
                </text>
                <text
                  x={zone.labelX}
                  y={zone.labelY + 3}
                  textAnchor="middle"
                  className="pointer-events-none fill-surface font-mono"
                  fontSize="1.7"
                  style={{ paintOrder: "stroke", stroke: "rgba(28,28,22,0.6)", strokeWidth: 0.3 }}
                >
                  {load}/{capacity}
                </text>
              </g>
            );
          })}
        </svg>

        <Legend />
      </div>

      {selected && selectedZone && (
        <button
          type="button"
          aria-label="Lukk panel"
          className="absolute inset-0 cursor-default bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        />
      )}

      {selected && selectedZone && (
        <div
          className="absolute right-6 top-6 z-10 w-full max-w-sm rounded-2xl border border-outline-variant/20 bg-on-surface/85 p-5 text-surface shadow-card-hover backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={`Detaljer for ${selected}`}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-surface/60">
                Fasilitet
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{selected}</h3>
              <p className="mt-1 text-xs text-surface/70">
                {selectedBookings.length} bookinger · kapasitet {selectedCapacity}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full p-1 text-surface/70 hover:bg-surface/10 hover:text-surface"
              aria-label="Lukk"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="mb-4 max-h-56 space-y-2 overflow-y-auto pr-1">
            {selectedBookings.length === 0 && (
              <p className="rounded-xl bg-surface/5 px-3 py-3 text-xs text-surface/60">
                Ingen bookinger på {formatDate(selectedDate)}.
              </p>
            )}
            {selectedBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl bg-surface/8 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{b.person}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-surface/60">
                    {b.startTime}–{b.endTime} · {b.type}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const facility = selected;
              setSelected(null);
              onAddBooking(facility);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary-fixed px-4 py-2.5 text-sm font-semibold text-secondary-fixed-text hover:brightness-95"
          >
            <Icon name="add" size={18} />
            Book nå
          </button>
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-3 rounded-full bg-on-surface/70 px-4 py-2 text-xs text-surface backdrop-blur-md">
      {(
        [
          { label: "Ledig", color: STATUS_COLORS.free },
          { label: "Nesten fullt", color: STATUS_COLORS.busy },
          { label: "Fullt", color: STATUS_COLORS.full },
        ] as const
      ).map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("nb-NO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}
