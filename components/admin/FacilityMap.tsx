"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FACILITIES,
  FACILITY_CAPACITY,
  ON_MAP_FACILITIES,
  getLiveStatus,
  type FacilityBookingDTO,
  type FacilityName,
  type LiveStatus,
} from "@/app/admin/(authed)/fasiliteter/actions";
import { ZoneDetailPanel } from "./facility-map/zone-detail-panel";
import { OffMapStrip } from "./facility-map/off-map-strip";

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
}

// Koordinater (viewBox 0-100) for GFGK-treningsområdet
const ZONES: Zone[] = [
  { name: "Putting Green", points: "8,20 42,18 46,52 10,55", labelX: 27, labelY: 36 },
  { name: "Short Game Area", points: "20,62 56,60 58,88 22,90", labelX: 39, labelY: 75 },
  { name: "Driving Range", points: "60,8 92,10 94,64 62,65", labelX: 77, labelY: 35 },
  { name: "Performance Studio", points: "62,68 92,68 92,90 64,90", labelX: 77, labelY: 79 },
];

interface FacilityMapProps {
  bookings: FacilityBookingDTO[];
  onAddBooking: (facility: FacilityName) => void;
  selectedDate: string;
  initialLive: LiveStatus[];
}

function statusFromLoad(load: number, capacity: number): ZoneStatus {
  const ratio = load / capacity;
  if (ratio >= 1) return "full";
  if (ratio >= 0.7) return "busy";
  return "free";
}

export function FacilityMap({
  bookings,
  onAddBooking,
  selectedDate,
  initialLive,
}: FacilityMapProps) {
  const [selected, setSelected] = useState<FacilityName | null>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus[]>(initialLive);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const next = await getLiveStatus();
        setLiveStatus(next);
      } catch {
        // ignorer feil — neste tick prøver igjen
      }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const liveByFacility = useMemo(() => {
    const map: Record<string, LiveStatus> = {};
    for (const s of liveStatus) map[s.facility] = s;
    return map;
  }, [liveStatus]);

  const dayByFacility = useMemo(() => {
    const map: Record<string, FacilityBookingDTO[]> = {};
    for (const f of FACILITIES) map[f] = [];
    for (const b of bookings) {
      if (b.date.startsWith(selectedDate) && map[b.facility]) {
        map[b.facility].push(b);
      }
    }
    return map;
  }, [bookings, selectedDate]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-on-surface shadow-card-hover">
        <div className="relative aspect-[16/10] w-full">
          <picture>
            <source srcSet="/admin/gfgk-aerial.jpg" type="image/jpeg" />
            <img
              src="/admin/gfgk-aerial-placeholder.svg"
              alt="GFGK treningsområde flyfoto"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-on-surface/10 via-transparent to-on-surface/40" />

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {ZONES.map((zone) => (
              <ZonePolygon
                key={zone.name}
                zone={zone}
                day={dayByFacility[zone.name] ?? []}
                live={liveByFacility[zone.name]}
                isActive={selected === zone.name}
                onClick={() => setSelected(zone.name)}
              />
            ))}
          </svg>

          <Legend />
        </div>

        {selected && (
          <button
            type="button"
            aria-label="Lukk panel"
            className="absolute inset-0 cursor-default bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
        )}

        {selected && (
          <ZoneDetailPanel
            name={selected}
            bookings={dayByFacility[selected] ?? []}
            capacity={FACILITY_CAPACITY[selected]}
            live={liveByFacility[selected] ?? null}
            selectedDate={selectedDate}
            onClose={() => setSelected(null)}
            onAdd={() => {
              const f = selected;
              setSelected(null);
              onAddBooking(f);
            }}
          />
        )}
      </div>

      <OffMapStrip
        facilities={FACILITIES.filter((f) => !ON_MAP_FACILITIES.includes(f))}
        liveByFacility={liveByFacility}
        dayByFacility={dayByFacility}
        onSelect={setSelected}
      />
    </div>
  );
}

function ZonePolygon({
  zone,
  day,
  live,
  isActive,
  onClick,
}: {
  zone: Zone;
  day: FacilityBookingDTO[];
  live: LiveStatus | undefined;
  isActive: boolean;
  onClick: () => void;
}) {
  const capacity = FACILITY_CAPACITY[zone.name];
  const status = statusFromLoad(day.length, capacity);
  const isLive = (live?.activeNow ?? 0) > 0;
  const fill = STATUS_COLORS[status];
  const textStyle = {
    paintOrder: "stroke" as const,
    stroke: "rgba(28,28,22,0.6)",
    strokeWidth: 0.4,
  };

  return (
    <g className="cursor-pointer" onClick={onClick}>
      <polygon
        points={zone.points}
        fill={fill}
        fillOpacity={isActive ? 0.7 : 0.42}
        stroke={isLive ? "#d2f000" : fill}
        strokeWidth={isLive ? 0.7 : isActive ? 0.6 : 0.3}
        strokeLinejoin="round"
      >
        {isLive && (
          <animate
            attributeName="stroke-opacity"
            values="1;0.4;1"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </polygon>
      <text
        x={zone.labelX}
        y={zone.labelY}
        textAnchor="middle"
        className="pointer-events-none fill-surface font-headline"
        fontSize="2.2"
        fontWeight="600"
        style={textStyle}
      >
        {zone.name}
      </text>
      <text
        x={zone.labelX}
        y={zone.labelY + 3}
        textAnchor="middle"
        className="pointer-events-none fill-surface font-mono"
        fontSize="1.7"
        style={{ ...textStyle, strokeWidth: 0.3 }}
      >
        {day.length}/{capacity}
      </text>
      {isLive && (
        <g transform={`translate(${zone.labelX + 6}, ${zone.labelY - 5})`}>
          <rect x={-4} y={-2} width={8} height={3} rx={1.5} fill="#d2f000" />
          <text
            x={0}
            y={0.4}
            textAnchor="middle"
            fontSize="1.5"
            fontWeight="700"
            fill="#191e00"
            className="font-mono"
          >
            LIVE {live?.activeNow}
          </text>
        </g>
      )}
    </g>
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
      <span className="flex items-center gap-1.5 border-l border-surface/30 pl-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-fixed/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-fixed" />
        </span>
        Live nå
      </span>
    </div>
  );
}
