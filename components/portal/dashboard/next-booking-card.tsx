"use client";

import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

interface NextBooking {
  id: string;
  instructorName: string;
  serviceName: string;
  duration: number;
  startTime: Date | string;
}

interface NextBookingCardProps {
  booking: NextBooking | null;
  delay?: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function NextBookingCard({ booking, delay = 0 }: NextBookingCardProps) {
  if (!booking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
        className="flex h-full flex-col justify-between rounded-xl border border-dashed border-grey-200 bg-white p-5 shadow-card"
      >
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-black">
            Ingen kommende coaching
          </h3>
          <p className="mt-1 text-sm text-muted">
            Book en coaching-time og kom et skritt nærmere målet ditt.
          </p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-[20px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-alt"
        >
          Book en coaching-time
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    );
  }

  const start = new Date(booking.startTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      className="flex h-full flex-col justify-between rounded-xl bg-white p-5 shadow-card"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cta/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cta" />
            Neste coaching
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
            {format(start, "EEE d. MMM", { locale: nb })}
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight text-black tabular-nums">
            {format(start, "HH:mm")}
          </span>
          <span className="text-sm font-medium text-muted">
            <Clock className="mr-1 inline h-3.5 w-3.5" />
            {booking.duration} min
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-text">
          {booking.serviceName}
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-surface p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-accent-cta">
            {getInitials(booking.instructorName)}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Instruktør
            </p>
            <p className="text-sm font-semibold text-black">
              <User className="mr-1 inline h-3.5 w-3.5 text-muted" />
              {booking.instructorName}
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/portal/bookinger"
        className="mt-5 inline-flex items-center justify-between rounded-[20px] border border-grey-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-grey-50"
      >
        Se detaljer
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
