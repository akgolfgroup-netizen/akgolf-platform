import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { StatsCard } from "@/components/coach/dashboard/StatsCard";
import {
  RecentMessages,
  type Message,
} from "@/components/coach/dashboard/RecentMessages";
import { Inbox, CheckCircle, Clock, Users } from "lucide-react";

export default async function CoachDashboardPage() {
  const user = await requirePortalUser();

  // Hent statistikk
  // TODO: Erstatt med UnifiedMessage queries når modellen er opprettet
  const playerCount = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  // Placeholder-verdier til UnifiedMessage er implementert
  const pendingCount = 0;
  const todayCount = 0;
  const avgResponseTime = 0;

  // Placeholder for meldinger til UnifiedMessage er implementert
  const recentMessages: Message[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          God morgen, {user.name?.split(" ")[0] || "Coach"}
        </h1>
        <p className="text-[var(--color-grey-400)] mt-1">Her er oversikten din for i dag</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ventende meldinger"
          value={pendingCount}
          icon={<Inbox className="h-5 w-5 text-[var(--color-black)]" />}
        />
        <StatsCard
          title="Meldinger i dag"
          value={todayCount}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        <StatsCard
          title="Avg. responstid"
          value={avgResponseTime > 0 ? `${avgResponseTime} min` : "-"}
          subtitle="Mal: < 60 min"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Aktive spillere"
          value={playerCount}
          icon={<Users className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages messages={recentMessages} />
      </div>
    </div>
  );
}
