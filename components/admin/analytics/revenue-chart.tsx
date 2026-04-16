"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { AdminAreaChart } from "@/components/portal/mission-control/ui/charts/AdminAreaChart";
import type { AdminAreaChartDatum } from "@/components/portal/mission-control/ui/charts/AdminAreaChart";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data?: AdminAreaChartDatum[];
  period?: "month" | "quarter" | "year";
  totalRevenue?: number;
  change?: { value: number; positive: boolean };
}

// Generate mock revenue data
const generateRevenueData = (months: number = 12): AdminAreaChartDatum[] => {
  const data: AdminAreaChartDatum[] = [];
  const today = new Date();
  let baseRevenue = 120000;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    // Add some seasonality and growth
    const seasonality = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 20000;
    const growth = (months - i) * 3000;
    const random = (Math.random() - 0.5) * 15000;
    
    data.push({
      label: date.toLocaleDateString("nb-NO", { month: "short" }),
      value: Math.round(baseRevenue + seasonality + growth + random),
    });
  }
  return data;
};

const defaultData = generateRevenueData();

export function RevenueChart({
  data = defaultData,
  period = "month",
  totalRevenue = 1845000,
  change = { value: 15.3, positive: true },
}: RevenueChartProps) {
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const averageRevenue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-grey-400">Totalt ({period === "month" ? "12 måneder" : period})</h3>
              <p className="text-2xl font-bold text-black tabular-nums">
                {formatRevenue(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              change.positive ? "bg-success-light text-success" : "bg-error-light text-error"
            )}
          >
            {change.positive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change.positive ? "+" : ""}
            {change.value}%
          </div>
          <p className="text-xs text-grey-400 mt-1">vs forrige periode</p>
        </div>
      </div>

      <div className="h-64">
        <AdminAreaChart
          data={data}
          height={256}
          color="var(--color-primary)"
          showGrid
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-grey-200">
        <div>
          <p className="text-xs text-grey-400">Gjennomsnitt</p>
          <p className="text-lg font-semibold text-black tabular-nums">
            {formatRevenue(averageRevenue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-grey-400">Høyeste</p>
          <p className="text-lg font-semibold text-black tabular-nums">
            {formatRevenue(Math.max(...data.map((d) => d.value)))}
          </p>
        </div>
        <div>
          <p className="text-xs text-grey-400">Laveste</p>
          <p className="text-lg font-semibold text-black tabular-nums">
            {formatRevenue(Math.min(...data.map((d) => d.value)))}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Service breakdown component
interface ServiceRevenue {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export function RevenueByService({
  services = [
    { name: "Coaching", amount: 850000, percentage: 46, color: "var(--color-primary)" },
    { name: "TrackMan", amount: 520000, percentage: 28, color: "var(--color-ai)" },
    { name: "Junior Academy", amount: 315000, percentage: 17, color: "var(--color-warning)" },
    { name: "GFGK", amount: 160000, percentage: 9, color: "var(--color-success)" },
  ],
}: {
  services?: ServiceRevenue[];
}) {
  const total = services.reduce((sum, s) => sum + s.amount, 0);
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-black mb-4">Inntekt per tjeneste</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-black">{service.name}</span>
              <span className="text-sm text-grey-400">{formatRevenue(service.amount)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-grey-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${service.percentage}%`,
                    backgroundColor: service.color,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-grey-400 w-10 text-right">
                {service.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-grey-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black">Totalt</span>
          <span className="text-lg font-bold text-black tabular-nums">
            {formatRevenue(total)}
          </span>
        </div>
      </div>
    </Card>
  );
}
