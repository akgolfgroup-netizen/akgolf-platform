"use client";

import { useTransition } from "react";
import {
  Bot,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  toggleAgent,
  type AgentData,
  type AgentStats,
} from "./actions";
import type { AgentTeam } from "@prisma/client";

const TEAM_LABELS: Record<AgentTeam, string> = {
  LEADERSHIP: "Ledergruppen",
  DEV: "Utviklingsteam",
  OPS: "Drift og operasjon",
  COACHING: "Coaching",
  CONTENT: "Innhold og merkevare",
};

const TEAM_ORDER: AgentTeam[] = [
  "LEADERSHIP",
  "COACHING",
  "CONTENT",
  "DEV",
  "OPS",
];

interface AgenterClientProps {
  agents: AgentData[];
  stats: AgentStats;
}

export function AgenterClient({ agents, stats }: AgenterClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (agentId: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleAgent(agentId, !currentState);
    });
  };

  // Group agents by team
  const agentsByTeam = new Map<AgentTeam, AgentData[]>();
  for (const agent of agents) {
    const existing = agentsByTeam.get(agent.team);
    if (existing) {
      existing.push(agent);
    } else {
      agentsByTeam.set(agent.team, [agent]);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="AI-agenter"
        subtitle="Administrer autonome AI-agenter"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <AdminStatCard
          label="Totalt"
          value={stats.total}
          icon={<Bot className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Aktive"
          value={stats.active}
          change={
            stats.total > 0
              ? {
                  value: Math.round((stats.active / stats.total) * 100),
                  positive: true,
                }
              : undefined
          }
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Handlinger i dag"
          value={stats.actionsToday}
          icon={<Zap className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Kostnader MTD"
          value={`$${stats.costMtd.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Agents by Team */}
      <div className="space-y-8">
        {TEAM_ORDER.filter((team) => agentsByTeam.has(team)).map((team) => (
          <section key={team}>
            <h2 className="admin-label mb-3">{TEAM_LABELS[team]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentsByTeam.get(team)?.map((agent) => (
                <AdminCard
                  key={agent.id}
                  className={cn(
                    "transition-all",
                    !agent.isActive && "opacity-60",
                    isPending && "pointer-events-none",
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <button
                      onClick={() => handleToggle(agent.id, agent.isActive)}
                      disabled={isPending}
                      aria-label={
                        agent.isActive
                          ? "Deaktiver agent"
                          : "Aktiver agent"
                      }
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        agent.isActive
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-grey-200)]",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
                          agent.isActive ? "left-[22px]" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <h3 className="font-semibold text-[var(--color-text)] mb-1">
                    {agent.displayName}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] mb-2">
                    {agent.model}
                  </p>
                  <p className="text-sm text-[var(--color-text)]/80 mb-4">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[var(--color-grey-200)] flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-medium",
                        agent.isActive
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-muted)]",
                      )}
                    >
                      {agent.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Aktiv
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inaktiv
                        </>
                      )}
                    </span>
                    <span className="text-[var(--color-muted)]">
                      {agent.lastActionAt
                        ? `Sist: ${formatDistanceToNow(new Date(agent.lastActionAt), { locale: nb, addSuffix: true })}`
                        : "Ingen handlinger"}
                    </span>
                  </div>
                </AdminCard>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {agents.length === 0 && (
        <AdminEmptyState
          icon={<Bot className="w-6 h-6" />}
          title="Ingen agenter konfigurert"
          description="Det er ikke lagt til noen AI-agenter ennå."
        />
      )}
    </div>
  );
}
