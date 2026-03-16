"use client";

import { format, isSameDay } from "date-fns";
import type { CalendarBooking } from "@/app/portal/(dashboard)/admin/kalender/actions";

// 08:00 – 22:00 time grid
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8..22
const SLOT_HEIGHT = 60; // px per hour

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
  return Math.max(durationHours * SLOT_HEIGHT, 24);
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#22c55e",
  PENDING: "#f59e0b",
  COMPLETED: "#6b7280",
  NO_SHOW: "#ef4444",
};

export function AdminCalendarDay({ date, bookings, onSelectBooking }: Props) {
  const dayBookings = bookings.filter((b) =>
    isSameDay(new Date(b.startTime), date)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Time grid */}
      <div className="relative" style={{ height: HOURS.length * SLOT_HEIGHT }}>
        {/* Hour lines */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-100 flex"
            style={{ top: (hour - 8) * SLOT_HEIGHT }}
          >
            <span className="text-[10px] text-gray-400 w-14 px-2 -translate-y-1/2 bg-white">
              {String(hour).padStart(2, "0")}:00
            </span>
          </div>
        ))}

        {/* Bookings */}
        <div className="ml-14 relative">
          {dayBookings.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const top = bookingTop(start);
            const height = bookingHeight(start, end);
            const color = booking.serviceType.color ?? STATUS_COLORS[booking.status] ?? "#6b7280";

            return (
              <button
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="absolute left-1 right-4 rounded-lg px-3 py-1.5 text-left text-xs hover:opacity-90 transition-opacity cursor-pointer overflow-hidden"
                style={{
                  top,
                  height,
                  backgroundColor: `${color}15`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <p className="font-semibold text-gray-800 truncate">
                  {booking.student.name ?? "Ukjent"}
                </p>
                <p className="text-gray-500 truncate">
                  {booking.serviceType.name} • {format(start, "HH:mm")}–{format(end, "HH:mm")}
                </p>
                {booking.instructor.user.name && (
                  <p className="text-gray-400 truncate">
                    {booking.instructor.user.name}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Now line */}
        {isSameDay(new Date(), date) && (() => {
          const now = new Date();
          const nowHours = now.getHours() + now.getMinutes() / 60;
          if (nowHours < 8 || nowHours > 22) return null;
          return (
            <div
              className="absolute left-14 right-0 border-t-2 border-red-400 z-10 pointer-events-none"
              style={{ top: (nowHours - 8) * SLOT_HEIGHT }}
            >
              <div className="w-2 h-2 rounded-full bg-red-400 -translate-y-1/2 -translate-x-1" />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
