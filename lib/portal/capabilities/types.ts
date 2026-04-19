import type { Capability } from "@prisma/client";

export type CapabilityGroup =
  | "mission-board"
  | "scouting"
  | "kartlegging"
  | "tournament"
  | "booking"
  | "content"
  | "finance"
  | "users"
  | "gdpr"
  | "system";

export interface CapabilityDefinition {
  capability: Capability;
  group: CapabilityGroup;
  label: string;
  description: string;
  requiresMfa?: boolean;
  requires?: Capability[];
  juniorGated?: boolean;
}

export interface CapabilityGroupDefinition {
  id: CapabilityGroup;
  label: string;
  description: string;
}

export interface CapabilityPreset {
  id: string;
  label: string;
  description: string;
  capabilities: Capability[];
}
