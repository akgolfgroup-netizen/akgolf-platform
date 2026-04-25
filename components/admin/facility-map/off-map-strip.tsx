"use client";

import { Icon } from "@/components/ui/icon";
import {
  FACILITY_CAPACITY,
  type FacilityBookingDTO,
  type FacilityName,
  type LiveStatus,
} from "@/app/admin/(authed)/fasiliteter/actions";

interface Props {
  facilities: FacilityName[];
  liveByFacility: Record<string, LiveStatus>;
  dayByFacility: Record<string, FacilityBookingDTO[]>;
  onSelect: (f: FacilityName) => void;
}

export function OffMapStrip({
  facilities,
  liveByFacility,
  dayByFacility,
  onSelect,
}: Props) {
  if (facilities.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/80">
        Andre fasiliteter
      </span>
      {facilities.map((f) => {
        const live = liveByFacility[f];
        const isLive = (live?.activeNow ?? 0) > 0;
        const day = dayByFacility[f] ?? [];
        return (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm font-medium text-on-surface hover:border-primary"
          >
            <Icon name="park" size={14} />
            {f}
            <span className="font-mono text-[10px] text-on-surface-variant">
              {day.length}/{FACILITY_CAPACITY[f]}
            </span>
            {isLive && (
              <span className="flex items-center gap-1 rounded-full bg-secondary-fixed px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-secondary-fixed-text">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-fixed-text/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary-fixed-text" />
                </span>
                Live {live?.activeNow}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
