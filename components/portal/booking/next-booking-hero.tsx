"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, differenceInHours } from "date-fns";
import { nb } from "date-fns/locale";

import type { BookingViewModel } from "./booking-types";
import { fadeInUp } from "@/components/portal/premium";

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}

function formatTimeRange(start: Date, duration: number): string {
  const end = new Date(start.getTime() + duration * 60_000);
  return `${format(start, "HH:mm")}–${format(end, "HH:mm")}`;
}

function getCountdown(date: Date): string {
  const hours = differenceInHours(date, new Date());
  if (hours < 1) return "Starter snart";
  if (hours < 24) return `Om ${hours} timer`;
  const days = Math.floor(hours / 24);
  return `Om ${days} ${days === 1 ? "dag" : "dager"}`;
}

interface NextBookingHeroProps {
  booking: BookingViewModel;
}

/**
 * NextBookingHero — uthevet kort for neste booking.
 * Bruker accent-cta som highlight-farge.
 */
export function NextBookingHero({ booking }: NextBookingHeroProps) {
  const dateLabel = formatDateLabel(booking.startTime);
  const timeLabel = formatTimeRange(booking.startTime, booking.duration);
  const countdown = getCountdown(booking.startTime);

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Link href={`/portal/bookinger/${booking.id}`} className="block group">
        <div className="relative rounded-[24px] overflow-hidden bg-on-surface p-6 lg:p-8 shadow-[0_20px_60px_-20px_rgba(10,31,24,0.25)] border border-white/5">
          {/* Gradient mesh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 80% 0%, rgba(209,248,67,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 100%, rgba(0,88,64,0.15), transparent 60%)",
            }}
          />

          {/* Innhold */}
          <div className="relative z-10">
            {/* Øvre rad: label + countdown */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-bold tracking-[0.22em] text-surface/50 uppercase flex items-center gap-2">
                <span className="w-6 h-px bg-surface-container-lowest/30" />
                Neste booking
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-secondary-fixed-text text-[11px] font-bold">
                {countdown}
              </span>
            </div>

            {/* Tjenestenavn */}
            <h2 className="text-[28px] lg:text-[36px] font-bold text-surface tracking-tight leading-tight mb-1">
              {booking.serviceName}
            </h2>

            {/* Dato og tid */}
            <p className="text-[16px] text-secondary-fixed font-semibold mb-5 tabular-nums">
              {dateLabel} · {timeLabel}
            </p>

            {/* Meta-info */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-surface/60">
              <span className="flex items-center gap-2">
                <Icon name="person"Icon className="w-4 h-4" strokeWidth={1.5} />
                {booking.instructorName}
              </span>
              {booking.location && (
                <span className="flex items-center gap-2">
                  <Icon name="location_on" className="w-4 h-4" strokeWidth={1.5} />
                  {booking.location}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Icon name="schedule" className="w-4 h-4" strokeWidth={1.5} />
                <span className="tabular-nums">{booking.duration} min</span>
              </span>
            </div>

            {/* Pil-indikator */}
            <div className="mt-6 flex items-center gap-2 text-[12px] text-secondary-fixed font-semibold opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
              <span>Se detaljer</span>
              <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
