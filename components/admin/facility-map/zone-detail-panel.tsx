"use client";

import { Icon } from "@/components/ui/icon";
import type {
  FacilityBookingDTO,
  FacilityName,
  LiveStatus,
} from "@/app/admin/(authed)/fasiliteter/constants";

interface Props {
  name: FacilityName;
  bookings: FacilityBookingDTO[];
  capacity: number;
  live: LiveStatus | null;
  selectedDate: string;
  onClose: () => void;
  onAdd: () => void;
}

export function ZoneDetailPanel({
  name,
  bookings,
  capacity,
  live,
  selectedDate,
  onClose,
  onAdd,
}: Props) {
  return (
    <div
      className="absolute right-6 top-6 z-10 w-full max-w-sm rounded-2xl border border-outline-variant/20 bg-on-surface/85 p-5 text-surface shadow-card-hover backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={`Detaljer for ${name}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-surface/60">
            Fasilitet
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 text-xs text-surface/70">
            {bookings.length} bookinger · kapasitet {capacity}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-surface/70 hover:bg-surface/10 hover:text-surface"
          aria-label="Lukk"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      {live && (live.activeNow > 0 || live.nextStart) && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-secondary-fixed/15 px-3 py-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                live.activeNow > 0 ? "animate-ping bg-secondary-fixed" : "bg-surface/40"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                live.activeNow > 0 ? "bg-secondary-fixed" : "bg-surface/50"
              }`}
            />
          </span>
          <span className="font-mono uppercase tracking-wider text-surface/80">
            {live.activeNow > 0
              ? `${live.activeNow} aktiv${live.activeNow === 1 ? "" : "e"} nå`
              : `Neste: ${live.nextStart} · ${live.nextPerson}`}
          </span>
        </div>
      )}

      <div className="mb-4 max-h-56 space-y-2 overflow-y-auto pr-1">
        {bookings.length === 0 && (
          <p className="rounded-xl bg-surface/5 px-3 py-3 text-xs text-surface/60">
            Ingen bookinger på {formatDate(selectedDate)}.
          </p>
        )}
        {bookings.map((b) => (
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
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary-fixed px-4 py-2.5 text-sm font-semibold text-secondary-fixed-text hover:brightness-95"
      >
        <Icon name="add" size={18} />
        Book nå
      </button>
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
