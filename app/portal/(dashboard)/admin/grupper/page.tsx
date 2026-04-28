import { GrupperPageHeader } from "@/components/admin/grupper/grupper-page-header";
import { GroupsKpiRow } from "@/components/admin/grupper/groups-kpi-row";
import { GroupCard } from "@/components/admin/grupper/group-card";
import { GROUPS_KPIS, GROUPS_LIST } from "@/components/admin/grupper/mock-data";

// TODO: koble til ekte data
// - prisma.coachingGroup.findMany med roster + nextSession
// - aggregat for KPI-rad: aktive grupper, roster total, økter per uke, belegg snitt
// - filter-knapp åpner dialog med nivå/lokasjon/dag

export default function GrupperPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <GrupperPageHeader
        eyebrow="/ Mennesker · Grupper"
        title="Treningsgrupper og kohorter."
        subtitle="8 aktive grupper fordelt på Bogstad og Skullerud. Kohorter løper i 12-ukers sykluser fra mai. Filtrer på nivå, lokasjon og dag."
      />

      <GroupsKpiRow kpis={GROUPS_KPIS} />

      <div className="grid grid-cols-3 gap-3.5">
        {GROUPS_LIST.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
