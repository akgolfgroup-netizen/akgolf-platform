// TODO: koble til ekte data
// - week-grid bookings: prisma.booking.findMany({ where: { instructorId, startTime: { gte: weekStart, lt: weekEnd } } })
// - kpis: aggregat fra Booking + Capacity (slots ledig vs. booket), Stripe forventet inntekt
// - aktive spillere: telle distinct userId i Booking i uken
// - apne slots: lib/portal/booking/available-slots
// - ukens fokus: ny modell WeeklyFocus eller manuelt fra Coach

export type EventColor = "green" | "lime" | "coral" | "violet" | "muted";

export interface WeekEvent {
  /** Dag-indeks (0 = man, 6 = son) */
  day: number;
  /** Posisjon i px fra topp av kolonne (60px per slot, 7 slots = 420px) */
  top: number;
  /** Hoyde i px */
  height: number;
  title: string;
  meta: string;
  color: EventColor;
}

export interface WeekDay {
  short: string;
  num: string;
  isToday?: boolean;
}

export interface WeekKpi {
  label: string;
  value: string;
  delta?: string;
  barPercent: number;
}

export interface WeeklyFocusItem {
  title: string;
  description: string;
  highlight?: boolean;
}

export interface OpenSlot {
  when: string;
  location: string;
}

export const TIME_SLOTS = [
  "07:00",
  "09:00",
  "11:00",
  "13:00",
  "15:00",
  "17:00",
  "19:00",
];

export const WEEK_DAYS: WeekDay[] = [
  { short: "Man", num: "28" },
  { short: "Tir", num: "29", isToday: true },
  { short: "Ons", num: "30" },
  { short: "Tor", num: "01" },
  { short: "Fre", num: "02" },
  { short: "Lor", num: "03" },
  { short: "Son", num: "04" },
];

export const WEEK_KPIS: WeekKpi[] = [
  { label: "Planlagte okter", value: "28", delta: "+4", barPercent: 88 },
  { label: "Kapasitet brukt", value: "92%", delta: "+8%", barPercent: 92 },
  { label: "Forventet inntekt", value: "22,4k", delta: "+12%", barPercent: 78 },
  { label: "Aktive spillere", value: "19", delta: "av 42", barPercent: 45 },
];

export const WEEK_EVENTS: WeekEvent[] = [
  // Man (0)
  { day: 0, top: 8, height: 44, title: "Sofie H.", meta: "Range · 45m", color: "green" },
  { day: 0, top: 160, height: 56, title: "Erik L.", meta: "Studio · 60m", color: "green" },
  { day: 0, top: 425, height: 56, title: "Markus E.", meta: "Putting · 60m", color: "lime" },
  { day: 0, top: 510, height: 50, title: "Henrik V.", meta: "Bane 9h · 45m", color: "coral" },
  { day: 0, top: 685, height: 90, title: "Junior A", meta: "Range · 90m · 8 stk", color: "violet" },

  // Tir (1) — i dag
  { day: 1, top: 8, height: 50, title: "Lars B.", meta: "Studio · 50m", color: "green" },
  { day: 1, top: 90, height: 56, title: "Mia D.", meta: "Range · 60m", color: "green" },
  { day: 1, top: 245, height: 60, title: "Kari N.", meta: "Studio · 60m", color: "green" },
  { day: 1, top: 340, height: 60, title: "Tor S.", meta: "Bane · 60m", color: "coral" },
  { day: 1, top: 595, height: 90, title: "Junior B", meta: "Range · 90m", color: "violet" },

  // Ons (2)
  { day: 2, top: 8, height: 50, title: "— Apen —", meta: "Studio 1", color: "muted" },
  { day: 2, top: 90, height: 50, title: "— Apen —", meta: "Range", color: "muted" },
  { day: 2, top: 245, height: 56, title: "Camilla R.", meta: "Studio · 60m", color: "green" },
  { day: 2, top: 425, height: 50, title: "Pelle K.", meta: "Range · 45m", color: "green" },
  { day: 2, top: 510, height: 60, title: "Anne M.", meta: "Studio · 60m", color: "green" },

  // Tor (3)
  { day: 3, top: 8, height: 50, title: "Lars B.", meta: "Range · 45m", color: "green" },
  { day: 3, top: 160, height: 60, title: "Sofie H.", meta: "Studio · 60m", color: "green" },
  { day: 3, top: 340, height: 60, title: "Erik L.", meta: "Studio · 60m", color: "green" },
  { day: 3, top: 510, height: 90, title: "Henrik + Tor", meta: "Bane 9h · 90m", color: "coral" },

  // Fre (4)
  { day: 4, top: 8, height: 50, title: "Mia D.", meta: "Range · 45m", color: "green" },
  { day: 4, top: 160, height: 56, title: "Kari N.", meta: "Studio · 60m", color: "green" },
  { day: 4, top: 245, height: 56, title: "Camilla R.", meta: "Range · 60m", color: "green" },
  { day: 4, top: 425, height: 56, title: "— Apen —", meta: "Putting", color: "muted" },
  { day: 4, top: 595, height: 90, title: "Junior C", meta: "Range · 90m", color: "violet" },

  // Lor (5)
  { day: 5, top: 8, height: 130, title: "Voksengruppe", meta: "Bane · 130m · 6 stk", color: "coral" },
  { day: 5, top: 245, height: 60, title: "Pelle K.", meta: "Studio · 60m", color: "green" },
  { day: 5, top: 340, height: 60, title: "Anne M.", meta: "Studio · 60m", color: "green" },

  // Son (6)
  { day: 6, top: 90, height: 60, title: "— Apen —", meta: "Studio", color: "muted" },
  { day: 6, top: 245, height: 60, title: "Tor S.", meta: "Studio · 60m", color: "green" },
  { day: 6, top: 510, height: 60, title: "— Apen —", meta: "Range", color: "muted" },
];

export const WEEKLY_FOCUS: WeeklyFocusItem[] = [
  {
    title: "Short-game block",
    description:
      "3 spillere pa SG-putting under -0,4 — 4 okter dedikert",
    highlight: true,
  },
  {
    title: "Junior turneringsuke",
    description:
      "Junior A+B+C far forberedelse til regions-turnering 12 mai",
  },
  {
    title: "Re-engagement",
    description: "Emma + Henrik booket inn etter inaktivitet",
  },
];

export const OPEN_SLOTS: OpenSlot[] = [
  { when: "Ons 30 · 07:00", location: "Studio 1" },
  { when: "Ons 30 · 09:30", location: "Range" },
  { when: "Fre 02 · 15:00", location: "Putting" },
  { when: "Son 04 · 09:30", location: "Studio 2" },
];
