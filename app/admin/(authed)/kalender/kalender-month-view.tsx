"use client";

import { format, isSameMonth, isSameDay } from "date-fns";
import { cn } from "@/lib/portal/utils/cn";
import type { CalendarBooking } from "./actions";
import { formatTime, statusCellStyles } from "./kalender-utils";

interface KalenderMonthViewProps {
  days: Date[];
  currentDate: Date;
  selectedDate: Date | null;
  bookings: CalendarBooking[];
  onSelectDate: (date: Date) => void;
  onBookingClick: (booking: CalendarBooking) => void;
}

export default function KalenderMonthView({
  days,
  currentDate,
  selectedDate,
  bookings,
  onSelectDate,
  onBookingClick,
}: KalenderMonthViewProps) {
  const getBookingsForDate = (date: Date) =>
    bookings.filter((b) => isSameDay(new Date(b.startTime), date));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-outline-variant/30 bg-surface">
        {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((label) => (
          <div
            key={label}
            className="px-3 py-2.5 text-center text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((date, i) => {
          const dayBookings = getBookingsForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={cn(
                "min-h-[110px] p-2 border-b border-r border-outline-variant/20 text-left transition-colors",
                !isCurrentMonth && "bg-surface opacity-60",
                isToday && "bg-surface-container",
                isSelected && "ring-2 ring-black ring-inset",
                "hover:bg-surface"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-on-surface text-surface" : "text-on-surface"
                  )}
                >
                  {format(date, "d")}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-[10px] text-on-surface-variant tabular-nums">
                    {dayBookings.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(booking);
                    }}
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] rounded border truncate cursor-pointer",
                      statusCellStyles[booking.status] ||
                        statusCellStyles.CONFIRMED
                    )}
                  >
                    {formatTime(booking.startTime)}{" "}
                    {booking.student.name || booking.serviceType.name}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-[10px] text-on-surface-variant pl-1">
                    +{dayBookings.length - 3} flere
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
