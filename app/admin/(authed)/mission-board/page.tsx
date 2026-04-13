"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Calendar,
  Users,
  AlertCircle,
  Clock,
  DollarSign,
  Activity,
  ArrowRight,
  Plus,
  MessageSquare,
  UserPlus,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
  Bell,
  CheckCircle,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminAreaChart,
  AdminDonutChart,
  AdminSparkline,
  AdminHeatmap,
  AdminTimeline,
  AdminProgressRing,
} from "@/components/portal/mission-control/ui";
import type {
  AdminAreaChartDatum,
  AdminDonutChartDatum,
  AdminHeatmapCell,
  AdminTimelineItem,
} from "@/components/portal/mission-control/ui";
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
    <AdminBadge variant={variantMap[normalized] ?? "muted"}>
      {labels[normalized] ?? status}
    </AdminBadge>
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
            <Loader2 className="w-10 h-10 text-grey-600 animate-spin" />
            <p className="text-grey-500 font-medium">
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
          <AdminEmptyState
            icon={<AlertCircle className="w-6 h-6 text-red-500" />}
            title="Kunne ikke laste data"
            description={error}
            action={
              <AdminButton
                variant="primary"
                onClick={fetchDashboardData}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Prov igjen
              </AdminButton>
            }
            className="max-w-md"
          />
        </div>
      </>
    );
  }

  if (!stats) return null;

  // Reelle chart-data fra server action
  const bookingTrendData: AdminAreaChartDatum[] = charts?.bookingTrend ?? [];
  const bookingDistribution: AdminDonutChartDatum[] = charts?.serviceDistribution ?? [];
  const sparkBookings = charts?.sparkBookings ?? [];
  const sparkRevenue = charts?.sparkRevenue ?? [];
  const sparkStudents = charts?.sparkStudents ?? [];
  const sparkActive = sparkBookings; // Bruker booking-sparkline som proxy

  const heatmapRows = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
  const heatmapCols = ["08", "10", "12", "14", "16", "18", "20"];
  const heatmapData: AdminHeatmapCell[] = charts?.heatmap ?? [];

  // Timeline — dagens hendelser basert pa todaysSchedule
  const timelineItems: AdminTimelineItem[] = stats.todaysSchedule.slice(0, 6).map((b) => ({
    id: b.id,
    title: b.studentName,
    description: `${b.service} med ${b.instructor}`,
    date: b.time,
    color:
      b.status.toLowerCase() === "confirmed" || b.status.toLowerCase() === "completed"
        ? "#22c55e"
        : b.status.toLowerCase() === "pending"
          ? "#f59e0b"
          : "#16a34a",
  }));

  const monthlyGoal = charts?.monthlyGoal ?? 240;
  const monthlyCurrent = charts?.monthlyCurrent ?? 0;

  const quickActions = [
    {
      icon: Plus,
      label: "Ny booking",
      href: "/admin/bookinger/ny",
      variant: "primary" as const,
    },
    {
      icon: MessageSquare,
      label: "Send melding",
      href: "/admin/meldinger",
      variant: "secondary" as const,
    },
    {
      icon: UserPlus,
      label: "Ny elev",
      href: "/admin/elever/ny",
      variant: "secondary" as const,
    },
    {
      icon: FileText,
      label: "Rapport",
      href: "/admin/rapporter",
      variant: "secondary" as const,
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
          <div className="flex items-center gap-2 px-4 py-2 bg-grey-100 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-grey-500">
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
              className="ml-2 p-1.5 hover:bg-grey-200 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Oppdater"
            >
              <RefreshCw
                className={`w-4 h-4 text-grey-600 ${loading ? "animate-spin" : ""}`}
              />
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
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <AdminButton
                    variant={action.variant}
                    className="w-full justify-between"
                    icon={<Icon className="w-4 h-4" />}
                  >
                    <span className="flex-1 text-left">{action.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-60" />
                  </AdminButton>
                </Link>
              );
            })}
          </motion.div>

          {/* Stats Grid med sparklines */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-grey-500">Okter i dag</p>
                  <p className="mt-2 text-3xl font-bold text-grey-900 tracking-tight">
                    {stats.today.totalBookings}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline data={sparkBookings} width="100%" height={32} />
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-grey-500">Aktive okter</p>
                  <p className="mt-2 text-3xl font-bold text-grey-900 tracking-tight">
                    {stats.today.activeSessions}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkActive}
                width="100%"
                height={32}
                color="#22c55e"
              />
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-grey-500">Nye elever (uke)</p>
                  <p className="mt-2 text-3xl font-bold text-grey-900 tracking-tight">
                    {stats.week.newStudents}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkStudents}
                width="100%"
                height={32}
                color="#16a34a"
              />
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-grey-500">Omsetning (uke)</p>
                  <p className="mt-2 text-3xl font-bold text-grey-900 tracking-tight">
                    {`${stats.week.revenue.toLocaleString("nb-NO")} kr`}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <AdminSparkline
                data={sparkRevenue}
                width="100%"
                height={32}
                color="#16a34a"
              />
            </div>
          </motion.div>

          {/* Charts — trend + fordeling + manedsmal */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-grey-900">Bookinger siste 30 dager</h3>
                <AdminBadge variant="info">Trend</AdminBadge>
              </div>
              <AdminAreaChart data={bookingTrendData} height={240} />
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <h3 className="text-base font-semibold text-grey-900 mb-4">Manedlig mal</h3>
              <div className="flex flex-col items-center justify-center py-4">
                <AdminProgressRing
                  value={monthlyCurrent}
                  max={monthlyGoal}
                  size={140}
                  strokeWidth={12}
                  label={`${monthlyCurrent} / ${monthlyGoal} okter`}
                />
              </div>
            </div>
          </motion.div>

          {/* Heatmap + Donut */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-grey-900">Aktivitet denne uken</h3>
                <span className="text-xs text-grey-500">Dag x time</span>
              </div>
              <div className="overflow-x-auto">
                <AdminHeatmap
                  data={heatmapData}
                  rows={heatmapRows}
                  cols={heatmapCols}
                  cellSize={32}
                  formatTooltip={(c) => `${c.row} kl. ${c.col}:00 — ${c.value} okter`}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <h3 className="text-base font-semibold text-grey-900 mb-4">Fordeling per tjeneste</h3>
              <AdminDonutChart
                data={bookingDistribution}
                height={240}
                centerLabel="Denne uken"
                centerValue={bookingDistribution.reduce((s, d) => s + d.value, 0)}
              />
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-grey-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <h2 className="text-base font-semibold text-grey-900">Dagens timeplan</h2>
                  </div>
                  <Link
                    href="/admin/kalender"
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    Se kalender
                    <ArrowRight className="w-4 h-4" />
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
                        className="px-6 py-4 hover:bg-grey-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-grey-900 tabular-nums">
                              {booking.time}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-grey-900">
                                {booking.studentName}
                              </p>
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-sm text-grey-500">
                              {booking.service}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-grey-500">
                              {booking.instructor}
                            </p>
                          </div>

                          <ArrowRight className="w-5 h-5 text-grey-300 group-hover:text-green-600 transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-grey-400 mx-auto mb-4" />
                    <p className="text-grey-500">
                      Ingen bookinger i dag
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights Card */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-xl shadow-card relative overflow-hidden p-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="text-base font-semibold text-grey-900">AI-innsikt</h3>
                    </div>

                    <p className="text-sm text-grey-500 mb-4 leading-relaxed">
                      Basert pa monsteret denne uken, anbefales det a legge
                      til en ekstra &quot;Quick Fix&quot;-slot pa fredag
                      ettermiddag. Etterspurselen er hoy.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/admin/analytics")}
                      className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Se detaljert analyse
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-grey-200">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      <h3 className="text-base font-semibold text-grey-900">Varsler</h3>
                      {stats.alerts.length > 0 && (
                        <span className="ml-auto px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
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
                          className="px-6 py-4 flex items-start gap-3 hover:bg-grey-50 transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === "warning"
                                ? "bg-amber-500"
                                : alert.type === "success"
                                  ? "bg-green-500"
                                  : "bg-green-600"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-grey-900">
                              {alert.message}
                            </p>
                            <p className="text-xs text-grey-500 mt-1">
                              {alert.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-grey-500">
                        Ingen aktive varsler
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Timeline — dagens aktivitet */}
              {timelineItems.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-card p-5">
                    <h3 className="text-base font-semibold text-grey-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      Dagens aktivitet
                    </h3>
                    <AdminTimeline items={timelineItems} />
                  </div>
                </motion.div>
              )}

              {/* Weekly Summary */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-xl shadow-card p-5">
                  <h3 className="text-base font-semibold text-grey-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Denne uken
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-grey-500">
                        Totale bookinger
                      </span>
                      <span className="font-semibold text-grey-900 tabular-nums">
                        {stats.week.totalBookings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-grey-500">
                        Omsetning
                      </span>
                      <span className="font-semibold text-green-600 tabular-nums">
                        {stats.week.revenue.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-grey-500">
                        Retention
                      </span>
                      <span className="font-semibold text-grey-900 tabular-nums">
                        {stats.week.retention}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
