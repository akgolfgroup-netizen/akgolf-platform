"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PYRAMID_LEVELS } from "@/lib/portal/golf/ak-formula";
import type { DegradationCurve as DegradationCurveData } from "@/lib/portal/training/degradation-service";
import type { ShotType } from "@/lib/portal/training/l-phase-service";

// =============================================================================
// TYPES
// =============================================================================

interface DegradationCurveProps {
  data: Record<ShotType, DegradationCurveData>;
}

interface ChartDataPoint {
  level: string;
  levelName: string;
  score: number | null;
  dataPoints: number;
}

// =============================================================================
// SHOT TYPE LABELS
// =============================================================================

const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  DRIVER: "Driver",
  IRON: "Jern",
  WEDGE: "Wedge",
  PUTT: "Putt",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function DegradationCurve({ data }: DegradationCurveProps) {
  const [selectedShotType, setSelectedShotType] = useState<ShotType>("DRIVER");

  const curveData = data[selectedShotType];

  // Transform data for chart
  const chartData: ChartDataPoint[] = curveData.points.map((point) => ({
    level: point.pyramidLevel,
    levelName: PYRAMID_LEVELS[point.pyramidLevel].name,
    score: point.score,
    dataPoints: point.dataPoints,
  }));

  // Check if we have enough data
  const hasData = chartData.some((d) => d.score !== null);

  if (!hasData) {
    return (
      <div className="space-y-4">
        <ShotTypeSelector
          selected={selectedShotType}
          onChange={setSelectedShotType}
        />
        <div className="flex items-center justify-center h-40 text-sm text-[var(--color-grey-500)]">
          Ikke nok treningsdata for {SHOT_TYPE_LABELS[selectedShotType]}. Logg
          flere okter for a se degraderingskurven.
        </div>
      </div>
    );
  }

  // Calculate Y-axis domain
  const scores = chartData.map((d) => d.score).filter((s): s is number => s !== null);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const padding = Math.max((maxScore - minScore) * 0.2, 1);
  const yMin = Math.max(0, Math.floor(minScore - padding));
  const yMax = Math.min(10, Math.ceil(maxScore + padding));

  return (
    <div className="space-y-4">
      <ShotTypeSelector
        selected={selectedShotType}
        onChange={setSelectedShotType}
      />

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-grey-200)"
          />
          <XAxis
            dataKey="levelName"
            tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--color-grey-300)", strokeDasharray: "3 3" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-grey-900)"
            strokeWidth={2}
            dot={{ fill: "var(--color-grey-900)", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "var(--color-grey-900)" }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      <TrendIndicator trend={curveData.trend} degradation={curveData.averageDegradationPerLevel} />
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function ShotTypeSelector({
  selected,
  onChange,
}: {
  selected: ShotType;
  onChange: (type: ShotType) => void;
}) {
  const shotTypes: ShotType[] = ["DRIVER", "IRON", "WEDGE", "PUTT"];

  return (
    <div className="flex gap-2">
      {shotTypes.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            selected === type
              ? "bg-[var(--color-grey-900)] text-white"
              : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
          }`}
        >
          {SHOT_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
    value: number | null;
  }>;
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div
      className="bg-white border border-[var(--color-grey-200)] rounded-lg p-3 shadow-sm"
      style={{ fontSize: "12px" }}
    >
      <div className="font-medium text-[var(--color-grey-900)]">
        {data.levelName}
      </div>
      <div className="mt-1 text-[var(--color-grey-500)]">
        Score: {data.score !== null ? data.score.toFixed(1) : "Ingen data"}
      </div>
      <div className="text-[var(--color-grey-400)]">
        {data.dataPoints} datapunkt{data.dataPoints !== 1 ? "er" : ""}
      </div>
    </div>
  );
}

function TrendIndicator({
  trend,
  degradation,
}: {
  trend: DegradationCurveData["trend"];
  degradation: number | null;
}) {
  const getTrendInfo = () => {
    switch (trend) {
      case "stable":
        return {
          label: "Stabil",
          color: "text-[var(--color-success)]",
          description: "Teknikken holder seg godt under press",
        };
      case "degrading":
        return {
          label: "Degraderer",
          color: "text-[var(--color-warning)]",
          description: "Teknikken faller under press",
        };
      case "improving":
        return {
          label: "Forbedres",
          color: "text-[#007AFF]",
          description: "Uvanlig - presterer bedre under press",
        };
      case "insufficient_data":
        return {
          label: "Utilstrekkelig data",
          color: "text-[var(--color-grey-400)]",
          description: "Logg flere okter for a se trend",
        };
    }
  };

  const info = getTrendInfo();

  return (
    <div className="flex items-center justify-between text-xs">
      <div>
        <span className={`font-medium ${info.color}`}>{info.label}</span>
        <span className="text-[var(--color-grey-400)] ml-2">
          {info.description}
        </span>
      </div>
      {degradation !== null && (
        <div className="text-[var(--color-grey-500)]">
          Gjennomsnittlig fall: {Math.abs(degradation).toFixed(1)} poeng/nivå
        </div>
      )}
    </div>
  );
}
