import { Capability } from "@prisma/client";
import type { CapabilityPreset } from "./types";

export const CAPABILITY_PRESETS: CapabilityPreset[] = [
  {
    id: "coach-standard",
    label: "Coach standard",
    description: "Vanlig AK-coach med tilgang til egne elever og coaching-verktøy.",
    capabilities: [
      Capability.MB_VIEW_OWN_PLAYERS,
      Capability.MB_EDIT_TRAINING_PLAN,
      Capability.MB_REGISTER_TEST_RESULT,
      Capability.MB_CREATE_COACHING_SESSION,
      Capability.MB_VIEW_COACHING_SIGNALS,
      Capability.TOURNAMENT_VIEW,
      Capability.TOURNAMENT_MANAGE_PREP,
      Capability.BOOKING_VIEW_OWN,
      Capability.BOOKING_MANAGE,
      Capability.LIBRARY_VIEW,
    ],
  },
  {
    id: "senior-coach",
    label: "Senior-coach",
    description:
      "Erfaren coach med tilgang til alle AK-elever, opprykk og scouting-pool.",
    capabilities: [
      Capability.MB_VIEW_OWN_PLAYERS,
      Capability.MB_VIEW_ALL_PLAYERS,
      Capability.MB_EDIT_TRAINING_PLAN,
      Capability.MB_REGISTER_TEST_RESULT,
      Capability.MB_APPROVE_CATEGORY_PROMOTION,
      Capability.MB_CREATE_COACHING_SESSION,
      Capability.MB_VIEW_COACHING_SIGNALS,
      Capability.SCOUTING_VIEW,
      Capability.KARTLEGGING_VIEW_ANY_AK_PLAYER,
      Capability.TOURNAMENT_VIEW,
      Capability.TOURNAMENT_CREATE,
      Capability.TOURNAMENT_MANAGE_PREP,
      Capability.BOOKING_VIEW_OWN,
      Capability.BOOKING_VIEW_ALL,
      Capability.BOOKING_MANAGE,
    ],
  },
  {
    id: "junior-coach",
    label: "Junior-coach",
    description:
      "Coach-standard utvidet med juniordata i scouting-pool. Krever 2FA og fornyes hver 90 dag.",
    capabilities: [
      Capability.MB_VIEW_OWN_PLAYERS,
      Capability.MB_EDIT_TRAINING_PLAN,
      Capability.MB_REGISTER_TEST_RESULT,
      Capability.MB_CREATE_COACHING_SESSION,
      Capability.MB_VIEW_COACHING_SIGNALS,
      Capability.SCOUTING_VIEW,
      Capability.SCOUTING_VIEW_JUNIORS,
      Capability.TOURNAMENT_VIEW,
      Capability.TOURNAMENT_MANAGE_PREP,
      Capability.BOOKING_VIEW_OWN,
      Capability.BOOKING_MANAGE,
    ],
  },
  {
    id: "talent-scout",
    label: "Talent-scout",
    description:
      "Talent-identifikasjon med scouting-pool og lesetilgang til AK-elevprofiler.",
    capabilities: [
      Capability.MB_VIEW_COACHING_SIGNALS,
      Capability.SCOUTING_VIEW,
      Capability.SCOUTING_LINK_TO_USER,
      Capability.KARTLEGGING_VIEW_ANY_AK_PLAYER,
      Capability.TOURNAMENT_VIEW,
    ],
  },
  {
    id: "analyst",
    label: "Analytiker",
    description: "Dataanalyse på tvers av elever og aggregerte tall.",
    capabilities: [
      Capability.MB_VIEW_ALL_PLAYERS,
      Capability.KARTLEGGING_VIEW_ANY_AK_PLAYER,
      Capability.SCOUTING_EXPORT_AGGREGATED,
      Capability.FINANCE_VIEW,
      Capability.TOURNAMENT_VIEW,
    ],
  },
  {
    id: "finance",
    label: "Regnskapsansvarlig",
    description: "Økonomi, fakturering og refunder.",
    capabilities: [
      Capability.FINANCE_VIEW,
      Capability.FINANCE_EXPORT,
      Capability.FINANCE_REFUND,
      Capability.BOOKING_VIEW_ALL,
    ],
  },
  {
    id: "content",
    label: "Content-manager",
    description: "Redigering og publisering av markedsside.",
    capabilities: [
      Capability.CONTENT_VIEW,
      Capability.CONTENT_EDIT,
      Capability.CONTENT_PUBLISH,
    ],
  },
  {
    id: "admin",
    label: "Admin (alt)",
    description:
      "Full tilgang til alle funksjoner. Sensitive kapabiliteter krever 2FA ved bruk.",
    capabilities: Object.values(Capability),
  },
];

export function getPreset(id: string): CapabilityPreset | undefined {
  return CAPABILITY_PRESETS.find((p) => p.id === id);
}

export const STUDENT_DEFAULT_CAPABILITIES: Capability[] = [
  Capability.KARTLEGGING_VIEW_OWN_PROFILE,
  Capability.BOOKING_VIEW_OWN,
];

export const INSTRUCTOR_DEFAULT_CAPABILITIES: Capability[] =
  getPreset("coach-standard")?.capabilities ?? [];

export const ADMIN_DEFAULT_CAPABILITIES: Capability[] = Object.values(Capability);

export const INVITED_DEFAULT_CAPABILITIES: Capability[] = [];
