import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getAllConsents } from "@/lib/portal/consent/service";
import { PrivacyClient } from "./privacy-client";

export const metadata: Metadata = {
  title: "Personvern | PlayersHQ",
  description: "Administrer samtykker, se dataaksesslogger og last ned dine data.",
};

export const dynamic = "force-dynamic";

export default async function PersonvernPage() {
  const user = await requirePortalUser();
  const consents = await getAllConsents(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Personvern og samtykker
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Du bestemmer hvordan dataene dine brukes. Tier 1 er nødvendig for tjenesten.
        </p>
      </header>

      <PrivacyClient
        userId={user.id}
        initialConsents={consents}
      />
    </div>
  );
}
