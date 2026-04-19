"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo, useState } from "react";
import { DollarSign } from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
 AdminDateRangePicker,
 AdminAreaChart,
 AdminBarChart,
 AdminDonutChart,
 AdminLineChart,
 AdminDataTable,
 AdminGauge,
 AdminSparkline,
 type AdminDateRange,
 type AdminDataTableColumn,
 type AdminDonutChartDatum,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OkonomiData } from "./actions";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatKr(amount: number): string {
 return `${amount.toLocaleString("nb-NO")} kr`;
}

function formatRelativeDate(isoDate: string): string {
 const date = new Date(isoDate);
 const now = new Date();
 const diffMs = now.getTime() - date.getTime();
 const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

 if (diffDays === 0) return "I dag";
 if (diffDays === 1) return "I går";
 if (diffDays < 7) return `${diffDays} dager siden`;
 if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
 return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short"});
}

// ── Mock tillegg (sammenligning i fjor + sparkline) ─────────────────────────

const sparkDaily = [3200, 4100, 3800, 4500, 5200, 4900, 5800];
const sparkWeekly = [21000, 23500, 22800, 25300, 27100, 26400, 28900];
const sparkMonthly = [85000, 92000, 88000, 98000, 102000, 110000, 118000];
const sparkYearly = [780000, 820000, 860000, 910000, 950000, 1010000, 1080000];

// Fiktive i-fjor-verdier for sammenligning
function buildYearComparison(monthlyTrend: { label: string; value: number }[]) {
 return monthlyTrend.map((point) => ({
 label: point.label,
 value: Math.round(point.value * 0.82),
 }));
}

// ── Transaksjons- og refusjonsrader til tabell ──────────────────────────────

interface UnpaidRow {
 id: string;
 customerName: string;
 serviceName: string;
 amount: number;
 createdAt: string;
}

interface RefundRow {
 id: string;
 customerName: string;
 serviceName: string;
 grossAmount: number;
 refundedAt: string | null;
}

// ── Component ────────────────────────────────────────────────────────────────

export function OkonomiClient({ data }: { data: OkonomiData }) {
 const { toggle } = useMCSidebar();
 const [dateRange, setDateRange] = useState<AdminDateRange>({
 from: new Date(new Date().setDate(new Date().getDate() - 29)),
 to: new Date(),
 });

 const yearTotal = formatKr(data.revenue.year);

 const areaData = useMemo(
 () =>
 data.monthlyTrend.map((p) => ({ label: p.label, value: p.value })),
 [data.monthlyTrend],
 );

 const donutData: AdminDonutChartDatum[] = useMemo(
 () =>
 data.revenueByService.slice(0, 6).map((service) => ({
 label: service.name,
 value: service.amount,
 })),
 [data.revenueByService],
 );

 const yearComparison = useMemo(
 () => buildYearComparison(data.monthlyTrend),
 [data.monthlyTrend],
 );

 const combinedTrend = useMemo(
 () =>
 data.monthlyTrend.map((point, i) => ({
 label: point.label,
 value: point.value,
 fjor: yearComparison[i]?.value ?? 0,
 })),
 [data.monthlyTrend, yearComparison],
 );

 const barChart6mo = useMemo(
 () =>
 data.monthlyTrend
 .slice(-6)
 .map((p) => ({ label: p.label, value: p.value })),
 [data.monthlyTrend],
 );

 // Måloppnåelse: mål 1,5M for året (eksempel)
 const yearGoal = 1_500_000;
 const goalPercent = Math.round((data.revenue.year / yearGoal) * 100);

 // Unpaid table columns
 const unpaidColumns: AdminDataTableColumn<UnpaidRow>[] = [
 {
 key: "customerName",
 label: "Kunde",
 sortable: true,
 },
 {
 key: "serviceName",
 label: "Tjeneste",
 sortable: true,
 },
 {
 key: "amount",
 label: "Beløp",
 sortable: true,
 align: "right",
 render: (row) => (
 <span className="tabular-nums font-semibold text-text">
 {formatKr(row.amount)}
 </span>
 ),
 },
 {
 key: "createdAt",
 label: "Opprettet",
 sortable: true,
 render: (row) => (
 <span className="text-grey-500">{formatRelativeDate(row.createdAt)}</span>
 ),
 },
 ];

 const refundColumns: AdminDataTableColumn<RefundRow>[] = [
 {
 key: "customerName",
 label: "Kunde",
 sortable: true,
 },
 {
 key: "serviceName",
 label: "Tjeneste",
 sortable: true,
 },
 {
 key: "grossAmount",
 label: "Beløp",
 sortable: true,
 align: "right",
 render: (row) => (
 <span className="tabular-nums font-semibold text-red-600">
 -{formatKr(row.grossAmount)}
 </span>
 ),
 },
 {
 key: "refundedAt",
 label: "Refundert",
 sortable: true,
 render: (row) =>
 row.refundedAt ? (
 <span className="text-grey-500">{formatRelativeDate(row.refundedAt)}</span>
 ) : (
 <span className="text-grey-400">—</span>
 ),
 },
 ];

 const unpaidRows: UnpaidRow[] = data.unpaid.map((u) => ({
 id: u.id,
 customerName: u.customerName,
 serviceName: u.serviceName,
 amount: u.amount,
 createdAt: u.createdAt,
 }));

 const refundRows: RefundRow[] = data.refunds.map((r) => ({
 id: r.id,
 customerName: r.customerName,
 serviceName: r.serviceName,
 grossAmount: r.grossAmount,
 refundedAt: r.refundedAt,
 }));

 return (
 <>
 <MCTopbar
 title="Økonomi"
 subtitle="Oversikt over inntekter, fakturaer og refusjoner"
 onMenuClick={toggle}
 />

 <div className="p-6 space-y-6">
 {/* Tidsperiode og handlinger */}
 <div className="flex items-center justify-between flex-wrap gap-3">
 <AdminDateRangePicker value={dateRange} onChange={setDateRange} />
 <div className="flex gap-2">
 <Button
 variant="secondary"
 >
 <Icon name="download" className="w-4 h-4 mr-2" />
 Eksporter
 </Button>
 <Button
 variant="accent"
 >
 <Icon name="description" className="w-4 h-4 mr-2" />
 Ny faktura
 </Button>
 </div>
 </div>

 {/* KPI-kort med sparklines */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCardSpark
 label="Dag"
 value={formatKr(data.revenue.day)}
 icon={<DollarSign className="w-5 h-5"/>}
 sparkData={sparkDaily}
 sparkColor="black"
 change={{ value: 8, positive: true }}
 />
 <StatCardSpark
 label="Uke"
 value={formatKr(data.revenue.week)}
 icon={<Icon name="credit_card" className="w-5 h-5" />}
 sparkData={sparkWeekly}
 sparkColor="success-text"
 change={{ value: 12, positive: true }}
 />
 <StatCardSpark
 label="Måned"
 value={formatKr(data.revenue.month)}
 icon={<Icon name="error" className="w-5 h-5" />}
 sparkData={sparkMonthly}
 sparkColor="#C48A32"
 change={{ value: 15, positive: true }}
 />
 <StatCardSpark
 label="År"
 value={yearTotal}
 icon={<Icon name="restart_alt" className="w-5 h-5" />}
 sparkData={sparkYearly}
 sparkColor="#D1F843"
 change={{ value: 22, positive: true }}
 />
 </div>

 {/* Inntektstrend (Area chart med gradient) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl lg:col-span-2 overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
 <div>
 <h3 className="text-base font-semibold text-black">Inntektstrend</h3>
 <span className="text-xs text-grey-500">
 {new Date().getFullYear()} — siste 6 måneder
 </span>
 </div>
 <div className="text-right">
 <span className="text-lg font-bold text-green-700 tabular-nums">
 {yearTotal}
 </span>
 <span className="text-xs text-grey-500 block">
 totalt i år
 </span>
 </div>
 </div>
 <div className="p-6">
 {data.monthlyTrend.length === 0 ? (
 <p className="text-sm text-grey-500 text-center py-10">
 Ingen trenddata ennå.
 </p>
 ) : (
 <AdminAreaChart
 data={areaData}
 valueLabel="Omsetning (kr)"
 height={280}
 />
 )}
 </div>
 </div>

 {/* Måloppnåelse-gauge */}
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl">
 <div className="px-6 py-4 border-b border-grey-200">
 <h3 className="text-base font-semibold text-black">Måloppnåelse vs budsjett</h3>
 </div>
 <div className="flex flex-col items-center py-6">
 <AdminGauge
 value={goalPercent}
 max={100}
 label={`${formatKr(data.revenue.year)} av ${formatKr(yearGoal)}`}
 warningThreshold={0.6}
 errorThreshold={0.4}
 />
 <div className="text-center mt-4 text-xs text-grey-500">
 Budsjett {new Date().getFullYear()}
 </div>
 </div>
 </div>
 </div>

 {/* Bar chart siste 6 mnd + Donut per kategori */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl lg:col-span-2 overflow-hidden">
 <div className="px-6 py-4 border-b border-grey-200">
 <h3 className="text-base font-semibold text-black">Inntekt per måned</h3>
 <span className="text-xs text-grey-500">
 Siste 6 måneder
 </span>
 </div>
 <div className="p-6">
 {barChart6mo.length === 0 ? (
 <p className="text-sm text-grey-500 text-center py-10">
 Ingen data
 </p>
 ) : (
 <AdminBarChart data={barChart6mo} valueLabel="Omsetning (kr)"/>
 )}
 </div>
 </div>

 <div className="bg-white rounded-xl border border-grey-200 rounded-xl overflow-hidden">
 <div className="px-6 py-4 border-b border-grey-200">
 <h3 className="text-base font-semibold text-black">Per tjeneste</h3>
 </div>
 <div className="p-4">
 {donutData.length === 0 ? (
 <p className="text-sm text-grey-500 text-center py-10">
 Ingen data
 </p>
 ) : (
 <AdminDonutChart data={donutData} />
 )}
 </div>
 </div>
 </div>

 {/* Sammenligning i år vs i fjor */}
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
 <div>
 <h3 className="text-base font-semibold text-black">I år vs i fjor</h3>
 <span className="text-xs text-grey-500">
 Sammenligning måned for måned
 </span>
 </div>
 <Badge variant="success">+22% YoY</Badge>
 </div>
 <div className="p-6">
 {combinedTrend.length === 0 ? (
 <p className="text-sm text-grey-500 text-center py-10">
 Ingen data
 </p>
 ) : (
 <AdminLineChart
 data={combinedTrend}
 valueLabel="I år"
 showLegend
 />
 )}
 </div>
 </div>

 {/* Ubetalte bookinger (DataTable, søkbar + sorterbar) */}
 <div>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-base font-semibold text-black">Ubetalte bookinger</h3>
 {unpaidRows.length > 0 && (
 <Badge variant="warning">
 {unpaidRows.length} stk · {formatKr(data.totalUnpaid)}
 </Badge>
 )}
 </div>
 <AdminDataTable<UnpaidRow>
 columns={unpaidColumns}
 data={unpaidRows}
 searchable
 searchPlaceholder="Søk etter kunde eller tjeneste..."
 pagination={{ pageSize: 10 }}
 emptyMessage="Ingen ubetalte bookinger."
 />
 </div>

 {/* Refusjoner (DataTable) */}
 <div>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-base font-semibold text-black">Refusjoner</h3>
 {refundRows.length > 0 && (
 <Badge variant="error">
 {refundRows.length} totalt · {formatKr(data.totalRefunds)}
 </Badge>
 )}
 </div>
 <AdminDataTable<RefundRow>
 columns={refundColumns}
 data={refundRows}
 searchable
 searchPlaceholder="Søk i refusjoner..."
 pagination={{ pageSize: 10 }}
 emptyMessage="Ingen refusjoner."
 />
 </div>
 </div>
 </>
 );
}

// ─── Stat card med sparkline ────────────────────────────────────────────────

interface StatCardSparkProps {
 label: string;
 value: string;
 icon: React.ReactNode;
 sparkData: number[];
 sparkColor?: string;
 change: { value: number; positive: boolean };
}

function StatCardSpark({
 label,
 value,
 icon,
 sparkData,
 sparkColor,
 change,
}: StatCardSparkProps) {
 return (
 <div className="bg-white rounded-xl border border-grey-200 rounded-xl p-5">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-grey-500">{label}</p>
 <p className="mt-2 text-2xl font-bold text-black tracking-tight tabular-nums">
 {value}
 </p>
 <div className="mt-2 flex items-center gap-1 text-xs font-medium">
 <span
 className={
 change.positive
 ? "text-green-600"
 : "text-red-600"
 }
 >
 {change.positive ? "+": "-"}
 {change.value}%
 </span>
 <span className="text-grey-400">vs forrige</span>
 </div>
 </div>
 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700">
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
