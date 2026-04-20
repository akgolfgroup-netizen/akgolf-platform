import { requirePortalUser } from "@/lib/portal/auth";
import { MeldingerDemoClient } from "./meldinger-demo-client";
import { MonoLabel } from "@/components/portal/patterns";

export const metadata = {
  title: "Melding demo | AK Golf",
};

export default async function MeldingerDemoPage() {
  await requirePortalUser();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <MonoLabel size="xs" uppercase className="block text-outline">
          Demo
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Meldinger
        </h1>
        <p className="text-sm text-outline">
          Eksempel på en samtale mellom spiller og trener
        </p>
      </div>
      <MeldingerDemoClient />
    </div>
  );
}
