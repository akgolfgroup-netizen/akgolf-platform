"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { DollarSign, MessageSquare, UserPlus, FileText } from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminAreaChart,
  AdminSparkline,
  AdminTimeline,
  AdminProgressRing,
} from "@/components/portal/mission-control/ui";
import type {
  AdminAreaChartDatum,
  AdminTimelineItem,
} from "@/components/portal/mission-control/ui";
import { Card, Button, Badge } from "@/components/ui";
import { getMissionBoardCharts, type MissionBoardCharts } from "./actions";

// Types — matcher respons fra /api/portal/admin/dashboard
interface DashboardStats {
  today: {
    totalBookings: number;
    activeSessions: number;
    revenue: number;
    cancellations: number;
  };
  week: {
    totalBookings: number;
    revenue: number;
    newStudents: number;
    retention: number;
  };
  trends: {
    bookings: number;
    revenue: number;
    students: number;
  };
  alerts: {
    type: "warning" | "info" | "success";
    message: string;
    time: string;
  }[];
  todaysSchedule: {
    id: string;
    time: string;
    studentName: string;
    service: string;
    instructor: string;
    status: string;
  }[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Status Badge
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase() as BookingStatus;

  const variantMap: Record<
    BookingStatus,
    "success" | "warning" | "error" | "info" | "muted"
  > = {
    confirmed: "success",
    pending: "warning",
    cancelled: "error",
    completed: "success",
  };

  const labels: Record<BookingStatus, string> = {
    confirmed: "Bekreftet",
    pending: "Venter",
    cancelled: "Avlyst",
    completed: "Fullfort",
  };

  return (
    <Badge variant={variantMap[normalized] ?? "muted"}>
      {labels[normalized] ?? status}
    </Badge>
  );
}

// Main Component
export default function MissionBoardPage() {
  const { toggle } = useMCSidebar();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<MissionBoardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [response, chartData] = await Promise.all([
        fetch("/api/portal/admin/dashboard"),
        getMissionBoardCharts(),
      ]);
      if (!response.ok) throw new Error("Kunne ikke hente dashboard-data");

      const data: DashboardStats = await response.json();
      setStats(data);
      setCharts(chartData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <>
        <MCTopbar
          title="Mission Board"
          subtitle="Oversikt over akademiet"
          onMenuClick={toggle}
        />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <Icon name="progress_activity" className="w-10 h-10 text-on-surface-variant/80 animate-spin" />
            <p className="text-on-surface-variant/80 font-medium">
              Laster Mission Board...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MCTopbar
          title="Mission Board"
          subtitle="Oversikt over akademiet"
          onMenuClick={toggle}
        />
        <div className="flex items-center justify-center p-6 py-32">
          <Card padding="lg" className="max-w-md flex flex-col items-center justify-center text-center py-12 px-6">
            <Icon name="error" className="w-12 h-12 text-error mb-4" />
            <h3 className="text-lg font-semibold text-on-surface mb-2">Kunne ikke laste data</h3>
            <p className="text-sm text-on-surface-variant/80 mb-6">{error}</p>
            <Button variant="accent" onClick={fetchDashboardData} className="gap-2">
              <Icon name="refresh" className="w-4 h-4" />
              Prøv igjen
            </Button>
          </Card>
        </div>
      </>
    );
  }

  if (!stats) return null;

  // Reelle chart-data fra server action
  const bookingTrendData: AdminAreaChartDatum[] = charts?.bookingTrend ?? [];
  const sparkBookings = charts?.sparkBookings ?? [];
  const sparkRevenue = charts?.sparkRevenue ?? [];
  const sparkStudents = charts?.sparkStudents ?? [];
  const sparkActive = sparkBookings; // Bruker booking-sparkline som proxy

  // Timeline — dagens hendelser basert pa todaysSchedule
  const timelineItems: AdminTimelineItem[] = stats.todaysSchedule.slice(0, 6).map((b) => ({
    id: b.id,
    title: b.studentName,
    description: `${b.service} med ${b.instructor}`,
    date: b.time,
    color:
      b.status.toLowerCase() === "confirmed" || b.status.toLowerCase() === "completed"
        ? "var(--color-success)"
        : b.status.toLowerCase() === "pending"
          ? "var(--color-warning)"
          : "var(--color-success)",
  }));

  const monthlyGoal = charts?.monthlyGoal ?? 240;
  const monthlyCurrent = charts?.monthlyCurrent ?? 0;

  const secondaryActions = [
    {
      icon: MessageSquare,
      label: "Send melding",
      href: "/admin/meldinger",
    },
    {
      icon: UserPlus,
      label: "Ny elev",
      href: "/admin/elever/ny",
    },
    {
      icon: FileText,
      label: "Rapport",
      href: "/admin/rapporter",
    },
  ];

  return (
    <>
      <MCTopbar
        title="Mission Board"
        subtitle="Oversikt over akademiet"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {/* Last Updated */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-on-surface-variant/80">
              Sist oppdatert:{" "}
              {lastUpdated.toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="ml-2 p-1.5 hover:bg-surface-variant rounded-lg transition-colors disabled:opacity-50"
              aria-label="Oppdater"
            >
              <Icon name="refresh"
                className={`w-4 h-4 text-on-surface-variant/80 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              {secondaryActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <Button
                      variant="secondary"
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <Link href="/admin/bookinger/ny">
              <Button
                variant="accent"
                className="gap-2"
              >
                <Icon name="add" className="w-4 h-4" />
                Ny booking
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid med sparklines */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card padding="sm" hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface-variant/80">Okter i dag</p>
                  <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight">
                    {stats.today.totalBookings}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success">
                  <Icon name="calendar_today" className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline data={sparkBookings} width="100%" height={32} />
            </Card>

            <Card padding="sm" hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface-variant/80">Aktive okter</p>
                  <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight">
                    {stats.today.activeSessions}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success">
                  <Icon name="monitoring" className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkActive}
                width="100%"
                height={32}
                color="var(--color-success)"
              />
            </Card>

            <Card padding="sm" hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface-variant/80">Nye elever (uke)</p>
                  <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight">
                    {stats.week.newStudents}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success">
                  <Icon name="group" className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkStudents}
                width="100%"
                height={32}
                color="var(--color-success)"
              />
            </Card>

            <Card padding="sm" hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface-variant/80">Omsetning (uke)</p>
                  <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight">
                    {`${stats.week.revenue.toLocaleString("nb-NO")} kr`}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkRevenue}
                width="100%"
                height={32}
                color="var(--color-success)"
              />
            </Card>
          </motion.div>

          {/* Charts — trend + manedsmal */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Card padding="sm" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-on-surface">Bookinger siste 30 dager</h3>
                <Badge variant="info">Trend</Badge>
              </div>
              <AdminAreaChart data={bookingTrendData} height={240} />
            </Card>

            <Card padding="sm">
              <h3 className="text-base font-semibold text-on-surface mb-4">Manedlig mal</h3>
              <div className="flex flex-col items-center justify-center py-4">
                <AdminProgressRing
                  value={monthlyCurrent}
                  max={monthlyGoal}
                  size={140}
                 
                  label={`${monthlyCurrent} / ${monthlyGoal} okter`}
                />
              </div>
            </Card>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card padding="none" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="schedule" className="w-5 h-5 text-success" />
                    <h2 className="text-base font-semibold text-on-surface">Dagens timeplan</h2>
                  </div>
                  <Link
                    href="/admin/kalender"
                    className="text-sm text-success hover:text-success-text font-medium flex items-center gap-1.5 transition-colors"
                  >
                    Se kalender
                    <Icon name="arrow_forward" className="w-4 h-4" />
                  </Link>
                </div>

                {stats.todaysSchedule.length > 0 ? (
                  <div className="divide-y divide-grey-100">
                    {stats.todaysSchedule.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => router.push(`/admin/bookinger?date=${new Date().toISOString().slice(0, 10)}`)}
                        className="px-6 py-4 hover:bg-surface transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-on-surface tabular-nums">
                              {booking.time}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-on-surface">
                                {booking.studentName}
                              </p>
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-sm text-on-surface-variant/80">
                              {booking.service}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-on-surface-variant/80">
                              {booking.instructor}
                            </p>
                          </div>

                          <Icon name="arrow_forward" className="w-5 h-5 text-on-surface-variant/60 group-hover:text-success transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Icon name="calendar_today" className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
                    <p className="text-on-surface-variant/80">
                      Ingen bookinger i dag
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights Card */}
              <motion.div variants={itemVariants}>
                <Card padding="sm" className="border-l-4 border-l-ai">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="auto_awesome" className="w-5 h-5 text-ai" />
                    <h3 className="text-base font-semibold text-on-surface">AI-innsikt</h3>
                  </div>

                  <p className="text-sm text-on-surface-variant/80 mb-4 leading-relaxed">
                    Basert pa monsteret denne uken, anbefales det a legge
                    til en ekstra &quot;Quick Fix&quot;-slot pa fredag
                    ettermiddag. Etterspurselen er hoy.
                  </p>

                  <Button
                    variant="secondary"
                    onClick={() => router.push("/admin/analytics")}
                    className="w-full"
                  >
                    Se detaljert analyse
                  </Button>
                </Card>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants}>
                <Card padding="none" className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <Icon name="notifications" className="w-5 h-5 text-success" />
                      <h3 className="text-base font-semibold text-on-surface">Varsler</h3>
                      {stats.alerts.length > 0 && (
                        <span className="ml-auto px-2.5 py-0.5 bg-success-light text-success-text text-xs font-bold rounded-full">
                          {stats.alerts.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {stats.alerts.length > 0 ? (
                    <div className="divide-y divide-grey-100">
                      {stats.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="px-6 py-4 flex items-start gap-3 hover:bg-surface transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === "warning"
                                ? "bg-warning"
                                : alert.type === "success"
                                  ? "bg-success"
                                  : "bg-success"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-on-surface">
                              {alert.message}
                            </p>
                            <p className="text-xs text-on-surface-variant/80 mt-1">
                              {alert.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <Icon name="check_circle" className="w-10 h-10 text-success mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-on-surface-variant/80">
                        Ingen aktive varsler
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Timeline — dagens aktivitet */}
              {timelineItems.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card padding="sm" className="p-5">
                    <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                      <Icon name="schedule" className="w-5 h-5 text-success" />
                      Dagens aktivitet
                    </h3>
                    <AdminTimeline items={timelineItems} />
                  </Card>
                </motion.div>
              )}

              {/* Weekly Summary */}
              <motion.div variants={itemVariants}>
                <Card padding="sm" className="p-5">
                  <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="bolt" className="w-5 h-5 text-success" />
                    Denne uken
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant/80">
                        Totale bookinger
                      </span>
                      <span className="font-semibold text-on-surface tabular-nums">
                        {stats.week.totalBookings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant/80">
                        Omsetning
                      </span>
                      <span className="font-semibold text-success tabular-nums">
                        {stats.week.revenue.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant/80">
                        Retention
                      </span>
                      <span className="font-semibold text-on-surface tabular-nums">
                        {stats.week.retention}%
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
