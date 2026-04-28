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
 type AdminDateRange,
 type AdminDataTableColumn,
 type AdminDonutChartDatum,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OkonomiData } from "./actions";
import { MonoLabel, BentoGrid, BentoCard, NightSurface } from "@/components/portal/patterns";

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

// Fiktive i-fjor-verdier — venter på en ekte historikk-pipeline
// før vi viser sammenligningskurven igjen.
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
 <span className="tabular-nums font-semibold text-on-surface">
 {formatKr(row.amount)}
 </span>
 ),
 },
 {
 key: "createdAt",
 label: "Opprettet",
 sortable: true,
 render: (row) => (
 <span className="text-on-surface-variant/80">{formatRelativeDate(row.createdAt)}</span>
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
 <span className="tabular-nums font-semibold text-error">
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
 <span className="text-on-surface-variant/80">{formatRelativeDate(row.refundedAt)}</span>
 ) : (
 <span className="text-on-surface-variant">—</span>
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
 {/* Brand V2 page header — d20 mockup */}
 <div className="flex items-end justify-between border-b border-line pb-5">
 <div>
 <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
 / ØKONOMI · OVERSIKT
 </div>
 <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-ink">
 Cash flow.
 </h1>
 <p className="mt-1.5 max-w-2xl text-[13px] text-ink-muted">
 Brutto inntekt, utbetalinger og kategori-fordeling for valgt periode.
 Stripe-data oppdatert kontinuerlig.
 </p>
 </div>
 </div>

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

 {/* KPI-kort med sparklines — BentoGrid */}
 <BentoGrid cols={4} gap="md">
 <BentoCard variant="light" padding="md">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Dag</MonoLabel>
 <p className="mt-2 text-2xl font-bold text-on-surface tracking-tight tabular-nums">
 {formatKr(data.revenue.day)}
 </p>
 </div>
 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success-text shrink-0">
 <DollarSign className="w-5 h-5" />
 </div>
 </div>
 </BentoCard>

 <BentoCard variant="light" padding="md">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Uke</MonoLabel>
 <p className="mt-2 text-2xl font-bold text-on-surface tracking-tight tabular-nums">
 {formatKr(data.revenue.week)}
 </p>
 </div>
 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-light text-success-text shrink-0">
 <Icon name="credit_card" className="w-5 h-5" />
 </div>
 </div>
 </BentoCard>

 <BentoCard variant="light" padding="md">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Måned</MonoLabel>
 <p className="mt-2 text-2xl font-bold text-on-surface tracking-tight tabular-nums">
 {formatKr(data.revenue.month)}
 </p>
 </div>
 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning-light text-warning shrink-0">
 <Icon name="error" className="w-5 h-5" />
 </div>
 </div>
 </BentoCard>

 <BentoCard variant="light" padding="md">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <MonoLabel size="xs" uppercase className="text-on-surface-variant block">År</MonoLabel>
 <p className="mt-2 text-2xl font-bold text-on-surface tracking-tight tabular-nums">
 {yearTotal}
 </p>
 </div>
 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-fixed/20 text-secondary-fixed shrink-0">
 <Icon name="restart_alt" className="w-5 h-5" />
 </div>
 </div>
 </BentoCard>
 </BentoGrid>

 {/* Inntektstrend (Area chart med gradient) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 lg:col-span-2 overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
 <div>
 <h3 className="text-base font-semibold text-on-surface">Inntektstrend</h3>
 <span className="text-xs text-on-surface-variant/80">
 {new Date().getFullYear()} — siste 6 måneder
 </span>
 </div>
 <div className="text-right">
 <span className="text-lg font-bold text-success-text tabular-nums">
 {yearTotal}
 </span>
 <span className="text-xs text-on-surface-variant/80 block">
 totalt i år
 </span>
 </div>
 </div>
 <div className="p-6">
 {data.monthlyTrend.length === 0 ? (
 <p className="text-sm text-on-surface-variant/80 text-center py-10">
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
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30">
 <div className="px-6 py-4 border-b border-outline-variant/30">
 <h3 className="text-base font-semibold text-on-surface">Måloppnåelse vs budsjett</h3>
 </div>
 <div className="flex flex-col items-center py-6">
 <AdminGauge
 value={goalPercent}
 max={100}
 label={`${formatKr(data.revenue.year)} av ${formatKr(yearGoal)}`}
 warningThreshold={0.6}
 errorThreshold={0.4}
 />
 <div className="text-center mt-4 text-xs text-on-surface-variant/80">
 Budsjett {new Date().getFullYear()}
 </div>
 </div>
 </div>
 </div>

 {/* Bar chart siste 6 mnd + Donut per kategori */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 lg:col-span-2 overflow-hidden">
 <div className="px-6 py-4 border-b border-outline-variant/30">
 <h3 className="text-base font-semibold text-on-surface">Inntekt per måned</h3>
 <span className="text-xs text-on-surface-variant/80">
 Siste 6 måneder
 </span>
 </div>
 <div className="p-6">
 {barChart6mo.length === 0 ? (
 <p className="text-sm text-on-surface-variant/80 text-center py-10">
 Ingen data
 </p>
 ) : (
 <AdminBarChart data={barChart6mo} valueLabel="Omsetning (kr)"/>
 )}
 </div>
 </div>

 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
 <div className="px-6 py-4 border-b border-outline-variant/30">
 <h3 className="text-base font-semibold text-on-surface">Per tjeneste</h3>
 </div>
 <div className="p-4">
 {donutData.length === 0 ? (
 <p className="text-sm text-on-surface-variant/80 text-center py-10">
 Ingen data
 </p>
 ) : (
 <AdminDonutChart data={donutData} />
 )}
 </div>
 </div>
 </div>

 {/* Sammenligning i år vs i fjor */}
 <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
 <div>
 <h3 className="text-base font-semibold text-on-surface">I år vs i fjor</h3>
 <span className="text-xs text-on-surface-variant/80">
 Sammenligning måned for måned
 </span>
 </div>
 <Badge variant="success">+22% YoY</Badge>
 </div>
 <div className="p-6">
 {combinedTrend.length === 0 ? (
 <p className="text-sm text-on-surface-variant/80 text-center py-10">
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
 <NightSurface variant="ambient" className="rounded-2xl p-6">
 <div className="flex items-center justify-between mb-4">
 <MonoLabel size="xs" uppercase className="text-surface/60 block">Ubetalte bookinger</MonoLabel>
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
 </NightSurface>

 {/* Refusjoner (DataTable) */}
 <NightSurface variant="ambient" className="rounded-2xl p-6">
 <div className="flex items-center justify-between mb-4">
 <MonoLabel size="xs" uppercase className="text-surface/60 block">Refusjoner</MonoLabel>
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
 </NightSurface>
 </div>
 </>
 );
}
