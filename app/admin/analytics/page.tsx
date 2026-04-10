"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Clock,
  RotateCcw,
  AlertCircle,
  Activity,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
} from "@/components/portal/mission-control/ui";

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

type StudentStatus = "good" | "warning" | "critical";

interface StudentHealth {
  id: string;
  name: string;
  status: StudentStatus;
  lastSession: string;
  nextSession: string | null;
  sessionsThisMonth: number;
}

const studentHealthData: StudentHealth[] = [
  { id: "1", name: "Olav Hansen", status: "good", lastSession: "2 dager siden", nextSession: "I morgen", sessionsThisMonth: 8 },
  { id: "2", name: "Mari Kristiansen", status: "good", lastSession: "1 uke siden", nextSession: "Fredag", sessionsThisMonth: 6 },
  { id: "3", name: "Erik Johansen", status: "warning", lastSession: "2 uker siden", nextSession: null, sessionsThisMonth: 2 },
  { id: "4", name: "Sofie Berg", status: "good", lastSession: "3 dager siden", nextSession: "I dag", sessionsThisMonth: 10 },
  { id: "5", name: "Anders Pettersen", status: "critical", lastSession: "1 måned siden", nextSession: null, sessionsThisMonth: 0 },
];

const revenueData = [
  { label: "Uke 1", value: 45000 },
  { label: "Uke 2", value: 52000 },
  { label: "Uke 3", value: 48000 },
  { label: "Uke 4", value: 58000 },
];

const statusConfig: Record<
  StudentStatus,
  { label: string; variant: "success" | "warning" | "error" }
> = {
  good: { label: "God", variant: "success" },
  warning: { label: "Oppfølging", variant: "warning" },
  critical: { label: "Kritisk", variant: "error" },
};

const timeRanges = [
  { label: "Siste 7 dager", value: "7d" },
  { label: "Siste 30 dager", value: "30d" },
  { label: "Siste 3 måneder", value: "3m" },
  { label: "År til dato", value: "ytd" },
];

function formatKr(amount: number): string {
  return `${amount.toLocaleString("nb-NO")} kr`;
}

export default function AnalyticsPage() {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState("30d");

  const studentsNeedingFollowUp = studentHealthData.filter(
    (s) => s.status === "warning" || s.status === "critical",
  );

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...revenueData.map((d) => d.value));

  return (
    <>
      <MCTopbar
        title="Analytics"
        subtitle="Innsikt og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center bg-[var(--color-grey-100)] rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  timeRange === range.value
                    ? "bg-white text-[var(--color-text)] shadow-sm"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          <AdminButton variant="secondary">Eksporter rapport</AdminButton>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Aktive elever"
            value={kpiData.activeStudents}
            icon={<Users className="w-5 h-5" />}
            change={{ value: kpiData.activeStudentsTrend, positive: true }}
          />
          <AdminStatCard
            label="Gj.snitt timer/uke"
            value={kpiData.avgHoursPerWeek}
            icon={<Clock className="w-5 h-5" />}
            change={{
              value: Math.abs(kpiData.avgHoursTrend),
              positive: kpiData.avgHoursTrend > 0,
            }}
          />
          <AdminStatCard
            label="Churn rate"
            value={`${kpiData.churnRate}%`}
            icon={<RotateCcw className="w-5 h-5" />}
            change={{
              value: Math.abs(kpiData.churnTrend),
              positive: kpiData.churnTrend < 0,
            }}
          />
          <AdminStatCard
            label="Kapasitetsutnyttelse"
            value={`${kpiData.capacityUtilization}%`}
            icon={<Activity className="w-5 h-5" />}
            change={{ value: kpiData.capacityTrend, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <AdminCard className="lg:col-span-2 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
              <div>
                <h3 className="admin-section-title">Omsetning</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Siste 4 uker
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[var(--color-primary)] tabular-nums">
                  {formatKr(totalRevenue)}
                </span>
                <span className="text-xs text-[var(--color-muted)] block">
                  totalt
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-4 h-48">
                {revenueData.map((point) => {
                  const heightPct = (point.value / maxValue) * 100;
                  return (
                    <div
                      key={point.label}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="w-full bg-[var(--color-primary)] rounded-t-md transition-all"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--color-muted)]">
                        {point.label}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-text)] tabular-nums">
                        {formatKr(point.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AdminCard>

          {/* Capacity Overview */}
          <AdminCard>
            <h3 className="admin-section-title mb-4">Kapasitet</h3>
            <div className="space-y-4">
              {[
                { label: "Anders Kristiansen", current: 6, max: 8 },
                { label: "Maria Hansen", current: 4, max: 6 },
                { label: "Total denne uken", current: 28, max: 40 },
              ].map((row) => {
                const pct = Math.round((row.current / row.max) * 100);
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--color-text)]">
                        {row.label}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-text)] tabular-nums">
                        {row.current}/{row.max} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-grey-200)]">
              <h4 className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider mb-3">
                Sesong-trender
              </h4>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                <span>18% økning fra i fjor</span>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Student Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Health Table */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Elev-status</h3>
              <span className="text-xs text-[var(--color-muted)]">
                Hvordan går det med hver elev?
              </span>
            </div>
            <AdminTable containerClassName="border-0 rounded-none">
              <AdminTableHead>
                <AdminTableRow>
                  <AdminTableHeaderCell>Elev</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Siste økt</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Neste økt</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Måned</AdminTableHeaderCell>
                </AdminTableRow>
              </AdminTableHead>
              <AdminTableBody>
                {studentHealthData.map((student) => {
                  const status = statusConfig[student.status];
                  return (
                    <AdminTableRow key={student.id}>
                      <AdminTableCell>
                        <span className="font-medium text-[var(--color-text)]">
                          {student.name}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminBadge variant={status.variant}>
                          {status.label}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell className="text-[var(--color-muted)]">
                        {student.lastSession}
                      </AdminTableCell>
                      <AdminTableCell
                        className={cn(
                          !student.nextSession && "text-[var(--color-error)]",
                        )}
                      >
                        {student.nextSession || "Ikke booket"}
                      </AdminTableCell>
                      <AdminTableCell className="tabular-nums">
                        {student.sessionsThisMonth}
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
              </AdminTableBody>
            </AdminTable>
          </AdminCard>

          {/* Students Needing Follow-up */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Trenger oppfølging</h3>
              <AdminBadge variant="warning">
                {studentsNeedingFollowUp.length} elever
              </AdminBadge>
            </div>
            <div className="divide-y divide-[var(--color-grey-100)]">
              {studentsNeedingFollowUp.map((student) => (
                <div
                  key={student.id}
                  className="px-6 py-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {student.name}
                    </div>
                    <div className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sist aktiv: {student.lastSession}
                    </div>
                  </div>
                  <AdminButton variant="primary" className="text-xs py-1.5">
                    Ta kontakt
                  </AdminButton>
                </div>
              ))}
              {studentsNeedingFollowUp.length === 0 && (
                <div className="py-10 text-center">
                  <Target className="w-10 h-10 text-[var(--color-success)] mx-auto mb-2" />
                  <span className="text-sm text-[var(--color-muted)]">
                    Alle elever er aktive
                  </span>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
