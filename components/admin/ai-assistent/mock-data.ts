// TODO: koble til ekte data
// - conversations: prisma.aiConversation.findMany med messages
// - context: spillerregister, bookinger, hcp-historikk, meldinger, notater
// - model: Anthropic Claude (lib/portal/ai/coach-copilot.ts)

export type ConversationItem = {
  id: string;
  title: string;
  meta: string;
  active?: boolean;
  group: "today" | "yesterday" | "earlier";
};

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "c1",
    title: "Hvem trenger oppfølging denne uken?",
    meta: "FOR 12 MIN SIDEN · 6 SVAR",
    active: true,
    group: "today",
  },
  {
    id: "c2",
    title: "Sammenlign Anders og Markus alignment-data",
    meta: "2 T SIDEN · 4 SVAR",
    group: "today",
  },
  {
    id: "c3",
    title: "Hvor mye av tida går til driver-coaching?",
    meta: "2 T SIDEN · 4 SVAR",
    group: "yesterday",
  },
  {
    id: "c4",
    title: "Skriv mai-rapport til klubb-styret",
    meta: "I GÅR · 3 SVAR",
    group: "yesterday",
  },
  {
    id: "c5",
    title: "Hvilke spillere risikerer å forsvinne?",
    meta: "28. APR",
    group: "earlier",
  },
  {
    id: "c6",
    title: "Lag treningsplan for Sofie · taper-uke",
    meta: "25. APR",
    group: "earlier",
  },
  {
    id: "c7",
    title: "Hva er typisk drop-off etter onboarding?",
    meta: "22. APR",
    group: "earlier",
  },
];

export type FollowUpRow = {
  player: string;
  reason: string;
  lastSession: string;
  hcpTrend: string;
  trendClass?: "up" | "down";
};

export const MOCK_FOLLOWUP_ROWS: FollowUpRow[] = [
  {
    player: "Per Rasmussen",
    reason: "2 no-show siste 30d",
    lastSession: "22d",
    hcpTrend: "+0.3",
    trendClass: "down",
  },
  {
    player: "Lina Holm",
    reason: "Ny · ikke booket etter onboarding",
    lastSession: "14d",
    hcpTrend: "—",
  },
  {
    player: "Tobias Rød",
    reason: "Plateau 4 mnd · spør sjelden om hjelp",
    lastSession: "7d",
    hcpTrend: "+0.0",
  },
  {
    player: "Marie Lindh",
    reason: "Skadet · skulder. Trenger varsom plan",
    lastSession: "10d",
    hcpTrend: "+0.6",
    trendClass: "down",
  },
  {
    player: "Aksel Berg",
    reason: "Far ringte ang. motivasjon (foreldre Berg)",
    lastSession: "5d",
    hcpTrend: "−0.1",
  },
];

export const SUGGESTION_CHIPS = [
  "Hvor stor andel av tida går til putting?",
  "Sammenlign mai mot april",
  "Hvem er nær neste milepæl?",
  "Skriv kvartalsrapport",
];

export const CONTEXT_SOURCES: { icon: string; label: string }[] = [
  { icon: "users", label: "Spillerregister" },
  { icon: "calendar", label: "Bookinger 30d" },
  { icon: "trending-up", label: "HCP-historikk" },
  { icon: "message-circle", label: "Meldings-tråder" },
  { icon: "file-text", label: "Coaching-notater" },
];
