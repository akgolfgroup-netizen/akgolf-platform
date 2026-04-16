"use client";

import React from "react";
import { Calendar, Users, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminSparkline } from "@/components/portal/mission-control/ui/charts/AdminSparkline";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
    label: string;
  };
  icon: React.ReactNode;
  sparklineData?: number[];
  sparklineColor?: string;
  className?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  sparklineData,
  sparklineColor = "var(--color-primary)",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5 overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-grey-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-black tracking-tight tabular-nums">
            {value}
          </p>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    trend.positive ? "text-success" : "text-error"
                  )}
                >
                  {trend.positive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {trend.value > 0 && "+"}
                  {trend.value}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-grey-400">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-50 text-black shrink-0">
          {icon}
        </div>
      </div>
      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-4 -mx-5 -mb-5 px-5 pb-4">
          <AdminSparkline
            data={sparklineData}
            width="100%"
            height={40}
            color={sparklineColor}
          />
        </div>
      )}
    </Card>
  );
}

// Mock data for sparklines
const sparklineSessions = [3, 5, 4, 6, 8, 5, 7, 9, 6, 8, 10, 7, 9, 8, 10];
const sparklineStudents = [45, 47, 48, 50, 52, 53, 55, 56, 58, 60, 61, 63, 65, 66, 68];
const sparklineRevenue = [8500, 9200, 8800, 10500, 11200, 10800, 12500, 13200, 12800, 14500, 15200, 14800, 16500, 17200, 18000];
const sparklineActivity = [65, 72, 68, 75, 82, 78, 85, 88, 82, 90, 92, 88, 95, 93, 98];

interface DashboardStatsProps {
  data?: {
    sessionsToday: number;
    sessionsTrend: number;
    activeStudents: number;
    studentsTrend: number;
    newStudentsThisMonth: number;
    mtdRevenue: number;
    revenueTrend: number;
    weeklySessions: number;
    activityTrend: number;
  };
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = data || {
    sessionsToday: 3,
    sessionsTrend: 12,
    activeStudents: 68,
    studentsTrend: 8,
    newStudentsThisMonth: 5,
    mtdRevenue: 18000,
    revenueTrend: 15,
    weeklySessions: 24,
    activityTrend: 5,
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Bookinger i dag"
        value={stats.sessionsToday}
        subtitle="3 coaching, 2 trackman"
        trend={{ value: stats.sessionsTrend, positive: true, label: "vs snitt" }}
        icon={<Calendar className="w-5 h-5" />}
        sparklineData={sparklineSessions}
        sparklineColor="var(--color-primary)"
      />
      
      <StatCard
        title="Aktive elever"
        value={stats.activeStudents}
        subtitle={`+${stats.newStudentsThisMonth} denne måneden`}
        trend={{ value: stats.studentsTrend, positive: true, label: "vs forrige måned" }}
        icon={<Users className="w-5 h-5" />}
        sparklineData={sparklineStudents}
        sparklineColor="var(--color-success)"
      />
      
      <StatCard
        title="Inntekt denne måneden"
        value={formatRevenue(stats.mtdRevenue)}
        trend={{ value: stats.revenueTrend, positive: true, label: "vs forrige måned" }}
        icon={<TrendingUp className="w-5 h-5" />}
        sparklineData={sparklineRevenue}
        sparklineColor="var(--color-accent-cta)"
      />
      
      <StatCard
        title="Aktivitet"
        value={`${stats.weeklySessions} økter`}
        subtitle="Denne uken logget"
        trend={{ value: stats.activityTrend, positive: true, label: "vs forrige uke" }}
        icon={<Activity className="w-5 h-5" />}
        sparklineData={sparklineActivity}
        sparklineColor="var(--color-ai)"
      />
    </div>
  );
}

export function MiniStatCard({
  label,
  value,
  trend,
  icon,
}: {
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-grey-50">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-grey-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-grey-400 truncate">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black tabular-nums">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-error"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
