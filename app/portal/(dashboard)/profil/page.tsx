import { getMyProfile, getPlayerStats, getHandicapHistory, getAchievements } from "./actions";
import { getGoals } from "./goal-actions";
import { ProfileCard } from "@/components/portal/profil/profile-card";
import { ProfileHero } from "@/components/portal/profil/profile-hero";
import { StatsGrid } from "@/components/portal/profil/stats-grid";
import { GoalList } from "@/components/portal/profil/goal-list";
import { AchievementGrid } from "@/components/portal/profil/achievement-grid";
import { FocusRecommendationCard } from "@/components/portal/profil/focus-recommendation-card";
import { HandicapChart } from "@/components/portal/analyse/handicap-chart";
import { redirect } from "next/navigation";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { Info } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

export default async function ProfilPage() {
  const user = await getMyProfile();
  if (!user) redirect("/login");

  const [stats, handicapHistory, goals, achievements] = await Promise.all([
    getPlayerStats(),
    getHandicapHistory(6),
    getGoals(),
    getAchievements(),
  ]);

  const canCreateGoals = hasTierAccess(user.subscriptionTier, SubscriptionTier.PRO);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Min profil</h1>

      <div className="max-w-3xl space-y-5">
        <ProfileHero
          name={user.name}
          image={user.image}
          role={user.role}
          subscriptionTier={user.subscriptionTier}
          currentHandicap={stats.currentHandicap}
        />

        <StatsGrid
          trainingSessions={stats.trainingSessions}
          coachingSessions={stats.coachingSessions}
          tournaments={stats.tournaments}
          streak={stats.streak}
        />

        <GoalList goals={goals} canCreate={canCreateGoals} />

        {/* Målsetting-info */}
        <details className="rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)] group">
          <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer list-none">
            <Info className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm font-medium text-[var(--color-snow)]">Slik setter du gode mål</span>
            <span className="ml-auto text-xs text-[var(--color-ink-40)] group-open:hidden">Vis mer</span>
            <span className="ml-auto text-xs text-[var(--color-ink-40)] hidden group-open:inline">Skjul</span>
          </summary>
          <div className="px-5 pb-5 space-y-4">
            <p className="text-sm text-[var(--color-ink-40)]">
              {PORTAL_CONTENT.profil.goalSetting.intro}
            </p>

            <div>
              <p className="text-xs font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-2">
                Eksempler på mål
              </p>
              <div className="space-y-2">
                {PORTAL_CONTENT.profil.goalSetting.examples.map((example) => (
                  <div key={example.type} className="flex items-start gap-3">
                    <span className="text-xs font-medium text-[var(--color-gold)] min-w-[70px]">
                      {example.type}
                    </span>
                    <span className="text-sm text-[var(--color-ink-40)]">
                      {example.example}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>

        {canCreateGoals && <FocusRecommendationCard />}

        {achievements.definitions.length > 0 && (
          <AchievementGrid
            definitions={achievements.definitions}
            unlocked={achievements.unlocked}
          />
        )}

        {handicapHistory.length > 0 && (
          <div className="rounded-2xl p-5 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
            <p className="text-[11px] font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-4">
              Handicap-utvikling (6 måneder)
            </p>
            <HandicapChart entries={handicapHistory} />
          </div>
        )}

        <ProfileCard user={user} />
      </div>
    </div>
  );
}
