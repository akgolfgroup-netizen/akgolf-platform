"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface BookingCardProps {
  booking: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
    serviceType: { name: string; color?: string | null; duration: number };
    instructor: { user: { name?: string | null }; title?: string | null };
    location?: { name: string } | null;
  };
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: "Venter", bg: "rgba(217,119,6,0.2)", color: "#FBBF24" },
  CONFIRMED: { label: "Bekreftet", bg: "rgba(34,197,94,0.2)", color: "#86EFAC" },
  CANCELLED: { label: "Avlyst", bg: "rgba(220,38,38,0.2)", color: "#FCA5A5" },
  COMPLETED: { label: "Fullført", bg: "rgba(156,163,175,0.2)", color: "#D1D5DB" },
  NO_SHOW: { label: "Møtte ikke", bg: "rgba(220,38,38,0.2)", color: "#FCA5A5" },
};

export function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status] ?? statusConfig.PENDING;
  const accent = booking.serviceType.color ?? "#B8975C";

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)]"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: accent,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate mb-3 text-[var(--color-snow)]">
            {booking.serviceType.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
              <Calendar className="w-4 h-4 flex-shrink-0 text-[var(--color-gold)]" />
              <span>
                {format(new Date(booking.startTime), "EEEE d. MMMM yyyy", { locale: nb })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
              <Clock className="w-4 h-4 flex-shrink-0 text-[var(--color-gold)]" />
              <span>
                {format(new Date(booking.startTime), "HH:mm")} –{" "}
                {format(new Date(booking.endTime), "HH:mm")}
                <span className="opacity-70">
                  {" "}({booking.serviceType.duration} min)
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
              <User className="w-4 h-4 flex-shrink-0 text-[var(--color-gold)]" />
              <span>
                {booking.instructor.user.name}
                {booking.instructor.title && (
                  <span className="opacity-70">
                    {" · "}{booking.instructor.title}
                  </span>
                )}
              </span>
            </div>
            {booking.location && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[var(--color-gold)]" />
                <span>{booking.location.name}</span>
              </div>
            )}
          </div>
        </div>

        <span
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
          )}
          style={{
            background: status.bg,
            color: status.color,
          }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
