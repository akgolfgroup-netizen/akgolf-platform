"use client";

import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import type { PlayerProfile } from "@/lib/portal/kartlegging";

interface PlayerLevelHeroProps {
  profile: PlayerProfile;
}

export function PlayerLevelHero({ profile }: PlayerLevelHeroProps) {
  const level = getSkillLevelByCode(profile.category);
  const pct = profile.progressToNextPct ?? 0;

  return (
    <div className="bg-portal-card rounded-[2rem] p-8 text-center shadow-portal-card transition-shadow duration-300 hover:shadow-portal-card-hover">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        Din kategori
      </span>

      <div
        className="mt-2 font-extrabold tabular-nums"
        style={{
          fontSize: "var(--text-stat-xl, 56px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: level?.color ?? "var(--color-primary)",
        }}
      >
        {profile.category}
      </div>

      <p className="mt-1">
        <span
          className="font-bold text-portal-text tabular-nums"
          style={{ fontSize: "var(--text-stat-md, 32px)" }}
        >
          {profile.averageScore !== null
            ? `Snittscore ${profile.averageScore}`
            : "Snittscore —"}
        </span>
      </p>

      {profile.handicap !== null && (
        <p className="mt-0.5 text-sm text-portal-muted tabular-nums">
          HCP {profile.handicap.toFixed(1)}
        </p>
      )}

      {profile.nextCategory && (
        <div className="mt-6 mx-auto max-w-sm">
          <div className="h-2 rounded-full bg-portal-hover overflow-hidden">
            <div
              className="h-full rounded-full bg-primary shadow-portal-glow-green transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-portal-secondary tabular-nums">
            {pct}% til {profile.nextCategory}
          </p>
        </div>
      )}

      <p className="mt-3 text-sm text-portal-muted">
        {profile.categoryLabel} · {profile.tournamentContext}
      </p>
    </div>
  );
}
