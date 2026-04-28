import { History, Plus } from "lucide-react";
import { AgentCard } from "@/components/admin/agenter/agent-card";
import { NewAgentCard } from "@/components/admin/agenter/new-agent-card";
import { MOCK_AGENTS } from "@/components/admin/agenter/mock-data";

// TODO: koble til ekte data
// - agents: prisma.agent.findMany med trigger-config
// - kjøringer siste 7d: aggregat fra agentRun
// - logs: prisma.agentRun.findMany ordered by createdAt

export default function AgenterPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
            / AUTOMATISERING · AGENTER
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Boter som jobber for deg.
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-[13px] text-white/60">
            Små bakgrunns-agenter som tar repetitive oppgaver — purringer,
            oppfølgings-meldinger, no-show flagging, sesongtransisjoner. Kjører
            på regler du setter; varsler deg når noe trenger blikk.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 hover:border-white/20 hover:bg-white/10"
          >
            <History className="h-3.5 w-3.5" strokeWidth={1.8} /> Logg
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-ink hover:bg-accent/90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} /> Ny agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
        <NewAgentCard />
      </div>
    </div>
  );
}
