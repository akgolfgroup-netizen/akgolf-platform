"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Bot,
  Brain,
  Shield,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";

// Mock agent configs
const AGENT_CONFIGS = [
  {
    id: "coach",
    displayName: "Coach",
    role: "Coaching-assistent",
    description: "Hjelper med treningsplanlegging og oppfølging",
    team: "leadership" as const,
    icon: Brain,
    color: "#d2f000",
    scopes: ["coaching", "training"],
  },
  {
    id: "mercury",
    displayName: "Mercury",
    role: "Markedsføring",
    description: "Genererer innhold og markedsføringsmateriell",
    team: "quality" as const,
    icon: Zap,
    color: "#00d2ff",
    scopes: ["marketing", "content"],
  },
  {
    id: "guardian",
    displayName: "Guardian",
    role: "Kvalitetskontroll",
    description: "Sjekker kvalitet på innhold og kommunikasjon",
    team: "quality" as const,
    icon: Shield,
    color: "#ff9500",
    scopes: ["review", "approval"],
  },
  {
    id: "atlas",
    displayName: "Atlas",
    role: "Data-analytiker",
    description: "Analyserer data og genererer rapporter",
    team: "technical" as const,
    icon: TrendingUp,
    color: "#2D6A4F",
    scopes: ["analytics", "reporting"],
  },
  {
    id: "assistant",
    displayName: "Assistant",
    role: "Kundeservice",
    description: "Hjelper med kundehenvendelser og support",
    team: "leadership" as const,
    icon: MessageSquare,
    color: "#007AFF",
    scopes: ["support", "communication"],
  },
  {
    id: "scheduler",
    displayName: "Scheduler",
    role: "Booking-assistent",
    description: "Hjelper med booking og timeplanlegging",
    team: "technical" as const,
    icon: Clock,
    color: "#8B5CF6",
    scopes: ["booking", "scheduling"],
  },
];

const TEAM_LABELS = {
  leadership: "Ledergruppen",
  quality: "Kvalitet & Merkevare",
  technical: "Teknisk Team",
};

export default function AgenterPage() {
  const { toggle } = useMCSidebar();
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>(
    Object.fromEntries(AGENT_CONFIGS.map((a) => [a.id, true]))
  );

  const handleToggle = (agentId: string) => {
    setEnabledAgents((prev) => ({ ...prev, [agentId]: !prev[agentId] }));
  };

  // Group agents by team
  const agentsByTeam = AGENT_CONFIGS.reduce((acc, agent) => {
    if (!acc[agent.team]) acc[agent.team] = [];
    acc[agent.team].push(agent);
    return acc;
  }, {} as Record<string, typeof AGENT_CONFIGS>);

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
          <HGStatCard
            label="Totalt"
            value={AGENT_CONFIGS.length}
            icon={Bot}
          />
          <HGStatCard
            label="Aktive"
            value={Object.values(enabledAgents).filter(Boolean).length}
            trend={{ value: 85, direction: "up" }}
            icon={CheckCircle}
          />
          <HGStatCard
            label="Handlinger i dag"
            value={24}
            icon={Zap}
          />
          <HGStatCard
            label="Kostnader MTD"
            value="$12.50"
            icon={TrendingUp}
          />
        </div>

        {/* Agents by Team */}
        {(["leadership", "quality", "technical"] as const).map((team) => (
          <div key={team}>
            <h2 className="text-sm font-medium text-[var(--hg-text-muted)] uppercase tracking-wider mb-3">
              {TEAM_LABELS[team]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentsByTeam[team]?.map((agent) => {
                const Icon = agent.icon;
                const isEnabled = enabledAgents[agent.id];
                
                return (
                  <div
                    key={agent.id}
                    className={cn(
                      "hg-card p-4 transition-all",
                      !isEnabled && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${agent.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: agent.color }} />
                      </div>
                      <button
                        onClick={() => handleToggle(agent.id)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          isEnabled ? "bg-[var(--hg-primary)]" : "bg-[var(--hg-surface-raised)]"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-[var(--hg-bg)] transition-all",
                            isEnabled ? "left-5" : "left-1"
                          )}
                        />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-[var(--hg-text)] mb-1">{agent.displayName}</h3>
                    <p className="text-sm text-[var(--hg-text-muted)] mb-2">{agent.role}</p>
                    <p className="text-xs text-[var(--hg-text-secondary)] mb-4">{agent.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {agent.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-[var(--hg-border)] flex items-center justify-between text-xs">
                      <span className={cn(
                        "flex items-center gap-1",
                        isEnabled ? "text-[var(--hg-success)]" : "text-[var(--hg-text-muted)]"
                      )}>
                        {isEnabled ? (
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
                      <span className="text-[var(--hg-text-muted)]">Siste handling: 2 min siden</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Action Log */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)]">
            <h3 className="hg-section-title">Siste handlinger</h3>
          </div>
          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {[
              { agent: "Coach", action: "Oppdaterte treningsplan for Erik S.", time: "2 min siden", color: "#d2f000" },
              { agent: "Mercury", action: "Genererte Instagram-innlegg for Junior Academy", time: "15 min siden", color: "#00d2ff" },
              { agent: "Guardian", action: "Godkjente nyhetsbrev-design", time: "1 time siden", color: "#ff9500" },
              { agent: "Atlas", action: "Oppdaterte MTD-rapport", time: "2 timer siden", color: "#2D6A4F" },
            ].map((log, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: log.color }}
                  />
                  <span className="text-sm font-medium text-[var(--hg-text)]">
                    {log.agent}
                  </span>
                  <span className="text-sm text-[var(--hg-text-secondary)]">{log.action}</span>
                </div>
                <span className="text-xs text-[var(--hg-text-muted)]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
