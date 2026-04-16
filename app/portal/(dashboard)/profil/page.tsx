import { requirePortalUser } from "@/lib/portal/auth";
import { getMyProfile, getPlayerStats } from "./actions";
import { ProfilePageClient } from "@/components/portal/profil/profile-page-client";

export default async function ProfilPage() {
  await requirePortalUser();

  const [profile, stats] = await Promise.all([
    getMyProfile(),
    getPlayerStats(),
  ]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--color-portal-muted)]">
          Kunne ikke laste profil. Prøv å laste siden på nytt.
        </p>
      </div>
    );
  }

  return (
    <ProfilePageClient
      profile={{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        image: profile.image,
        role: profile.role,
        subscriptionTier: profile.subscriptionTier,
      }}
      stats={{
        currentHandicap: stats.currentHandicap,
        trainingSessions: stats.trainingSessions,
        coachingSessions: stats.coachingSessions,
        streak: stats.streak,
      }}
    />
  );
}
