"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, RefreshCw, Loader2 } from "lucide-react";
import { KPICards } from "@/components/portal/admin/analytics/kpi-cards";
import { RevenueChart } from "@/components/portal/admin/analytics/revenue-chart";
import { StudentMetrics } from "@/components/portal/admin/analytics/student-metrics";
import { getAnalyticsData, type AnalyticsData, type AnalyticsPeriod } from "./actions";

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "week", label: "Denne uken" },
  { value: "month", label: "Denne maneden" },
  { value: "quarter", label: "Dette kvartalet" },
];

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const result = await getAnalyticsData(period);
    setData(result);

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const result = await getAnalyticsData(period);
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-grey-400)]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-grey-500)]">Kunne ikke laste data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-[var(--color-grey-900)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
              Analytics
            </h1>
            <p className="text-sm text-[var(--color-grey-500)]">
              {data.periodLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex bg-[var(--color-grey-100)] rounded-lg p-1">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-[background-color,color,box-shadow] ${
                  period === option.value
                    ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                    : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 rounded-lg bg-[var(--color-grey-100)] text-[var(--color-grey-600)] hover:bg-[var(--color-grey-200)] hover:text-[var(--color-grey-900)] transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <KPICards data={data} />

      {/* Revenue Chart */}
      <RevenueChart data={data} />

      {/* Student Metrics */}
      <StudentMetrics data={data} />
    </div>
  );
}
