"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { M_ENVIRONMENTS } from "@/lib/portal/golf/ak-formula";
import type { EnvironmentDistribution as EnvironmentDistributionData } from "@/lib/portal/training/degradation-service";

// =============================================================================
// TYPES
// =============================================================================

interface EnvironmentDistributionProps {
  data: EnvironmentDistributionData[];
  playerCategory?: string; // A-K spillerkategori
}

interface ChartDataPoint {
  name: string;
  value: number;
  environment: number;
  count: number;
  averageScore: number | null;
}

interface BalanceWarning {
  type: "too_low" | "too_high";
  message: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Grayscale colors for pie chart (M0 = lightest, M5 = darkest)
const ENVIRONMENT_COLORS = [
  "var(--color-grey-200)", // M0 - Isolert
  "var(--color-grey-300)", // M1 - Kontrollert
  "var(--color-grey-400)", // M2 - Semi-kontrollert
  "var(--color-grey-500)", // M3 - Bane-lignende
  "var(--color-grey-700)", // M4 - Bane
  "var(--color-grey-900)", // M5 - Konkurranse
];

// Recommended distribution ranges based on player level
// Elite players (A-C): More high-pressure training
// Amateur players (D-K): More controlled environment training
function getRecommendedRanges(category?: string): Record<number, { min: number; max: number }> {
  const isElite = category && ["A", "B", "C"].includes(category);

  if (isElite) {
    return {
      0: { min: 5, max: 15 },   // M0: Minimal isolert trening
      1: { min: 10, max: 25 },  // M1: Range
      2: { min: 15, max: 25 },  // M2: Semi-kontrollert
      3: { min: 15, max: 25 },  // M3: Bane-lignende
      4: { min: 20, max: 35 },  // M4: Bane
      5: { min: 10, max: 20 },  // M5: Konkurranse
    };
  }

  // Amateur recommendations
  return {
    0: { min: 10, max: 25 },  // M0: Mer isolert trening OK
    1: { min: 20, max: 35 },  // M1: Range er viktig
    2: { min: 15, max: 25 },  // M2: Semi-kontrollert
    3: { min: 10, max: 20 },  // M3: Bane-lignende
    4: { min: 10, max: 25 },  // M4: Bane
    5: { min: 0, max: 10 },   // M5: Mindre konkurranse
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EnvironmentDistribution({
  data,
  playerCategory,
}: EnvironmentDistributionProps) {
  // Transform data for chart (only include environments with data)
  const chartData: ChartDataPoint[] = useMemo(() => {
    return data
      .filter((d) => d.count > 0)
      .map((d) => ({
        name: d.name,
        value: Math.round(d.percentage * 10) / 10,
        environment: d.environment,
        count: d.count,
        averageScore: d.averageScore,
      }));
  }, [data]);

  // Calculate balance warnings
  const warnings = useMemo(() => {
    const result: BalanceWarning[] = [];
    const ranges = getRecommendedRanges(playerCategory);

    // Check for M0-M1 overtraining
    const lowEnvPercent = data
      .filter((d) => d.environment <= 1)
      .reduce((sum, d) => sum + d.percentage, 0);

    if (lowEnvPercent > 60) {
      result.push({
        type: "too_low",
        message: `${Math.round(lowEnvPercent)}% i M0-M1 — du bor teste pa bane mer!`,
      });
    }

    // Check for missing high-pressure training
    const highEnvPercent = data
      .filter((d) => d.environment >= 4)
      .reduce((sum, d) => sum + d.percentage, 0);

    const recommendedHighMin = ranges[4].min + ranges[5].min;
    if (highEnvPercent < recommendedHighMin && data.some((d) => d.count > 0)) {
      result.push({
        type: "too_high",
        message: `Kun ${Math.round(highEnvPercent)}% pa bane/konkurranse — anbefalt min ${recommendedHighMin}%`,
      });
    }

    // Check for no competition training (M5)
    const competitionData = data.find((d) => d.environment === 5);
    if (
      competitionData &&
      competitionData.count === 0 &&
      data.some((d) => d.count > 0)
    ) {
      result.push({
        type: "too_low",
        message: "Ingen konkurransetrening — legg inn M5-okter for a teste under press",
      });
    }

    return result;
  }, [data, playerCategory]);

  // Check if we have any data
  const hasData = chartData.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--color-grey-500)]">
        Ingen treningsdata. Logg okter med miljokategorisering for a se fordeling.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.environment}`}
                fill={ENVIRONMENT_COLORS[entry.environment]}
                stroke="var(--color-white)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend data={data} />}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Balance Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-3 rounded-lg bg-[#FF9500]/10 border border-[#FF9500]/20"
            >
              <AlertTriangle className="w-4 h-4 text-[#FF9500] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--color-grey-700)]">
                {warning.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Environment Legend with details */}
      <EnvironmentBreakdown data={data} />
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const envInfo = M_ENVIRONMENTS[data.environment as keyof typeof M_ENVIRONMENTS];

  return (
    <div
      className="bg-white border border-[var(--color-grey-200)] rounded-lg p-3 shadow-sm"
      style={{ fontSize: "12px" }}
    >
      <div className="font-medium text-[var(--color-grey-900)]">
        M{data.environment}: {data.name}
      </div>
      <div className="text-[var(--color-grey-500)] mt-1">
        {envInfo.description}
      </div>
      <div className="mt-2 space-y-1">
        <div className="text-[var(--color-grey-700)]">
          {data.count} okter ({data.value}%)
        </div>
        {data.averageScore !== null && (
          <div className="text-[var(--color-grey-500)]">
            Snitt score: {data.averageScore.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomLegend({ data }: { data: EnvironmentDistributionData[] }) {
  const activeEnvs = data.filter((d) => d.count > 0);

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {activeEnvs.map((env) => (
        <div key={env.environment} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: ENVIRONMENT_COLORS[env.environment] }}
          />
          <span className="text-[10px] text-[var(--color-grey-500)]">
            M{env.environment}
          </span>
        </div>
      ))}
    </div>
  );
}

function EnvironmentBreakdown({
  data,
}: {
  data: EnvironmentDistributionData[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {data.map((env) => (
        <div
          key={env.environment}
          className={`p-2 rounded-lg border transition-colors ${
            env.count > 0
              ? "border-[var(--color-grey-200)] bg-white"
              : "border-[var(--color-grey-100)] bg-[var(--color-grey-50)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  env.count > 0
                    ? ENVIRONMENT_COLORS[env.environment]
                    : "var(--color-grey-200)",
              }}
            />
            <span className="text-[10px] font-medium text-[var(--color-grey-700)] truncate">
              M{env.environment}: {env.name}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-lg font-bold ${
                env.count > 0
                  ? "text-[var(--color-grey-900)]"
                  : "text-[var(--color-grey-300)]"
              }`}
            >
              {Math.round(env.percentage)}%
            </span>
            <span className="text-[9px] text-[var(--color-grey-400)]">
              ({env.count})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
