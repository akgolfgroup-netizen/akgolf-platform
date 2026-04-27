"use client";


import { Icon } from "@/components/ui/icon";
import { colors } from "@/lib/design-tokens";


interface AiInsightCardProps {
  summary?: string;
  metrics?: { label: string; value: string; highlight?: boolean }[];
}

export function AiInsightCard({
  summary = "Kort spill er ditt største potensial",
  metrics = [
    { label: "Kort Spill", value: "-2.1", highlight: true },
    { label: "Driving", value: "+1.4", highlight: false },
    { label: "Putting", value: "+0.8", highlight: false },
  ],
}: AiInsightCardProps) {
  return (
    <div
      className="flex h-full flex-col justify-between rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: colors.ai.light,
        borderColor: `${colors.ai.primary}20`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.ai.primary}15` }}
        >
          <Icon name="bolt" className="h-5 w-5" style={{ color: colors.ai.primary }} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: colors.ai.primary }}
          >
            <Icon name="auto_awesome" className="h-3 w-3" />
            Anbefalt
          </div>
          <p className="line-clamp-3 text-sm font-semibold" style={{ color: colors.primary.dark }}>
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="flex-1 rounded-lg px-2 py-2 text-center"
            style={{
              backgroundColor: m.highlight ? colors.ai.primary : "white",
              color: m.highlight ? "white" : colors.primary.dark,
              border: m.highlight ? "none" : `1px solid ${colors.ai.primary}15`,
            }}
          >
            <p
              className="text-[8px] font-bold uppercase opacity-70"
              style={{ color: m.highlight ? "white" : colors.ink[40] }}
            >
              {m.label}
            </p>
            <p className="text-sm font-bold">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
