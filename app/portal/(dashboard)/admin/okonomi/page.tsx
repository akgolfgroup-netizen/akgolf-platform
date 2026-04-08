"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  AlertCircle,
  RotateCcw,
  Download,
  FileText,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  MCTopbar,
  useMCSidebar,
  HGStatCard,
  HGRevenueChart,
} from "@/components/portal/mission-control";

// Mock data
const revenueData = {
  day: 8400,
  week: 52400,
  month: 203000,
  year: 2450000,
};

const revenueByService = [
  { name: "Privat Coaching", amount: 125000, percentage: 62, trend: 12 },
  { name: "Videoanalyse", amount: 45000, percentage: 22, trend: -5 },
  { name: "Junior Trening", amount: 25000, percentage: 12, trend: 8 },
  { name: "Gruppetrening", amount: 8000, percentage: 4, trend: 15 },
];

const unpaidInvoices = [
  { id: "INV-001", customer: "Olav Hansen", amount: 1200, dueDate: "2 dager over", daysOverdue: 2 },
  { id: "INV-002", customer: "Erik Johansen", amount: 2400, dueDate: "5 dager over", daysOverdue: 5 },
  { id: "INV-003", customer: "Bedrift AS", amount: 15000, dueDate: "1 dag over", daysOverdue: 1 },
];

const refunds = [
  { id: "REF-001", customer: "Mari Kristiansen", amount: 1200, reason: "Avbestilling", date: "I går" },
  { id: "REF-002", customer: "Sofie Berg", amount: 600, reason: "No-show", date: "Forrige uke" },
];

const monthlyData = [
  { label: "Jan", value: 180000, previousValue: 165000 },
  { label: "Feb", value: 195000, previousValue: 170000 },
  { label: "Mar", value: 210000, previousValue: 185000 },
  { label: "Apr", value: 203000, previousValue: 190000 },
  { label: "Mai", value: 0, previousValue: 195000 },
  { label: "Jun", value: 0, previousValue: 200000 },
];

const timeRanges = [
  { label: "Dag", value: "day" },
  { label: "Uke", value: "week" },
  { label: "Måned", value: "month" },
  { label: "År", value: "year" },
];

export default function OkonomiPage() {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState("month");

  const currentRevenue = revenueData[timeRange as keyof typeof revenueData];

  return (
    <>
      <MCTopbar
        title="Økonomi"
        subtitle="Oversikt over inntekter, fakturaer og refusjoner"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Time Range & Actions */}
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

        {/* Revenue Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Omsetning"
            value={`${currentRevenue.toLocaleString("nb-NO")} kr`}
            trend={{ value: 12, direction: "up" }}
            icon={DollarSign}
          />
          <HGStatCard
            label="Betalinger"
            value={`${Math.round(currentRevenue * 0.92).toLocaleString("nb-NO")} kr`}
            trend={{ value: 8, direction: "up" }}
            icon={CreditCard}
          />
          <HGStatCard
            label="Utestående"
            value={`${unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString("nb-NO")} kr`}
            trend={{ value: 5, direction: "down" }}
            icon={AlertCircle}
            variant="warning"
          />
          <HGStatCard
            label="Refusjoner"
            value={`${refunds.reduce((sum, r) => sum + r.amount, 0).toLocaleString("nb-NO")} kr`}
            trend={{ value: 2, direction: "down" }}
            icon={RotateCcw}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <HGRevenueChart
              data={monthlyData}
              title="Inntektstrend"
              period="2024"
              total="788 000 kr"
            />
          </div>

          {/* Revenue by Service */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Inntekt per tjeneste</h3>
            <div className="space-y-4">
              {revenueByService.map((service) => (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[var(--hg-text)]">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                        {service.amount.toLocaleString("nb-NO")} kr
                      </span>
                      <span
                        className={cn(
                          "flex items-center text-xs",
                          service.trend > 0 ? "text-[var(--hg-success)]" : "text-[var(--hg-error)]"
                        )}
                      >
                        {service.trend > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(service.trend)}%
                      </span>
                    </div>
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
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Unpaid Invoices */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Ubetalte fakturaer</h3>
              <span className="hg-badge hg-badge-warning">
                {unpaidInvoices.length} stk
              </span>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {unpaidInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--hg-warning-bg)]">
                    <AlertCircle className="w-4 h-4 text-[var(--hg-warning)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--hg-text)]">
                        {invoice.id}
                      </span>
                      <span className="text-xs text-[var(--hg-text-muted)]">
                        {invoice.customer}
                      </span>
                    </div>
                    <div className={cn(
                      "text-xs",
                      invoice.daysOverdue > 3 ? "text-[var(--hg-error)]" : "text-[var(--hg-warning)]"
                    )}>
                      Forfall: {invoice.dueDate}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                    {invoice.amount.toLocaleString("nb-NO")} kr
                  </span>
                  <button className="hg-btn hg-btn-secondary text-xs py-1.5">
                    Påminn
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Refunds */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Refusjoner</h3>
              <span className="hg-badge hg-badge-error">
                {refunds.length} siste 30 dager
              </span>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {refunds.map((refund) => (
                <div key={refund.id} className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--hg-error-bg)]">
                    <RotateCcw className="w-4 h-4 text-[var(--hg-error)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--hg-text)]">
                        {refund.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--hg-text-muted)]">
                      <span>{refund.customer}</span>
                      <span>•</span>
                      <span>{refund.reason}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[var(--hg-error)] tabular-nums block">
                      -{refund.amount.toLocaleString("nb-NO")} kr
                    </span>
                    <span className="text-xs text-[var(--hg-text-muted)]">{refund.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
