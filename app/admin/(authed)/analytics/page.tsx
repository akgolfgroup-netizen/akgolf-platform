"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  Clock,
  RotateCcw,
  AlertCircle,
  Activity,
  Target,
  BarChart3,
  LineChart,
  PieChart,
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
  AdminTabs,
  AdminDateRangePicker,
  AdminLineChart,
  AdminBarChart,
  AdminDonutChart,
  AdminHeatmap,
  AdminProgressRing,
  AdminSparkline,
  type AdminDateRange,
  type AdminTabItem,
  type AdminHeatmapCell,
} from "@/components/portal/mission-control/ui";

// ─── Mock data ───────────────────────────────────────────────────────────────

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

const activeStudentsSpark = [98, 104, 108, 112, 118, 122, 124, 128];
const hoursSpark = [2.8, 2.7, 2.6, 2.5, 2.5, 2.4, 2.5, 2.4];
const churnSpark = [5.1, 4.9, 4.8, 4.6, 4.5, 4.3, 4.3, 4.2];
const capacitySpark = [68, 70, 72, 73, 75, 76, 77, 78];

const studentGrowthData = [
  { label: "Aug", value: 82 },
  { label: "Sep", value: 89 },
  { label: "Okt", value: 96 },
  { label: "Nov", value: 102 },
  { label: "Des", value: 108 },
  { label: "Jan", value: 114 },
  { label: "Feb", value: 120 },
  { label: "Mar", value: 124 },
  { label: "Apr", value: 128 },
];

const weeklyBookings = [
  { label: "U12", value: 38 },
  { label: "U13", value: 42 },
  { label: "U14", value: 45 },
  { label: "U15", value: 48 },
  { label: "U16", value: 52 },
  { label: "U17", value: 58 },
  { label: "U18", value: 54 },
  { label: "U19", value: 61 },
];

const serviceTypeDistribution = [
  { label: "Performance", value: 42, color: "var(--color-primary)" },
  { label: "Performance Pro", value: 28, color: "var(--color-accent-cta)" },
  { label: "Gruppe", value: 18, color: "var(--color-success)" },
  { label: "Flex", value: 8, color: "var(--color-warning)" },
  { label: "First Tee", value: 4, color: "var(--color-ai)" },
];

const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const hourLabels = ["08", "10", "12", "14", "16", "18", "20"];

function buildHeatmapData(): AdminHeatmapCell[] {
  const cells: AdminHeatmapCell[] = [];
  const base = [
    [1, 3, 6, 8, 9, 7, 4],
    [0, 2, 5, 7, 8, 6, 3],
    [2, 4, 6, 8, 9, 8, 5],
    [3, 5, 7, 9, 10, 7, 4],
    [4, 6, 8, 10, 9, 6, 2],
    [1, 2, 3, 5, 4, 2, 1],
    [0, 1, 2, 3, 2, 1, 0],
  ];
  weekdayLabels.forEach((day, r) => {
    hourLabels.forEach((hour, c) => {
      cells.push({ row: day, col: hour, value: base[r][c] });
    });
  });
  return cells;
}

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

const statusConfig: Record<
  StudentStatus,
  { label: string; variant: "success" | "warning" | "error" }
> = {
  good: { label: "God", variant: "success" },
  warning: { label: "Oppfølging", variant: "warning" },
  critical: { label: "Kritisk", variant: "error" },
};

const TAB_ITEMS: AdminTabItem[] = [
  { id: "overview", label: "Oversikt", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "students", label: "Elever", icon: <Users className="w-4 h-4" /> },
  { id: "bookings", label: "Bookinger", icon: <LineChart className="w-4 h-4" /> },
  { id: "revenue", label: "Inntekt", icon: <PieChart className="w-4 h-4" /> },
];

export default function AnalyticsPage() {
  const { toggle } = useMCSidebar();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<AdminDateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 29)),
    to: new Date(),
  });

  const heatmapData = useMemo(() => buildHeatmapData(), []);

  const studentsNeedingFollowUp = studentHealthData.filter(
    (s) => s.status === "warning" || s.status === "critical",
  );

  return (
    <>
      <MCTopbar
        title="Analytics"
        subtitle="Innsikt og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {/* Date range + eksport */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <AdminDateRangePicker value={dateRange} onChange={setDateRange} />
          <AdminButton variant="secondary">Eksporter rapport</AdminButton>
        </div>

        {/* Tabs */}
        <AdminTabs
          items={TAB_ITEMS}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        {/* KPI Cards med sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiWithSparkline
            label="Aktive elever"
            value={kpiData.activeStudents}
            icon={<Users className="w-5 h-5" />}
            change={{ value: kpiData.activeStudentsTrend, positive: true }}
            sparkData={activeStudentsSpark}
            sparkColor="var(--color-primary)"
          />
          <KpiWithSparkline
            label="Gj.snitt timer/uke"
            value={kpiData.avgHoursPerWeek}
            icon={<Clock className="w-5 h-5" />}
            change={{
              value: Math.abs(kpiData.avgHoursTrend),
              positive: kpiData.avgHoursTrend > 0,
            }}
            sparkData={hoursSpark}
            sparkColor="var(--color-warning)"
          />
          <KpiWithSparkline
            label="Churn rate"
            value={`${kpiData.churnRate}%`}
            icon={<RotateCcw className="w-5 h-5" />}
            change={{
              value: Math.abs(kpiData.churnTrend),
              positive: kpiData.churnTrend < 0,
            }}
            sparkData={churnSpark}
            sparkColor="var(--color-success)"
          />
          <KpiWithSparkline
            label="Kapasitet"
            value={`${kpiData.capacityUtilization}%`}
            icon={<Activity className="w-5 h-5" />}
            change={{ value: kpiData.capacityTrend, positive: true }}
            sparkData={capacitySpark}
            sparkColor="var(--color-accent-cta)"
          />
        </div>

        {activeTab === "overview" && (
          <>
            {/* Grafer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AdminCard className="lg:col-span-2 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
                  <div>
                    <h3 className="admin-section-title">Elev-vekst</h3>
                    <span className="text-xs text-[var(--color-muted)]">
                      Siste 9 måneder
                    </span>
                  </div>
                  <AdminBadge
                    variant="success"
                    icon={<TrendingUp className="w-3 h-3" />}
                  >
                    +56%
                  </AdminBadge>
                </div>
                <div className="p-6">
                  <AdminLineChart
                    data={studentGrowthData}
                    valueLabel="Aktive elever"
                  />
                </div>
              </AdminCard>

              {/* Churn-ring */}
              <AdminCard>
                <h3 className="admin-section-title mb-4">Churn-rate</h3>
                <div className="flex flex-col items-center gap-4 py-2">
                  <AdminProgressRing
                    value={kpiData.churnRate}
                    max={10}
                    size={140}
                    color="var(--color-success)"
                    label="Siste 30 dager"
                    valueSuffix="%"
                  />
                  <div className="text-center">
                    <div className="text-xs text-[var(--color-muted)]">
                      Mål: under 5%
                    </div>
                    <div className="text-xs text-[var(--color-success)] mt-1 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      12% forbedring fra forrige periode
                    </div>
                  </div>
                </div>
              </AdminCard>
            </div>

            {/* Bookinger + fordeling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AdminCard className="lg:col-span-2 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
                  <div>
                    <h3 className="admin-section-title">Bookinger per uke</h3>
                    <span className="text-xs text-[var(--color-muted)]">
                      Siste 8 uker
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <AdminBarChart
                    data={weeklyBookings}
                    valueLabel="Bookinger"
                  />
                </div>
              </AdminCard>

              <AdminCard className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                  <h3 className="admin-section-title">Fordeling tjenester</h3>
                </div>
                <div className="p-4">
                  <AdminDonutChart
                    data={serviceTypeDistribution}
                    centerLabel="Total"
                    centerValue="100%"
                  />
                </div>
              </AdminCard>
            </div>

            {/* Heatmap */}
            <AdminCard className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
                <div>
                  <h3 className="admin-section-title">Aktivitet per dag og time</h3>
                  <span className="text-xs text-[var(--color-muted)]">
                    Mørkere = mer aktivitet
                  </span>
                </div>
                <AdminBadge variant="muted">Siste 30 dager</AdminBadge>
              </div>
              <div className="p-6 overflow-x-auto">
                <AdminHeatmap
                  data={heatmapData}
                  rows={weekdayLabels}
                  cols={hourLabels}
                  cellSize={36}
                  formatTooltip={(cell) =>
                    `${cell.row} kl ${cell.col}: ${cell.value} økter`
                  }
                />
              </div>
            </AdminCard>
          </>
        )}

        {activeTab === "students" && (
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

            {/* Trenger oppfølging */}
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
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <AdminCard className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                <h3 className="admin-section-title">Bookinger per uke</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Siste 8 uker
                </span>
              </div>
              <div className="p-6">
                <AdminBarChart data={weeklyBookings} height={320} valueLabel="Bookinger" />
              </div>
            </AdminCard>

            <AdminCard className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                <h3 className="admin-section-title">Aktivitet per dag og time</h3>
              </div>
              <div className="p-6 overflow-x-auto">
                <AdminHeatmap
                  data={heatmapData}
                  rows={weekdayLabels}
                  cols={hourLabels}
                  cellSize={40}
                />
              </div>
            </AdminCard>
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AdminCard className="lg:col-span-2 p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                <h3 className="admin-section-title">Inntektstrend</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Siste 9 måneder
                </span>
              </div>
              <div className="p-6">
                <AdminLineChart
                  data={studentGrowthData.map((d) => ({
                    label: d.label,
                    value: d.value * 1200,
                  }))}
                  valueLabel="Omsetning (kr)"
                />
              </div>
            </AdminCard>

            <AdminCard className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
                <h3 className="admin-section-title">Per tjeneste</h3>
              </div>
              <div className="p-4">
                <AdminDonutChart data={serviceTypeDistribution} />
              </div>
            </AdminCard>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Helper: KPI-kort med sparkline ─────────────────────────────────────────

interface KpiWithSparklineProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change: { value: number; positive: boolean };
  sparkData: number[];
  sparkColor?: string;
}

function KpiWithSparkline({
  label,
  value,
  icon,
  change,
  sparkData,
  sparkColor,
}: KpiWithSparklineProps) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="admin-label">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text)] tracking-tight">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium">
            <span
              className={cn(
                change.positive
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-error)]",
              )}
            >
              {change.positive ? "+" : "-"}
              {change.value}%
            </span>
            <span className="text-[var(--color-muted)]">vs forrige</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <AdminSparkline
          data={sparkData}
          color={sparkColor}
          width="100%"
          height={32}
        />
      </div>
    </div>
  );
}
