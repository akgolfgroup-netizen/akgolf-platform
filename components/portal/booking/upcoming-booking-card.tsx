"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  Target,
  Trophy,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "./booking-status-badge";
import type { BookingViewModel } from "./booking-types";
import { getStatusConfig } from "./booking-types";

function renderIconForType(
  type: BookingViewModel["type"],
  className?: string,
  strokeWidth?: number,
) {
  switch (type) {
    case "coaching":
      return <Target className={className} strokeWidth={strokeWidth} />;
    case "training":
      return <Calendar className={className} strokeWidth={strokeWidth} />;
    case "tournament":
      return <Trophy className={className} strokeWidth={strokeWidth} />;
    case "booking":
    default:
      return <Calendar className={className} strokeWidth={strokeWidth} />;
  }
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}

function formatTimeRange(start: Date, duration: number): string {
  const end = new Date(start.getTime() + duration * 60_000);
  return `${format(start, "HH:mm")}–${format(end, "HH:mm")}`;
}

interface UpcomingBookingCardProps {
  booking: BookingViewModel;
}

export function UpcomingBookingCard({ booking }: UpcomingBookingCardProps) {
  const status = getStatusConfig(booking);
  const dateLabel = formatDateLabel(booking.startTime);
  const timeLabel = formatTimeRange(booking.startTime, booking.duration);

  return (
    <Link href={`/portal/bookinger/${booking.id}`} className="block">
      <Card variant="elevated" padding="md" hover className="group">
        <div className="flex items-center gap-4">
          {/* Ikon */}
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            {renderIconForType(booking.type, "w-5 h-5 text-primary", 1.75)}
          </div>

          {/* Innhold */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-semibold text-[14px] text-grey-900 truncate">
                {booking.serviceName}
              </h3>
              <BookingStatusBadge
                label={status.label}
                variant={status.variant}
              />
            </div>
            <p className="text-[11px] text-muted uppercase tracking-wider mb-2 tabular-nums">
              {dateLabel} · {timeLabel}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3 h-3" strokeWidth={1.75} />
                <span className="truncate">{booking.instructorName}</span>
              </span>
              {booking.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" strokeWidth={1.75} />
                  <span className="truncate">{booking.location}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" strokeWidth={1.75} />
                <span className="tabular-nums">{booking.duration} min</span>
              </span>
            </div>
          </div>

          {/* Pil */}
          <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
