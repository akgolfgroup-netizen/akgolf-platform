"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";

// Types — matcher respons fra /api/admin/dashboard
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Kunne ikke hente dashboard-data");

      const data: DashboardStats = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
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
            <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
            <p className="text-[var(--color-muted)] font-medium">
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
            icon={<AlertCircle className="w-6 h-6 text-[var(--color-error)]" />}
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
          <div className="flex items-center gap-2 px-4 py-2 admin-card-sm">
            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
            <span className="text-sm text-[var(--color-muted)]">
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
              className="ml-2 p-1.5 hover:bg-[var(--color-grey-100)] rounded-lg transition-colors disabled:opacity-50"
              aria-label="Oppdater"
            >
              <RefreshCw
                className={`w-4 h-4 text-[var(--color-primary)] ${loading ? "animate-spin" : ""}`}
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

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <AdminStatCard
              label="Okter i dag"
              value={stats.today.totalBookings}
              icon={<Calendar className="w-5 h-5" />}
              change={
                stats.trends.bookings !== 0
                  ? {
                      value: stats.trends.bookings,
                      positive: stats.trends.bookings > 0,
                    }
                  : undefined
              }
            />
            <AdminStatCard
              label="Aktive okter"
              value={stats.today.activeSessions}
              icon={<Activity className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Nye elever (uke)"
              value={stats.week.newStudents}
              icon={<Users className="w-5 h-5" />}
              change={
                stats.trends.students !== 0
                  ? {
                      value: stats.trends.students,
                      positive: stats.trends.students > 0,
                    }
                  : undefined
              }
            />
            <AdminStatCard
              label="Omsetning (uke)"
              value={`${stats.week.revenue.toLocaleString("nb-NO")} kr`}
              icon={<DollarSign className="w-5 h-5" />}
              change={
                stats.trends.revenue !== 0
                  ? {
                      value: stats.trends.revenue,
                      positive: stats.trends.revenue > 0,
                    }
                  : undefined
              }
            />
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <AdminCard className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="admin-section-title">Dagens timeplan</h2>
                  </div>
                  <Link
                    href="/admin/kalender"
                    className="text-sm text-[var(--color-primary)] hover:opacity-80 font-medium flex items-center gap-1.5 transition-opacity"
                  >
                    Se kalender
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {stats.todaysSchedule.length > 0 ? (
                  <div className="divide-y divide-[var(--color-grey-100)]">
                    {stats.todaysSchedule.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 hover:bg-[var(--color-grey-50)] transition-colors group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                              {booking.time}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-[var(--color-text)]">
                                {booking.studentName}
                              </p>
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">
                              {booking.service}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-[var(--color-muted)]">
                              {booking.instructor}
                            </p>
                          </div>

                          <ArrowRight className="w-5 h-5 text-[var(--color-grey-300)] group-hover:text-[var(--color-primary)] transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4 opacity-50" />
                    <p className="text-[var(--color-muted)]">
                      Ingen bookinger i dag
                    </p>
                  </div>
                )}
              </AdminCard>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights Card */}
              <motion.div variants={itemVariants}>
                <AdminCard className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-ai)]/5 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
                      <h3 className="admin-section-title">AI-innsikt</h3>
                    </div>

                    <p className="text-sm text-[var(--color-muted)] mb-4 leading-relaxed">
                      Basert pa monsteret denne uken, anbefales det a legge
                      til en ekstra &quot;Quick Fix&quot;-slot pa fredag
                      ettermiddag. Etterspurselen er hoy.
                    </p>

                    <button
                      type="button"
                      className="w-full py-2.5 bg-[var(--color-ai)]/10 hover:bg-[var(--color-ai)]/20 border border-[var(--color-ai)]/30 text-[var(--color-ai)] rounded-lg text-sm font-semibold transition-colors"
                    >
                      Se detaljert analyse
                    </button>
                  </div>
                </AdminCard>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants}>
                <AdminCard className="p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="admin-section-title">Varsler</h3>
                      {stats.alerts.length > 0 && (
                        <span className="ml-auto px-2.5 py-0.5 bg-[var(--color-accent-cta)] text-[var(--color-primary)] text-xs font-bold rounded-full">
                          {stats.alerts.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {stats.alerts.length > 0 ? (
                    <div className="divide-y divide-[var(--color-grey-100)]">
                      {stats.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="px-6 py-4 flex items-start gap-3 hover:bg-[var(--color-grey-50)] transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === "warning"
                                ? "bg-[var(--color-warning)]"
                                : alert.type === "success"
                                  ? "bg-[var(--color-success)]"
                                  : "bg-[var(--color-primary)]"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-[var(--color-text)]">
                              {alert.message}
                            </p>
                            <p className="text-xs text-[var(--color-muted)] mt-1">
                              {alert.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <CheckCircle className="w-10 h-10 text-[var(--color-success)] mx-auto mb-3 opacity-30" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Ingen aktive varsler
                      </p>
                    </div>
                  )}
                </AdminCard>
              </motion.div>

              {/* Weekly Summary */}
              <motion.div variants={itemVariants}>
                <AdminCard>
                  <h3 className="admin-section-title mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[var(--color-primary)]" />
                    Denne uken
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-muted)]">
                        Totale bookinger
                      </span>
                      <span className="font-semibold text-[var(--color-text)] tabular-nums">
                        {stats.week.totalBookings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-muted)]">
                        Omsetning
                      </span>
                      <span className="font-semibold text-[var(--color-primary)] tabular-nums">
                        {stats.week.revenue.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-muted)]">
                        Retention
                      </span>
                      <span className="font-semibold text-[var(--color-text)] tabular-nums">
                        {stats.week.retention}%
                      </span>
                    </div>
                  </div>
                </AdminCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
