import { Hammer, Plus } from "lucide-react";

export function NewAgentCard() {
  return (
    <article className="rounded-2xl border border-dashed border-[#1a4a3a] bg-[#0D2E23] px-7 py-[22px] opacity-65">
      <div className="mb-3.5 flex items-start gap-3.5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-white/60">
          <Plus className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div>
          <div className="text-[16px] font-bold tracking-[-0.015em] text-white/75">
            Ny agent
          </div>
          <div className="mt-1 text-[12.5px] leading-[1.5] text-white/65">
            Bygg din egen automatisering. Triggere: tid, hendelse, terskelverdier.
            Handlinger: SMS, email, task, faktura.
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-2 py-1.5 text-[11.5px] text-accent"
        >
          <Hammer className="h-3 w-3" strokeWidth={1.8} /> Bygg agent
        </button>
      </div>
    </article>
  );
}
