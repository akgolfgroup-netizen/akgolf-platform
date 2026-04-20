"use client";


import { Icon } from "@/components/ui/icon";
import { colors } from "@/lib/design-tokens";


interface TrainingActivityCardProps {
  sessionsCount: number;
  streak?: number;
}

const mockBars = [
  { lime: 30, orange: 15, mint: 15 },
  { lime: 40, orange: 25, mint: 20 },
  { lime: 20, orange: 10, mint: 10 },
  { lime: 50, orange: 30, mint: 15 },
  { lime: 45, orange: 20, mint: 15 },
];

export function TrainingActivityCard({
  sessionsCount,
  streak = 12,
}: TrainingActivityCardProps) {
  return (
    <div
      className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm"
      style={{
        background: `linear-gradient(135deg, #E1F0E8 0%, #D4E8DC 100%)`,
      }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: colors.primary.dark }}>
          Treningsaktivitet
        </h2>
        <div
          className="mb-4 mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold"
          style={{ backgroundColor: colors.primary.accent, color: colors.primary.dark }}
        >
          <Icon name="local_fire_department" className="h-3.5 w-3.5" />
          Du er på en streak! {streak} dager
        </div>
      </div>

      {/* Stacked bars */}
      <div className="flex flex-1 items-end gap-2.5">
        {mockBars.map((bar, i) => (
          <div key={i} className="flex h-full flex-1 flex-col-reverse gap-[2px]">
            <div
              className="w-full rounded-sm"
              style={{ height: `${bar.lime}%`, backgroundColor: colors.primary.accent }}
            />
            <div
              className="w-full rounded-sm"
              style={{ height: `${bar.orange}%`, backgroundColor: colors.data.coral }}
            />
            <div
              className="w-full rounded-sm"
              style={{ height: `${bar.mint}%`, backgroundColor: "rgba(255,255,255,0.6)" }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-black/5 pt-3">
        <p className="text-2xl font-bold" style={{ color: colors.primary.dark }}>
          {sessionsCount}
        </p>
        <p className="text-xs font-medium text-on-surface-variant/80">treningsøkter denne måneden</p>
      </div>
    </div>
  );
}
