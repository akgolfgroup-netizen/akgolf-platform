import { requirePortalUser } from "@/lib/portal/auth";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Coaching-historikk | AK Golf",
};

export default async function CoachHistorikkPage() {
  await requirePortalUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <History className="w-12 h-12 mb-4" style={{ color: "#9C9990" }} strokeWidth={1.75} />
      <h2 className="text-lg font-semibold mb-2" style={{ color: "#0A1F18" }}>
        Coaching-historikk
      </h2>
      <p className="text-sm max-w-md" style={{ color: "#5E5C57" }}>
        Full oversikt over alle coaching-okter, notater og fremgang over tid.
        Funksjonen kommer i Sprint 2.
      </p>
    </div>
  );
}
