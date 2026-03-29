import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const portalUser = await requirePortalUser();

  // Hent full brukerdata inkl. telefon og instruktor-data
  const user = await prisma.user.findUnique({
    where: { id: portalUser.id },
    select: {
      name: true,
      email: true,
      phone: true,
      Instructor: {
        select: { bio: true },
      },
    },
  });

  const settings = {
    profile: {
      name: user?.name || "",
      email: user?.email || portalUser.email,
      phone: user?.phone || "",
      bio: user?.Instructor?.bio || "",
    },
    notifications: {
      emailNewBooking: true,
      emailCancellation: true,
      emailReminder: true,
      pushEnabled: false,
    },
    integrations: {
      googleCalendar: false,
      outlook: false,
    },
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Innstillinger</h1>
        <p className="text-[var(--color-ink-40)] mt-1">
          Administrer profil, varsler og integrasjoner
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
