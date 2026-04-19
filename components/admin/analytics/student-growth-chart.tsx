"use client";


import { Icon } from "@/components/ui/icon";
import React from "react";
import { Card } from "@/components/ui/card";
import { AdminBarChart } from "@/components/portal/mission-control/ui/charts/AdminBarChart";
import type { AdminBarChartDatum } from "@/components/portal/mission-control/ui/charts/AdminBarChart";


interface StudentGrowthChartProps {
  data?: AdminBarChartDatum[];
  newStudents?: number;
  churnedStudents?: number;
  retentionRate?: number;
}

// Generate mock student growth data
const generateGrowthData = (months: number = 12): AdminBarChartDatum[] => {
  const data: AdminBarChartDatum[] = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const newStudents = Math.round(3 + Math.random() * 4);
    
    data.push({
      label: date.toLocaleDateString("nb-NO", { month: "short" }),
      value: newStudents,
    });
  }
  return data;
};

const defaultData = generateGrowthData();

export function StudentGrowthChart({
  data = defaultData,
  newStudents = 42,
  churnedStudents = 8,
  retentionRate = 88,
}: StudentGrowthChartProps) {
  const totalStudents = data.reduce((sum, d) => sum + d.value, 45);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
            <Icon name="person"s className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-grey-400">Totale elever</h3>
            <p className="text-2xl font-bold text-black tabular-nums">{totalStudents}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
            <Icon name="person"Plus className="w-3.5 h-3.5" />
            +{newStudents}
          </span>
          <p className="text-xs text-grey-400 mt-1">Nye denne måneden</p>
        </div>
      </div>

      <div className="h-48">
        <AdminBarChart
          data={data}
          height={192}
          color="var(--color-success)"
          showGrid
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-grey-200">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="person"Plus className="w-4 h-4 text-success" />
            <span className="text-xs text-grey-400">Nye</span>
          </div>
          <p className="text-lg font-semibold text-black tabular-nums">{newStudents}</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Icon name="person"Minus className="w-4 h-4 text-error" />
            <span className="text-xs text-grey-400">Sluttet</span>
          </div>
          <p className="text-lg font-semibold text-black tabular-nums">{churnedStudents}</p>
        </div>
        <div>
          <p className="text-xs text-grey-400">Retensjonsrate</p>
          <p className="text-lg font-semibold text-black tabular-nums">{retentionRate}%</p>
        </div>
      </div>
    </Card>
  );
}

// Student tier distribution
interface TierDistribution {
  tier: string;
  count: number;
  percentage: number;
  color: string;
}

export function StudentTierDistribution({
  tiers = [
    { tier: "Elite", count: 12, percentage: 18, color: "var(--color-ai)" },
    { tier: "Pro", count: 28, percentage: 41, color: "var(--color-primary)" },
    { tier: "Academy", count: 18, percentage: 26, color: "var(--color-warning)" },
    { tier: "Starter", count: 10, percentage: 15, color: "var(--color-grey-300)" },
  ],
}: {
  tiers?: TierDistribution[];
}) {
  const total = tiers.reduce((sum, t) => sum + t.count, 0);

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-black mb-4">Fordeling per tier</h3>
      <div className="space-y-3">
        {tiers.map((tier) => (
          <div key={tier.tier} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tier.color }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">{tier.tier}</span>
                <span className="text-sm text-grey-400">{tier.count}</span>
              </div>
              <div className="h-1.5 bg-grey-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                />
              </div>
            </div>
            <span className="text-xs font-medium text-grey-400 w-10 text-right">
              {tier.percentage}%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-grey-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black">Totalt</span>
          <span className="text-lg font-bold text-black tabular-nums">{total}</span>
        </div>
      </div>
    </Card>
  );
}
