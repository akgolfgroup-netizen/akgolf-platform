"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Plus } from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import type {
  BookingViewModel,
  CancellationRule,
} from "@/components/portal/booking/booking-types";
import { NextBookingHero } from "@/components/portal/booking/next-booking-hero";
import { UpcomingBookingCard } from "@/components/portal/booking/upcoming-booking-card";
import { PastBookingList } from "@/components/portal/booking/past-booking-list";
import { CancellationRulesCard } from "@/components/portal/booking/cancellation-rules-card";
import {
  BookingHoverCardGroup,
  BookingHoverCard,
} from "@/components/portal/booking/booking-hover-card";
import {
  VerticalTimeline,
  MonoLabel,
  type TimelineItem,
} from "@/components/portal/patterns";

// Re-eksporter typer som page.tsx trenger
export type { BookingViewModel, CancellationRule };

interface BookingerClientProps {
  upcoming: BookingViewModel[];
  past: BookingViewModel[];
  cancellationRules: readonly CancellationRule[];
  emptyMessage: string;
}

export function BookingerClient({
  upcoming,
  past,
  cancellationRules,
  emptyMessage,
}: BookingerClientProps) {
  const upcomingCount = upcoming.length;
  const pastCount = past.length;

  // Splitt: neste booking (hero) + resten
  const nextBooking = upcoming[0] ?? null;
  const restUpcoming = upcoming.slice(1);

  // v3.1: Bygg timeline for kommende 7 dager
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const timelineItems: TimelineItem[] = upcoming
    .filter((b) => {
      const d = new Date(b.startTime);
      return d >= today && d <= oneWeekFromNow;
    })
    .slice(0, 8)
    .map((b) => {
      const d = new Date(b.startTime);
      const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const dayLabel = d.toLocaleDateString("nb-NO", { weekday: "short" });
      return {
        id: b.id,
        time: timeStr,
        title: b.serviceName,
        meta: `${dayLabel.toUpperCase()} · ${b.instructorName}`,
        dotColor: b.id === nextBooking?.id ? "lime" : "sage",
        active: b.id === nextBooking?.id,
        href: `/portal/bookinger/${b.id}`,
      };
    });

  return (
    <div className="space-y-6">
      {/* ═══ HERO ═══ */}
      <div className="space-y-3">
        <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">Mine bookinger</MonoLabel>
        <h1 className="text-2xl font-bold text-black">
          Dine{" "}
          <span className="font-serif italic text-black font-normal">
            bookinger
          </span>
          <span className="text-accent-cta">.</span>
        </h1>
        <p className="text-[13px] text-grey-400 max-w-xl">
          <span className="font-semibold text-black tabular-nums">
            {upcomingCount}
          </span>{" "}
          kommende og{" "}
          <span className="font-semibold text-black tabular-nums">
            {pastCount}
          </span>{" "}
          tidligere økter.
        </p>
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/portal/bookinger/ny"
            className="relative h-11 px-6 rounded-full bg-accent-cta text-black text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(10,31,24,0.12)] hover:shadow-[0_12px_32px_rgba(10,31,24,0.16)] transition-shadow overflow-hidden group"
          >
            <Plus
              className="w-3.5 h-3.5 relative z-10"
              strokeWidth={2.5}
            />
            <span className="relative z-10">Ny booking</span>
          </Link>
        </motion.div>
      </div>

      {/* ═══ NESTE BOOKING (uthevet) ═══ */}
      {nextBooking && <NextBookingHero booking={nextBooking} />}

      {/* ═══ 7-DAGERS TIDSLINJE (v3.1 — P-06) ═══ */}
      {timelineItems.length > 0 && (
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel size="xs" uppercase className="text-grey-400">
              Neste 7 dager
            </MonoLabel>
            <MonoLabel size="xs" className="text-grey-400">
              {timelineItems.length} planlagt
            </MonoLabel>
          </div>
          <VerticalTimeline items={timelineItems} compact />
        </motion.section>
      )}

      {/* ═══ AVBESTILLINGSREGLER ═══ */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <CancellationRulesCard rules={cancellationRules} />
      </motion.div>

      {/* ═══ KOMMENDE (resten) ═══ */}
      {restUpcoming.length > 0 && (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 flex items-center gap-2">
              <span className="w-6 h-px bg-grey-400" />
              Kommende
            </p>
            <span className="text-[11px] text-grey-400 tabular-nums">
              {restUpcoming.length} planlagt
            </span>
          </div>

          <BookingHoverCardGroup>
            {restUpcoming.map((booking, i) => (
              <BookingHoverCard key={booking.id} index={i}>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: i * 0.05 }}
                >
                  <UpcomingBookingCard booking={booking} />
                </motion.div>
              </BookingHoverCard>
            ))}
          </BookingHoverCardGroup>
        </motion.section>
      )}

      {/* ═══ TOM TILSTAND ═══ */}
      {upcomingCount === 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <PremiumCard className="text-center">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center">
                <Calendar
                  className="w-6 h-6 text-black"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-[13px] text-grey-400 max-w-sm">{emptyMessage}</p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-black hover:gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Book din første time
              </Link>
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {/* ═══ TIDLIGERE ═══ */}
      <PastBookingList bookings={past} />
    </div>
  );
}
