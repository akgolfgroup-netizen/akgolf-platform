import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CapacityOverview } from "./capacity-overview";
import { getCapacityData } from "./actions";
import { CapacityTabs } from "./capacity-tabs";

export default async function KapasitetPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const params = await searchParams;
  const activeTab = params.tab ?? "oversikt";

  const data = await getCapacityData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Coach HQ - Kapasitet
        </h1>
        <span className="text-xs text-[var(--color-grey-400)]">
          Uke {format(new Date(), "w", { locale: nb })} &middot; Oppdatert{" "}
          {format(new Date(), "HH:mm")}
        </span>
      </div>

      <CapacityTabs activeTab={activeTab} data={data} />
    </div>
  );
}
