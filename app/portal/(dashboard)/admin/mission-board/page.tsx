"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
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
  Target,
  Zap,
  Bell,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

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

// Quick Action Component
function QuickAction({
  icon: Icon,
  label,
  href,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  variant?: "primary" | "default";
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={
          variant === "primary"
            ? "hg-btn hg-btn-primary justify-start gap-3 px-5 py-4 rounded-xl text-sm"
            : "hg-btn hg-btn-secondary justify-start gap-3 px-5 py-4 rounded-xl text-sm"
        }
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 ml-auto opacity-60" />
      </motion.div>
    </Link>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="hg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
          <Icon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1.5 text-sm font-medium ${
              trendUp
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]"
            }`}
          >
            {trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="hg-label">{label}</p>
        <p className="text-3xl font-bold text-[var(--color-text)] tracking-tight tabular-nums">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// Status Badge Component
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase() as BookingStatus;

  const styles: Record<BookingStatus, string> = {
    confirmed:
      "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
    pending:
      "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
    cancelled:
      "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20",
    completed:
      "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  };

  const icons: Record<BookingStatus, React.ElementType> = {
    confirmed: CheckCircle,
    pending: Clock3,
    cancelled: XCircle,
    completed: CheckCircle,
  };

  const labels: Record<BookingStatus, string> = {
    confirmed: "Bekreftet",
    pending: "Venter",
    cancelled: "Avlyst",
    completed: "Fullfort",
  };

  const BadgeIcon = icons[normalized] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[normalized] || styles.pending}`}
    >
      <BadgeIcon className="w-3.5 h-3.5" />
      {labels[normalized] || status}
    </span>
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

      const response = await fetch("/api/portal/admin/dashboard");
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
          <div className="hg-card p-8 max-w-md text-center border-[var(--color-error)]/20">
            <AlertCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
              Kunne ikke laste data
            </h2>
            <p className="text-[var(--color-muted)] mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="hg-btn hg-btn-primary"
            >
              <RefreshCw className="w-4 h-4" />
              Prov igjen
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!stats) return null;

  return (
    <>
      <MCTopbar
        title="Mission Board"
        subtitle="Oversikt over akademiet"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Last Updated */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 px-4 py-2 hg-card">
            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
            <span className="text-sm text-[var(--color-muted)]">
              Sist oppdatert:{" "}
              {lastUpdated.toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="ml-2 p-1.5 hover:bg-[var(--color-surface)] rounded-lg transition-colors disabled:opacity-50"
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
          className="space-y-5"
        >
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <QuickAction
              icon={Plus}
              label="Ny Booking"
              href="/portal/admin/bookinger/ny"
              variant="primary"
            />
            <QuickAction
              icon={MessageSquare}
              label="Send Melding"
              href="/portal/admin/meldinger"
            />
            <QuickAction
              icon={UserPlus}
              label="Ny Elev"
              href="/portal/admin/elever/ny"
            />
            <QuickAction
              icon={FileText}
              label="Rapport"
              href="/portal/admin/rapporter"
            />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Okter i dag"
              value={stats.today.totalBookings}
              trend={
                stats.trends.bookings !== 0
                  ? `${stats.trends.bookings > 0 ? "+" : ""}${stats.trends.bookings}`
                  : undefined
              }
              trendUp={stats.trends.bookings > 0}
            />
            <StatCard
              icon={Activity}
              label="Aktive okter"
              value={stats.today.activeSessions}
            />
            <StatCard
              icon={Users}
              label="Nye elever (uke)"
              value={stats.week.newStudents}
              trend={
                stats.trends.students !== 0
                  ? `${stats.trends.students > 0 ? "+" : ""}${stats.trends.students}`
                  : undefined
              }
              trendUp={stats.trends.students > 0}
            />
            <StatCard
              icon={DollarSign}
              label="Omsetning (uke)"
              value={`${stats.week.revenue.toLocaleString("nb-NO")} kr`}
              trend={
                stats.trends.revenue !== 0
                  ? `${stats.trends.revenue > 0 ? "+" : ""}${stats.trends.revenue}%`
                  : undefined
              }
              trendUp={stats.trends.revenue > 0}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="hg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--color-grey-300)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="hg-section-title">Dagens timeplan</h2>
                  </div>
                  <Link
                    href="/portal/admin/kalender"
                    className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    Se kalender
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="divide-y divide-[var(--color-grey-200)]">
                  {stats.todaysSchedule.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-5 py-4 hover:bg-[var(--color-surface)] transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                            {booking.time}
                          </p>
                        </div>

                        <div className="flex-1">
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

                {stats.todaysSchedule.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4 opacity-50" />
                    <p className="text-[var(--color-muted)]">
                      Ingen bookinger i dag
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* AI Insights Card */}
              <motion.div variants={itemVariants}>
                <div className="hg-card p-6 relative overflow-hidden border-[var(--color-ai)]/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-ai)]/5 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
                      <h3 className="font-bold text-[var(--color-text)]">
                        AI-innsikt
                      </h3>
                    </div>

                    <p className="text-sm text-[var(--color-muted)] mb-4 leading-relaxed">
                      Basert pa monsteret denne uken, anbefales det a legge til
                      en ekstra &quot;Quick Fix&quot;-slot pa fredag
                      ettermiddag. Ettersporselen er hoy.
                    </p>

                    <button className="w-full py-3 bg-[var(--color-ai)]/10 hover:bg-[var(--color-ai)]/20 border border-[var(--color-ai)]/30 text-[var(--color-ai)] rounded-xl text-sm font-semibold transition-all">
                      Se detaljert analyse
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants}>
                <div className="hg-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-[var(--color-grey-300)]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-bold text-[var(--color-text)]">
                        Varsler
                      </h3>
                      {stats.alerts.length > 0 && (
                        <span className="ml-auto px-2.5 py-0.5 bg-[var(--color-accent-cta)] text-[var(--color-primary)] text-xs font-bold rounded-full">
                          {stats.alerts.length}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-[var(--color-grey-200)]">
                    {stats.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="px-5 py-4 flex items-start gap-3 hover:bg-[var(--color-surface)] transition-colors"
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

                  {stats.alerts.length === 0 && (
                    <div className="px-5 py-8 text-center">
                      <CheckCircle className="w-10 h-10 text-[var(--color-success)] mx-auto mb-3 opacity-30" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Ingen aktive varsler
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weekly Summary */}
              <motion.div variants={itemVariants}>
                <div className="hg-card p-5">
                  <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[var(--color-primary)]" />
                    Denne uken
                  </h3>

                  <div className="space-y-4">
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
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
