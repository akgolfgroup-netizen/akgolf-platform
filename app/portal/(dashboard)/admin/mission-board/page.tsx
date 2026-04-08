"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  DollarSign,
  Activity,
  ArrowRight,
  Plus,
  MessageSquare,
  UserPlus,
  FileText
} from "lucide-react";
import Link from "next/link";

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
  alerts: Array<{
    type: "warning" | "info" | "success";
    message: string;
    time: string;
  }>;
}

interface Booking {
  id: string;
  studentName: string;
  service: string;
  time: string;
  instructor: string;
  status: string;
}

export default function MissionBoardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mock-data?type=dashboard")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });

    fetch("/api/mock-data?type=bookings")
      .then(res => res.json())
      .then(data => setTodayBookings(data.slice(0, 5)));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d2f000]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d0a] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-[#d2f000]">Mission</span> Board
        </h1>
        <p className="text-white/60">Komplett oversikt over AK Golf Academy</p>
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
          href="/portal/admin/elever/ny"
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
          value={stats?.today.totalBookings || 0}
          icon={Calendar}
          trend={+2}
          color="border-[#d2f000]"
        />
        <StatCard
          title="Aktive Sesjoner"
          value={stats?.today.activeSessions || 0}
          icon={Activity}
          trend={0}
          color="border-[#154212]"
        />
        <StatCard
          title="Dagens Inntekt"
          value={`${stats?.today.revenue || 0} kr`}
          icon={DollarSign}
          trend={+12}
          color="border-green-500"
        />
        <StatCard
          title="Nye Elever (uke)"
          value={stats?.week.newStudents || 0}
          icon={Users}
          trend={+1}
          color="border-blue-500"
        />
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
          
          <div className="space-y-3">
            {todayBookings.map((booking) => (
              <div 
                key={booking.id}
                className="flex items-center gap-4 p-4 bg-[#0a0d0a] rounded-xl border border-white/5"
              >
                <div className="w-16 text-center">
                  <div className="text-lg font-bold text-[#d2f000]">{booking.time}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{booking.studentName}</div>
                  <div className="text-sm text-white/60">{booking.service}</div>
                </div>
                <div className="text-sm text-white/60">{booking.instructor}</div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-[#1a1d1a] rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-[#d2f000]" />
            Varsler
          </h2>
          
          <div className="space-y-4">
            {stats?.alerts.map((alert, i) => (
              <div 
                key={i}
                className={`p-4 rounded-xl border ${
                  alert.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                  alert.type === "success" ? "bg-green-500/10 border-green-500/30" :
                  "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-white/40 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, color }: { 
  icon: any; 
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

function StatCard({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string | number;
  icon: any;
  trend: number;
  color: string;
}) {
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
        <div className={`mt-2 text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
          {trend > 0 ? "+" : ""}{trend} fra i går
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
  };
  
  const labels: Record<string, string> = {
    confirmed: "Bekreftet",
    pending: "Venter",
    cancelled: "Kansellert",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.pending}`}>
      {labels[status] || status}
    </span>
  );
}
