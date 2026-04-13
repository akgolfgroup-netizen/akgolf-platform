"use client";

import { useState, useTransition } from "react";
import {
  Users, TrendingUp, RotateCcw, Activity, BarChart3, LineChart,
  PieChart, AlertCircle, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminBadge,
  AdminLineChart, AdminBarChart, AdminDonutChart,
  AdminHeatmap, AdminProgressRing, AdminTabs,
  AdminTable, AdminTableHead, AdminTableBody, AdminTableRow,
  AdminTableHeaderCell, AdminTableCell, AdminButton,
  type AdminTabItem,
} from "@/components/portal/mission-control/ui";
import { getDashboardData, type DashboardData, type AnalyticsPeriod } from "./actions";

// ── Constants ──────────────────────────────────────────────

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "week", label: "Uke" },
  { value: "month", label: "Måned" },
  { value: "quarter", label: "Kvartal" },
];

const TAB_ITEMS: AdminTabItem[] = [
  { id: "overview", label: "Oversikt", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "students", label: "Elever", icon: <Users className="w-4 h-4" /> },
  { id: "bookings", label: "Bookinger", icon: <LineChart className="w-4 h-4" /> },
  { id: "revenue", label: "Inntekt", icon: <PieChart className="w-4 h-4" /> },
];

const WEEKDAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HOUR_LABELS = ["08", "10", "12", "14", "16", "18", "20"];

const STATUS_CONFIG = {
  good: { label: "God", variant: "success" as const },
  warning: { label: "Oppfølging", variant: "warning" as const },
  critical: { label: "Kritisk", variant: "error" as const },
};

// ── Helpers ────────────────────────────────────────────────

function relativeDate(iso: string | null): string {
  if (!iso) return "-";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return "I dag";
  if (diff === 1) return "I går";
  if (diff < 7) return `${diff} dager siden`;
  if (diff < 30) return `${Math.floor(diff / 7)} uker siden`;
  return `${Math.floor(diff / 30)} mnd siden`;
}

function futureDate(iso: string | null): string {
  if (!iso) return "Ikke booket";
  return new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

function formatKr(amount: number): string {
  return `kr ${Math.round(amount).toLocaleString("nb-NO")}`;
}

// ── Component ──────────────────────────────────────────────

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const { toggle } = useMCSidebar();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const [isPending, startTransition] = useTransition();

  function handlePeriodChange(p: AnalyticsPeriod) {
    setPeriod(p);
    startTransition(async () => {
      const result = await getDashboardData(p);
      setData(result);
    });
  }

  const followUp = data.studentHealth.filter((s) => s.status !== "good");

  return (
    <>
      <MCTopbar title="Analytics" subtitle={data.periodLabel} onMenuClick={toggle} />

      <div className={cn("p-6 space-y-6", isPending && "opacity-60 pointer-events-none transition-opacity")}>
        {/* Period selector - Chips with grey tokens */}
        <div className="flex items-center gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePeriodChange(opt.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                period === opt.value
                  ? "bg-grey-900 text-white shadow-sm"
                  : "bg-grey-100 text-grey-600 hover:text-grey-800 hover:bg-grey-200",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <AdminTabs items={TAB_ITEMS} value={activeTab} onValueChange={setActiveTab} />

        {/* KPI Cards - White cards with shadow, tabular-nums */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
            label="Aktive elever" 
            value={data.activeStudents} 
            icon={<Users className="w-5 h-5" />} 
            change={data.newStudents > 0 ? `+${data.newStudents} nye` : undefined} 
            positive 
          />
          <KpiCard 
            label="Bookinger" 
            value={data.totalBookings} 
            icon={<Activity className="w-5 h-5" />} 
            change={`${data.completedBookings} fullført`} 
            positive 
          />
          <KpiCard 
            label="Churn-rate" 
            value={`${data.churnRate.toFixed(1)}%`} 
            icon={<RotateCcw className="w-5 h-5" />} 
            change={`${data.churnedStudents} inaktive`} 
            positive={data.churnRate < 5} 
          />
          <KpiCard 
            label="Inntekt" 
            value={formatKr(data.revenue)} 
            icon={<TrendingUp className="w-5 h-5" />} 
            change={`${data.revenueGrowth >= 0 ? "+" : ""}${data.revenueGrowth.toFixed(0)}% vs forrige`} 
            positive={data.revenueGrowth >= 0} 
          />
        </div>

        {/* ── Overview tab ──────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Elev-vekst" subtitle="Siste 9 måneder" className="lg:col-span-2">
                <AdminLineChart 
                  data={data.monthlyGrowth} 
                  valueLabel="Aktive elever" 
                />
              </ChartCard>
              <div className="bg-white rounded-xl shadow-card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-grey-200">
                  <h3 className="text-sm font-semibold text-grey-900">Churn-rate</h3>
                </div>
                <div className="flex flex-col items-center gap-4 py-6 px-6">
                  <AdminProgressRing 
                    value={data.churnRate} 
                    max={10} 
                    size={140} 
                    color="var(--color-success)" 
                    label="Siste periode" 
                    valueSuffix="%" 
                  />
                  <p className="text-xs text-grey-500">Mål: under 5%</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Bookinger per uke" subtitle={`Siste ${data.weeklyBookings.length} uker`} className="lg:col-span-2">
                <AdminBarChart 
                  data={data.weeklyBookings.map((w) => ({ label: w.week, value: w.count }))} 
                  valueLabel="Bookinger" 
                />
              </ChartCard>
              <ChartCard title="Fordeling tjenester">
                <AdminDonutChart 
                  data={data.serviceDistribution} 
                  centerLabel="Total" 
                  centerValue="100%" 
                />
              </ChartCard>
            </div>
          </>
        )}

        {/* ── Students tab ──────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-grey-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-grey-900">Elev-status</h3>
                <span className="text-xs text-grey-500">{data.studentHealth.length} elever</span>
              </div>
              <AdminTable containerClassName="border-0 rounded-none">
                <AdminTableHead>
                  <AdminTableRow>
                    <AdminTableHeaderCell>Elev</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Siste økt</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Neste økt</AdminTableHeaderCell>
                    <AdminTableHeaderCell className="text-right">Måned</AdminTableHeaderCell>
                  </AdminTableRow>
                </AdminTableHead>
                <AdminTableBody>
                  {data.studentHealth.map((s) => (
                    <AdminTableRow key={s.id}>
                      <AdminTableCell>
                        <span className="font-medium text-grey-900">{s.name}</span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminBadge variant={STATUS_CONFIG[s.status].variant}>
                          {STATUS_CONFIG[s.status].label}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell className="text-grey-500">{relativeDate(s.lastSession)}</AdminTableCell>
                      <AdminTableCell className={cn(!s.nextSession && "text-red-600")}>
                        {futureDate(s.nextSession)}
                      </AdminTableCell>
                      <AdminTableCell className="text-right tabular-nums text-grey-900">
                        {s.sessionsThisMonth}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </div>
            <div className="bg-white rounded-xl shadow-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-grey-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-grey-900">Trenger oppfølging</h3>
                <AdminBadge variant="warning">{followUp.length} elever</AdminBadge>
              </div>
              <div className="divide-y divide-grey-100">
                {followUp.map((s) => (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-grey-100 text-grey-700 text-xs font-semibold flex items-center justify-center">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-grey-900 truncate">{s.name}</div>
                      <div className="text-xs text-grey-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Sist aktiv: {relativeDate(s.lastSession)}
                      </div>
                    </div>
                    <AdminButton variant="primary" className="text-xs py-1.5">Ta kontakt</AdminButton>
                  </div>
                ))}
                {followUp.length === 0 && (
                  <div className="py-10 text-center">
                    <Calendar className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <span className="text-sm text-grey-500">Alle elever er aktive</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings tab ──────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <ChartCard title="Bookinger per uke" subtitle={`Siste ${data.weeklyBookings.length} uker`}>
              <AdminBarChart 
                data={data.weeklyBookings.map((w) => ({ label: w.week, value: w.count }))} 
                height={320} 
                valueLabel="Bookinger" 
              />
            </ChartCard>
            <ChartCard title="Aktivitet per dag og time" subtitle="Mørkere = mer aktivitet">
              <div className="overflow-x-auto">
                <AdminHeatmap 
                  data={data.heatmap} 
                  rows={WEEKDAY_LABELS} 
                  cols={HOUR_LABELS} 
                  cellSize={40} 
                  formatTooltip={(c) => `${c.row} kl ${c.col}: ${c.value} økter`} 
                />
              </div>
            </ChartCard>
          </div>
        )}

        {/* ── Revenue tab ───────────────────────────────────── */}
        {activeTab === "revenue" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Inntektstrend" subtitle="Siste 9 måneder" className="lg:col-span-2">
              <AdminLineChart 
                data={data.monthlyRevenue} 
                valueLabel="Omsetning (kr)" 
              />
            </ChartCard>
            <ChartCard title="Per tjeneste">
              <AdminDonutChart data={data.serviceDistribution} />
            </ChartCard>
          </div>
        )}
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────

function KpiCard({ label, value, icon, change, positive }: {
  label: string; value: string | number; icon: React.ReactNode;
  change?: string; positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-grey-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-3xl font-bold text-grey-900 tracking-tight tabular-nums">
            {value}
          </p>
          {change && (
            <p className={cn(
              "mt-2 text-xs font-medium",
              positive ? "text-green-600" : "text-red-600"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-100 text-grey-600 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, className, children }: {
  title: string; subtitle?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-white rounded-xl shadow-card p-0 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-grey-200">
        <h3 className="text-sm font-semibold text-grey-900">{title}</h3>
        {subtitle && <span className="text-xs text-grey-500 mt-0.5 block">{subtitle}</span>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
