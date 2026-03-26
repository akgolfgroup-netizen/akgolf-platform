import { requirePortalUser } from "@/lib/portal/auth";
import { Topbar } from "@/components/portal/layout/topbar";
import { Package } from "lucide-react";

export default async function ApperPage() {
  await requirePortalUser();

  return (
    <div>
      <Topbar title="Apper" />
      <div className="p-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-[#EBE5DA]">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-[#B8975C]/15">
            <Package className="w-10 h-10 text-[#B8975C]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F2950] mb-2">Kommer snart</h3>
          <p className="text-[#64748B] max-w-md">
            Apper og moduler er under utvikling. Kontakt din coach for mer informasjon.
          </p>
        </div>
      </div>
    </div>
  );
}
