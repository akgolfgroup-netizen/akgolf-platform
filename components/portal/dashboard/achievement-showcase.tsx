import Link from "next/link";
import {
  Award,
  Crown,
  Flame,
  Lock,
  Medal,
  Star,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlockedAt?: string;
  progress?: number;
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
  totalAchievements: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Flame,
  Target,
  Star,
  Zap,
  Award,
  Crown,
  Medal,
};

const RARITY_COLORS: Record<Rarity, string> = {
  common: "var(--color-muted)",
  rare: "var(--color-primary)",
  epic: "var(--color-ai)",
  legendary: "var(--color-warning)",
};

export function AchievementShowcase({
  achievements,
  totalAchievements,
}: AchievementShowcaseProps) {
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const top = achievements.slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-warning)]/10">
            <Trophy
              className="h-5 w-5 text-[var(--color-warning)]"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              Achievements
            </h3>
            <p className="text-[11px] text-[var(--color-muted)]">
              {unlockedCount} av {totalAchievements} opplåst
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {top.map((achievement) => {
          const Icon = ICON_MAP[achievement.icon] ?? Trophy;
          const isUnlocked = Boolean(achievement.unlockedAt);
          const color = isUnlocked
            ? RARITY_COLORS[achievement.rarity]
            : "var(--color-muted)";
          const progress = achievement.progress ?? 0;

          return (
            <div
              key={achievement.id}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3 text-center",
                isUnlocked
                  ? "border-[var(--color-grey-200)] bg-[var(--color-surface)]"
                  : "border-dashed border-[var(--color-grey-200)] bg-white opacity-80",
              )}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                }}
              >
                {isUnlocked ? (
                  <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.75} />
                ) : (
                  <Lock className="h-4 w-4 text-[var(--color-muted)]" />
                )}
              </div>
              <p
                className={cn(
                  "text-[11px] font-semibold leading-tight",
                  isUnlocked
                    ? "text-[var(--color-grey-900)]"
                    : "text-[var(--color-muted)]",
                )}
              >
                {achievement.name}
              </p>
              {!isUnlocked && progress > 0 && (
                <div className="w-full">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-grey-200)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-medium text-[var(--color-muted)] tabular-nums">
                    {progress}%
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link
        href="/portal/achievements"
        className="mt-auto inline-flex items-center justify-center pt-5 text-[12px] font-semibold text-[var(--color-primary)] hover:underline"
      >
        Se alle ({unlockedCount}/{totalAchievements})
      </Link>
    </div>
  );
}
