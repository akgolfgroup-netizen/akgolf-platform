"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colors, shadows } from "@/lib/design-tokens";
import { TrendingDown } from "lucide-react";

interface HandicapTrendChartProps {
  data: number[];
}

const MONTHS = [
  "jan", "feb", "mar", "apr", "mai", "jun",
  "jul", "aug", "sep", "okt", "nov", "des",
];

function generateMonthLabels(count: number): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MONTHS[d.getMonth()]);
  }
  return labels;
}

export function HandicapTrendChart({ data }: HandicapTrendChartProps) {
  const labels = generateMonthLabels(data.length);
  const chartData = data.map((hcp, i) => ({
    month: labels[i] ?? "",
    hcp,
  }));

  const currentHcp = data[data.length - 1] ?? 0;
  const startHcp = data[0] ?? currentHcp;
  const improvement = startHcp - currentHcp;

  return (
    <div className="flex h-full flex-col rounded-xl border border-grey-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-400">
            Handicap-utvikling
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[32px] font-semibold tracking-tight text-black">
              {currentHcp.toFixed(1)}
            </span>
            {improvement > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success-light px-2 py-0.5 text-xs font-semibold text-success-text">
                <TrendingDown className="h-3 w-3" />
                -{improvement.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[220px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary.main}
                  stopOpacity={0.12}
                />
                <stop
                  offset="95%"
                  stopColor={colors.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grey[100]}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: colors.grey[400], fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fill: colors.grey[400], fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              reversed
            />
            <Tooltip
              contentStyle={{
                background: colors.primary.white,
                border: `1px solid ${colors.grey[200]}`,
                borderRadius: "12px",
                fontSize: 12,
                boxShadow: shadows.md,
              }}
              labelStyle={{ color: colors.grey[500] }}
              itemStyle={{ color: colors.primary.dark }}
              formatter={(value) => [
                `HCP ${Number(value).toFixed(1)}`,
                "Handicap",
              ]}
            />
            <Area
              type="monotone"
              dataKey="hcp"
              stroke={colors.primary.main}
              strokeWidth={2.5}
              fill="url(#trendFill)"
              activeDot={{
                r: 5,
                stroke: colors.primary.main,
                strokeWidth: 2,
                fill: colors.primary.white,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
