import { Hero360Full } from "@/components/admin/spillerprofil/hero-360";
import {
  MOCK_ACTIVITY,
  MOCK_COACH_NOTES,
  MOCK_EQUIPMENT,
  MOCK_GOALS,
  MOCK_HERO,
  MOCK_KPIS,
  MOCK_KPIS_SUMMARY,
  MOCK_MOOD_DAYS,
  MOCK_MOOD_LOGS,
  MOCK_PAYMENTS,
  MOCK_PRE_ROUND,
  MOCK_SG,
  MOCK_SIGNALS,
  MOCK_UPCOMING,
} from "@/components/admin/spillerprofil/mock-data";
import { TabsClient } from "./tabs-client";

// TODO: erstatt mock med Prisma-oppslag.
// const player = await prisma.user.findFirst({
//   where: { OR: [{ supabaseId: id }, { id }] },
//   include: {
//     UserGolfId: true,
//     UnifiedSkillIndex: true,
//     PlayerGoals: true,
//     CoachingSession: { take: 6, orderBy: { date: "desc" } },
//     Round: { take: 6, orderBy: { date: "desc" } },
//     PlayerBag: true,
//   },
// });
// — bygg deretter PlayerHero + KpiBlock[] + SgRow[] etc. fra dette.

export default async function SpillerprofilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // For nå: mock — id brukes for å vise riktig spillernavn senere.
  void id;

  const data = {
    hero: MOCK_HERO,
    kpis: MOCK_KPIS,
    summaryKpis: MOCK_KPIS_SUMMARY,
    sg: MOCK_SG,
    totalSg: MOCK_SG.reduce((a, r) => a + r.value, 0),
    goals: MOCK_GOALS,
    activity: MOCK_ACTIVITY,
    coachNotes: MOCK_COACH_NOTES,
    moodDays: MOCK_MOOD_DAYS,
    moodLogs: MOCK_MOOD_LOGS,
    preRound: MOCK_PRE_ROUND,
    equipment: MOCK_EQUIPMENT,
    payments: MOCK_PAYMENTS,
    signals: MOCK_SIGNALS,
    upcoming: MOCK_UPCOMING,
  };

  return (
    <div
      className="min-h-full px-7 pb-12 pt-6 text-white"
      style={{ background: "#0A1F18" }}
    >
      <Hero360Full hero={data.hero} />
      <TabsClient data={data} />
    </div>
  );
}
