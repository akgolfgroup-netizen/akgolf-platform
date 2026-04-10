"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Clock,
  History,
  MapPin,
  Plus,
  Target,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import {
  PremiumBentoCard,
  PremiumBentoGrid,
  PortalCard,
  staggerContainer,
  fadeInUp,
} from "@/components/portal/premium";

/**
 * Shape returned fra getUpcomingBookings / getPastBookings i actions.ts.
 * Her holder vi typene snevre og spesifikke — ingen `any`.
 */
export interface BookingViewModel {
  id: string;
  serviceName: string;
  instructorName: string;
  startTime: Date;
  duration: number;
  location?: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "coaching" | "training" | "tournament" | "booking";
}

export interface CancellationRule {
  hours: string;
  rule: string;
  fee: string;
}

interface BookingerClientProps {
  upcoming: BookingViewModel[];
  past: BookingViewModel[];
  cancellationRules: readonly CancellationRule[];
  emptyMessage: string;
}

type BadgeVariant = "success" | "warning" | "neutral";

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

function statusConfig(booking: BookingViewModel): StatusConfig {
  switch (booking.status) {
    case "upcoming":
      return { label: "Bekreftet", variant: "success" };
    case "completed":
      return { label: "Fullført", variant: "neutral" };
    case "cancelled":
      return { label: "Avlyst", variant: "neutral" };
  }
}

function iconForType(type: BookingViewModel["type"]) {
  switch (type) {
    case "coaching":
      return Target;
    case "training":
      return Calendar;
    case "tournament":
      return Trophy;
    case "booking":
    default:
      return Calendar;
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

function BookingCardItem({
  booking,
  variant,
}: {
  booking: BookingViewModel;
  variant: "default" | "soft";
}) {
  const status = statusConfig(booking);
  const Icon = iconForType(booking.type);
  const dateLabel = formatDateLabel(booking.startTime);
  const timeLabel = formatTimeRange(booking.startTime, booking.duration);

  return (
    <PremiumBentoCard
      title={booking.serviceName}
      description={`${dateLabel} · ${timeLabel}`}
      icon={Icon}
      badge={status.label}
      badgeVariant={status.variant}
      href={`/portal/bookinger/${booking.id}`}
      variant={variant}
    >
      <div className="mt-1 flex flex-col gap-1.5 text-xs text-[var(--color-muted)]">
        <div className="flex items-center gap-1.5">
          <UserIcon className="h-3.5 w-3.5" />
          <span className="truncate">{booking.instructorName}</span>
        </div>
        {booking.location ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{booking.location}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{booking.duration} min</span>
        </div>
      </div>
    </PremiumBentoCard>
  );
}

export function CancellationRulesCard({
  rules,
}: {
  rules: readonly CancellationRule[];
}) {
  return (
    <PortalCard variant="soft" padding="md">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-[var(--color-primary)]" />
        <h3 className="font-semibold text-[var(--color-text)]">
          Avbestillingsregler
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rules.map((rule) => (
          <div
            key={rule.hours}
            className="rounded-xl border border-[var(--color-primary)]/10 bg-white p-3"
          >
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {rule.hours} timer
            </p>
            <p className="text-xs text-[var(--color-muted)]">{rule.rule}</p>
            <p className="mt-1 text-xs font-medium text-[var(--color-primary)]">
              {rule.fee}
            </p>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}

export function BookingerClient({
  upcoming,
  past,
  cancellationRules,
  emptyMessage,
}: BookingerClientProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <CancellationRulesCard rules={cancellationRules} />
      </motion.div>

      {/* Kommende bookinger */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Kommende økter
            </h2>
          </div>
          <span className="text-sm text-[var(--color-muted)]">
            {upcoming.length} planlagt
          </span>
        </div>

        {upcoming.length === 0 ? (
          <PortalCard padding="lg" className="text-center">
            <p className="text-[var(--color-muted)]">{emptyMessage}</p>
            <Link
              href="/portal/bookinger/ny"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              <Plus className="h-4 w-4" />
              Book din første time
            </Link>
          </PortalCard>
        ) : (
          <PremiumBentoGrid columns={3}>
            {upcoming.map((booking) => (
              <BookingCardItem
                key={booking.id}
                booking={booking}
                variant="default"
              />
            ))}
          </PremiumBentoGrid>
        )}
      </motion.section>

      {/* Tidligere bookinger */}
      {past.length > 0 ? (
        <motion.section variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[var(--color-muted)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Tidligere økter
              </h2>
            </div>
            <span className="text-sm text-[var(--color-muted)]">
              {past.length} fullført
            </span>
          </div>
          <PremiumBentoGrid columns={3}>
            {past.slice(0, 6).map((booking) => (
              <BookingCardItem
                key={booking.id}
                booking={booking}
                variant="soft"
              />
            ))}
          </PremiumBentoGrid>
        </motion.section>
      ) : null}
    </motion.div>
  );
}
