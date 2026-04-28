import { requirePortalUser } from "@/lib/portal/auth";
import { getMyProfile } from "../actions";
import { SettingsPageClientV2 } from "@/components/portal/profil/v2/settings-page-client-v2";

interface ProfileQuery {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  subscriptionTier: string;
  UserGolfId?: { clubName: string | null } | null;
}

export default async function InnstillingerPage() {
  await requirePortalUser();
  const profile = (await getMyProfile()) as ProfileQuery | null;

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-[#5C6B62]">Kunne ikke laste profil.</p>
      </div>
    );
  }

  return (
    <SettingsPageClientV2
      profile={{
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        image: profile.image,
        clubName: profile.UserGolfId?.clubName ?? null,
        subscriptionTier: profile.subscriptionTier,
      }}
    />
  );
}
