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
import { cn } from "@/lib/portal/utils/cn";
import {
  MCTopbar,
  useMCSidebar,
  HGStatCard,
  HGRevenueChart,
} from "@/components/portal/mission-control";
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

  return (
    <>
      <MCTopbar
        title="Økonomi"
        subtitle="Oversikt over inntekter, fakturaer og refusjoner"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Tidsperiode og handlinger */}
        <div className="flex items-center justify-between flex-wrap gap-3">
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
          <div className="flex gap-2">
            <button className="hg-btn hg-btn-secondary">
              <Download className="w-4 h-4" />
              Eksporter
            </button>
            <button className="hg-btn hg-btn-primary">
              <FileText className="w-4 h-4" />
              Ny faktura
            </button>
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Omsetning"
            value={formatKr(currentRevenue)}
            icon={DollarSign}
          />
          <HGStatCard
            label="Netto (est.)"
            value={formatKr(Math.round(currentRevenue * 0.75))}
            icon={CreditCard}
            subtitle="Etter MVA og avgifter"
          />
          <HGStatCard
            label="Utestående"
            value={formatKr(data.totalUnpaid)}
            icon={AlertCircle}
            variant={data.totalUnpaid > 0 ? "warning" : "default"}
          />
          <HGStatCard
            label="Refusjoner"
            value={formatKr(data.totalRefunds)}
            icon={RotateCcw}
          />
        </div>

        {/* Hovedinnhold */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Inntektsgraf */}
          <div className="lg:col-span-2">
            <HGRevenueChart
              data={data.monthlyTrend}
              title="Inntektstrend"
              period={new Date().getFullYear().toString()}
              total={yearTotal}
            />
          </div>

          {/* Inntekt per tjeneste */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Inntekt per tjeneste</h3>
            {data.revenueByService.length === 0 ? (
              <p className="text-sm text-[var(--hg-text-muted)]">
                Ingen betalinger denne måneden ennå.
              </p>
            ) : (
              <div className="space-y-4">
                {data.revenueByService.map((service) => (
                  <div key={service.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--hg-text)]">
                        {service.name}
                      </span>
                      <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                        {formatKr(service.amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--hg-surface-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--hg-primary)] rounded-full transition-all"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--hg-text-muted)] mt-1 block">
                      {service.percentage}% av totalen
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bunn-grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Ubetalte bookinger */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Ubetalte bookinger</h3>
              {data.unpaid.length > 0 && (
                <span className="hg-badge hg-badge-warning">
                  {data.unpaid.length} stk
                </span>
              )}
            </div>
            {data.unpaid.length === 0 ? (
              <div className="p-4 text-sm text-[var(--hg-text-muted)]">
                Ingen ubetalte bookinger.
              </div>
            ) : (
              <div className="divide-y divide-[var(--hg-border-subtle)]">
                {data.unpaid.map((booking) => (
                  <div key={booking.id} className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--hg-warning-bg)]">
                      <AlertCircle className="w-4 h-4 text-[var(--hg-warning)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--hg-text)]">
                          {booking.customerName}
                        </span>
                        <span className="text-xs text-[var(--hg-text-muted)]">
                          {booking.serviceName}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--hg-text-muted)]">
                        Opprettet: {formatRelativeDate(booking.createdAt)}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                      {formatKr(booking.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refusjoner */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Refusjoner</h3>
              {data.refunds.length > 0 && (
                <span className="hg-badge hg-badge-error">
                  {data.refunds.length} totalt
                </span>
              )}
            </div>
            {data.refunds.length === 0 ? (
              <div className="p-4 text-sm text-[var(--hg-text-muted)]">
                Ingen refusjoner.
              </div>
            ) : (
              <div className="divide-y divide-[var(--hg-border-subtle)]">
                {data.refunds.map((refund) => (
                  <div key={refund.id} className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--hg-error-bg)]">
                      <RotateCcw className="w-4 h-4 text-[var(--hg-error)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--hg-text)]">
                        {refund.customerName}
                      </div>
                      <div className="text-xs text-[var(--hg-text-muted)]">
                        {refund.serviceName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[var(--hg-error)] tabular-nums block">
                        -{formatKr(refund.grossAmount)}
                      </span>
                      {refund.refundedAt && (
                        <span className="text-xs text-[var(--hg-text-muted)]">
                          {formatRelativeDate(refund.refundedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
