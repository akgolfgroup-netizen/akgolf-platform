"use client";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface ComplianceChartProps {
  data: Array<{ week: string; planned: number; completed: number }>;
  height?: number;
  className?: string;
}

const PLANNED_COLOR = "#EFEDE6";
const COMPLETED_COLOR = "#D1F843";

export function ComplianceChart({
  data,
  height = 260,
  className,
}: ComplianceChartProps) {
  const enriched = data.map((d) => ({
    ...d,
    compliance:
      d.planned > 0 ? Math.round((d.completed / d.planned) * 100) : 0,
  }));

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={enriched}
          margin={{ top: 24, right: 8, left: -16, bottom: 32 }}
          barGap={2}
        >
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12,
              fill: "#5E5C57",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 11,
              fill: "#9C9990",
            }}
          />
          <Bar
            dataKey="planned"
            fill={PLANNED_COLOR}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            name="Planlagt"
          />
          <Bar
            dataKey="completed"
            fill={COMPLETED_COLOR}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            name="Fullfort"
          >
            <LabelList
              dataKey="compliance"
              position="top"
              formatter={(val) => `${val ?? 0}%`}
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 500,
                fill: "#5E5C57",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 -mt-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: PLANNED_COLOR }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "12px",
              color: "#5E5C57",
            }}
          >
            Planlagt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: COMPLETED_COLOR }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "12px",
              color: "#5E5C57",
            }}
          >
            Fullfort
          </span>
        </div>
      </div>
    </div>
  );
}
