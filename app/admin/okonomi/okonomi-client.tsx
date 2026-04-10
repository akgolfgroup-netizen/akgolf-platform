"use client";

import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  RotateCcw,
  Download,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
} from "@/components/portal/mission-control/ui";
import type { OkonomiData } from "./actions";

// ── Constants ────────────────────────────────────────────────────────────────

const timeRanges = [
  { label: "Dag", value: "day" as const },
  { label: "Uke", value: "week" as const },
  { label: "Måned", value: "month" as const },
  { label: "År", value: "year" as const },
];

type TimeRange = "day" | "week" | "month" | "year";

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
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

// ── Component ────────────────────────────────────────────────────────────────

export function OkonomiClient({ data }: { data: OkonomiData }) {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const currentRevenue = data.revenue[timeRange];
  const yearTotal = formatKr(data.revenue.year);
  const maxTrend = Math.max(...data.monthlyTrend.map((d) => d.value), 1);

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
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
            >
              Eksporter
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={<FileText className="w-4 h-4" />}
            >
              Ny faktura
            </AdminButton>
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Omsetning"
            value={formatKr(currentRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Netto (est.)"
            value={formatKr(Math.round(currentRevenue * 0.75))}
            icon={<CreditCard className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Utestående"
            value={formatKr(data.totalUnpaid)}
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Refusjoner"
            value={formatKr(data.totalRefunds)}
            icon={<RotateCcw className="w-5 h-5" />}
          />
        </div>

        {/* Hovedinnhold */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inntektsgraf */}
          <AdminCard className="lg:col-span-2 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
              <div>
                <h3 className="admin-section-title">Inntektstrend</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  {new Date().getFullYear()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[var(--color-primary)] tabular-nums">
                  {yearTotal}
                </span>
                <span className="text-xs text-[var(--color-muted)] block">
                  totalt
                </span>
              </div>
            </div>
            <div className="p-6">
              {data.monthlyTrend.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)] text-center py-10">
                  Ingen trenddata ennå.
                </p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {data.monthlyTrend.map((point) => {
                    const heightPct = (point.value / maxTrend) * 100;
                    return (
                      <div
                        key={point.label}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full bg-[var(--color-primary)] rounded-t-md transition-all hover:bg-[var(--color-primary)]/90"
                            style={{ height: `${heightPct}%` }}
                            title={formatKr(point.value)}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--color-muted)]">
                          {point.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AdminCard>

          {/* Inntekt per tjeneste */}
          <AdminCard>
            <h3 className="admin-section-title mb-4">Inntekt per tjeneste</h3>
            {data.revenueByService.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                Ingen betalinger denne måneden ennå.
              </p>
            ) : (
              <div className="space-y-4">
                {data.revenueByService.map((service) => (
                  <div key={service.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--color-text)]">
                        {service.name}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                        {formatKr(service.amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-muted)] mt-1 block">
                      {service.percentage}% av totalen
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Bunn-grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ubetalte bookinger */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Ubetalte bookinger</h3>
              {data.unpaid.length > 0 && (
                <AdminBadge variant="warning">
                  {data.unpaid.length} stk
                </AdminBadge>
              )}
            </div>
            {data.unpaid.length === 0 ? (
              <div className="p-6 text-sm text-[var(--color-muted)]">
                Ingen ubetalte bookinger.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-grey-100)]">
                {data.unpaid.map((booking) => (
                  <div
                    key={booking.id}
                    className="px-6 py-4 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[var(--color-warning)]/10">
                      <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text)] truncate">
                          {booking.customerName}
                        </span>
                        <span className="text-xs text-[var(--color-muted)] truncate">
                          {booking.serviceName}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        Opprettet: {formatRelativeDate(booking.createdAt)}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                      {formatKr(booking.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          {/* Refusjoner */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Refusjoner</h3>
              {data.refunds.length > 0 && (
                <AdminBadge variant="error">
                  {data.refunds.length} totalt
                </AdminBadge>
              )}
            </div>
            {data.refunds.length === 0 ? (
              <div className="p-6 text-sm text-[var(--color-muted)]">
                Ingen refusjoner.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-grey-100)]">
                {data.refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="px-6 py-4 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[var(--color-error)]/10">
                      <RotateCcw className="w-4 h-4 text-[var(--color-error)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">
                        {refund.customerName}
                      </div>
                      <div className="text-xs text-[var(--color-muted)] truncate">
                        {refund.serviceName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[var(--color-error)] tabular-nums block">
                        -{formatKr(refund.grossAmount)}
                      </span>
                      {refund.refundedAt && (
                        <span className="text-xs text-[var(--color-muted)]">
                          {formatRelativeDate(refund.refundedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </>
  );
}
