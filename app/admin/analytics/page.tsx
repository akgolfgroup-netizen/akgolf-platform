"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  RotateCcw,
  AlertCircle,
  Activity,
  Target,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  MCTopbar,
  useMCSidebar,
  HGStatCard,
  HGCapacityBar,
  HGRevenueChart,
} from "@/components/portal/mission-control";

// Mock data
const kpiData = {
  activeStudents: 128,
  activeStudentsTrend: 8,
  avgHoursPerWeek: 2.4,
  avgHoursTrend: -3,
  churnRate: 4.2,
  churnTrend: -12,
  capacityUtilization: 78,
  capacityTrend: 5,
};

const studentHealthData = [
  { id: "1", name: "Olav Hansen", status: "good", lastSession: "2 dager siden", nextSession: "I morgen", sessionsThisMonth: 8 },
  { id: "2", name: "Mari Kristiansen", status: "good", lastSession: "1 uke siden", nextSession: "Fredag", sessionsThisMonth: 6 },
  { id: "3", name: "Erik Johansen", status: "warning", lastSession: "2 uker siden", nextSession: null, sessionsThisMonth: 2 },
  { id: "4", name: "Sofie Berg", status: "good", lastSession: "3 dager siden", nextSession: "I dag", sessionsThisMonth: 10 },
  { id: "5", name: "Anders Pettersen", status: "critical", lastSession: "1 måned siden", nextSession: null, sessionsThisMonth: 0 },
];

const revenueData = [
  { label: "Uke 1", value: 45000, previousValue: 42000 },
  { label: "Uke 2", value: 52000, previousValue: 48000 },
  { label: "Uke 3", value: 48000, previousValue: 51000 },
  { label: "Uke 4", value: 58000, previousValue: 49000 },
];

const statusConfig = {
  good: { label: "God", className: "text-[var(--hg-success)] bg-[var(--hg-success-bg)]", icon: TrendingUp },
  warning: { label: "Oppfølging", className: "text-[var(--hg-warning)] bg-[var(--hg-warning-bg)]", icon: AlertCircle },
  critical: { label: "Kritisk", className: "text-[var(--hg-error)] bg-[var(--hg-error-bg)]", icon: RotateCcw },
};

const timeRanges = [
  { label: "Siste 7 dager", value: "7d" },
  { label: "Siste 30 dager", value: "30d" },
  { label: "Siste 3 måneder", value: "3m" },
  { label: "År til dato", value: "ytd" },
];

export default function AnalyticsPage() {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState("30d");

  const studentsNeedingFollowUp = studentHealthData.filter(
    (s) => s.status === "warning" || s.status === "critical"
  );

  return (
    <>
      <MCTopbar
        title="Analytics"
        subtitle="Innsikt og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="hg-tabs">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn("hg-tab", timeRange === range.value && "active")}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button className="hg-btn hg-btn-secondary text-sm">
            Eksporter rapport
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Aktive elever"
            value={kpiData.activeStudents}
            trend={{ value: kpiData.activeStudentsTrend, direction: "up" }}
            icon={Users}
          />
          <HGStatCard
            label="Gj.snitt timer/uke"
            value={kpiData.avgHoursPerWeek}
            trend={{ value: Math.abs(kpiData.avgHoursTrend), direction: kpiData.avgHoursTrend > 0 ? "up" : "down" }}
            icon={Clock}
          />
          <HGStatCard
            label="Churn rate"
            value={`${kpiData.churnRate}%`}
            trend={{ value: Math.abs(kpiData.churnTrend), direction: kpiData.churnTrend > 0 ? "up" : "down" }}
            icon={RotateCcw}
            variant={kpiData.churnRate > 5 ? "warning" : "default"}
          />
          <HGStatCard
            label="Kapasitetsutnyttelse"
            value={`${kpiData.capacityUtilization}%`}
            trend={{ value: kpiData.capacityTrend, direction: "up" }}
            icon={Activity}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <HGRevenueChart
              data={revenueData}
              title="Omsetning"
              period="Siste 4 uker"
              total="203 000 kr"
            />
          </div>

          {/* Capacity Overview */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Kapasitet</h3>
            <div className="space-y-4">
              <HGCapacityBar
                current={6}
                max={8}
                label="Anders Kristiansen"
                showPercentage
              />
              <HGCapacityBar
                current={4}
                max={6}
                label="Maria Hansen"
                showPercentage
              />
              <HGCapacityBar
                current={28}
                max={40}
                label="Total denne uken"
                showPercentage
              />
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--hg-border)]">
              <h4 className="text-xs font-medium text-[var(--hg-text-secondary)] uppercase tracking-wider mb-3">
                Sesong-trender
              </h4>
              <div className="flex items-center gap-2 text-sm text-[var(--hg-text)]">
                <TrendingUp className="w-4 h-4 text-[var(--hg-success)]" />
                <span>18% økning fra i fjor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Student Health Table */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Elev-status</h3>
              <span className="text-xs text-[var(--hg-text-muted)]">
                Hvordan går det med hver elev?
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="hg-table">
                <thead>
                  <tr>
                    <th>Elev</th>
                    <th>Status</th>
                    <th>Siste økt</th>
                    <th>Neste økt</th>
                    <th>Måned</th>
                  </tr>
                </thead>
                <tbody>
                  {studentHealthData.map((student) => {
                    const status = statusConfig[student.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={student.id}>
                        <td>
                          <span className="font-medium text-[var(--hg-text)]">{student.name}</span>
                        </td>
                        <td>
                          <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", status.className)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </div>
                        </td>
                        <td className="text-[var(--hg-text-secondary)]">{student.lastSession}</td>
                        <td className={cn(!student.nextSession && "text-[var(--hg-error)]")}>
                          {student.nextSession || "Ikke booket"}
                        </td>
                        <td className="tabular-nums">{student.sessionsThisMonth}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Students Needing Follow-up */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Trenger oppfølging</h3>
              <span className="hg-badge hg-badge-warning">
                {studentsNeedingFollowUp.length} elever
              </span>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {studentsNeedingFollowUp.map((student) => (
                <div key={student.id} className="p-4 flex items-center gap-3">
                  <div className="hg-avatar hg-avatar-sm">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--hg-text)]">
                      {student.name}
                    </div>
                    <div className="text-xs text-[var(--hg-text-muted)]">
                      Sist aktiv: {student.lastSession}
                    </div>
                  </div>
                  <button className="hg-btn hg-btn-primary text-xs py-1.5">
                    Ta kontakt
                  </button>
                </div>
              ))}
              {studentsNeedingFollowUp.length === 0 && (
                <div className="py-8 text-center">
                  <Target className="w-10 h-10 text-[var(--hg-success)] mx-auto mb-2" />
                  <span className="text-sm text-[var(--hg-text-muted)]">
                    Alle elever er aktive! 🎉
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
