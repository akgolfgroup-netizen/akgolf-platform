import { Filter, Layers, Plus } from "lucide-react";
import { BoardColumn } from "@/components/admin/coaching-board/board-column";
import { MOCK_COLUMNS } from "@/components/admin/coaching-board/mock-data";

export const metadata = { title: "Coaching Board · CoachHQ" };

export default function CoachingBoardPage() {
  // TODO: koble til ekte data — CoachingSession + status (forberedelse / pågår / etterarbeid / ferdig)
  const columns = MOCK_COLUMNS;

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-[#E6EAE8]">
      <div className="mb-[22px] flex items-end justify-between border-b border-[#1a4a3a] pb-[18px]">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            Workflow · Drag og slipp
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold tracking-[-0.025em] text-white">
            Coaching Board
          </h1>
          <p className="mt-1.5 text-[13px] text-white/60">
            Hver økt går gjennom 4 faser. Dra kort mellom kolonner for å
            oppdatere status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] text-white/80 transition hover:bg-white/[0.05]"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Anders + Markus
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-[13px] text-white/80 transition hover:bg-white/[0.05]"
          >
            <Layers className="h-3.5 w-3.5" strokeWidth={1.8} /> Denne uken
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#00422F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny økt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <BoardColumn key={column.key} column={column} />
        ))}
      </div>
    </div>
  );
}
