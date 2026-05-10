"use client";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface SgBarChartProps {
  data: Array<{ area: string; value: number }>;
  height?: number;
  className?: string;
}

const POSITIVE_COLOR = "#D1F843";
const NEGATIVE_COLOR = "#A32D2D";
const ZERO_LINE_COLOR = "#E5E3DD";

export function SgBarChart({
  data,
  height = 200,
  className,
}: SgBarChartProps) {
  const maxAbsValue = Math.max(
    ...data.map((d) => Math.abs(d.value)),
    0.5
  );
  const domainPadding = maxAbsValue * 0.3;

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 48, left: 8, bottom: 8 }}
        >
          <XAxis
            type="number"
            domain={[-(maxAbsValue + domainPadding), maxAbsValue + domainPadding]}
            hide
          />
          <YAxis
            type="category"
            dataKey="area"
            axisLine={false}
            tickLine={false}
            width={100}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12,
              fill: "#5E5C57",
            }}
          />
          <ReferenceLine
            x={0}
            stroke={ZERO_LINE_COLOR}
            strokeWidth={1}
          />
          <Bar dataKey="value" barSize={24} radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(val) => {
                const n = Number(val);
                if (isNaN(n)) return String(val ?? "");
                return n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
              }}
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), JetBrains Mono, monospace",
                fontSize: 12,
                fontWeight: 500,
                fill: "#0A1F18",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
