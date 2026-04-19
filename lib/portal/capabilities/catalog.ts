import { Capability } from "@prisma/client";
import type {
  CapabilityDefinition,
  CapabilityGroup,
  CapabilityGroupDefinition,
} from "./types";

export const CAPABILITY_GROUPS: CapabilityGroupDefinition[] = [
  {
    id: "mission-board",
    label: "Mission Board og coaching",
    description: "Arbeidsflate for trenere med egne og andres spillere.",
  },
  {
    id: "scouting",
    label: "Intern scouting-pool",
    description:
      "Tilgang til ekstern konkurransepopulasjon. Aldri vist til spillere eller tredjepart.",
  },
  {
    id: "kartlegging",
    label: "Spillerkartlegging og data",
    description: "Spillerprofiler, gap-analyse og tildeling til coach.",
  },
  {
    id: "tournament",
    label: "Turneringer",
    description: "Turneringsoversikt, opprettelse og prep.",
  },
  {
    id: "booking",
    label: "Booking og kalender",
    description: "Booking-administrasjon og kalenderstyring.",
  },
  {
    id: "content",
    label: "Innhold (markedsside)",
    description: "Redigering og publisering av markedssideinnhold.",
  },
  {
    id: "finance",
    label: "Økonomi",
    description: "Stripe-aggregater, abonnementer og refunder.",
  },
  {
    id: "users",
    label: "Brukeradministrasjon",
    description: "Opprette og redigere brukere, rolle- og kapabilitets-tildeling.",
  },
  {
    id: "gdpr",
    label: "GDPR og compliance",
    description: "Innsyn, sletting, audit og dataeksport.",
  },
  {
    id: "system",
    label: "System",
    description: "Innstillinger, logger og manuell CRON-kjøring.",
  },
];

export const CAPABILITY_CATALOG: CapabilityDefinition[] = [
  // Mission Board
  {
    capability: Capability.MB_VIEW_OWN_PLAYERS,
    group: "mission-board",
    label: "Se Mission Board med egne elever",
    description: "Viser dagsagenda og spillerliste for spillere som er tildelt brukeren.",
  },
  {
    capability: Capability.MB_VIEW_ALL_PLAYERS,
    group: "mission-board",
    label: "Se alle AK-elever",
    description: "Utvider Mission Board til å vise alle AK-elever, ikke bare egne.",
    requires: [Capability.MB_VIEW_OWN_PLAYERS],
  },
  {
    capability: Capability.MB_EDIT_TRAINING_PLAN,
    group: "mission-board",
    label: "Endre treningsplan",
    description: "Redigere treningsplaner for spillere man har tilgang til.",
  },
  {
    capability: Capability.MB_REGISTER_TEST_RESULT,
    group: "mission-board",
    label: "Registrere testresultat",
    description: "Legge inn objektive testresultater for spillere.",
  },
  {
    capability: Capability.MB_APPROVE_CATEGORY_PROMOTION,
    group: "mission-board",
    label: "Godkjenne kategori-opprykk",
    description: "Godkjenne opprykk i A-K-kategorisystemet.",
  },
  {
    capability: Capability.MB_CREATE_COACHING_SESSION,
    group: "mission-board",
    label: "Opprette coaching-økter",
    description: "Opprette og publisere økter i egen kalender.",
  },
  {
    capability: Capability.MB_VIEW_COACHING_SIGNALS,
    group: "mission-board",
    label: "Se CoachingSignal-varsler",
    description: "Automatiske anbefalinger basert på USI, treningsdata og tester.",
  },

  // Scouting
  {
    capability: Capability.SCOUTING_VIEW,
    group: "scouting",
    label: "Se intern scouting-pool",
    description:
      "Tilgang til spillere fra Olyo, Srixon, Norgescup, Østlandstour og Global Junior Golf. Aldri vist til spillere.",
    requiresMfa: true,
  },
  {
    capability: Capability.SCOUTING_VIEW_JUNIORS,
    group: "scouting",
    label: "Se juniordata (U18) i scouting-pool",
    description:
      "Utvider scouting-pool med U18-data. Krever fornyet samtykke hver 90 dag.",
    requires: [Capability.SCOUTING_VIEW],
    requiresMfa: true,
    juniorGated: true,
  },
  {
    capability: Capability.SCOUTING_LINK_TO_USER,
    group: "scouting",
    label: "Koble ekstern spiller til AK-elev",
    description: "Manuell matching mellom scouting-oppføring og AK-elev-konto (etter samtykke).",
    requires: [Capability.SCOUTING_VIEW],
  },
  {
    capability: Capability.SCOUTING_EXPORT_AGGREGATED,
    group: "scouting",
    label: "Eksportere aggregerte tall",
    description:
      "Eksport av kun aggregerte benchmarks, aldri identifiserbare data.",
    requires: [Capability.SCOUTING_VIEW],
  },

  // Kartlegging
  {
    capability: Capability.KARTLEGGING_VIEW_OWN_PROFILE,
    group: "kartlegging",
    label: "Se egen kartleggingsprofil",
    description: "Standardkapabilitet for alle AK-elever.",
  },
  {
    capability: Capability.KARTLEGGING_VIEW_ANY_AK_PLAYER,
    group: "kartlegging",
    label: "Se full profil på hvilken som helst AK-elev",
    description: "Lese-tilgang til komplett spillerprofil uavhengig av coach-tildeling.",
  },
  {
    capability: Capability.KARTLEGGING_EDIT_ASSIGNMENTS,
    group: "kartlegging",
    label: "Tildele spillere til coach",
    description: "Endre CoachPlayerRelation — hvem som følger opp hvilke spillere.",
  },

  // Turneringer
  {
    capability: Capability.TOURNAMENT_VIEW,
    group: "tournament",
    label: "Se turneringsoversikt",
    description: "Alle turneringer i katalogen.",
  },
  {
    capability: Capability.TOURNAMENT_CREATE,
    group: "tournament",
    label: "Opprette turneringer",
    description: "Legge inn nye turneringer manuelt.",
  },
  {
    capability: Capability.TOURNAMENT_MANAGE_PREP,
    group: "tournament",
    label: "Registrere turnering-prep",
    description: "Sette opp readiness-score og prep-sjekkliste for spillere.",
  },

  // Booking
  {
    capability: Capability.BOOKING_VIEW_OWN,
    group: "booking",
    label: "Se egne bookinger",
    description: "Standardkapabilitet for alle brukere.",
  },
  {
    capability: Capability.BOOKING_VIEW_ALL,
    group: "booking",
    label: "Se alle bookinger",
    description: "Helhetlig oversikt over bookinger på tvers av coacher.",
  },
  {
    capability: Capability.BOOKING_MANAGE,
    group: "booking",
    label: "Administrere bookinger",
    description: "Omberamme, kansellere, refundere egne bookinger.",
  },
  {
    capability: Capability.BOOKING_RESCHEDULE_OTHER_COACHES,
    group: "booking",
    label: "Flytte økter for andre coacher",
    description: "Omberamme bookinger som tilhører andre coacher.",
    requires: [Capability.BOOKING_MANAGE],
  },

  // Content
  {
    capability: Capability.CONTENT_VIEW,
    group: "content",
    label: "Se utkast og markedssideinnhold",
    description: "Tilgang til interne utkast og meldinger.",
  },
  {
    capability: Capability.CONTENT_EDIT,
    group: "content",
    label: "Redigere markedssidetekst",
    description: "Endre innhold i lib/website-constants.ts og relaterte områder.",
  },
  {
    capability: Capability.CONTENT_PUBLISH,
    group: "content",
    label: "Publisere endringer",
    description: "Pushe innholdsendringer til produksjon.",
    requires: [Capability.CONTENT_EDIT],
  },

  // Finance
  {
    capability: Capability.FINANCE_VIEW,
    group: "finance",
    label: "Se økonomitall",
    description: "Stripe-aggregater, abonnementer, inntekter.",
  },
  {
    capability: Capability.FINANCE_EXPORT,
    group: "finance",
    label: "Eksportere økonomidata",
    description: "Eksport til CSV/XLSX.",
    requires: [Capability.FINANCE_VIEW],
  },
  {
    capability: Capability.FINANCE_REFUND,
    group: "finance",
    label: "Utføre refunder",
    description: "Refundere betalinger via Stripe.",
    requires: [Capability.FINANCE_VIEW],
    requiresMfa: true,
  },

  // Users
  {
    capability: Capability.USERS_VIEW,
    group: "users",
    label: "Se brukerliste",
    description: "Oversikt over alle brukere i plattformen.",
  },
  {
    capability: Capability.USERS_INVITE,
    group: "users",
    label: "Invitere nye brukere",
    description: "Sende magic link-invitasjon til ny bruker.",
  },
  {
    capability: Capability.USERS_ASSIGN_ROLE,
    group: "users",
    label: "Endre primærrolle",
    description: "Sette ADMIN/INSTRUCTOR/STUDENT/INVITED på en bruker.",
    requiresMfa: true,
  },
  {
    capability: Capability.USERS_ASSIGN_CAPABILITIES,
    group: "users",
    label: "Tildele kapabiliteter",
    description: "Huke av funksjoner per bruker. Krever re-autentisering.",
    requiresMfa: true,
  },
  {
    capability: Capability.USERS_DEACTIVATE,
    group: "users",
    label: "Deaktivere brukere",
    description: "Sette bruker som inaktiv — blokkerer innlogging.",
    requiresMfa: true,
  },

  // GDPR
  {
    capability: Capability.GDPR_VIEW_REQUESTS,
    group: "gdpr",
    label: "Se GDPR-forespørsler",
    description: "Innsyn- og slettingforespørsler fra registrerte.",
  },
  {
    capability: Capability.GDPR_HANDLE_REQUESTS,
    group: "gdpr",
    label: "Behandle GDPR-forespørsler",
    description: "Utføre innsyn, sletting, retting innen 30 dager.",
    requires: [Capability.GDPR_VIEW_REQUESTS],
    requiresMfa: true,
  },
  {
    capability: Capability.GDPR_VIEW_AUDIT_LOG,
    group: "gdpr",
    label: "Se audit-logg",
    description: "Alle kapabilitets-endringer og scouting-visninger.",
  },
  {
    capability: Capability.GDPR_EXPORT_USER_DATA,
    group: "gdpr",
    label: "Eksportere brukerdata (art. 20)",
    description: "Generere dataportabilitets-eksport for en bruker.",
    requires: [Capability.GDPR_HANDLE_REQUESTS],
  },

  // System
  {
    capability: Capability.SYSTEM_SETTINGS,
    group: "system",
    label: "Endre systeminnstillinger",
    description: "Globale innstillinger for plattformen.",
    requiresMfa: true,
  },
  {
    capability: Capability.SYSTEM_VIEW_LOGS,
    group: "system",
    label: "Se systemlogger",
    description: "Tekniske logger og feilmeldinger.",
  },
  {
    capability: Capability.SYSTEM_RUN_CRON,
    group: "system",
    label: "Kjøre CRON manuelt",
    description: "Trigge periodiske jobber utenom normal tidsplan.",
    requiresMfa: true,
  },
];

export function getCapabilityDefinition(
  capability: Capability
): CapabilityDefinition | undefined {
  return CAPABILITY_CATALOG.find((c) => c.capability === capability);
}

export function getCapabilitiesByGroup(
  group: CapabilityGroup
): CapabilityDefinition[] {
  return CAPABILITY_CATALOG.filter((c) => c.group === group);
}

export function getGroupDefinition(
  group: CapabilityGroup
): CapabilityGroupDefinition | undefined {
  return CAPABILITY_GROUPS.find((g) => g.id === group);
}
