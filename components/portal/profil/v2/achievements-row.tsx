import { CircleDot, Flame, Lock, TrendingDown, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

interface Achievement {
  id: string;
  iconName: "trophy" | "trending-down" | "zap" | "circle-dot" | "flame" | "lock";
  value: string;
  label: string;
  locked?: boolean;
}

const ICON_MAP: Record<Achievement["iconName"], LucideIcon> = {
  trophy: Trophy,
  "trending-down": TrendingDown,
  zap: Zap,
  "circle-dot": CircleDot,
  flame: Flame,
  lock: Lock,
};

interface AchievementsRowProps {
  items: Achievement[];
  unlockedCount: number;
  totalCount: number;
}

export function AchievementsRow({ items, unlockedCount, totalCount }: AchievementsRowProps) {
  const remaining = Math.max(totalCount - unlockedCount, 0);
  return (
    <>
      <SectionHeading
        title="Prestasjoner"
        sub={`${unlockedCount} OPPLÅST · ${remaining} IGJEN`}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {items.map((a) => {
          const Icon = ICON_MAP[a.iconName];
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${
                a.locked
                  ? "border-[#1a4a3a] bg-white/[0.025] opacity-40"
                  : "border-[#D1F843]/20 bg-[#D1F843]/[0.06]"
              }`}
            >
              <div
                className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px] ${
                  a.locked ? "bg-white/5 text-white/40" : "bg-[#D1F843]/15 text-[#D1F843]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold leading-none tabular-nums tracking-[-0.02em] text-white">
                  {a.value}
                </div>
                <div className="mt-1 text-[11px] text-white/60">{a.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
