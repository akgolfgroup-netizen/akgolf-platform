import { requirePortalUser } from "@/lib/portal/auth";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mine dokumenter | AK Golf",
};

export default async function MegDokumenterPage() {
  await requirePortalUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <FileText className="w-12 h-12 mb-4" style={{ color: "#9C9990" }} strokeWidth={1.75} />
      <h2 className="text-lg font-semibold mb-2" style={{ color: "#0A1F18" }}>
        Mine dokumenter
      </h2>
      <p className="text-sm max-w-md" style={{ color: "#5E5C57" }}>
        Dine treningsrapporter, testresultater og coaching-notater samlet pa ett sted.
        Funksjonen kommer i Sprint 2.
      </p>
    </div>
  );
}
