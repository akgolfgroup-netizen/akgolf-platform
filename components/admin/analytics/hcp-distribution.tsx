"use client";


import { Icon } from "@/components/ui/icon";
import React from "react";
import { Card } from "@/components/ui/card";
import { AdminDonutChart } from "@/components/portal/coach-hq/ui/charts/AdminDonutChart";
import type { AdminDonutChartDatum } from "@/components/portal/coach-hq/ui/charts/AdminDonutChart";
import { Target, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HcpDistributionProps {
  data?: AdminDonutChartDatum[];
  averageHcp?: number;
  improvement?: number;
}

const defaultData: AdminDonutChartDatum[] = [
  { label: "0-9", value: 8, color: "var(--color-ai)" },
  { label: "10-18", value: 24, color: "var(--color-primary)" },
  { label: "19-27", value: 28, color: "var(--color-warning)" },
  { label: "28+", value: 12, color: "var(--color-grey-300)" },
];

export function HcpDistribution({
  data = defaultData,
  averageHcp = 18.4,
  improvement = 1.2,
}: HcpDistributionProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="my_location" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant">Snitt HCP</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-on-surface tabular-nums">{averageHcp}</p>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
                <Icon name="trending_down" className="w-3.5 h-3.5" />
                -{improvement}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-56">
        <AdminDonutChart
          data={data}
          height={224}
          centerLabel="Elever"
          centerValue={total}
        />
      </div>

      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-on-surface-variant">HCP {item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-on-surface tabular-nums">
                {item.value}
              </span>
              <span className="text-xs text-on-surface-variant w-10 text-right">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// HCP trend for individual student
interface HcpTrendProps {
  currentHcp: number;
  lowestHcp: number;
  targetHcp: number;
  trend: "improving" | "stable" | "declining";
}

export function HcpTrendBadge({
  currentHcp,
  lowestHcp,
  targetHcp,
  trend,
}: HcpTrendProps) {
  const trendConfig = {
    improving: { icon: TrendingDown, label: "Forbedrer", color: "text-success" },
    stable: { icon: Target, label: "Stabil", color: "text-on-surface-variant" },
    declining: { icon: TrendingDown, label: "Økende", color: "text-error" },
  };

  const config = trendConfig[trend];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          trend === "improving" && "bg-success-light text-success",
          trend === "stable" && "bg-surface-container text-on-surface-variant",
          trend === "declining" && "bg-error-light text-error"
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
        <span>HCP {currentHcp}</span>
        <span>·</span>
        <span>Mål: {targetHcp}</span>
      </div>
    </div>
  );
}
