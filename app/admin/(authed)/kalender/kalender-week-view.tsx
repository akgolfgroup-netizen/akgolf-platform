"use client";

import { useMemo } from "react";
import {
  format,
  isSameDay,
  addDays,
  differenceInMinutes,
  startOfWeek,
} from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/portal/utils/cn";
import type { CalendarBooking, CalendarBlockedTime } from "./actions";
import type { CalendarAvailability } from "./actions";

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;
const TOTAL_HOURS = END_HOUR - START_HOUR;

interface KalenderWeekViewProps {
  currentDate: Date;
  bookings: CalendarBooking[];
  blockedTimes: CalendarBlockedTime[];
  availability: CalendarAvailability[];
  onBookingClick: (booking: CalendarBooking) => void;
}

export default function KalenderWeekView({
  currentDate,
  bookings,
  blockedTimes,
  availability,
  onBookingClick,
}: KalenderWeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const hours = useMemo(
    () => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i),
    []
  );

  const itemsByDay = useMemo(() => {
    return days.map((day) => ({
      bookings: bookings.filter((b) => isSameDay(new Date(b.startTime), day)),
      blocked: blockedTimes.filter((bt) =>
        isSameDay(new Date(bt.startTime), day)
      ),
      availability: availability.filter((a) => a.dayOfWeek === day.getDay()),
    }));
  }, [days, bookings, blockedTimes, availability]);

  const getTop = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    if (h < START_HOUR) return 0;
    return (h - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  const getHeight = (start: Date, end: Date) => {
    const mins = differenceInMinutes(end, start);
    return Math.max((mins / 60) * HOUR_HEIGHT, 20);
  };

  const getAvailTopAndHeight = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const top = (sh - START_HOUR) * HOUR_HEIGHT + (sm / 60) * HOUR_HEIGHT;
    const height =
      ((eh - sh) * 60 + (em - sm)) * (HOUR_HEIGHT / 60);
    return { top: Math.max(top, 0), height: Math.max(height, 20) };
  };

  return (
    <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-grey-200 bg-grey-50">
        <div className="px-3 py-2.5 text-center text-xs font-semibold text-grey-500 border-r border-grey-200">
          Tid
        </div>
        {days.map((day) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "px-3 py-2.5 text-center border-r border-grey-200 last:border-r-0",
                isToday && "bg-primary-soft"
              )}
            >
              <div className="text-xs text-grey-500 capitalize">
                {format(day, "EEEE", { locale: nb })}
              </div>
              <div
                className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-primary" : "text-black"
                )}
              >
                {format(day, "d. MMM", { locale: nb })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="overflow-auto">
        <div
          className="grid grid-cols-8 relative"
          style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px`, minHeight: "400px" }}
        >
          {/* Time labels */}
          <div className="border-r border-grey-200 sticky left-0 bg-white z-10">
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b border-grey-100 px-2 text-[10px] text-grey-400 flex items-start justify-end pt-1"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const { bookings: dayBookings, blocked: dayBlocked, availability: dayAvail } =
              itemsByDay[dayIndex];

            return (
              <div
                key={day.toISOString()}
                className="relative border-r border-grey-100 last:border-r-0"
              >
                {/* Hour rows */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-grey-50"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Availability background */}
                {dayAvail.map((slot) => {
                  const { top, height } = getAvailTopAndHeight(
                    slot.startTime,
                    slot.endTime
                  );
                  if (top + height <= 0) return null;
                  return (
                    <div
                      key={slot.id}
                      className="absolute left-0 right-0 bg-success-light/40"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    />
                  );
                })}

                {/* Blocked times */}
                {dayBlocked.map((bt) => {
                  const s = new Date(bt.startTime);
                  const e = new Date(bt.endTime);
                  return (
                    <div
                      key={bt.id}
                      className="absolute left-0.5 right-0.5 bg-error-light/70 border border-error/30 rounded text-[10px] text-error-text px-1.5 py-0.5 truncate z-[5]"
                      style={{
                        top: `${getTop(s)}px`,
                        height: `${getHeight(s, e)}px`,
                      }}
                    >
                      {bt.reason || "Blokkert"}
                    </div>
                  );
                })}

                {/* Bookings */}
                {dayBookings.map((booking) => {
                  const s = new Date(booking.startTime);
                  const e = new Date(booking.endTime);
                  const color = booking.serviceType.color;
                  return (
                    <button
                      key={booking.id}
                      onClick={() => onBookingClick(booking)}
                      className={cn(
                        "absolute left-0.5 right-0.5 rounded border text-left px-2 py-1 text-xs overflow-hidden hover:shadow-md transition-shadow z-[6]"
                      )}
                      style={{
                        top: `${getTop(s)}px`,
                        height: `${getHeight(s, e)}px`,
                        backgroundColor: color ? `${color}18` : undefined,
                        borderColor: color || undefined,
                      }}
                    >
                      <div
                        className="font-semibold truncate"
                        style={{ color: color || "#0A1F18" }}
                      >
                        {format(s, "HH:mm")} {booking.serviceType.name}
                      </div>
                      <div className="truncate text-black">
                        {booking.student.name || "Ukjent elev"}
                      </div>
                      {booking.instructor.user.name && (
                        <div className="truncate text-grey-500 text-[10px]">
                          {booking.instructor.user.name}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
