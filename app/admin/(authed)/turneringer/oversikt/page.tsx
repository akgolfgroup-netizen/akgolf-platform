import { redirect } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { getCoachTournamentOverview } from "./actions";
import { OversiktClient } from "./oversikt-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ year?: string; level?: string; month?: string }>;
}

export default async function TournamentOverviewPage({ searchParams }: PageProps) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const params = await searchParams;
  const year = params.year ? parseInt(params.year, 10) : new Date().getFullYear();
  const level = params.level && params.level !== "all" ? params.level : undefined;
  const month = params.month ? parseInt(params.month, 10) : undefined;

  const data = await getCoachTournamentOverview(year, { level, month });

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-ink-muted">Ingen tilgang.</p>
      </div>
    );
  }

  return <OversiktClient initialData={data} year={year} levelFilter={level} monthFilter={month} />;
}
