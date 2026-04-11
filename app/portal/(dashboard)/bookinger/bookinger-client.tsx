"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Plus } from "lucide-react";
import {
  HeroHeading,
  GlassCard,
  Shimmer,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
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

  return (
    <div className="space-y-10">
      {/* ═══ HERO ═══ */}
      <HeroHeading
        label="Mine bookinger"
        title={
          <>
            Dine{" "}
            <span className="font-serif italic text-primary font-normal">
              bookinger
            </span>
            <span className="text-accent-cta">.</span>
          </>
        }
        description={
          <>
            <span className="font-semibold text-grey-900 tabular-nums">
              {upcomingCount}
            </span>{" "}
            kommende og{" "}
            <span className="font-semibold text-grey-900 tabular-nums">
              {pastCount}
            </span>{" "}
            tidligere økter.
          </>
        }
        actions={
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/portal/bookinger/ny"
              className="relative h-11 px-6 rounded-full bg-accent-cta text-accent-cta-text text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
            >
              <Shimmer />
              <Plus
                className="w-3.5 h-3.5 relative z-10"
                strokeWidth={2.5}
              />
              <span className="relative z-10">Ny booking</span>
            </Link>
          </motion.div>
        }
      />

      {/* ═══ NESTE BOOKING (uthevet) ═══ */}
      {nextBooking && <NextBookingHero booking={nextBooking} />}

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
            <p className="text-[10px] font-bold tracking-[0.22em] text-muted uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-muted" />
              Kommende
            </p>
            <span className="text-[11px] text-muted tabular-nums">
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
          <GlassCard variant="light" padding="lg" className="text-center">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar
                  className="w-6 h-6 text-primary"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-[13px] text-muted max-w-sm">{emptyMessage}</p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Book din første time
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ═══ TIDLIGERE ═══ */}
      <PastBookingList bookings={past} />
    </div>
  );
}
