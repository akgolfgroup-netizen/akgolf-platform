"use client";


import { Icon } from "@/components/ui/icon";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { colors } from "@/lib/design-tokens";

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
    <div className="flex h-full flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Økt-fordeling</MonoLabel>
        <Icon name="circle"Dashed className="h-4 w-4 text-on-surface-variant/60" />
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
            <span className="text-2xl font-semibold text-on-surface">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
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
              <span className="text-sm text-on-surface-variant/80">{item.name}</span>
              <span className="ml-auto text-sm font-semibold text-on-surface">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
