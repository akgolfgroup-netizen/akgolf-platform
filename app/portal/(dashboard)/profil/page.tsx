import { requirePortalUser } from "@/lib/portal/auth";
import {
  getMyProfile,
  getPlayerStats,
  getHandicapHistory,
  getAchievements,
  getPlayerSGData,
} from "./actions";
import { getGoals } from "./goal-actions";
import { ProfileHero } from "@/components/portal/profil/profile-hero";
import { ProfileCard } from "@/components/portal/profil/profile-card";
import { StatsGrid } from "@/components/portal/profil/stats-grid";
import { GoalList } from "@/components/portal/profil/goal-list";
import { AchievementGrid } from "@/components/portal/profil/achievement-grid";
import { TourComparison } from "@/components/portal/profil/tour-comparison";
import { FocusRecommendationCard } from "@/components/portal/profil/focus-recommendation-card";
import { HandicapChart } from "@/components/portal/profil/handicap-chart";
import { SettingsLinks } from "@/components/portal/profil/settings-links";

export default async function ProfilPage() {
  const user = await requirePortalUser();

  const [profile, stats, handicapHistory, achievements, goals, sgData] =
    await Promise.all([
      getMyProfile(),
      getPlayerStats(),
      getHandicapHistory(12),
      getAchievements(),
      getGoals(),
      getPlayerSGData(),
    ]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--color-muted)]">
          Kunne ikke laste profil. Prøv å laste siden på nytt.
        </p>
      </div>
    );
  }

  const canCreateGoals = ["PRO", "ELITE", "BUSINESS"].includes(
    user.subscriptionTier
  );

  return (
    <div className="space-y-6">
      {/* Hero med avatar, navn, rolle, handicap */}
      <ProfileHero
        name={profile.name}
        image={profile.image}
        role={profile.role}
        subscriptionTier={profile.subscriptionTier}
        currentHandicap={stats.currentHandicap}
      />

      {/* Profilkort med redigering */}
      <ProfileCard
        user={{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          image: profile.image,
          role: profile.role,
          instructorProfile: profile.Instructor?.[0]
            ? {
                specialization: profile.Instructor[0].specialization,
                title: profile.Instructor[0].title,
                bio: profile.Instructor[0].bio,
              }
            : null,
        }}
      />

      {/* Statistikk-grid */}
      <StatsGrid
        trainingSessions={stats.trainingSessions}
        coachingSessions={stats.coachingSessions}
        tournaments={stats.tournaments}
        streak={stats.streak}
      />

      {/* To-kolonne: Handicap-utvikling + Mål */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HandicapChart entries={handicapHistory} />
        <GoalList goals={goals} canCreate={canCreateGoals} />
      </div>

      {/* Tour Comparison (kun hvis SG-data) */}
      {sgData && <TourComparison playerSG={sgData} />}

      {/* AI-anbefalt fokus */}
      <FocusRecommendationCard />

      {/* Prestasjoner */}
      <AchievementGrid
        definitions={achievements.definitions}
        unlocked={achievements.unlocked}
      />

      {/* Innstillinger-lenker */}
      <SettingsLinks />
    </div>
  );
}
