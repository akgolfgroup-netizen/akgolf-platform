"use client";

import { format, parseISO, isBefore } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, MapPin, Globe } from "lucide-react";
import type { TourScheduleEvent } from "@/lib/portal/datagolf/client";
import { cardStyle, accent, accentSoft } from "./styles";

interface Props {
  pgaSchedule: TourScheduleEvent[];
  euroSchedule: TourScheduleEvent[];
  proTour: "pga" | "euro";
  setProTour: (t: "pga" | "euro") => void;
}

export function ExploreProTour({ pgaSchedule, euroSchedule, proTour, setProTour }: Props) {
  const schedule = proTour === "pga" ? pgaSchedule : euroSchedule;

  return (
    <div className="space-y-4">
      <div
        className="inline-flex w-fit gap-1 rounded-xl border p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {(["pga", "euro"] as const).map((tour) => {
          const active = tour === proTour;
          return (
            <button
              key={tour}
              type="button"
              onClick={() => setProTour(tour)}
              className="rounded-lg px-4 py-2 text-[12.5px] font-semibold transition-colors"
              style={{
                background: active ? accentSoft : "transparent",
                color: active ? accent : "rgba(255,255,255,0.6)",
              }}
            >
              {tour === "pga" ? "PGA Tour" : "DP World Tour"}
            </button>
          );
        })}
      </div>

      {schedule.length === 0 ? (
        <div
          style={cardStyle}
          className="flex flex-col items-center justify-center px-6 py-16 text-center"
        >
          <p className="max-w-md text-sm text-white/65">
            Ingen kommende turneringer funnet for denne touren.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {schedule.map((e) => (
            <ProEventCard key={e.event_id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProEventCard({ event }: { event: TourScheduleEvent }) {
  const startDate = event.start_date ? parseISO(event.start_date) : null;
  const endDate = event.end_date ? parseISO(event.end_date) : null;
  const isPast = startDate ? isBefore(startDate, new Date()) : false;
  return (
    <div
      style={cardStyle}
      className="px-5 py-4 text-white"
      data-past={isPast || undefined}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <Globe className="h-3 w-3" />
          Pro Tour
        </span>
        {event.winner_name ? (
          <span className="text-[10px] text-white/50">Vinner: {event.winner_name}</span>
        ) : null}
      </div>
      <h3 className="text-sm font-semibold text-white">{event.event_name}</h3>
      <div className="mt-2 flex flex-col gap-1 text-[12px] text-white/60">
        {startDate ? (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {format(startDate, "d. MMM yyyy", { locale: nb })}
            {endDate ? ` – ${format(endDate, "d. MMM", { locale: nb })}` : ""}
          </span>
        ) : null}
        {(event.course || event.location) && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {[event.course, event.location].filter(Boolean).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}
