import { requirePortalUser } from "@/lib/portal/auth";
import { Target } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mal | AK Golf",
};

export default async function MaalPage() {
  await requirePortalUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <Target className="w-12 h-12 mb-4" style={{ color: "#9C9990" }} strokeWidth={1.75} />
      <h2 className="text-lg font-semibold mb-2" style={{ color: "#0A1F18" }}>
        Mine mal
      </h2>
      <p className="text-sm max-w-md" style={{ color: "#5E5C57" }}>
        Sett og folg opp dine golfmal — handicap, Strokes Gained, treningsvolum og mer.
        Funksjonen kommer i Sprint 1.
      </p>
    </div>
  );
}
