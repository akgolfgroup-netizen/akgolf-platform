"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
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
        className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
          variant === "primary"
            ? "bg-[#DFFF00] text-[#154212] hover:shadow-[0_0_20px_rgba(223,255,0,0.3)]"
            : "bg-[#1A1D1A] text-[#F5F1E8] border border-[#2D5A27]/30 hover:border-[#DFFF00]/30 hover:bg-[#2A2D2A]"
        }`}
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
  delay = 0,
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
      className="relative bg-[#141914] border border-[#2D5A27]/20 rounded-2xl p-6 overflow-hidden group hover:border-[#2D5A27]/40 transition-all duration-300"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A27]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-[#2D5A27]/10 rounded-xl border border-[#2D5A27]/20">
            <Icon className="w-6 h-6 text-[#DFFF00]" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1.5 text-sm font-medium ${
                trendUp ? "text-[#DFFF00]" : "text-red-400"
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
          <p className="text-[#F5F1E8]/50 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#F5F1E8] tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Status Badge Component
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase() as BookingStatus;

  const styles: Record<BookingStatus, string> = {
    confirmed: "bg-[#DFFF00]/10 text-[#DFFF00] border-[#DFFF00]/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    completed: "bg-[#DFFF00]/10 text-[#DFFF00] border-[#DFFF00]/20",
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

  const Icon = icons[normalized] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[normalized] || styles.pending}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {labels[normalized] || status}
    </span>
  );
}

// Main Component
export default function MissionBoardPage() {
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
      <div className="min-h-screen bg-[#0D0F0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#DFFF00] animate-spin" />
          <p className="text-[#F5F1E8]/60 font-medium">Laster Mission Board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0F0D] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#F5F1E8] mb-2">Kunne ikke laste data</h2>
          <p className="text-[#F5F1E8]/60 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#2D5A27] text-[#F5F1E8] rounded-xl font-semibold hover:bg-[#3D7A37] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#0D0F0D] text-[#F5F1E8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0D0F0D]/80 backdrop-blur-xl border-b border-[#2D5A27]/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-[#DFFF00] rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#154212]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F5F1E8] tracking-tight">
                    Mission Board
                  </h1>
                  <p className="text-sm text-[#F5F1E8]/50">
                    {new Date().toLocaleDateString("nb-NO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1D1A] rounded-xl border border-[#2D5A27]/20">
                <div className="w-2 h-2 bg-[#DFFF00] rounded-full animate-pulse" />
                <span className="text-sm text-[#F5F1E8]/70">
                  Sist oppdatert: {lastUpdated.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="ml-2 p-1.5 hover:bg-[#2D5A27]/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-[#DFFF00] ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={Calendar}
              label="Okter i dag"
              value={stats.today.totalBookings}
              trend={stats.trends.bookings !== 0 ? `${stats.trends.bookings > 0 ? "+" : ""}${stats.trends.bookings}` : undefined}
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
              trend={stats.trends.students !== 0 ? `${stats.trends.students > 0 ? "+" : ""}${stats.trends.students}` : undefined}
              trendUp={stats.trends.students > 0}
            />
            <StatCard
              icon={DollarSign}
              label="Omsetning (uke)"
              value={`${stats.week.revenue.toLocaleString("nb-NO")} kr`}
              trend={stats.trends.revenue !== 0 ? `${stats.trends.revenue > 0 ? "+" : ""}${stats.trends.revenue}%` : undefined}
              trendUp={stats.trends.revenue > 0}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-[#141914] border border-[#2D5A27]/20 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#2D5A27]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#DFFF00]" />
                    <h2 className="text-lg font-bold text-[#F5F1E8]">Dagens timeplan</h2>
                  </div>
                  <Link
                    href="/portal/admin/kalender"
                    className="text-sm text-[#DFFF00] hover:text-[#B8D400] font-medium flex items-center gap-1.5 transition-colors"
                  >
                    Se kalender
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="divide-y divide-[#2D5A27]/10">
                  {stats.todaysSchedule.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-6 py-4 hover:bg-[#1A1D1A] transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold text-[#F5F1E8]">{booking.time}</p>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-[#F5F1E8]">{booking.studentName}</p>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="text-sm text-[#F5F1E8]/60">{booking.service}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-[#F5F1E8]/70">{booking.instructor}</p>
                        </div>
                        
                        <ArrowRight className="w-5 h-5 text-[#F5F1E8]/20 group-hover:text-[#DFFF00] transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {stats.todaysSchedule.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-[#F5F1E8]/20 mx-auto mb-4" />
                    <p className="text-[#F5F1E8]/50">Ingen bookinger i dag</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights Card */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-[#2D5A27]/20 to-[#154212]/20 border border-[#2D5A27]/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFFF00]/5 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[#DFFF00]" />
                      <h3 className="font-bold text-[#F5F1E8]">AI-innsikt</h3>
                    </div>
                    
                    <p className="text-sm text-[#F5F1E8]/70 mb-4 leading-relaxed">
                      Basert på mønsteret denne uken, anbefales det å legge til en ekstra "Quick Fix"-slot på fredag ettermiddag. Etterspørselen er høy.
                    </p>
                    
                    <button className="w-full py-3 bg-[#DFFF00]/10 hover:bg-[#DFFF00]/20 border border-[#DFFF00]/30 text-[#DFFF00] rounded-xl text-sm font-semibold transition-all">
                      Se detaljert analyse
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants}>
                <div className="bg-[#141914] border border-[#2D5A27]/20 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#2D5A27]/20">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#DFFF00]" />
                      <h3 className="font-bold text-[#F5F1E8]">Varsler</h3>
                      {stats.alerts.length > 0 && (
                        <span className="ml-auto px-2.5 py-0.5 bg-[#DFFF00] text-[#154212] text-xs font-bold rounded-full">
                          {stats.alerts.length}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="divide-y divide-[#2D5A27]/10">
                    {stats.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="px-5 py-4 flex items-start gap-3 hover:bg-[#1A1D1A] transition-colors"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            alert.type === "warning"
                              ? "bg-amber-400"
                              : alert.type === "success"
                              ? "bg-[#DFFF00]"
                              : "bg-blue-400"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-[#F5F1E8]/80">{alert.message}</p>
                          <p className="text-xs text-[#F5F1E8]/40 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {stats.alerts.length === 0 && (
                    <div className="px-5 py-8 text-center">
                      <CheckCircle className="w-10 h-10 text-[#DFFF00]/30 mx-auto mb-3" />
                      <p className="text-sm text-[#F5F1E8]/50">Ingen aktive varsler</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weekly Summary */}
              <motion.div variants={itemVariants}>
                <div className="bg-[#141914] border border-[#2D5A27]/20 rounded-2xl p-5">
                  <h3 className="font-bold text-[#F5F1E8] mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#DFFF00]" />
                    Denne uken
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F5F1E8]/60">Totale bookinger</span>
                      <span className="font-semibold text-[#F5F1E8]">{stats.week.totalBookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F5F1E8]/60">Omsetning</span>
                      <span className="font-semibold text-[#DFFF00]">
                        {stats.week.revenue.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F5F1E8]/60">Retention</span>
                      <span className="font-semibold text-[#F5F1E8]">{stats.week.retention}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
