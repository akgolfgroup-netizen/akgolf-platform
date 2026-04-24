"use client";


import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { cn } from "@/lib/portal/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDropdown } from "@/components/portal/coach-hq/ui";
import type { AdminDropdownItem } from "@/components/portal/coach-hq/ui";
import type { CalendarBooking } from "./actions";
import {
  formatTime,
  formatDuration,
  statusLabels,
  statusBadgeVariant,
  statusCellStyles,
  isStatusKey,
} from "./kalender-utils";

interface KalenderSidebarProps {
  selectedDate: Date | null;
  bookings: CalendarBooking[];
  onBookingClick: (booking: CalendarBooking) => void;
  onAddNote: (booking: CalendarBooking) => void;
  onMarkNoShow: (bookingId: string) => void;
  onNewEvent: () => void;
}

export default function KalenderSidebar({
  selectedDate,
  bookings,
  onBookingClick,
  onAddNote,
  onMarkNoShow,
  onNewEvent,
}: KalenderSidebarProps) {
  const selectedDateBookings = selectedDate
    ? bookings.filter((b) =>
        format(new Date(b.startTime), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const buildQuickActions = (booking: CalendarBooking): AdminDropdownItem[] => [
    {
      id: "view",
      label: "Se detaljer",
      icon: <Icon name="calendar_today" className="w-4 h-4" />,
      onSelect: () => onBookingClick(booking),
    },
    {
      id: "note",
      label: "Legg til notat",
      icon: <Icon name="chat" className="w-4 h-4" />,
      onSelect: () => onAddNote(booking),
    },
    {
      id: "no-show",
      label: "Merk som ikke møtt",
      icon: <Icon name="warning" className="w-4 h-4" />,
      variant: "danger",
      disabled: booking.status === "NO_SHOW" || booking.status === "COMPLETED",
      onSelect: () => onMarkNoShow(booking.id),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selected Date Details */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <h3 className="text-sm font-semibold text-on-surface mb-3 capitalize">
          {selectedDate
            ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
            : "Velg en dato"}
        </h3>
        {selectedDateBookings.length === 0 ? (
          <div className="py-8 text-center">
            <Icon name="calendar_today" className="w-10 h-10 text-on-surface-variant/60 mx-auto mb-2" />
            <span className="text-sm text-on-surface-variant">Ingen bookinger</span>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDateBookings.map((booking) => {
              const statusKey = isStatusKey(booking.status)
                ? booking.status
                : "CONFIRMED";
              return (
                <div
                  key={booking.id}
                  className="p-3 rounded-lg border border-outline-variant/30 bg-surface"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-on-surface">
                      <Icon name="schedule" className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span className="text-xs font-medium tabular-nums">
                        {formatTime(booking.startTime)}–
                        {formatTime(booking.endTime)}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        ({formatDuration(booking)})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={statusBadgeVariant[statusKey]}>
                        {statusLabels[booking.status] || booking.status}
                      </Badge>
                      <AdminDropdown
                        items={buildQuickActions(booking)}
                        trigger={
                          <button
                            aria-label="Handlinger"
                            className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                          >
                            <Icon name="more_horiz" className="w-3.5 h-3.5" />
                          </button>
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onBookingClick(booking)}
                    className="block w-full text-left"
                  >
                    <div className="text-sm font-medium text-on-surface">
                      {booking.serviceType.name}
                    </div>
                    <div className="text-xs text-on-surface-variant/80 mt-0.5">
                      {booking.student.name ||
                        booking.student.email ||
                        "Ukjent elev"}
                    </div>
                    {booking.instructor.user.name && (
                      <div className="text-xs text-on-surface-variant/80">
                        Med {booking.instructor.user.name}
                      </div>
                    )}
                    {booking.location && (
                      <div className="text-xs text-on-surface-variant/80">
                        {booking.location.name}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <Button variant="accent" className="w-full mt-3" onClick={onNewEvent}>
          <Icon name="add" className="w-4 h-4" />
          Legg til hendelse
        </Button>
      </div>

      {/* Status Legend */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <h3 className="text-sm font-semibold text-on-surface mb-3">Status</h3>
        <div className="space-y-2">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={cn("w-3 h-3 rounded border", statusCellStyles[status])}
              />
              <span className="text-sm text-text">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
