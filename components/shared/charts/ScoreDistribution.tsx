"use client";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ScoreDistributionProps {
  scores: number[];
  par?: number;
  highlightScore?: number;
  className?: string;
}

interface BinData {
  label: string;
  count: number;
  highlighted: boolean;
}

const NORMAL_COLOR = "#E5E3DD";
const HIGHLIGHT_COLOR = "#D1F843";

function binScores(
  scores: number[],
  par: number,
  highlightScore?: number
): BinData[] {
  const bins: { label: string; range: [number, number] }[] = [
    { label: "Under par", range: [-Infinity, par - 1] },
    { label: "Par", range: [par, par] },
    { label: "+1-3", range: [par + 1, par + 3] },
    { label: "+4-6", range: [par + 4, par + 6] },
    { label: "+7-10", range: [par + 7, par + 10] },
    { label: "+11+", range: [par + 11, Infinity] },
  ];

  return bins.map((bin) => {
    const count = scores.filter(
      (s) => s >= bin.range[0] && s <= bin.range[1]
    ).length;

    const highlighted =
      highlightScore !== undefined &&
      highlightScore >= bin.range[0] &&
      highlightScore <= bin.range[1];

    return { label: bin.label, count, highlighted };
  });
}

export function ScoreDistribution({
  scores,
  par = 72,
  highlightScore,
  className,
}: ScoreDistributionProps) {
  const data = binScores(scores, par, highlightScore);

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 16, right: 8, left: 8, bottom: 8 }}
        >
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12,
              fill: "#5E5C57",
            }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily:
                "var(--font-jetbrains-mono), JetBrains Mono, monospace",
              fontSize: 12,
              fill: "#9C9990",
            }}
            width={28}
          />
          <Bar dataKey="count" barSize={32} radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.highlighted ? HIGHLIGHT_COLOR : NORMAL_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
