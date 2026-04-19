import { requirePortalUser } from "@/lib/portal/auth";
import { getMyProfile } from "../actions";
import { SettingsClient } from "./settings-client";

export default async function InnstillingerPage() {
  await requirePortalUser();
  const profile = await getMyProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--color-surface-container-high)]">
          Kunne ikke laste profil.
        </p>
      </div>
    );
  }

  return (
    <SettingsClient
      profile={{
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        image: profile.image,
      }}
    />
  );
}
