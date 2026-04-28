// TODO: koble til ekte data
// - agents: prisma.agent.findMany med trigger-config og kjøringer siste 7d
// - logs: prisma.agentRun.findMany ordered by createdAt
// - stats: aggregat fra agentRun

export type AgentIcon =
  | "bell-ring"
  | "user-x"
  | "receipt"
  | "trending-up"
  | "leaf"
  | "message-circle"
  | "zap-off";

export type AgentCard = {
  id: string;
  icon: AgentIcon;
  name: string;
  description: string;
  trigger: { lab: string; lhs: string; sep?: string; rhs?: string };
  stats?: { label: string; value: string; valueColor?: string }[];
  recent: string;
  recentWhen?: string;
  active: boolean;
  paused?: boolean;
};

export const MOCK_AGENTS: AgentCard[] = [
  {
    id: "booking-reminder",
    icon: "bell-ring",
    name: "Booking-påminnelse",
    description:
      "Sender SMS 24t før avtalt økt. Inkluderer Bay-nr, tid, parkerings-info.",
    trigger: {
      lab: "Trigger",
      lhs: "before(booking.start, 24h)",
      sep: "OG",
      rhs: "booking.status = confirmed",
    },
    stats: [
      { label: "Kjørt · 7d", value: "42" },
      { label: "No-show ↓", value: "−68%" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "6 SMS sendt for økter i morgen",
    recentWhen: "I DAG 09:00",
    active: true,
  },
  {
    id: "no-show-flag",
    icon: "user-x",
    name: "No-show flagger",
    description:
      "Markerer spillere som har 2+ no-show siste 30 dager. Oppretter task til Erik.",
    trigger: {
      lab: "Trigger",
      lhs: "noshow.count(30d) ≥ 2",
      rhs: "→ opprett task: «Følg opp [spiller]»",
    },
    stats: [
      { label: "Flagg · 7d", value: "2" },
      { label: "Tasks åpne", value: "1" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "Per Rasmussen flagget",
    recentWhen: "I GÅR 12:30",
    active: true,
  },
  {
    id: "invoice-dunning",
    icon: "receipt",
    name: "Faktura-purring",
    description:
      "Sender vennlig påminnelse 7d og 14d etter forfall. Stripe-integrert.",
    trigger: {
      lab: "Trigger",
      lhs: "invoice.overdue ∈ {7d, 14d}",
      rhs: "→ email + push",
    },
    stats: [
      { label: "Kjørt · 7d", value: "3" },
      { label: "Inn-betalt", value: "2" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "1 betaling registrert siden",
    recentWhen: "I GÅR 10:00",
    active: true,
  },
  {
    id: "hcp-milestone",
    icon: "trending-up",
    name: "HCP-milepæl-gratulant",
    description:
      "Når en spiller passerer en milepæl (single, scratch, ny PB) sendes auto-melding.",
    trigger: {
      lab: "Trigger",
      lhs: "hcp.crosses({10, 5, 0}) OR hcp.new_pb",
    },
    stats: [
      { label: "Kjørt · 7d", value: "3" },
      { label: "PB · siste", value: "SOFIE" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "Sofie Aas (8.1 → 7.7) gratulert",
    recentWhen: "2 t SIDEN",
    active: true,
  },
  {
    id: "season-transition",
    icon: "leaf",
    name: "Sesongtransisjon",
    description:
      "Når været endrer seg (under 5°C 5d), foreslår indoor-økter for outdoor-bookinger.",
    trigger: {
      lab: "Trigger",
      lhs: "weather.avg(5d) < 5°C",
      rhs: "→ foreslå Skullerud",
    },
    stats: [
      { label: "Pause", value: "SOMMER" },
      { label: "Sesong-prep", value: "OKT" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "Aktiveres igjen oktober",
    recentWhen: "15. APRIL",
    active: true,
  },
  {
    id: "smart-reply",
    icon: "message-circle",
    name: "Smart-svar (foreldre)",
    description:
      "Genererer utkast til foreldrespørsmål om bookinger. Erik godkjenner før send.",
    trigger: {
      lab: "Trigger",
      lhs: "message.from = parent",
      sep: "AND",
      rhs: "classifier(booking_question) = true",
    },
    stats: [
      { label: "Utkast · 7d", value: "8" },
      { label: "Godkjent", value: "7" },
      { label: "Feil", value: "0", valueColor: "#6FCBA1" },
    ],
    recent: "Foreldre Hansen (svar lagt klar)",
    recentWhen: "3 t SIDEN",
    active: true,
  },
  {
    id: "re-engagement",
    icon: "zap-off",
    name: "Re-engagement",
    description:
      "Spillere som ikke har booket siste 30d får påminnelse + tilbud om gratis 30 min.",
    trigger: {
      lab: "Trigger",
      lhs: "last_booking > 30d",
      rhs: "→ SMS m/ promo-link",
    },
    recent: "Pause · Erik vurderer policy om gratis-økt-tilbud",
    active: false,
    paused: true,
  },
];
