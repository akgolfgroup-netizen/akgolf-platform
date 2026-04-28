"use client";

import { addDays, format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarBooking } from "@/app/admin/(authed)/kalender/actions";
import { COACH_COLORS, type CoachKey } from "@/app/admin/(authed)/kalender/kalender-week-data";

const HOUR_HEIGHT = 60;
const FIRST_HOUR = 9;
const LAST_HOUR = 18;

type Props = {
  weekStart: Date;
  bookings: CalendarBooking[];
  coachMap: Map<string, CoachKey>;
  now: Date;
};

export function KalenderWeekGrid({ weekStart, bookings, coachMap, now }: Props) {
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }).map(
    (_, i) => FIRST_HOUR + i,
  );

  const dayCounts = days.map((d) =>
    bookings.filter((b) => isSameDay(b.startTime, d)).length,
  );

  return (
    <div
      className="overflow-hidden rounded-[14px] border bg-white/[0.04]"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        display: "grid",
        gridTemplateColumns: "60px repeat(7, 1fr)",
      }}
    >
      {/* Header row */}
      <div
        className="border-b border-r border-white/8 bg-white/[0.025]"
        style={{ borderRightColor: "rgba(255,255,255,0.10)", borderBottomColor: "rgba(255,255,255,0.10)" }}
      />
      {days.map((d, i) => {
        const today = isSameDay(d, now);
        return (
          <div
            key={d.toISOString()}
            className="border-b border-r border-white/8 bg-white/[0.025] px-2 py-3 last:border-r-0"
            style={{
              borderRightColor: "rgba(255,255,255,0.10)",
              borderBottomColor: "rgba(255,255,255,0.10)",
            }}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {format(d, "EEE", { locale: nb })} {today && "· I DAG"}
            </div>
            <div
              className="mt-0.5 text-[20px] font-bold tracking-tight"
              style={{ color: today ? "#D1F843" : "#fff" }}
            >
              {format(d, "dd")}
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-white/50">
              {dayCounts[i]} økter
            </div>
          </div>
        );
      })}

      {/* Time rows */}
      {hours.map((h) => (
        <div key={`row-${h}`} className="contents">
          <div
            className="border-r border-t px-2 py-2 text-right font-mono text-[10px] tracking-wider text-white/45"
            style={{
              borderRightColor: "rgba(255,255,255,0.10)",
              borderTopColor: "rgba(255,255,255,0.04)",
              height: HOUR_HEIGHT,
            }}
          >
            {String(h).padStart(2, "0")}:00
          </div>
          {days.map((d) => {
            const isNow = isSameDay(d, now) && now.getHours() === h;
            const cellBookings = bookings.filter((b) => {
              if (!isSameDay(b.startTime, d)) return false;
              return b.startTime.getHours() === h;
            });
            return (
              <div
                key={`cell-${d.toISOString()}-${h}`}
                className="relative border-r border-t border-white/8 transition last:border-r-0"
                style={{
                  height: HOUR_HEIGHT,
                  borderRightColor: "rgba(255,255,255,0.10)",
                  borderTopColor: "rgba(255,255,255,0.04)",
                  background: isNow ? "rgba(209,248,67,0.04)" : undefined,
                }}
              >
                {cellBookings.map((b) => (
                  <BookingBlock key={b.id} booking={b} coachMap={coachMap} />
                ))}
                {isNow && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-[5] h-[2px]"
                    style={{
                      background: "#D1F843",
                      top: `${(now.getMinutes() / 60) * HOUR_HEIGHT}px`,
                    }}
                  >
                    <span
                      className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full"
                      style={{ background: "#D1F843", boxShadow: "0 0 8px #D1F843" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function BookingBlock({
  booking,
  coachMap,
}: {
  booking: CalendarBooking;
  coachMap: Map<string, CoachKey>;
}) {
  const start = booking.startTime;
  const end = booking.endTime;
  const top = (start.getMinutes() / 60) * HOUR_HEIGHT;
  const minutes = (end.getTime() - start.getTime()) / 60000;
  const height = Math.max(28, (minutes / 60) * HOUR_HEIGHT);
  const key = coachMap.get(booking.instructor.id) ?? "coach-other";
  const color = COACH_COLORS[key];
  const isPending = booking.status === "PENDING";
  const isLive =
    booking.status === "CONFIRMED" &&
    start <= new Date() &&
    end >= new Date();

  const styleBase = isLive
    ? {
        background: "rgba(209,248,67,0.18)",
        borderLeftColor: "#D1F843",
        boxShadow: "0 0 0 1px rgba(209,248,67,0.30), 0 0 12px rgba(209,248,67,0.20)",
      }
    : {
        background: color.bg,
        borderLeftColor: color.bar,
      };

  return (
    <div
      className={
        "absolute left-[3px] right-[3px] z-[2] cursor-grab overflow-hidden rounded-md p-1.5 text-[11px] leading-tight text-white " +
        (isPending ? "border-dashed" : "")
      }
      style={{
        top,
        height,
        borderLeft: "3px solid",
        ...styleBase,
        opacity: isPending ? 0.55 : 1,
      }}
    >
      <div className="truncate font-semibold text-white">
        {isLive && "● "}
        {booking.student.name ?? booking.student.email ?? "Ukjent"}
      </div>
      {height > 36 && (
        <div className="truncate text-[10px] text-white/85">
          {booking.serviceType.name}
          {booking.location?.name ? ` · ${booking.location.name}` : ""}
        </div>
      )}
      {height > 50 && (
        <div className="mt-0.5 font-mono text-[9px] tracking-wider text-white/70">
          {format(start, "HH:mm")} · {Math.round(minutes)}M
        </div>
      )}
    </div>
  );
}
