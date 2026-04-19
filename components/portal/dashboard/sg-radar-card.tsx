"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { colors } from "@/lib/design-tokens";
import { Target } from "lucide-react";
import { MonoLabel } from "@/components/portal/patterns";

interface SGRadarData {
  category: string;
  current: number;
  target: number;
}

const PLACEHOLDER_DATA: SGRadarData[] = [
  { category: "OTT", current: 0.2, target: 1.0 },
  { category: "APP", current: -0.5, target: 0.5 },
  { category: "ARG", current: -1.2, target: 0.0 },
  { category: "PUTT", current: 0.8, target: 0.5 },
];

interface SGRadarCardProps {
  data?: SGRadarData[];
}

export function SGRadarCard({ data = PLACEHOLDER_DATA }: SGRadarCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-grey-200 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">Strokes Gained</MonoLabel>
        <Target className="h-4 w-4 text-grey-300" />
      </div>

      <div className="min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <PolarGrid stroke={colors.grey[200]} />
            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: colors.grey[500],
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis
              tick={{ fill: colors.grey[400], fontSize: 10 }}
              axisLine={false}
              tickCount={4}
            />
            <Tooltip
              contentStyle={{
                background: colors.primary.white,
                border: `1px solid ${colors.grey[200]}`,
                borderRadius: "12px",
                fontSize: 12,
              }}
              formatter={(value, name) => [
                `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)}`,
                name === "current" ? "Din score" : "Mål",
              ]}
            />
            <Radar
              name="current"
              dataKey="current"
              stroke={colors.primary.main}
              fill={colors.primary.main}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name="target"
              dataKey="target"
              stroke={colors.data.coral}
              fill={colors.data.coral}
              fillOpacity={0.08}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-4 rounded-full"
            style={{ backgroundColor: colors.primary.main }}
          />
          <span className="text-xs text-grey-500">Din score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ backgroundColor: colors.data.coral }}
          />
          <span className="text-xs text-grey-500">Mål</span>
        </div>
      </div>
    </div>
  );
}
