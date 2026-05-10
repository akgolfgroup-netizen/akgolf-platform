import { requirePortalUser } from "@/lib/portal/auth";
import { ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Oppfolgingsko | AK Golf CoachHQ",
};

export default async function OppfolgingPage() {
  await requirePortalUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <ClipboardCheck className="w-12 h-12 mb-4" style={{ color: "#9C9990" }} strokeWidth={1.75} />
      <h2 className="text-lg font-semibold mb-2" style={{ color: "#0A1F18" }}>
        Oppfolgingsko
      </h2>
      <p className="text-sm max-w-md" style={{ color: "#5E5C57" }}>
        SLA-varsler og oppfolgingsoppgaver for alle spillere vises her.
        Funksjonen kommer i Sprint 1.
      </p>
    </div>
  );
}
