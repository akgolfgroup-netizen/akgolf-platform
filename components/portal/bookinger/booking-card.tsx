"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  PENDING: { label: "Venter", variant: "warning" },
  CONFIRMED: { label: "Bekreftet", variant: "success" },
  CANCELLED: { label: "Avlyst", variant: "error" },
  COMPLETED: { label: "Fullfort", variant: "default" },
  NO_SHOW: { label: "Motte ikke", variant: "error" },
};

export function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status] ?? statusConfig.PENDING;
  const accent = booking.serviceType.color ?? "var(--color-grey-900)";

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: accent }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Service name */}
            <h3 className="font-semibold text-base text-[var(--color-grey-900)] truncate mb-3">
              {booking.serviceType.name}
            </h3>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-grey-900)]" />
                </div>
                <span className="truncate">
                  {format(new Date(booking.startTime), "EEEE d. MMM", { locale: nb })}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-grey-900)]" />
                </div>
                <span>
                  {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                  <span className="text-[var(--color-grey-400)] ml-1">
                    ({booking.serviceType.duration} min)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-[var(--color-grey-900)]" />
                </div>
                <span className="truncate">
                  {booking.instructor.user.name}
                  {booking.instructor.title && (
                    <span className="text-[var(--color-grey-400)]">
                      {" "}({booking.instructor.title})
                    </span>
                  )}
                </span>
              </div>

              {booking.location && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--color-grey-600)]">
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-grey-900)]" />
                  </div>
                  <span className="truncate">{booking.location.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status badge */}
          <Badge variant={status.variant} size="md">
            {status.label}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
