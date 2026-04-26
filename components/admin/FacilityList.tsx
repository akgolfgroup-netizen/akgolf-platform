"use client";

import { useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import {
  FACILITIES,
  type FacilityBookingDTO,
  type FacilityName,
} from "@/app/admin/(authed)/fasiliteter/constants";

interface FacilityListProps {
  bookings: FacilityBookingDTO[];
  onDelete?: (id: string) => void;
}

const TYPE_BADGES: Record<string, { label: string; cls: string }> = {
  Trening: {
    label: "Trening",
    cls: "bg-primary-container text-on-primary-container",
  },
  Coaching: {
    label: "Coaching",
    cls: "bg-secondary-fixed text-secondary-fixed-text",
  },
  Turnering: {
    label: "Turnering",
    cls: "bg-tertiary-container text-on-tertiary-container",
  },
  Event: {
    label: "Event",
    cls: "bg-surface-container-high text-on-surface",
  },
  Vedlikehold: {
    label: "Vedlikehold",
    cls: "bg-error-container text-on-surface",
  },
};

export function FacilityList({ bookings, onDelete }: FacilityListProps) {
  const grouped = useMemo(() => {
    const map: Record<string, FacilityBookingDTO[]> = {};
    for (const f of FACILITIES) map[f] = [];
    for (const b of bookings) {
      if (!map[b.facility]) map[b.facility] = [];
      map[b.facility].push(b);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
    }
    return map;
  }, [bookings]);

  return (
    <div className="space-y-6">
      {FACILITIES.map((facility) => {
        const items = grouped[facility] ?? [];
        return (
          <section
            key={facility}
            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5"
          >
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/80">
                  Fasilitet
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-on-surface">
                  {facility}
                </h3>
              </div>
              <span className="rounded-full bg-surface-container px-3 py-1 font-mono text-xs text-on-surface-variant">
                {items.length} bookinger
              </span>
            </header>

            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low px-4 py-6 text-center text-sm text-on-surface-variant">
                Ingen bookinger denne uken.
              </p>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {items.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    facility={facility}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function BookingRow({
  booking,
  facility,
  onDelete,
}: {
  booking: FacilityBookingDTO;
  facility: FacilityName;
  onDelete?: (id: string) => void;
}) {
  const badge = TYPE_BADGES[booking.type] ?? {
    label: booking.type,
    cls: "bg-surface-container text-on-surface",
  };
  const date = new Date(booking.date);
  const dateLabel = new Intl.DateTimeFormat("nb-NO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <Icon name="event" size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-on-surface">{booking.person}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            {dateLabel} · {booking.startTime}–{booking.endTime} · {facility}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${badge.cls}`}
        >
          {badge.label}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-error"
            aria-label="Slett booking"
          >
            <Icon name="delete" size={16} />
          </button>
        )}
      </div>
    </li>
  );
}
