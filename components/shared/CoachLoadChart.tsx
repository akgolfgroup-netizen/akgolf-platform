"use client";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface CoachLoadChartProps {
  data: Array<{
    coachName: string;
    bookedHours: number;
    availableHours: number;
    studentCount: number;
  }>;
  className?: string;
}

function getBookedColor(utilization: number): string {
  if (utilization >= 95) return "#A32D2D";
  if (utilization >= 85) return "#B8852A";
  return "#005840";
}

interface ChartRow {
  coachName: string;
  booked: number;
  available: number;
  total: number;
  utilization: number;
  studentCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UtilizationLabel(props: Record<string, any>) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, chartData = [] } = props as {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    chartData?: ChartRow[];
  };
  const row = chartData[index];
  if (!row) return null;

  const labelX = x + width + 8;
  const labelY = y + height / 2;

  return (
    <g>
      <text
        x={labelX}
        y={labelY}
        dy={-1}
        textAnchor="start"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          fontWeight: 500,
          fill: "#0A1F18",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(row.utilization)}%
      </text>
      <rect
        x={labelX + 38}
        y={labelY - 10}
        width={32}
        height={18}
        rx={9}
        fill="#EFEDE6"
      />
      <text
        x={labelX + 54}
        y={labelY}
        dy={1}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 10,
          fontWeight: 500,
          fill: "#5E5C57",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {row.studentCount}
      </text>
    </g>
  );
}

export function CoachLoadChart({ data, className }: CoachLoadChartProps) {
  const chartData: ChartRow[] = data.map((d) => {
    const total = d.bookedHours + d.availableHours;
    const utilization = total > 0 ? (d.bookedHours / total) * 100 : 0;
    return {
      coachName: d.coachName,
      booked: d.bookedHours,
      available: d.availableHours,
      total,
      utilization,
      studentCount: d.studentCount,
    };
  });

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);
  const barHeight = Math.max(chartData.length * 48, 120);

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{
        borderRadius: 20,
        border: "1px solid #E5E3DD",
        backgroundColor: "#FFFFFF",
        padding: "20px 24px",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontSize: 16,
          fontWeight: 700,
          color: "#0A1F18",
          margin: "0 0 16px",
        }}
      >
        Coach-kapasitet
      </h3>

      <ResponsiveContainer width="100%" height={barHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 90, bottom: 0, left: 0 }}
          barCategoryGap="20%"
        >
          <XAxis
            type="number"
            domain={[0, maxTotal]}
            hide
          />
          <YAxis
            type="category"
            dataKey="coachName"
            width={100}
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              fill: "#0A1F18",
            }}
          />
          <Bar
            dataKey="booked"
            stackId="load"
            radius={[6, 0, 0, 6]}
            isAnimationActive={false}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.coachName}
                fill={getBookedColor(entry.utilization)}
              />
            ))}
            <LabelList
              dataKey="booked"
              content={((props: Record<string, unknown>) => (
                <UtilizationLabel {...props} chartData={chartData} />
              )) as never}
            />
          </Bar>
          <Bar
            dataKey="available"
            stackId="load"
            fill="#EFEDE6"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
