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
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  toggleAgent,
  TEAM_LABELS,
  type AgentData,
  type AgentStats,
} from "./actions";
import type { AgentTeam } from "@prisma/client";

// ── Team order for display ─────────────────────────────────────────────

const TEAM_ORDER: AgentTeam[] = [
  "LEADERSHIP",
  "COACHING",
  "CONTENT",
  "DEV",
  "OPS",
];

// ── Color by team ──────────────────────────────────────────────────────

const TEAM_COLORS: Record<AgentTeam, string> = {
  LEADERSHIP: "#005840",
  COACHING: "#d2f000",
  CONTENT: "#00d2ff",
  DEV: "#8B5CF6",
  OPS: "#ff9500",
};

// ── Component ──────────────────────────────────────────────────────────

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
    <>
      <MCTopbar
        title="AI Agenter"
        subtitle="Administrer autonome AI-agenter"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HGStatCard label="Totalt" value={stats.total} icon={Bot} />
          <HGStatCard
            label="Aktive"
            value={stats.active}
            trend={
              stats.total > 0
                ? {
                    value: Math.round((stats.active / stats.total) * 100),
                    direction: "up" as const,
                  }
                : undefined
            }
            icon={CheckCircle}
          />
          <HGStatCard
            label="Handlinger i dag"
            value={stats.actionsToday}
            icon={Zap}
          />
          <HGStatCard
            label="Kostnader MTD"
            value={`$${stats.costMtd.toFixed(2)}`}
            icon={TrendingUp}
          />
        </div>

        {/* Agents by Team */}
        {TEAM_ORDER.filter((team) => agentsByTeam.has(team)).map((team) => (
          <div key={team}>
            <h2 className="text-sm font-medium text-[var(--hg-text-muted)] uppercase tracking-wider mb-3">
              {TEAM_LABELS[team]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentsByTeam.get(team)?.map((agent) => {
                const color = TEAM_COLORS[agent.team];

                return (
                  <div
                    key={agent.id}
                    className={cn(
                      "hg-card p-4 transition-all",
                      !agent.isActive && "opacity-60",
                      isPending && "pointer-events-none"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Bot
                          className="w-6 h-6"
                          style={{ color }}
                        />
                      </div>
                      <button
                        onClick={() => handleToggle(agent.id, agent.isActive)}
                        disabled={isPending}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          agent.isActive
                            ? "bg-[var(--hg-primary)]"
                            : "bg-[var(--hg-surface-raised)]"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-[var(--hg-bg)] transition-all",
                            agent.isActive ? "left-5" : "left-1"
                          )}
                        />
                      </button>
                    </div>

                    <h3 className="font-semibold text-[var(--hg-text)] mb-1">
                      {agent.displayName}
                    </h3>
                    <p className="text-sm text-[var(--hg-text-muted)] mb-2">
                      {agent.model}
                    </p>
                    <p className="text-xs text-[var(--hg-text-secondary)] mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {agent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--hg-border)] flex items-center justify-between text-xs">
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          agent.isActive
                            ? "text-[var(--hg-success)]"
                            : "text-[var(--hg-text-muted)]"
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
                      <span className="text-[var(--hg-text-muted)]">
                        {agent.lastActionAt
                          ? `Siste: ${formatDistanceToNow(new Date(agent.lastActionAt), { locale: nb, addSuffix: true })}`
                          : "Ingen handlinger"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {agents.length === 0 && (
          <div className="hg-card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--hg-surface-raised)] flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-[var(--hg-text-muted)]" />
            </div>
            <p className="text-sm text-[var(--hg-text-muted)]">
              Ingen agenter konfigurert
            </p>
          </div>
        )}
      </div>
    </>
  );
}
