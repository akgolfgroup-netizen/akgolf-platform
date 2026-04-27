import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getTournamentsWithPlans } from "@/modules/tournament-planner";
import { getTourSchedule } from "@/lib/portal/datagolf/client";
import { TurneringerClientV2 } from "@/components/portal/turneringer/v2/turneringer-client-v2";

export const maxDuration = 30;

export default async function TurneringerPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  const [tournaments, pgaSchedule, euroSchedule] = await Promise.all([
    getTournamentsWithPlans(supabase, user.id),
    getTourSchedule("pga", undefined, true).catch(() => []),
    getTourSchedule("euro", undefined, true).catch(() => []),
  ]);

  return (
    <TurneringerClientV2
      tournaments={JSON.parse(JSON.stringify(tournaments))}
      pgaSchedule={JSON.parse(JSON.stringify(pgaSchedule))}
      euroSchedule={JSON.parse(JSON.stringify(euroSchedule))}
    />
  );
}
