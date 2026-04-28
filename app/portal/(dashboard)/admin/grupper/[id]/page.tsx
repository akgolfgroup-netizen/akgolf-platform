import { GroupDetailHeader } from "@/components/admin/grupper/group-detail-header";
import { GroupDetailHero } from "@/components/admin/grupper/group-detail-hero";
import {
  RosterCard,
  ScheduleCard,
  ProgressCard,
  NotesCard,
} from "@/components/admin/grupper/group-detail-cards";
import { GROUP_DETAIL_FALLBACK } from "@/components/admin/grupper/detail-mock-data";

// TODO: koble til ekte data
// - prisma.coachingGroup.findUnique({ where: { id: params.id }, include: ... })
// - notes hentes fra CoachingNote-relasjon, filtrert pa coachId
// - schedule fra Booking pa neste 4 uker for denne gruppen
// - progress aggregeres fra Trackman / round-data ved kohortstart vs siste uke

export default async function GruppeDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fallback-data — bytt med Prisma-oppslag på id
  const detail = { ...GROUP_DETAIL_FALLBACK, id };

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <GroupDetailHeader
        eyebrow="/ Grupper · Detalj"
        title={detail.name}
        subtitle={detail.pageSubtitle}
      />

      <GroupDetailHero detail={detail} />

      <div className="grid grid-cols-[1.5fr_1fr] gap-[18px]">
        <div>
          <RosterCard members={detail.roster} total={detail.roster.length} />
        </div>
        <aside>
          <ScheduleCard rows={detail.schedule} />
          <ProgressCard rows={detail.progress} />
          <NotesCard
            notes={detail.notes}
            total={12}
            authorLabel="Erik sine notater"
          />
        </aside>
      </div>
    </div>
  );
}
