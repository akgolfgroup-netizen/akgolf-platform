"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import type { TekSlagSpillGap as TekSlagSpillGapData } from "@/lib/portal/training/degradation-service";
import type { ShotType } from "@/lib/portal/training/l-phase-service";

// =============================================================================
// TYPES
// =============================================================================

interface TekSlagSpillGapProps {
  data: Record<ShotType, TekSlagSpillGapData>;
}

interface ChartDataPoint {
  level: string;
  score: number;
  gap: number | null;
  gapLabel: string;
  hasData: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  DRIVER: "Driver",
  IRON: "Jern",
  WEDGE: "Wedge",
  PUTT: "Putt",
};

const PYRAMID_LEVEL_LABELS: Record<string, string> = {
  TEK: "Teknikk",
  SLAG: "Slag",
  SPILL: "Spill",
  TURN: "Turnering",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function TekSlagSpillGap({ data }: TekSlagSpillGapProps) {
  const [selectedShotType, setSelectedShotType] = useState<ShotType>("DRIVER");

  const gapData = data[selectedShotType];

  // Transform data for stacked bar chart
  const chartData = useMemo(() => {
    const points: ChartDataPoint[] = [];

    // TEK level (base, no gap)
    if (gapData.tekScore !== null) {
      points.push({
        level: "TEK",
        score: gapData.tekScore,
        gap: null,
        gapLabel: "",
        hasData: true,
      });
    }

    // SLAG level (shows gap from TEK)
    if (gapData.slagScore !== null) {
      points.push({
        level: "SLAG",
        score: gapData.slagScore,
        gap: gapData.tekToSlagGap,
        gapLabel: gapData.tekToSlagGap !== null
          ? `${gapData.tekToSlagGap > 0 ? "+" : ""}${gapData.tekToSlagGap.toFixed(1)}`
          : "",
        hasData: true,
      });
    }

    // SPILL level (shows gap from SLAG)
    if (gapData.spillScore !== null) {
      points.push({
        level: "SPILL",
        score: gapData.spillScore,
        gap: gapData.slagToSpillGap,
        gapLabel: gapData.slagToSpillGap !== null
          ? `${gapData.slagToSpillGap > 0 ? "+" : ""}${gapData.slagToSpillGap.toFixed(1)}`
          : "",
        hasData: true,
      });
    }

    // TURN level (shows gap from SPILL)
    if (gapData.turnScore !== null) {
      points.push({
        level: "TURN",
        score: gapData.turnScore,
        gap: gapData.spillToTurnGap,
        gapLabel: gapData.spillToTurnGap !== null
          ? `${gapData.spillToTurnGap > 0 ? "+" : ""}${gapData.spillToTurnGap.toFixed(1)}`
          : "",
        hasData: true,
      });
    }

    return points;
  }, [gapData]);

  // Find the biggest gap for highlighting
  const biggestGap = useMemo(() => {
    const gaps = [
      { name: "TEK til SLAG", value: gapData.tekToSlagGap },
      { name: "SLAG til SPILL", value: gapData.slagToSpillGap },
      { name: "SPILL til TURN", value: gapData.spillToTurnGap },
    ].filter((g) => g.value !== null);

    if (gaps.length === 0) return null;

    // Find the most negative gap (biggest degradation)
    return gaps.reduce((max, curr) => {
      if (curr.value === null) return max;
      if (max.value === null) return curr;
      return curr.value < max.value ? curr : max;
    });
  }, [gapData]);

  // Generate focus recommendation
  const recommendation = useMemo(() => {
    if (gapData.totalDegradation === null) {
      return {
        type: "insufficient" as const,
        message: "Logg flere treningsokter for a fa en anbefaling",
        icon: AlertTriangle,
      };
    }

    if (gapData.totalDegradation > -1) {
      return {
        type: "good" as const,
        message: "Teknikken holder seg godt under press. Fortsett med konkurransetrening.",
        icon: CheckCircle,
      };
    }

    if (biggestGap && biggestGap.value !== null && biggestGap.value < -1) {
      const focusArea = biggestGap.name.split(" til ")[1];
      return {
        type: "focus" as const,
        message: `Storst fall ved ${focusArea}. Tren mer i ${focusArea.toLowerCase()}-miljo for a redusere gapet.`,
        icon: TrendingDown,
      };
    }

    return {
      type: "moderate" as const,
      message: "Moderat degradering. Fokuser pa a overfoere teknikk til hoeyere pressniva.",
      icon: TrendingDown,
    };
  }, [gapData, biggestGap]);

  // Check if we have enough data
  const hasData = chartData.length >= 2;

  if (!hasData) {
    return (
      <div className="space-y-4">
        <ShotTypeSelector
          selected={selectedShotType}
          onChange={setSelectedShotType}
        />
        <div className="flex items-center justify-center h-40 text-sm text-[var(--color-grey-500)]">
          Ikke nok treningsdata for {SHOT_TYPE_LABELS[selectedShotType]}. Logg
          flere okter pa ulike pressniva for a se gap-analyse.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ShotTypeSelector
        selected={selectedShotType}
        onChange={setSelectedShotType}
      />

      {/* Stats summary */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-2xl font-bold text-[var(--color-grey-900)]">
            {gapData.totalDegradation !== null
              ? `${gapData.totalDegradation > 0 ? "+" : ""}${gapData.totalDegradation.toFixed(1)}`
              : "-"}
          </p>
          <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wider">
            Total degradering
          </p>
        </div>
        {biggestGap && biggestGap.value !== null && (
          <div>
            <p className="text-2xl font-bold text-[var(--color-grey-900)]">
              {biggestGap.value.toFixed(1)}
            </p>
            <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wider">
              Storst gap ({biggestGap.name})
            </p>
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-[var(--color-grey-900)]">
            {gapData.dataPoints}
          </p>
          <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wider">
            Datapunkter
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-grey-200)"
            vertical={false}
          />
          <XAxis
            dataKey="level"
            tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => PYRAMID_LEVEL_LABELS[value] || value}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--color-grey-100)" }}
          />
          <ReferenceLine
            y={gapData.tekScore ?? 0}
            stroke="var(--color-grey-300)"
            strokeDasharray="3 3"
            label={{
              value: "TEK-niva",
              position: "right",
              fill: "var(--color-grey-400)",
              fontSize: 9,
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => {
              // Highlight bar if it has the biggest gap
              const isHighlighted =
                entry.gap !== null &&
                biggestGap !== null &&
                biggestGap.value !== null &&
                entry.gap === biggestGap.value &&
                entry.gap < -0.5;

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isHighlighted
                      ? "var(--color-warning)" // Warning orange for biggest gap
                      : "var(--color-grey-900)"
                  }
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Gap labels under chart */}
      <div className="flex justify-around text-xs px-4">
        {chartData.map((point, index) => (
          <div key={point.level} className="text-center">
            {index > 0 && point.gap !== null && (
              <span
                className={`font-medium ${
                  point.gap < -0.5
                    ? "text-[var(--color-warning)]"
                    : point.gap > 0.5
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-grey-500)]"
                }`}
              >
                {point.gapLabel}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div
        className={`flex items-start gap-3 p-3 rounded-lg ${
          recommendation.type === "good"
            ? "bg-[var(--color-success)]/10"
            : recommendation.type === "focus"
            ? "bg-[var(--color-warning)]/10"
            : "bg-[var(--color-grey-100)]"
        }`}
      >
        <recommendation.icon
          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
            recommendation.type === "good"
              ? "text-[var(--color-success)]"
              : recommendation.type === "focus"
              ? "text-[var(--color-warning)]"
              : "text-[var(--color-grey-400)]"
          }`}
        />
        <p className="text-xs text-[var(--color-grey-600)]">
          {recommendation.message}
        </p>
      </div>
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
    value: number;
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
        {PYRAMID_LEVEL_LABELS[data.level]}
      </div>
      <div className="mt-1 text-[var(--color-grey-500)]">
        Score: {data.score.toFixed(1)}
      </div>
      {data.gap !== null && (
        <div
          className={`mt-1 ${
            data.gap < -0.5
              ? "text-[var(--color-warning)]"
              : data.gap > 0.5
              ? "text-[var(--color-success)]"
              : "text-[var(--color-grey-400)]"
          }`}
        >
          Gap: {data.gapLabel}
        </div>
      )}
    </div>
  );
}
