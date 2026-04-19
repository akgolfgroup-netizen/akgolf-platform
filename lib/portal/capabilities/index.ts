// Client-trygge exports — catalog, presets, types.
// NB: check.ts og sensitive-guard.ts er server-only og importeres DIREKTE fra sine
// egne stier i server-komponenter ("@/lib/portal/capabilities/check" /
// "@/lib/portal/capabilities/sensitive-guard"). De re-eksporteres IKKE herfra
// for å unngå at client-komponenter drar inn next/headers via barrel.

export {
  CAPABILITY_CATALOG,
  CAPABILITY_GROUPS,
  getCapabilityDefinition,
  getCapabilitiesByGroup,
  getGroupDefinition,
} from "./catalog";
export {
  CAPABILITY_PRESETS,
  getPreset,
  STUDENT_DEFAULT_CAPABILITIES,
  INSTRUCTOR_DEFAULT_CAPABILITIES,
  ADMIN_DEFAULT_CAPABILITIES,
  INVITED_DEFAULT_CAPABILITIES,
} from "./presets";
export type {
  CapabilityDefinition,
  CapabilityGroup,
  CapabilityGroupDefinition,
  CapabilityPreset,
} from "./types";
