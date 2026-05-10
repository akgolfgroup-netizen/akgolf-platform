import { requirePortalUser } from "@/lib/portal/auth";
import { Play } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Live Session | AK Golf",
};

export default async function LiveSessionPage() {
  await requirePortalUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <Play className="w-12 h-12 mb-4" style={{ color: "#9C9990" }} strokeWidth={1.75} />
      <h2 className="text-lg font-semibold mb-2" style={{ color: "#0A1F18" }}>
        Live Session
      </h2>
      <p className="text-sm max-w-md" style={{ color: "#5E5C57" }}>
        Start en treningsokt og logg reps, serier og klubber i sanntid.
        Funksjonen kommer i Sprint 1.
      </p>
    </div>
  );
}
