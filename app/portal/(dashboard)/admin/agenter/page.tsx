"use client";

import { useState } from "react";
import {
  MCTopbar,
  MCCard,
  MCCardHeader,
  MCCardTitle,
  MCCardBody,
  AgentCard,
  AGENT_CONFIGS,
  useMCSidebar,
} from "@/components/portal/mission-control";

type AgentTeam = "leadership" | "quality" | "technical";

const TEAM_LABELS: Record<AgentTeam, string> = {
  leadership: "Ledergruppen",
  quality: "Kvalitet & Merkevare",
  technical: "Teknisk Team",
};

export default function AgenterPage() {
  const { toggle } = useMCSidebar();
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>(
    Object.fromEntries(AGENT_CONFIGS.map((a) => [a.id, true]))
  );

  const handleToggle = (agentId: string, enabled: boolean) => {
    setEnabledAgents((prev) => ({ ...prev, [agentId]: enabled }));
    // TODO: Persist to database via API
  };

  // Group agents by team
  const agentsByTeam = AGENT_CONFIGS.reduce((acc, agent) => {
    if (!acc[agent.team]) acc[agent.team] = [];
    acc[agent.team].push(agent);
    return acc;
  }, {} as Record<AgentTeam, typeof AGENT_CONFIGS>);

  return (
    <>
      <MCTopbar
        title="AI Agenter"
        subtitle="Administrer autonome AI-agenter"
        onMenuClick={toggle}
        notificationCount={0}
      />

      <div className="p-5 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MCCard>
            <MCCardBody>
              <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                Totalt
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F]">
                {AGENT_CONFIGS.length}
              </div>
            </MCCardBody>
          </MCCard>
          <MCCard>
            <MCCardBody>
              <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                Aktive
              </div>
              <div className="text-2xl font-bold text-[var(--color-success)]">
                {Object.values(enabledAgents).filter(Boolean).length}
              </div>
            </MCCardBody>
          </MCCard>
          <MCCard>
            <MCCardBody>
              <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                Handlinger i dag
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F]">24</div>
            </MCCardBody>
          </MCCard>
          <MCCard>
            <MCCardBody>
              <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                Kostnader MTD
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F]">$12.50</div>
            </MCCardBody>
          </MCCard>
        </div>

        {/* Agents by Team */}
        {(["leadership", "quality", "technical"] as AgentTeam[]).map((team) => (
          <div key={team}>
            <h2 className="text-sm font-bold text-[#1D1D1F] mb-3">
              {TEAM_LABELS[team]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agentsByTeam[team]?.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.displayName}
                  role={agent.role}
                  description={agent.description}
                  status={enabledAgents[agent.id] ? "active" : "inactive"}
                  isEnabled={enabledAgents[agent.id]}
                  onToggle={(enabled) => handleToggle(agent.id, enabled)}
                  gradient={agent.gradient}
                  iconName={agent.iconName}
                  scopes={agent.scopes}
                  lastAction="2 min siden"
                />
              ))}
            </div>
          </div>
        ))}

        {/* Action Log */}
        <MCCard>
          <MCCardHeader>
            <MCCardTitle>Siste handlinger</MCCardTitle>
          </MCCardHeader>
          <MCCardBody>
            <div className="space-y-2">
              {[
                {
                  agent: "Coach",
                  action: "Oppdaterte treningsplan for Erik S.",
                  time: "2 min siden",
                },
                {
                  agent: "Mercury",
                  action: "Genererte Instagram-innlegg for Junior Academy",
                  time: "15 min siden",
                },
                {
                  agent: "Guardian",
                  action: "Godkjente nyhetsbrev-design",
                  time: "1 time siden",
                },
                {
                  agent: "Atlas",
                  action: "Oppdaterte MTD-rapport",
                  time: "2 timer siden",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[#E8E8ED] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[#1D1D1F]">
                      {log.agent}
                    </span>
                    <span className="text-[10px] text-[#6E6E73]">{log.action}</span>
                  </div>
                  <span className="text-[9px] text-[#86868B]">{log.time}</span>
                </div>
              ))}
            </div>
          </MCCardBody>
        </MCCard>
      </div>
    </>
  );
}
