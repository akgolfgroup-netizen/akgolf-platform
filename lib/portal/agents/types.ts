/**
 * Agent-park typer.
 *
 * En agent er en bakgrunn-prosess som triggerer på en event eller schedule
 * og utfører én konkret administrativ rutine.
 */

export type AgentName =
  | "post-session-transcriber"
  | "next-session-planner"
  | "usi-focus-updater"
  | "test-retest-scheduler"
  | "degradation-flagger"
  | "payment-collect"
  | "cancellation"
  | "coach-payout"
  | "booking-confirm"
  | "no-show"
  | "dunning"
  | "onboarding"
  | "winback"
  | "birthday"
  | "sponsor-report"
  | "degradation-flag";

export type AgentStatus = "success" | "error" | "skipped" | "running";

export interface AgentResult {
  ran: boolean;
  reason?: string;
  duration?: number;
}

export interface AgentDefinition {
  name: AgentName;
  displayName: string;
  description: string;
  trigger: "event" | "cron" | "manual";
  schedule?: string; // cron-expr hvis cron
  category: "post-session" | "payment" | "communication" | "admin" | "data";
}

export const AGENT_REGISTRY: Record<AgentName, AgentDefinition> = {
  "post-session-transcriber": {
    name: "post-session-transcriber",
    displayName: "Post-okt-transkribering",
    description: "Transkriberer lyd og genererer AI-sammendrag etter coaching-okt",
    trigger: "event",
    category: "post-session",
  },
  "next-session-planner": {
    name: "next-session-planner",
    displayName: "Neste-okt-planlegger",
    description: "Genererer utkast til neste coaching-okt etter publisering",
    trigger: "event",
    category: "post-session",
  },
  "usi-focus-updater": {
    name: "usi-focus-updater",
    displayName: "Ferdighetsniva-oppdaterer",
    description: "Varsler coach ved signifikant endring i USI",
    trigger: "event",
    category: "data",
  },
  "test-retest-scheduler": {
    name: "test-retest-scheduler",
    displayName: "Test-retest-skedulerer",
    description: "Auto-skedulerer neste retest 8 uker frem",
    trigger: "event",
    category: "data",
  },
  "degradation-flagger": {
    name: "degradation-flagger",
    displayName: "Tilbakegang-flagger",
    description: "Flagger spillere som taper terreng pa metric-snapshots",
    trigger: "event",
    category: "data",
  },
  "payment-collect": {
    name: "payment-collect",
    displayName: "Betaling-trekker",
    description: "Trekker fra kort eller sender faktura for fullforte Flex-okter",
    trigger: "event",
    category: "payment",
  },
  cancellation: {
    name: "cancellation",
    displayName: "Avbestilling-handterer",
    description: "Beregner refund og gjennomforer Stripe-refund/credit-note",
    trigger: "event",
    category: "payment",
  },
  "coach-payout": {
    name: "coach-payout",
    displayName: "Trener-payout-kalkulator",
    description: "Kalkulerer manedlig payout til trenere",
    trigger: "cron",
    schedule: "55 23 28-31 * *",
    category: "admin",
  },
  "booking-confirm": {
    name: "booking-confirm",
    displayName: "Booking-bekrefter",
    description: "Sender SMS + e-post + kalender-invite ved ny booking",
    trigger: "event",
    category: "communication",
  },
  "no-show": {
    name: "no-show",
    displayName: "Ikke-mott-handterer",
    description: "Marker no-show 15 min etter start hvis ikke checked-in",
    trigger: "cron",
    schedule: "*/15 * * * *",
    category: "admin",
  },
  dunning: {
    name: "dunning",
    displayName: "Purrelogikk",
    description: "3-trinns purring pa forfalt faktura, eskalering til Anders ved 21d",
    trigger: "cron",
    schedule: "0 10 * * *",
    category: "payment",
  },
  onboarding: {
    name: "onboarding",
    displayName: "Onboarding-sekvens",
    description: "Velkomst-flow + mental-baseline + forste-okt-link for nye elever",
    trigger: "event",
    category: "communication",
  },
  winback: {
    name: "winback",
    displayName: "Vinn-tilbake",
    description: "Personlig vinn-tilbake-melding for elever inaktive 21+ dager",
    trigger: "cron",
    schedule: "0 9 * * *",
    category: "communication",
  },
  birthday: {
    name: "birthday",
    displayName: "Bursdag-gratulant",
    description: "Personlig melding fra coach pa elevens bursdag",
    trigger: "cron",
    schedule: "0 8 * * *",
    category: "communication",
  },
  "sponsor-report": {
    name: "sponsor-report",
    displayName: "Sponsor-rapport-generator",
    description: "Manedlig rapport per sponsor med antall okter, NPS, hoydepunkter",
    trigger: "cron",
    schedule: "0 9 1 * *",
    category: "admin",
  },
  "degradation-flag": {
    name: "degradation-flag",
    displayName: "Tilbakegang-detektor",
    description: "Detekterer tilbakegang i prestasjon og oppretter DegradationTracking",
    trigger: "event",
    category: "data",
  },
};
