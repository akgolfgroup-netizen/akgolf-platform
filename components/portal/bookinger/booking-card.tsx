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

const THEME = {
  bg: "#FFFFFF",
  text: "#02060D",
  textSecondary: "#64748B",
  border: "#EBE5DA",
  gold: "#B8975C",
  green: "#22C55E",
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: "Venter", bg: "#FEF3C7", color: "#D97706" },
  CONFIRMED: { label: "Bekreftet", bg: "#DCFCE7", color: "#16A34A" },
  CANCELLED: { label: "Avlyst", bg: "#FEE2E2", color: "#DC2626" },
  COMPLETED: { label: "Fullført", bg: "#F3F4F6", color: "#64748B" },
  NO_SHOW: { label: "Møtte ikke", bg: "#FEE2E2", color: "#DC2626" },
};

export function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status] ?? statusConfig.PENDING;
  const accent = booking.serviceType.color ?? THEME.gold;

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
      style={{ 
        background: THEME.bg,
        border: `1px solid ${THEME.border}`,
        borderLeftWidth: 4,
        borderLeftColor: accent,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-base truncate mb-3"
            style={{ color: THEME.text }}
          >
            {booking.serviceType.name}
          </h3>

          <div className="space-y-2">
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: THEME.textSecondary }}
            >
              <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: THEME.gold }} />
              <span>
                {format(new Date(booking.startTime), "EEEE d. MMMM yyyy", { locale: nb })}
              </span>
            </div>
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: THEME.textSecondary }}
            >
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: THEME.gold }} />
              <span>
                {format(new Date(booking.startTime), "HH:mm")} –{" "}
                {format(new Date(booking.endTime), "HH:mm")}
                <span style={{ color: THEME.textSecondary, opacity: 0.7 }}>
                  {" "}({booking.serviceType.duration} min)
                </span>
              </span>
            </div>
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: THEME.textSecondary }}
            >
              <User className="w-4 h-4 flex-shrink-0" style={{ color: THEME.gold }} />
              <span>
                {booking.instructor.user.name}
                {booking.instructor.title && (
                  <span style={{ opacity: 0.7 }}>
                    {" · "}{booking.instructor.title}
                  </span>
                )}
              </span>
            </div>
            {booking.location && (
              <div 
                className="flex items-center gap-2 text-sm"
                style={{ color: THEME.textSecondary }}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: THEME.gold }} />
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
