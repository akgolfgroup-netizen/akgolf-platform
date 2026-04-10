"use client";

import { cn } from "@/lib/portal/utils/cn";
import { Switch } from "@/components/ui/switch";
import {
  GraduationCap,
  Megaphone,
  BarChart3,
  Scale,
  Shield,
  Search,
  CheckCircle2,
  Cog,
  Database,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

const AGENT_ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  megaphone: Megaphone,
  "bar-chart": BarChart3,
  scale: Scale,
  shield: Shield,
  search: Search,
  "check-circle": CheckCircle2,
  cog: Cog,
  database: Database,
  clipboard: ClipboardList,
};

type AgentStatus = "active" | "busy" | "inactive";

interface AgentCardProps {
  name: string;
  role: string;
  description?: string;
  status: AgentStatus;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  gradient: string; // CSS gradient string
  iconName?: string;
  lastAction?: string;
  scopes?: string[];
  className?: string;
}

const statusStyles: Record<AgentStatus, string> = {
  active: "bg-[var(--color-success)]",
  busy: "bg-[#C48A32]",
  inactive: "bg-[#7A8C85]",
};

export function AgentCard({
  name,
  role,
  description,
  status,
  isEnabled,
  onToggle,
  gradient,
  iconName,
  lastAction,
  scopes,
  className,
}: AgentCardProps) {
  const IconComponent = iconName ? AGENT_ICON_MAP[iconName] : null;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#D5DFDB] p-4 relative transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 w-2 h-2 rounded-full",
          statusStyles[status],
        )}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-3 text-white"
        style={{ background: gradient }}
      >
        {IconComponent ? (
          <IconComponent className="w-7 h-7" />
        ) : (
          <span className="text-sm font-bold">AI</span>
        )}
      </div>

      {/* Name & Role */}
      <div className="text-[13px] font-bold text-[#0A1F18] mb-0.5">{name}</div>
      <div className="text-[10px] text-[#5A6E66] mb-2">{role}</div>

      {/* Description */}
      {description && (
        <div className="text-[9px] text-[#7A8C85] leading-relaxed mb-3">
          {description}
        </div>
      )}

      {/* Scopes */}
      {scopes && scopes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {scopes.map((scope) => (
            <span
              key={scope}
              className="px-1.5 py-0.5 text-[8px] bg-[#ECF0EF] text-[#5A6E66] rounded"
            >
              {scope}
            </span>
          ))}
        </div>
      )}

      {/* Last action */}
      {lastAction && (
        <div className="text-[9px] text-[#7A8C85] mb-3">
          Siste handling: {lastAction}
        </div>
      )}

      {/* Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-[#D5DFDB]">
        <span className="text-[10px] text-[#5A6E66]">
          {isEnabled ? "Aktiv" : "Inaktiv"}
        </span>
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-[var(--color-brand)]"
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
  iconName: string;
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
    description:
      "Ansvarlig for spillerutvikling, coaching-planer og treningsstrategier.",
    gradient: "linear-gradient(135deg, #0A1F18, #3a3a3c)",
    iconName: "graduation-cap",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "mercury",
    name: "Mercury",
    displayName: "Mercury",
    role: "CMO",
    description:
      "Markedsforing, innholdsstrategi og kampanjer for alle divisjoner.",
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
    iconName: "megaphone",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "atlas",
    name: "Atlas",
    displayName: "Atlas",
    role: "CFO",
    description:
      "Okonomi, budsjett, cash flow og finansiell rapportering.",
    gradient: "linear-gradient(135deg, #14B8A6, #0D9488)",
    iconName: "bar-chart",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "themis",
    name: "Themis",
    displayName: "Themis",
    role: "Juridisk radgiver",
    description:
      "Avtaler, forhandlinger, compliance og juridisk radgivning.",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    iconName: "scale",
    team: "leadership",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "guardian",
    name: "Guardian",
    displayName: "Guardian",
    role: "Brand Enforcer",
    description:
      "Kvalitetssikrer at alt innhold folger brand guidelines.",
    gradient: "linear-gradient(135deg, #EC4899, #DB2777)",
    iconName: "shield",
    team: "quality",
    scopes: ["AK Golf", "Junior", "GFGK"],
  },
  {
    id: "inspector",
    name: "Inspector",
    displayName: "Inspector",
    role: "Code Reviewer",
    description:
      "Gjennomgar kode for bugs, sikkerhet og kvalitet.",
    gradient: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
    iconName: "search",
    team: "quality",
    scopes: ["Developer"],
  },
  {
    id: "validator",
    name: "Validator",
    displayName: "Validator",
    role: "Test Runner",
    description:
      "Skriver og kjorer tester for a sikre kodekvalitet.",
    gradient: "linear-gradient(135deg, #10B981, #EC4899)",
    iconName: "check-circle",
    team: "technical",
    scopes: ["Developer"],
  },
  {
    id: "architect",
    name: "Architect",
    displayName: "Architect",
    role: "Dev Tech Lead",
    description:
      "Teknisk arkitektur, kodereviews og deployment-strategi.",
    gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
    iconName: "cog",
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
    iconName: "database",
    team: "technical",
    scopes: ["Developer"],
  },
  {
    id: "ops",
    name: "Ops",
    displayName: "Ops",
    role: "Operations Assistant",
    description:
      "Daglig drift, oppfolging og operasjonell styring.",
    gradient: "linear-gradient(135deg, #F472B6, #FBBF24)",
    iconName: "clipboard",
    team: "technical",
    scopes: ["Operations"],
  },
];
