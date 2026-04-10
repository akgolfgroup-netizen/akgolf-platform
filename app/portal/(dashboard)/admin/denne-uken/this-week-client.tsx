"use client";

import Image from "next/image";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import type { WeekBooking, WeekStats } from "./actions";

// ── Status config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  CONFIRMED: {
    label: "Bekreftet",
    className: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  },
  COMPLETED: {
    label: "Fullfort",
    className: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  },
  PENDING: {
    label: "Venter",
    className: "text-[var(--color-warning)] bg-[var(--color-warning)]/10",
  },
  NO_SHOW: {
    label: "Ikke mott",
    className: "text-[var(--color-error)] bg-[var(--color-error)]/10",
  },
};

// ── Component ──────────────────────────────────────────────────────────

interface ThisWeekClientProps {
  bookings: WeekBooking[];
  stats: WeekStats;
}

export function ThisWeekClient({ bookings, stats }: ThisWeekClientProps) {
  const { toggle } = useMCSidebar();

  // Group bookings by date
  const byDate = new Map<string, WeekBooking[]>();
  for (const booking of bookings) {
    const dateKey = format(new Date(booking.startTime), "yyyy-MM-dd");
    const existing = byDate.get(dateKey);
    if (existing) {
      existing.push(booking);
    } else {
      byDate.set(dateKey, [booking]);
    }
  }

  const confirmRate =
    stats.totalBookings > 0
      ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
      : 0;

  return (
    <>
      <MCTopbar
        title="Denne uken"
        subtitle={`Bookinger for ${stats.weekLabel}`}
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Bookinger"
            value={stats.totalBookings}
            icon={Calendar}
          />
          <HGStatCard
            label="Unike elever"
            value={stats.uniqueStudents}
            icon={Users}
          />
          <HGStatCard
            label="Bekreftet"
            value={stats.confirmedBookings}
            trend={
              confirmRate >= 80
                ? { value: confirmRate, direction: "up" as const }
                : undefined
            }
            icon={CheckCircle2}
          />
          <HGStatCard
            label="Inntekt"
            value={`${stats.weeklyRevenue.toLocaleString("nb-NO")} kr`}
            icon={DollarSign}
          />
        </div>

        {/* Bookings by Day */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">Ukens bookinger</h3>
            <span className="text-sm text-[var(--hg-text-muted)]">
              {bookings.length} booking{bookings.length !== 1 ? "er" : ""}
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--hg-surface-raised)] flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-[var(--hg-text-muted)]" />
              </div>
              <p className="text-sm text-[var(--hg-text-muted)]">
                Ingen bookinger denne uken
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-8">
              {Array.from(byDate.entries()).map(
                ([dateKey, dayBookings], index) => (
                  <motion.div
                    key={dateKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {/* Day Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--hg-border)]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--hg-primary)] to-[var(--hg-primary-muted)] flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[var(--hg-bg)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--hg-text)] truncate">
                          {format(new Date(dateKey), "EEEE d. MMMM", {
                            locale: nb,
                          })}
                        </h3>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        {dayBookings.length} booking
                        {dayBookings.length !== 1 ? "er" : ""}
                      </span>
                    </div>

                    {/* Booking List */}
                    <div className="space-y-3">
                      {dayBookings.map((booking) => {
                        const statusCfg = STATUS_CONFIG[booking.status] ?? {
                          label: booking.status,
                          className:
                            "text-[var(--hg-text-muted)] bg-[var(--hg-surface-raised)]",
                        };

                        return (
                          <div
                            key={booking.id}
                            className="hg-card p-3 flex items-center gap-4"
                          >
                            {/* Avatar */}
                            {booking.student.image ? (
                              <Image
                                src={booking.student.image}
                                alt=""
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded-xl object-cover ring-2 ring-[var(--hg-surface-raised)]"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-[var(--hg-text)] bg-[var(--hg-surface-raised)]">
                                {booking.student.name?.charAt(0) ?? "?"}
                              </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--hg-text)] truncate">
                                {booking.student.name ?? "Ukjent elev"}
                              </p>
                              <p className="text-xs text-[var(--hg-text-muted)] truncate mt-0.5">
                                {booking.service.name} &middot;{" "}
                                {booking.instructor.name ?? "Ukjent instruktor"}
                              </p>
                            </div>

                            {/* Time + Status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-[var(--hg-text-muted)] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(booking.startTime), "HH:mm")}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  statusCfg.className
                                )}
                              >
                                {statusCfg.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
