"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { fadeInUp, staggerContainer } from "@/components/portal/premium";
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
      return <Icon name="my_location" className={className} strokeWidth={strokeWidth} />;
    case "tournament":
      return <Icon name="emoji_events" className={className} strokeWidth={strokeWidth} />;
    default:
      return <Icon name="calendar_today" className={className} strokeWidth={strokeWidth} />;
  }
}

interface PastBookingRowProps {
  booking: BookingViewModel;
}

function PastBookingRow({ booking }: PastBookingRowProps) {
  const status = getStatusConfig(booking);
  const dateLabel = format(booking.startTime, "d. MMM yyyy", { locale: nb });
  const timeLabel = format(booking.startTime, "HH:mm");

  return (
    <Link href={`/portal/bookinger/${booking.id}`} className="block">
      <Card variant="elevated" padding="sm" hover className="group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0">
            {renderIconForType(booking.type, "w-4 h-4 text-muted", 1.75)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[13px] text-grey-900 truncate">
              {booking.serviceName}
            </p>
            <p className="text-[11px] text-muted tabular-nums">
              {dateLabel} · {timeLabel} · {booking.instructorName}
            </p>
          </div>
          <BookingStatusBadge label={status.label} variant={status.variant} />
        </div>
      </Card>
    </Link>
  );
}

interface PastBookingListProps {
  bookings: BookingViewModel[];
  /** Maks antall å vise (default 8) */
  limit?: number;
}

export function PastBookingList({ bookings, limit = 8 }: PastBookingListProps) {
  if (bookings.length === 0) return null;

  const visible = bookings.slice(0, limit);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted uppercase flex items-center gap-2">
          <span className="w-6 h-px bg-muted" />
          Tidligere
        </p>
        <span className="text-[11px] text-muted tabular-nums">
          {bookings.length} fullført
        </span>
      </div>
      <div className="space-y-2">
        {visible.map((booking, i) => (
          <motion.div
            key={booking.id}
            variants={fadeInUp}
            transition={{ delay: i * 0.04 }}
          >
            <PastBookingRow booking={booking} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
