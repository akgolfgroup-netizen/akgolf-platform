import { getMyProfile, getPlayerStats, getHandicapHistory, getAchievements } from "./actions";
import { getGoals } from "./goal-actions";
import { ProfileCard } from "@/components/portal/profil/profile-card";
import { ProfileHero } from "@/components/portal/profil/profile-hero";
import { StatsGrid } from "@/components/portal/profil/stats-grid";
import { GoalList } from "@/components/portal/profil/goal-list";
import { AchievementGrid } from "@/components/portal/profil/achievement-grid";
import { FocusRecommendationCard } from "@/components/portal/profil/focus-recommendation-card";
import { HandicapChart } from "@/components/portal/analyse/handicap-chart";
import { Topbar } from "@/components/portal/layout/topbar";
import { redirect } from "next/navigation";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";

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
    <div>
      <Topbar title="Min profil" />
      <div className="p-6 max-w-3xl space-y-5">
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

        {canCreateGoals && <FocusRecommendationCard />}

        {achievements.definitions.length > 0 && (
          <AchievementGrid
            definitions={achievements.definitions}
            unlocked={achievements.unlocked}
          />
        )}

        {handicapHistory.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(10,25,41,0.7)",
              border: "1px solid rgba(15,41,80,0.8)",
            }}
          >
            <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest mb-4">
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
