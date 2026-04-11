"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Target,
  Trophy,
  User as UserIcon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  HeroHeading,
  GlassCard,
  Shimmer,
  fadeInUp,
  staggerContainer,
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

function iconForType(type: BookingViewModel["type"]): LucideIcon {
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

const BADGE_STYLES: Record<BadgeVariant, string> = {
  success:
    "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  warning:
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  neutral:
    "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-grey-200)]",
};

function StatusBadge({ label, variant }: StatusConfig) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border ${BADGE_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}

function UpcomingBookingRow({ booking }: { booking: BookingViewModel }) {
  const status = statusConfig(booking);
  const Icon = iconForType(booking.type);
  const dateLabel = formatDateLabel(booking.startTime);
  const timeLabel = formatTimeRange(booking.startTime, booking.duration);

  return (
    <Link href={`/portal/bookinger/${booking.id}`} className="block">
      <GlassCard
        variant="light"
        padding="md"
        interactive
        className="group"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Icon
              className="w-5 h-5 text-[var(--color-primary)]"
              strokeWidth={1.75}
            />
          </div>

          {/* Innhold */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-semibold text-[14px] text-[var(--color-grey-900)] truncate">
                {booking.serviceName}
              </h3>
              <StatusBadge label={status.label} variant={status.variant} />
            </div>
            <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider mb-2 tabular-nums">
              {dateLabel} · {timeLabel}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3 h-3" strokeWidth={1.75} />
                <span className="truncate">{booking.instructorName}</span>
              </span>
              {booking.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" strokeWidth={1.75} />
                  <span className="truncate">{booking.location}</span>
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" strokeWidth={1.75} />
                <span className="tabular-nums">{booking.duration} min</span>
              </span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
        </div>
      </GlassCard>
    </Link>
  );
}

function PastBookingRow({ booking }: { booking: BookingViewModel }) {
  const status = statusConfig(booking);
  const Icon = iconForType(booking.type);
  const dateLabel = format(booking.startTime, "d. MMM yyyy", { locale: nb });
  const timeLabel = format(booking.startTime, "HH:mm");

  return (
    <Link href={`/portal/bookinger/${booking.id}`} className="block">
      <GlassCard
        variant="light"
        padding="sm"
        interactive
        className="group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] flex items-center justify-center shrink-0">
            <Icon
              className="w-4 h-4 text-[var(--color-muted)]"
              strokeWidth={1.75}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[13px] text-[var(--color-grey-900)] truncate">
              {booking.serviceName}
            </p>
            <p className="text-[11px] text-[var(--color-muted)] tabular-nums">
              {dateLabel} · {timeLabel} · {booking.instructorName}
            </p>
          </div>
          <StatusBadge label={status.label} variant={status.variant} />
        </div>
      </GlassCard>
    </Link>
  );
}

export function CancellationRulesCard({
  rules,
}: {
  rules: readonly CancellationRule[];
}) {
  return (
    <GlassCard variant="light" padding="md">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Clock className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[13px] text-[var(--color-grey-900)]">
            Avbestillingsregler
          </h3>
          <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
            Gjelder alle bookinger
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rules.map((rule) => (
          <div
            key={rule.hours}
            className="rounded-2xl border border-[var(--color-grey-200)] bg-white/50 p-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-1">
              {rule.hours} timer
            </p>
            <p className="text-[12px] text-[var(--color-text)] mb-1">
              {rule.rule}
            </p>
            <p className="text-[11px] font-semibold text-[var(--color-primary)] tabular-nums">
              {rule.fee}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function BookingerClient({
  upcoming,
  past,
  cancellationRules,
  emptyMessage,
}: BookingerClientProps) {
  const upcomingCount = upcoming.length;
  const pastCount = past.length;

  return (
    <div className="space-y-10">
      {/* ═══ HERO ═══ */}
      <HeroHeading
        label="Mine bookinger"
        title={
          <>
            Dine{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              bookinger
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description={
          <>
            <span className="font-semibold text-[var(--color-grey-900)] tabular-nums">
              {upcomingCount}
            </span>{" "}
            kommende og{" "}
            <span className="font-semibold text-[var(--color-grey-900)] tabular-nums">
              {pastCount}
            </span>{" "}
            tidligere økter. Administrer dine coaching-timer og treninger.
          </>
        }
        actions={
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/portal/bookinger/ny"
              className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
            >
              <Shimmer />
              <Plus className="w-3.5 h-3.5 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Ny booking</span>
            </Link>
          </motion.div>
        }
      />

      {/* ═══ CANCELLATION RULES ═══ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <CancellationRulesCard rules={cancellationRules} />
      </motion.div>

      {/* ═══ KOMMENDE ═══ */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--color-muted)]" />
            Kommende
          </p>
          <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
            {upcomingCount} planlagt
          </span>
        </div>

        {upcomingCount === 0 ? (
          <GlassCard variant="light" padding="lg" className="text-center">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Calendar
                  className="w-6 h-6 text-[var(--color-primary)]"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-[13px] text-[var(--color-muted)] max-w-sm">
                {emptyMessage}
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-primary)] hover:gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Book din første time
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking, i) => (
              <motion.div
                key={booking.id}
                variants={fadeInUp}
                transition={{ delay: i * 0.05 }}
              >
                <UpcomingBookingRow booking={booking} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ═══ TIDLIGERE ═══ */}
      {pastCount > 0 ? (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[var(--color-muted)]" />
              Tidligere
            </p>
            <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
              {pastCount} fullført
            </span>
          </div>
          <div className="space-y-2">
            {past.slice(0, 8).map((booking, i) => (
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
      ) : null}
    </div>
  );
}
