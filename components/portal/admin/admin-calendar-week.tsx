"use client";

import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarBooking } from "@/app/portal/(dashboard)/admin/kalender/actions";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);
const SLOT_HEIGHT = 56; // slightly smaller for week view
const DAYS = 7;

interface Props {
  date: Date;
  bookings: CalendarBooking[];
  onSelectBooking: (booking: CalendarBooking) => void;
}

function bookingTop(startTime: Date): number {
  const hours = startTime.getHours() + startTime.getMinutes() / 60;
  return (hours - 8) * SLOT_HEIGHT;
}

function bookingHeight(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.max(durationHours * SLOT_HEIGHT, 20);
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#22c55e",
  PENDING: "#f59e0b",
  COMPLETED: "#6b7280",
  NO_SHOW: "#ef4444",
};

export function AdminCalendarWeek({ date, bookings, onSelectBooking }: Props) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: DAYS }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Day headers */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
        <div /> {/* spacer for time column */}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`text-center py-3 border-l border-gray-100 ${
              isToday(day) ? "bg-[#B8975C]/10" : ""
            }`}
          >
            <p className="text-[10px] uppercase text-gray-400 font-medium">
              {format(day, "EEE", { locale: nb })}
            </p>
            <p
              className={`text-sm font-semibold mt-0.5 ${
                isToday(day)
                  ? "bg-[#0F2950] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto"
                  : "text-gray-700"
              }`}
            >
              {format(day, "d")}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div
        className="grid overflow-y-auto"
        style={{
          gridTemplateColumns: "56px repeat(7, 1fr)",
          maxHeight: "calc(100vh - 260px)",
        }}
      >
        {/* Time labels */}
        <div className="relative" style={{ height: HOURS.length * SLOT_HEIGHT }}>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0"
              style={{ top: (hour - 8) * SLOT_HEIGHT }}
            >
              <span className="text-[10px] text-gray-400 px-2 -translate-y-1/2 block">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayBookings = bookings.filter((b) =>
            isSameDay(new Date(b.startTime), day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`relative border-l border-gray-100 ${
                isToday(day) ? "bg-[#B8975C]/5" : ""
              }`}
              style={{ height: HOURS.length * SLOT_HEIGHT }}
            >
              {/* Hour lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-gray-50"
                  style={{ top: (hour - 8) * SLOT_HEIGHT }}
                />
              ))}

              {/* Bookings */}
              {dayBookings.map((booking) => {
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const top = bookingTop(start);
                const height = bookingHeight(start, end);
                const color =
                  booking.serviceType.color ??
                  STATUS_COLORS[booking.status] ??
                  "#6b7280";

                return (
                  <button
                    key={booking.id}
                    onClick={() => onSelectBooking(booking)}
                    className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-left text-[10px] hover:opacity-90 transition-opacity cursor-pointer overflow-hidden"
                    style={{
                      top,
                      height,
                      backgroundColor: `${color}20`,
                      borderLeft: `2px solid ${color}`,
                    }}
                  >
                    <p className="font-semibold text-gray-800 truncate">
                      {booking.student.name ?? "—"}
                    </p>
                    <p className="text-gray-500 truncate">
                      {format(start, "HH:mm")} {booking.serviceType.name}
                    </p>
                  </button>
                );
              })}

              {/* Now line */}
              {isToday(day) &&
                (() => {
                  const now = new Date();
                  const nowHours =
                    now.getHours() + now.getMinutes() / 60;
                  if (nowHours < 8 || nowHours > 22) return null;
                  return (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-red-400 z-10 pointer-events-none"
                      style={{ top: (nowHours - 8) * SLOT_HEIGHT }}
                    />
                  );
                })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
