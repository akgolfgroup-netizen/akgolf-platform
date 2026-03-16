"use client";

import { getSkillLevelByHandicap } from "@/lib/portal/golf/skill-levels";

export function SkillLevelBadge({ handicap }: { handicap: number | null }) {
  if (handicap === null) return null;

  const level = getSkillLevelByHandicap(Math.round(handicap));
  if (!level) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{
        background: `${level.color}20`,
        color: level.color,
        border: `1px solid ${level.color}40`,
      }}
    >
      <span className="text-[10px]">{level.code}</span>
      {level.labelNO}
    </span>
  );
}
