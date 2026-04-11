"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import type { AnalyticsData } from "@/app/admin/(authed)/analytics/actions";

interface RevenueChartProps {
  data: AnalyticsData;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.weeklyRevenue.map((item, index) => ({
    ...item,
    bookings: data.weeklyBookings[index]?.count ?? 0,
  }));

  const formatCurrency = (value: number) =>
    `kr ${(value / 1000).toFixed(0)}k`;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-grey-900)]">
            Inntekt og bookinger
          </h3>
          <p className="text-sm text-[var(--color-grey-500)]">
            Siste 8 uker
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[var(--color-grey-900)]" />
            <span className="text-[var(--color-grey-600)]">Inntekt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-[var(--color-grey-600)]">Bookinger</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-grey-200)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "var(--color-grey-500)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-grey-200)" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "var(--color-grey-500)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "var(--color-grey-500)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid var(--color-grey-200)",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => {
                const numValue = typeof value === "number" ? value : 0;
                if (name === "amount") {
                  return [`kr ${numValue.toLocaleString("nb-NO")}`, "Inntekt"];
                }
                return [numValue, "Bookinger"];
              }}
              labelStyle={{ color: "var(--color-grey-900)", fontWeight: 600 }}
            />
            <Bar
              yAxisId="left"
              dataKey="amount"
              fill="var(--color-grey-900)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-info)"
              strokeWidth={2}
              dot={{ fill: "var(--color-info)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
