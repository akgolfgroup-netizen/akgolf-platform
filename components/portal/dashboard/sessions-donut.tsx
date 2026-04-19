"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { colors } from "@/lib/design-tokens";
import { CircleDashed } from "lucide-react";
import { MonoLabel } from "@/components/portal/patterns";

interface SessionType {
  name: string;
  value: number;
  color: string;
}

const MOCK_DATA: SessionType[] = [
  { name: "Coaching", value: 8, color: colors.primary.main },
  { name: "Trening", value: 14, color: colors.data.sage },
  { name: "Runde", value: 6, color: colors.data.coral },
  { name: "TrackMan", value: 4, color: colors.data.blue },
];

interface SessionsDonutProps {
  data?: SessionType[];
}

export function SessionsDonut({ data = MOCK_DATA }: SessionsDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex h-full flex-col rounded-xl border border-grey-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">Økt-fordeling</MonoLabel>
        <CircleDashed className="h-4 w-4 text-grey-300" />
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: colors.primary.white,
                  border: `1px solid ${colors.grey[200]}`,
                  borderRadius: "12px",
                  fontSize: 12,
                }}
                itemStyle={{ color: colors.primary.dark }}
                formatter={(value) => [
                  `${Number(value)} økter`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-black">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-grey-400">
              Økter
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-grey-600">{item.name}</span>
              <span className="ml-auto text-sm font-semibold text-black">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
