import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";
import { CapacityOverview } from "./capacity-overview";
import { getCapacityData } from "./actions";

export default async function KapasitetPage() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const data = await getCapacityData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">
          Kapasitet & Inntekt
        </h1>
        <span className="text-xs text-[var(--color-ink-40)]">
          Uke {format(new Date(), "w", { locale: nb })} &middot; Oppdatert {format(new Date(), "HH:mm")}
        </span>
      </div>

      <CapacityOverview data={data} />
    </div>
  );
}
