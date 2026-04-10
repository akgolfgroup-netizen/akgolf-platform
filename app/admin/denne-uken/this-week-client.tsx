"use client";

import Image from "next/image";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminStatCard,
  AdminBadge,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import type { WeekBooking, WeekStats } from "./actions";

// ── Status config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "info" | "muted" }
> = {
  CONFIRMED: { label: "Bekreftet", variant: "success" },
  COMPLETED: { label: "Fullfort", variant: "success" },
  PENDING: { label: "Venter", variant: "warning" },
  NO_SHOW: { label: "Ikke mott", variant: "error" },
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

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Bookinger"
            value={stats.totalBookings}
            icon={<Calendar className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Unike elever"
            value={stats.uniqueStudents}
            icon={<Users className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Bekreftet"
            value={stats.confirmedBookings}
            icon={<CheckCircle2 className="w-5 h-5" />}
            change={
              confirmRate >= 80
                ? { value: confirmRate, positive: true }
                : undefined
            }
          />
          <AdminStatCard
            label="Inntekt"
            value={`${stats.weeklyRevenue.toLocaleString("nb-NO")} kr`}
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        {/* Bookings by Day */}
        {bookings.length === 0 ? (
          <AdminEmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="Ingen bookinger denne uken"
            description="Nar elever booker okter vil de dukke opp her."
          />
        ) : (
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Ukens bookinger</h3>
              <span className="text-sm text-[var(--color-muted)]">
                {bookings.length} booking{bookings.length !== 1 ? "er" : ""}
              </span>
            </div>

            <div className="p-6 space-y-8">
              {Array.from(byDate.entries()).map(
                ([dateKey, dayBookings], index) => (
                  <motion.div
                    key={dateKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {/* Day Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--color-grey-100)]">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text)] truncate capitalize">
                          {format(new Date(dateKey), "EEEE d. MMMM", {
                            locale: nb,
                          })}
                        </h3>
                      </div>
                      <AdminBadge variant="muted">
                        {dayBookings.length} booking
                        {dayBookings.length !== 1 ? "er" : ""}
                      </AdminBadge>
                    </div>

                    {/* Booking List */}
                    <div className="space-y-2">
                      {dayBookings.map((booking) => {
                        const statusCfg = STATUS_CONFIG[booking.status] ?? {
                          label: booking.status,
                          variant: "muted" as const,
                        };

                        return (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-grey-50)] hover:bg-[var(--color-grey-100)] transition-colors"
                          >
                            {/* Avatar */}
                            {booking.student.image ? (
                              <Image
                                src={booking.student.image}
                                alt=""
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10">
                                {booking.student.name?.charAt(0) ?? "?"}
                              </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                                {booking.student.name ?? "Ukjent elev"}
                              </p>
                              <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                                {booking.service.name} &middot;{" "}
                                {booking.instructor.name ??
                                  "Ukjent instruktor"}
                              </p>
                            </div>

                            {/* Time + Status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-[var(--color-muted)] flex items-center gap-1 tabular-nums">
                                <Clock className="w-3 h-3" />
                                {format(new Date(booking.startTime), "HH:mm")}
                              </span>
                              <AdminBadge variant={statusCfg.variant}>
                                {statusCfg.label}
                              </AdminBadge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </AdminCard>
        )}
      </div>
    </>
  );
}
