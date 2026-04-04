"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { AnalyticsData } from "@/app/portal/(dashboard)/admin/analytics/actions";

interface KPICardsProps {
  data: AnalyticsData;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  delay?: number;
}

function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  delay = 0,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend === undefined || trend === 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? "bg-green-50 text-green-600"
                : isNegative
                  ? "bg-red-50 text-red-600"
                  : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]"
            }`}
          >
            <TrendIcon className="w-3 h-3" />
            <span>
              {isNeutral ? "0" : isPositive ? "+" : ""}
              {typeof trend === "number" ? trend.toFixed(1) : trend}%
            </span>
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-[var(--color-grey-900)] mb-1">
        {value}
      </p>

      <p className="text-sm font-medium text-[var(--color-grey-600)]">{title}</p>

      {subtitle && (
        <p className="text-xs text-[var(--color-grey-400)] mt-1">{subtitle}</p>
      )}

      {trendLabel && (
        <p className="text-[10px] text-[var(--color-grey-400)] mt-2">
          {trendLabel}
        </p>
      )}
    </motion.div>
  );
}

export function KPICards({ data }: KPICardsProps) {
  const formatCurrency = (amount: number) =>
    `kr ${amount.toLocaleString("nb-NO")}`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard
        title="Nye elever"
        value={data.newStudents}
        icon={UserPlus}
        iconColor="#2D6A4F"
        delay={0}
      />

      <KPICard
        title="Aktive elever"
        value={data.activeStudents}
        subtitle="Siste 30 dager"
        icon={Users}
        iconColor="#3B82F6"
        delay={0.05}
      />

      <KPICard
        title="Churnet"
        value={data.churnedStudents}
        subtitle="Ingen booking siste 60d"
        icon={UserMinus}
        iconColor={data.churnedStudents > 0 ? "#EF4444" : "#6B7280"}
        delay={0.1}
      />

      <KPICard
        title="Bookinger"
        value={data.totalBookings}
        subtitle={`${data.completedBookings} fullfort`}
        icon={Calendar}
        iconColor="#8B5CF6"
        delay={0.15}
      />

      <KPICard
        title="Booking-rate"
        value={`${data.bookingRate.toFixed(0)}%`}
        subtitle="Fullfort/totalt"
        icon={CheckCircle}
        iconColor="#10B981"
        delay={0.2}
      />

      <KPICard
        title="No-shows"
        value={data.noShowCount}
        subtitle={
          data.noShowCount > data.totalBookings * 0.1 ? "Over 10% - advarsel" : ""
        }
        icon={XCircle}
        iconColor={
          data.noShowCount > data.totalBookings * 0.1 ? "#EF4444" : "#6B7280"
        }
        delay={0.25}
      />

      <KPICard
        title="Inntekt"
        value={formatCurrency(data.revenue)}
        trend={data.revenueGrowth}
        trendLabel={`vs ${data.previousPeriodLabel}`}
        icon={TrendingUp}
        iconColor="#059669"
        delay={0.3}
      />

      <KPICard
        title="Per elev"
        value={formatCurrency(Math.round(data.avgRevenuePerStudent))}
        subtitle="Gjennomsnitt"
        icon={Users}
        iconColor="#0EA5E9"
        delay={0.35}
      />
    </div>
  );
}
