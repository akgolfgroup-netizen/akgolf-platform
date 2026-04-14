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
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
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
          <h1 className="text-2xl font-semibold text-black">AI-agenter</h1>
          <p className="text-grey-400">Administrer autonome AI-agenter</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-grey-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-grey-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-grey-400" />
              </div>
              <span className="text-sm font-medium text-grey-400">Totalt</span>
            </div>
            <div className="text-2xl font-semibold text-black tabular-nums">{stats.total}</div>
          </div>

          <div className="bg-white border border-grey-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-grey-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-grey-400" />
              </div>
              <span className="text-sm font-medium text-grey-400">Aktive</span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-semibold text-black tabular-nums">{stats.active}</div>
              {stats.total > 0 && (
                <span className="text-xs font-medium text-success tabular-nums">
                  {Math.round((stats.active / stats.total) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-grey-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-grey-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-grey-400" />
              </div>
              <span className="text-sm font-medium text-grey-400">Handlinger i dag</span>
            </div>
            <div className="text-2xl font-semibold text-black tabular-nums">{stats.actionsToday}</div>
          </div>

          <div className="bg-white border border-grey-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-grey-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-grey-400" />
              </div>
              <span className="text-sm font-medium text-grey-400">Kostnader MTD</span>
            </div>
            <div className="text-2xl font-semibold text-black tabular-nums">${stats.costMtd.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-6">
          {TEAM_ORDER.filter((team) => agentsByTeam.has(team)).map((team) => (
            <section key={team}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3">
                {TEAM_LABELS[team]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentsByTeam.get(team)?.map((agent) => (
                  <div
                    key={agent.id}
                    className={cn(
                      "bg-white border border-grey-200 rounded-xl p-5 transition-all hover:border-grey-300",
                      !agent.isActive && "opacity-60",
                      isPending && "pointer-events-none",
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-grey-50 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-grey-400" />
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
                            : "bg-grey-200",
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

                    <h3 className="font-semibold text-black mb-1">
                      {agent.displayName}
                    </h3>
                    <p className="text-xs text-grey-400 mb-2">
                      {agent.model}
                    </p>
                    <p className="text-sm text-grey-400 mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-grey-50 text-grey-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-grey-200 flex items-center justify-between text-xs">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium",
                          agent.isActive
                            ? "text-success"
                            : "text-grey-400",
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
                      <span className="text-grey-400">
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
          <div className="bg-white border border-grey-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-grey-50 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-grey-400" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-1">
              Ingen agenter konfigurert
            </h3>
            <p className="text-grey-400">
              Det er ikke lagt til noen AI-agenter ennå.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
