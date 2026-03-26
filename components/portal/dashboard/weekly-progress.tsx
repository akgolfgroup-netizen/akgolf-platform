"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WeekDay {
  dayLabel: string;
  trained: boolean;
  habitsCompleted: number;
  mood?: number;
  isToday: boolean;
}

interface WeeklyProgressProps {
  days: WeekDay[];
}

const moodEmoji: Record<number, string> = {
  5: "\ud83d\ude04",
  4: "\ud83d\ude42",
  3: "\ud83d\ude10",
  2: "\ud83d\ude14",
  1: "\ud83d\ude22",
};

export function WeeklyProgress({ days }: WeeklyProgressProps) {
  const data = days.map((d) => ({
    day: d.dayLabel,
    training: d.trained ? 1 : 0,
    habits: d.habitsCompleted,
    mood: d.mood,
    isToday: d.isToday,
  }));

  return (
    <div className="p-5 rounded-xl border border-[#E5E5E5] bg-white">
      <h3 className="text-sm font-semibold text-[#171717] mb-4">
        Ukens fremgang
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barGap={2}>
          <XAxis
            dataKey="day"
            tick={({ x, y, payload }) => {
              const entry = data.find((d) => d.day === payload.value);
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={12}
                    textAnchor="middle"
                    className="text-xs fill-[#737373]"
                  >
                    {payload.value}
                  </text>
                  <text
                    x={0}
                    y={12}
                    dy={12}
                    textAnchor="middle"
                    className="text-sm"
                  >
                    {entry?.mood ? moodEmoji[entry.mood] : ""}
                  </text>
                </g>
              );
            }}
            tickLine={false}
            axisLine={false}
            height={40}
          />
          <Bar
            dataKey="training"
            stackId="a"
            fill="var(--color-gold)"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, i) => (
              <Cell key={i} opacity={entry.isToday ? 1 : 0.7} />
            ))}
          </Bar>
          <Bar
            dataKey="habits"
            stackId="a"
            fill="var(--color-ink-80)"
            radius={[4, 4, 0, 0]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const entry = payload[0].payload;
              return (
                <div className="bg-white border border-[#E5E5E5] rounded-lg p-2 shadow-lg text-xs">
                  <p className="font-medium text-[#171717]">{entry.day}</p>
                  <p className="text-[#737373]">
                    Trening: {entry.training ? "Ja" : "Nei"}
                  </p>
                  <p className="text-[#737373]">
                    Vaner: {entry.habits}
                  </p>
                  {entry.mood && (
                    <p className="text-[#737373]">
                      Humr: {moodEmoji[entry.mood]}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
