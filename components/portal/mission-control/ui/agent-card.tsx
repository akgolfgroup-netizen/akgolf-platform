"use client";

import { cn } from "@/lib/portal/utils/cn";
import { Switch } from "@/components/ui/switch";

type AgentStatus = "active" | "busy" | "inactive";

interface AgentCardProps {
  name: string;
  role: string;
  description?: string;
  status: AgentStatus;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  gradient: string; // CSS gradient string
  iconEmoji?: string;
  lastAction?: string;
  scopes?: string[];
  className?: string;
}

const statusStyles: Record<AgentStatus, string> = {
  active: "bg-[#34C759]",
  busy: "bg-[#FF9500]",
  inactive: "bg-[#86868B]",
};

export function AgentCard({
  name,
  role,
  description,
  status,
  isEnabled,
  onToggle,
  gradient,
  iconEmoji,
  lastAction,
  scopes,
  className,
}: AgentCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#E8E8ED] p-4 relative transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 w-2 h-2 rounded-full",
          statusStyles[status]
        )}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-3 text-2xl text-white"
        style={{ background: gradient }}
      >
        {iconEmoji || "AI"}
      </div>

      {/* Name & Role */}
      <div className="text-[13px] font-bold text-[#1D1D1F] mb-0.5">{name}</div>
      <div className="text-[10px] text-[#6E6E73] mb-2">{role}</div>

      {/* Description */}
      {description && (
        <div className="text-[9px] text-[#86868B] leading-relaxed mb-3">
          {description}
        </div>
      )}

      {/* Scopes */}
      {scopes && scopes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {scopes.map((scope) => (
            <span
              key={scope}
              className="px-1.5 py-0.5 text-[8px] bg-[#F5F5F7] text-[#6E6E73] rounded"
            >
              {scope}
            </span>
          ))}
        </div>
      )}

      {/* Last action */}
      {lastAction && (
        <div className="text-[9px] text-[#86868B] mb-3">
          Siste handling: {lastAction}
        </div>
      )}

      {/* Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E8E8ED]">
        <span className="text-[10px] text-[#6E6E73]">
          {isEnabled ? "Aktiv" : "Inaktiv"}
        </span>
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-[#34C759]"
        />
      </div>
    </div>
  );
}

// Agent configuration type
export interface AgentConfig {
  id: string;
  name: string;
  displayName: string;
  role: string;
  description: string;
  gradient: string;
  iconEmoji: string;
  team: "leadership" | "quality" | "technical";
  scopes: string[];
}

// Predefined agents
export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: "coach",
    name: "Coach",
    displayName: "Coach",
    role: "Akademi-direktor",
    description: "Ansvarlig for spillerutvikling, coaching-planer og treningsstrategier.",
    gradient: "linear-gradient(135deg, #1D1D1F, #3a3a3c)",
    iconEmoji: "🎓",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "mercury",
    name: "Mercury",
    displayName: "Mercury",
    role: "CMO",
    description: "Markedsforing, innholdsstrategi og kampanjer for alle divisjoner.",
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
    iconEmoji: "📣",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "atlas",
    name: "Atlas",
    displayName: "Atlas",
    role: "CFO",
    description: "Okonomi, budsjett, cash flow og finansiell rapportering.",
    gradient: "linear-gradient(135deg, #14B8A6, #0D9488)",
    iconEmoji: "📊",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "themis",
    name: "Themis",
    displayName: "Themis",
    role: "Juridisk radgiver",
    description: "Avtaler, forhandlinger, compliance og juridisk radgivning.",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    iconEmoji: "⚖️",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "guardian",
    name: "Guardian",
    displayName: "Guardian",
    role: "Brand Enforcer",
    description: "Kvalitetssikrer at alt innhold folger brand guidelines.",
    gradient: "linear-gradient(135deg, #EC4899, #DB2777)",
    iconEmoji: "🛡️",
    team: "quality",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "inspector",
    name: "Inspector",
    displayName: "Inspector",
    role: "Code Reviewer",
    description: "Gjennomgar kode for bugs, sikkerhet og kvalitet.",
    gradient: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
    iconEmoji: "🔍",
    team: "quality",
    scopes: ["Developer"],
  },
  {
    id: "validator",
    name: "Validator",
    displayName: "Validator",
    role: "Test Runner",
    description: "Skriver og kjorer tester for a sikre kodekvalitet.",
    gradient: "linear-gradient(135deg, #10B981, #EC4899)",
    iconEmoji: "✓",
    team: "technical",
    scopes: ["Developer"],
  },
  {
    id: "architect",
    name: "Architect",
    displayName: "Architect",
    role: "Dev Tech Lead",
    description: "Teknisk arkitektur, kodereviews og deployment-strategi.",
    gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
    iconEmoji: "⚙️",
    team: "technical",
    scopes: ["Developer"],
  },
  {
    id: "oracle",
    name: "Oracle",
    displayName: "Oracle",
    role: "Supabase Expert",
    description: "Database-design, migrasjoner og RLS-regler.",
    gradient: "linear-gradient(135deg, #3ECF8E, #1C7C4E)",
    iconEmoji: "🗄️",
    team: "technical",
    scopes: ["Developer"],
  },
  {
    id: "ops",
    name: "Ops",
    displayName: "Ops",
    role: "Operations Assistant",
    description: "Daglig drift, oppfolging og operasjonell styring.",
    gradient: "linear-gradient(135deg, #F472B6, #FBBF24)",
    iconEmoji: "📋",
    team: "technical",
    scopes: ["Operations"],
  },
];
