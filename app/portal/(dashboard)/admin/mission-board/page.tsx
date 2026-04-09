"use client";

import { useState, useEffect } from "react";
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
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  alerts: Array<{
    type: "warning" | "info" | "success";
    message: string;
    time: string;
  }>;
  todaysSchedule: Array<{
    id: string;
    studentName: string;
    service: string;
    time: string;
    instructor: string;
    status: string;
  }>;
}

export default function MissionBoardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/portal/admin/dashboard");
      
      if (!res.ok) {
        throw new Error("Kunne ikke hente dashboard-data");
      }
      
      const dashboardData = await res.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh hvert 5. minutt
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d2f000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d0a] flex items-center justify-center p-6">
        <div className="bg-[#1a1d1a] rounded-2xl border border-red-500/30 p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Noe gikk galt</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d2f000] text-[#0a0d0a] font-bold hover:scale-[1.02] transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d0a] text-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#d2f000]">Mission</span> Board
          </h1>
          <p className="text-white/60">Komplett oversikt over AK Golf Academy</p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="p-3 rounded-xl bg-[#1a1d1a] border border-white/10 text-white/60 hover:text-white hover:border-[#d2f000]/50 transition-all"
          title="Oppdater data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction 
          icon={Plus} 
          label="Ny Booking" 
          href="/portal/admin/bookinger/ny"
          color="bg-[#d2f000] text-[#0a0d0a]"
        />
        <QuickAction 
          icon={MessageSquare} 
          label="Send Melding" 
          href="/portal/admin/meldinger"
          color="bg-[#154212] text-white"
        />
        <QuickAction 
          icon={UserPlus} 
          label="Ny Elev" 
          href="/portal/admin/elever"
          color="bg-[#154212] text-white"
        />
        <QuickAction 
          icon={FileText} 
          label="Rapport" 
          href="/portal/admin/rapporter"
          color="bg-[#154212] text-white"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Dagens Bookinger"
          value={data?.today.totalBookings || 0}
          icon={Calendar}
          trend={data?.trends.bookings || 0}
          color="border-[#d2f000]"
        />
        <StatCard
          title="Aktive Sesjoner"
          value={data?.today.activeSessions || 0}
          icon={Activity}
          trend={0}
          color="border-[#154212]"
        />
        <StatCard
          title="Dagens Inntekt"
          value={`${(data?.today.revenue || 0).toLocaleString("nb-NO")} kr`}
          icon={DollarSign}
          trend={data?.trends.revenue || 0}
          color="border-green-500"
          isPercentage
        />
        <StatCard
          title="Nye Elever (uke)"
          value={data?.week.newStudents || 0}
          icon={Users}
          trend={data?.trends.students || 0}
          color="border-blue-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <p className="text-white/60 text-sm mb-1">Denne ukens bookinger</p>
          <p className="text-3xl font-bold">{data?.week.totalBookings || 0}</p>
          <p className="text-sm text-white/40 mt-2">{data?.week.retention || 100}% av forrige uke</p>
        </div>
        <div className="bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <p className="text-white/60 text-sm mb-1">Ukens inntekt</p>
          <p className="text-3xl font-bold">{(data?.week.revenue || 0).toLocaleString("nb-NO")} kr</p>
          <p className="text-sm text-white/40 mt-2">Hittil denne uken</p>
        </div>
        <div className="bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <p className="text-white/60 text-sm mb-1">Avbestillinger i dag</p>
          <p className="text-3xl font-bold">{data?.today.cancellations || 0}</p>
          <p className="text-sm text-white/40 mt-2">
            {data?.today.cancellations === 0 ? "Ingen avbestillinger" : "Krever oppmerksomhet"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#d2f000]" />
              Dagens Timeplan
            </h2>
            <Link 
              href="/portal/admin/kalender"
              className="text-sm text-[#d2f000] hover:underline flex items-center gap-1"
            >
              Se full kalender <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {data?.todaysSchedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Ingen bookinger i dag</p>
              <Link
                href="/portal/admin/bookinger/ny"
                className="inline-flex items-center gap-2 mt-4 text-sm text-[#d2f000] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Legg til booking
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.todaysSchedule.map((booking) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-[#0a0d0a] rounded-xl border border-white/5 hover:border-[#d2f000]/30 transition-colors"
                >
                  <div className="w-16 text-center">
                    <div className="text-lg font-bold text-[#d2f000]">{booking.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{booking.studentName}</div>
                    <div className="text-sm text-white/60 truncate">{booking.service}</div>
                  </div>
                  <div className="text-sm text-white/60 hidden sm:block">{booking.instructor}</div>
                  <StatusBadge status={booking.status} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-[#d2f000]" />
            Varsler
          </h2>
          
          {data?.alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-white/40 text-sm">Ingen aktive varsler</p>
              <p className="text-white/20 text-xs mt-1">Alt ser bra ut!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.alerts.map((alert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    alert.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                    alert.type === "success" ? "bg-green-500/10 border-green-500/30" :
                    "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.type === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                    {alert.type === "success" && <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    {alert.type === "info" && <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-white/40 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, color }: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`${color} p-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] transition-transform`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

function StatCard({ title, value, icon: Icon, trend, color, isPercentage = false }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend: number;
  color: string;
  isPercentage?: boolean;
}) {
  const trendPositive = trend > 0;
  const trendNegative = trend < 0;
  
  return (
    <div className={`bg-[#1a1d1a] rounded-2xl border-l-4 ${color} p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="w-5 h-5 text-white/40" />
      </div>
      {trend !== 0 && (
        <div className={`mt-2 text-sm flex items-center gap-1 ${
          trendPositive ? "text-green-500" : trendNegative ? "text-red-500" : "text-white/40"
        }`}>
          {trendPositive && <TrendingUp className="w-4 h-4" />}
          {trendNegative && <TrendingDown className="w-4 h-4" />}
          {trend > 0 ? "+" : ""}{trend}{isPercentage ? "%" : ""} fra i går
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: "bg-green-500/20 text-green-500 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
    completed: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  };
  
  const labels: Record<string, string> = {
    confirmed: "Bekreftet",
    pending: "Venter",
    cancelled: "Kansellert",
    completed: "Fullført",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.pending}`}>
      {labels[status] || status}
    </span>
  );
}
