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
  AdminTimeline,
  AdminProgressRing,
  AdminBarChart,
} from "@/components/portal/mission-control/ui";
import type {
  AdminTimelineItem,
  AdminBarChartDatum,
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

  // Daglig aktivitet for bar chart (man-son)
  const dayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
  const dailyCounts = new Array(7).fill(0) as number[];
  for (const b of bookings) {
    const d = new Date(b.startTime);
    // getDay: 0=son, 1=man ... -> map til 0=man ... 6=son
    const idx = (d.getDay() + 6) % 7;
    dailyCounts[idx] += 1;
  }
  const dailyData: AdminBarChartDatum[] = dayLabels.map((label, i) => ({
    label,
    value: dailyCounts[i],
  }));

  // Timeline — ukens hendelser (topp 8 kommende)
  const now = new Date();
  const timelineItems: AdminTimelineItem[] = bookings
    .filter((b) => new Date(b.startTime) >= now)
    .slice(0, 8)
    .map((b) => ({
      id: b.id,
      title: b.student.name ?? "Ukjent elev",
      description: `${b.service.name} · ${b.instructor.name ?? "Ukjent instruktor"}`,
      date: format(new Date(b.startTime), "EEE d. MMM HH:mm", { locale: nb }),
      color:
        b.status === "CONFIRMED" || b.status === "COMPLETED"
          ? "var(--color-success)"
          : b.status === "PENDING"
            ? "var(--color-warning)"
            : "var(--color-primary)",
    }));

  // Ukemal (eksempel — 50 okter per uke)
  const weeklyGoal = 50;

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

        {/* Visualiseringer — ukemal, daglig aktivitet, timeline */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AdminCard>
              <h3 className="admin-section-title mb-4">Ukemal</h3>
              <div className="flex flex-col items-center justify-center py-2">
                <AdminProgressRing
                  value={stats.totalBookings}
                  max={weeklyGoal}
                  size={160}
                  strokeWidth={12}
                  label={`${stats.totalBookings} av ${weeklyGoal} bookinger`}
                />
              </div>
            </AdminCard>

            <AdminCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Daglig aktivitet</h3>
                <AdminBadge variant="info">Denne uken</AdminBadge>
              </div>
              <AdminBarChart data={dailyData} height={220} />
            </AdminCard>
          </div>
        )}

        {timelineItems.length > 0 && (
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Ukens kommende hendelser</h3>
              <span className="text-xs text-[var(--color-muted)]">
                {timelineItems.length} hendelser
              </span>
            </div>
            <AdminTimeline items={timelineItems} />
          </AdminCard>
        )}

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
