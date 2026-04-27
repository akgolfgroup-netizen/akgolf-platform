import { Filter, LayoutList, Plus } from "lucide-react";
import { MissionCard } from "@/components/admin/mission-board/mission-card";
import { MissionSummaryRow } from "@/components/admin/mission-board/mission-summary";
import {
  MOCK_MISSIONS,
  MOCK_SUMMARY,
} from "@/components/admin/mission-board/mock-data";

export const metadata = { title: "Mission Board · CoachHQ" };

export default function MissionBoardPage() {
  // TODO: koble til ekte data — Mission/Goal-modeller med per-spiller fremdrift.
  const summary = MOCK_SUMMARY;
  const missions = MOCK_MISSIONS;

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-[#E6EAE8]">
      <div className="mb-[22px] flex items-end justify-between border-b border-[#1a4a3a] pb-[18px]">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            Mission Board · Per spiller / team
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-[-0.025em] text-white">
            Hva jobber vi mot, og hvor langt har vi kommet?
          </h1>
          <p className="mt-1.5 text-[13px] text-white/60">
            Hver spiller har 1–3 aktive oppdrag. Klikk for å se hele veien — fra
            første kartlegging til mål.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] text-white/80 transition hover:bg-white/[0.05]"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Alle oppdrag
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] text-white/80 transition hover:bg-white/[0.05]"
          >
            <LayoutList className="h-3.5 w-3.5" strokeWidth={1.8} />{" "}
            Tabell-visning
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#00422F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Nytt oppdrag
          </button>
        </div>
      </div>

      <MissionSummaryRow summary={summary} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}
