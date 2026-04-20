"use client";

/**
 * PlayerLevelHero — følger portal-profil wireframe Option 1 Dashboard.
 * Profile-header med avatar, navn, kategori-badge, meta + 3 stats-col til høyre.
 */

import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import { MonoLabel } from "@/components/portal/patterns";
import type { PlayerProfile } from "@/lib/portal/kartlegging";

interface PlayerLevelHeroProps {
  profile: PlayerProfile;
}

function getInitials(name: string | null): string {
  if (!name) return "EL";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PlayerLevelHero({ profile }: PlayerLevelHeroProps) {
  const level = getSkillLevelByCode(profile.category);
  const pct = profile.progressToNextPct ?? 0;

  return (
    <section className="rounded-xl bg-surface-container-lowest shadow-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Avatar */}
        <div
          className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl text-2xl font-bold text-surface shrink-0"
          style={{ background: level?.color ?? "#005840" }}
        >
          {getInitials(profile.userName)}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              {profile.userName ?? "Din profil"}
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-primary uppercase">
              Kategori {profile.category}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-on-surface-variant/80">
            <span>{level?.labelNO ?? profile.categoryLabel}</span>
            <span>·</span>
            <span>{profile.tournamentContext}</span>
          </div>

          {/* Progress to next */}
          {profile.nextCategory && (
            <div className="mt-4 max-w-md">
              <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <MonoLabel size="xs" className="mt-1.5 text-on-surface-variant/80 block">
                {pct}% til {profile.nextCategory}
              </MonoLabel>
            </div>
          )}
        </div>

        {/* Stats column */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 md:pl-8 md:border-l md:border-outline-variant/20">
          <Stat label="Snittscore" value={profile.averageScore?.toString() ?? "—"} sub="siste 10" />
          <Stat
            label="HCP"
            value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
            sub="indeks"
          />
          <Stat
            label="USI"
            value={profile.totalUsi.toFixed(2)}
            sub={`${profile.totalSg >= 0 ? "+" : ""}${profile.totalSg.toFixed(2)} SG`}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
        {label}
      </MonoLabel>
      <div className="mt-1 text-2xl font-bold text-on-surface tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-[11px] text-on-surface-variant mt-0.5">{sub}</div>
    </div>
  );
}
