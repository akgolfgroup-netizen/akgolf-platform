"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { LineChart, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminLineChart, AdminBarChart, AdminDonutChart,
  AdminHeatmap, AdminProgressRing,
  AdminTable, AdminTableHead, AdminTableBody, AdminTableRow,
  AdminTableHeaderCell, AdminTableCell,
} from "@/components/portal/mission-control/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { getDashboardData, type DashboardData, type AnalyticsPeriod } from "./actions";
import { MonoLabel, BentoGrid, BentoCard, NightSurface } from "@/components/portal/patterns";

// ── Constants ──────────────────────────────────────────────

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "week", label: "Uke" },
  { value: "month", label: "Måned" },
  { value: "quarter", label: "Kvartal" },
];

const TAB_ITEMS: TabItem[] = [
  { id: "overview", label: "Oversikt", icon: <Icon name="bar_chart" className="w-4 h-4" /> },
  { id: "students", label: "Elever", icon: <Icon name="person" className="w-4 h-4" /> },
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
        {/* Heritage Grid Header */}
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">
            Mission Control
          </MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Analytics<span className="text-outline">.</span>
          </h1>
          <p className="text-on-surface-variant">
            {data.periodLabel}
          </p>
        </div>

        {/* Period selector - Chips with grey tokens */}
        <div className="flex items-center gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePeriodChange(opt.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                period === opt.value
                  ? "bg-on-surface text-surface shadow-sm"
                  : "bg-surface text-on-surface hover:text-on-surface hover:bg-surface-variant",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Tabs items={TAB_ITEMS} value={activeTab} onValueChange={setActiveTab} />

        {/* KPI Cards - BentoGrid */}
        <BentoGrid cols={4} gap="md">
          <BentoCard variant="light" padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Aktive elever</MonoLabel>
                <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                  {data.activeStudents}
                </p>
                {data.newStudents > 0 && (
                  <p className="mt-2 text-xs font-medium text-success-text">
                    +{data.newStudents} nye
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-on-surface shrink-0">
                <Icon name="person" className="w-5 h-5" />
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="light" padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Bookinger</MonoLabel>
                <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                  {data.totalBookings}
                </p>
                <p className="mt-2 text-xs font-medium text-success-text">
                  {data.completedBookings} fullført
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-on-surface shrink-0">
                <Icon name="monitoring" className="w-5 h-5" />
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="light" padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Churn-rate</MonoLabel>
                <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                  {data.churnRate.toFixed(1)}%
                </p>
                <p className={cn(
                  "mt-2 text-xs font-medium",
                  data.churnRate < 5 ? "text-success-text" : "text-error"
                )}>
                  {data.churnedStudents} inaktive
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-on-surface shrink-0">
                <Icon name="restart_alt" className="w-5 h-5" />
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="light" padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Inntekt</MonoLabel>
                <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                  {formatKr(data.revenue)}
                </p>
                <p className={cn(
                  "mt-2 text-xs font-medium",
                  data.revenueGrowth >= 0 ? "text-success-text" : "text-error"
                )}>
                  {data.revenueGrowth >= 0 ? "+" : ""}{data.revenueGrowth.toFixed(0)}% vs forrige
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-on-surface shrink-0">
                <Icon name="trending_up" className="w-5 h-5" />
              </div>
            </div>
          </BentoCard>
        </BentoGrid>

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
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant/30">
                  <h3 className="text-sm font-semibold text-on-surface">Churn-rate</h3>
                </div>
                <div className="flex flex-col items-center gap-4 py-6 px-6">
                  <AdminProgressRing
                    value={data.churnRate}
                    max={10}
                    size={140}
                    color="success-text"
                    label="Siste periode"
                    valueSuffix="%"
                  />
                  <p className="text-xs text-on-surface-variant">Mål: under 5%</p>
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
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-on-surface">Elev-status</h3>
                <span className="text-xs text-on-surface-variant">{data.studentHealth.length} elever</span>
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
                        <span className="font-medium text-on-surface">{s.name}</span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <Badge variant={STATUS_CONFIG[s.status].variant}>
                          {STATUS_CONFIG[s.status].label}
                        </Badge>
                      </AdminTableCell>
                      <AdminTableCell className="text-on-surface-variant">{relativeDate(s.lastSession)}</AdminTableCell>
                      <AdminTableCell className={cn(!s.nextSession && "text-error")}>
                        {futureDate(s.nextSession)}
                      </AdminTableCell>
                      <AdminTableCell className="text-right tabular-nums text-on-surface">
                        {s.sessionsThisMonth}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-on-surface">Trenger oppfølging</h3>
                <Badge variant="warning">{followUp.length} elever</Badge>
              </div>
              <div className="divide-y divide-outline-variant">
                {followUp.map((s) => (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface text-on-surface text-xs font-semibold flex items-center justify-center">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-on-surface truncate">{s.name}</div>
                      <div className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Icon name="error" className="w-3 h-3" />
                        Sist aktiv: {relativeDate(s.lastSession)}
                      </div>
                    </div>
                    <Button variant="accent" className="text-xs py-1.5">Ta kontakt</Button>
                  </div>
                ))}
                {followUp.length === 0 && (
                  <div className="py-10 text-center">
                    <Icon name="calendar_today" className="w-10 h-10 text-success-text mx-auto mb-2" />
                    <span className="text-sm text-on-surface-variant">Alle elever er aktive</span>
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

function ChartCard({ title, subtitle, className, children }: {
  title: string; subtitle?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-outline-variant/30">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        {subtitle && <span className="text-xs text-on-surface-variant mt-0.5 block">{subtitle}</span>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
