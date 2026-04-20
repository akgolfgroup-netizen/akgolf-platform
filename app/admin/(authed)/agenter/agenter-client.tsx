"use client";


import { Icon } from "@/components/ui/icon";
import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  toggleAgent,
  type AgentData,
  type AgentStats,
} from "./actions";
import type { AgentTeam } from "@prisma/client";

import { MonoLabel } from "@/components/portal/patterns";
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
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (agentId: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleAgent(agentId, !currentState);
    });
  };

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
    <>
      <MCTopbar
        title="AI-agenter"
        subtitle="Administrer autonome AI-agenter"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-on-surface">AI-agenter</h1>
          <p className="text-on-surface-variant">Administrer autonome AI-agenter</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                <Icon name="smart_toy" className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Totalt</span>
            </div>
            <div className="text-2xl font-semibold text-on-surface tabular-nums">{stats.total}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                <Icon name="check"Circle className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Aktive</span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-semibold text-on-surface tabular-nums">{stats.active}</div>
              {stats.total > 0 && (
                <span className="text-xs font-medium text-success tabular-nums">
                  {Math.round((stats.active / stats.total) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                <Icon name="bolt" className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Handlinger i dag</span>
            </div>
            <div className="text-2xl font-semibold text-on-surface tabular-nums">{stats.actionsToday}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                <Icon name="trending_up" className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Kostnader MTD</span>
            </div>
            <div className="text-2xl font-semibold text-on-surface tabular-nums">${stats.costMtd.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-6">
          {TEAM_ORDER.filter((team) => agentsByTeam.has(team)).map((team) => (
            <section key={team}>
              <MonoLabel as="h3" size="xs" uppercase className="text-on-surface-variant mb-3">{TEAM_LABELS[team]}</MonoLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentsByTeam.get(team)?.map((agent) => (
                  <div
                    key={agent.id}
                    className={cn(
                      "bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 transition-all hover:border-outline-variant/50",
                      !agent.isActive && "opacity-60",
                      isPending && "pointer-events-none",
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center">
                        <Icon name="smart_toy" className="w-6 h-6 text-on-surface-variant" />
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
                            ? "bg-success"
                            : "bg-surface-variant",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transition-all",
                            agent.isActive ? "left-[22px]" : "left-0.5",
                          )}
                        />
                      </button>
                    </div>

                    <h3 className="font-semibold text-on-surface mb-1">
                      {agent.displayName}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-2">
                      {agent.model}
                    </p>
                    <p className="text-sm text-on-surface-variant mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-on-surface-variant"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium",
                          agent.isActive
                            ? "text-success"
                            : "text-on-surface-variant",
                        )}
                      >
                        {agent.isActive ? (
                          <>
                            <Icon name="check"Circle className="w-3 h-3" />
                            Aktiv
                          </>
                        ) : (
                          <>
                            <Icon name="close"Circle className="w-3 h-3" />
                            Inaktiv
                          </>
                        )}
                      </span>
                      <span className="text-on-surface-variant">
                        {agent.lastActionAt
                          ? `Sist: ${formatDistanceToNow(new Date(agent.lastActionAt), { locale: nb, addSuffix: true })}`
                          : "Ingen handlinger"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mx-auto mb-4">
              <Icon name="smart_toy" className="w-6 h-6 text-on-surface-variant" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              Ingen agenter konfigurert
            </h3>
            <p className="text-on-surface-variant">
              Det er ikke lagt til noen AI-agenter ennå.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
