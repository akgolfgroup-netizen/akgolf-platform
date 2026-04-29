// TODO: Hent fra Booking-aggregat (heatmap), CRM-funnel, Stripe (revenue per service)
// Mock-data matcher d30-analytics.html.

export type Kpi = {
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  up: boolean;
};

export const KPIS: Kpi[] = [
  { label: "Belegg · snitt", value: "94", suffix: "%", delta: "↑ +6 vs forrige", up: true },
  { label: "No-show · rate", value: "3.2", suffix: "%", delta: "↓ −2.4", up: true },
  { label: "Konvertering · prøvetime", value: "62", suffix: "%", delta: "↑ +8", up: true },
  { label: "Snitt mnd / spiller", value: "3 380", suffix: " kr", delta: "↑ +320", up: true },
  { label: "HCP · 12mnd ↓", value: "−2.6", delta: "76 % AV SPILLERE", up: true },
];

/** Heatmap-celler: heat-level 0-5 per (rad, dag) */
export const HEATMAP_HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] as const;
export const HEATMAP_DAYS = ["MAN", "TIR", "ONS", "TOR", "FRE", "LØR", "SØN"] as const;
export const HEATMAP_CELLS: number[][] = [
  [2, 3, 2, 3, 3, 4, 2],
  [3, 4, 4, 4, 5, 5, 4],
  [2, 3, 3, 3, 4, 4, 3],
  [3, 4, 4, 5, 4, 3, 2],
  [5, 5, 5, 5, 4, 2, 2],
  [5, 5, 5, 5, 3, 1, 1],
  [2, 2, 2, 2, 0, 0, 0],
];

export const HEAT_BG: Record<number, string> = {
  0: "rgba(255,255,255,0.03)",
  1: "rgba(209,248,67,0.15)",
  2: "rgba(209,248,67,0.30)",
  3: "rgba(209,248,67,0.50)",
  4: "rgba(209,248,67,0.75)",
  5: "#D1F843",
};

export type SlotRow = { label: string; barPct: number; valuePct: number };

export const FREE_SLOTS: SlotRow[] = [
  { label: "FRE 18-20", barPct: 60, valuePct: 40 },
  { label: "SØN 16-20", barPct: 75, valuePct: 25 },
  { label: "LØR 18-20", barPct: 80, valuePct: 20 },
  { label: "MAN 20-22", barPct: 85, valuePct: 15 },
  { label: "TIR 12-14", barPct: 65, valuePct: 35 },
  { label: "ONS 08-10", barPct: 70, valuePct: 30 },
];

export type FunnelStep = {
  head: string;
  meta: string;
  barPct: number;
  value: string;
};

export const FUNNEL: FunnelStep[] = [
  { head: "Besøk på akademi.no", meta: "PRØV-CTA · BOOKINGER · OM-OSS", barPct: 100, value: "2 480" },
  { head: "Booket prøvetime", meta: "RATE: 12 % AV BESØK", barPct: 54, value: "298" },
  { head: "Møtte opp til prøvetime", meta: "RATE: 92 % NO-SHOW LAVT", barPct: 50, value: "274" },
  { head: "Konvertert til betalt", meta: "RATE: 62 % AV PRØVENDE", barPct: 31, value: "170" },
  { head: "Aktiv etter 90d", meta: "RETENTION: 88 %", barPct: 27, value: "150" },
];

export type DonutSeg = { label: string; value: string; color: string; dashLen: number; dashOffset: number };

export const REVENUE_PER_SERVICE: DonutSeg[] = [
  { label: "1:1 coaching", value: "240k · 56 %", color: "#D1F843", dashLen: 274, dashOffset: 0 },
  { label: "Pakker", value: "102k · 24 %", color: "#6BB1FF", dashLen: 118, dashOffset: -276 },
  { label: "Abonnement", value: "60k · 14 %", color: "#C99CF3", dashLen: 69, dashOffset: -396 },
  { label: "Camp + gruppe", value: "26k · 6 %", color: "#E8B967", dashLen: 29, dashOffset: -467 },
];

export const COACH_TIME: SlotRow[] = [
  { label: "LONG-GAME", barPct: 36, valuePct: 36 },
  { label: "PUTTING", barPct: 24, valuePct: 24 },
  { label: "SHORT-GAME", barPct: 18, valuePct: 18 },
  { label: "MENTAL", barPct: 8, valuePct: 8 },
  { label: "FYSISK", barPct: 7, valuePct: 7 },
  { label: "ON-COURSE", barPct: 7, valuePct: 7 },
];

/** Bar heights for new-spillere (12 weeks) */
export const NEW_PLAYERS_BARS: { x: number; y: number; h: number }[] = [
  { x: 10, y: 100, h: 40 },
  { x: 34, y: 80, h: 60 },
  { x: 58, y: 90, h: 50 },
  { x: 82, y: 60, h: 80 },
  { x: 106, y: 70, h: 70 },
  { x: 130, y: 50, h: 90 },
  { x: 154, y: 50, h: 90 },
  { x: 178, y: 40, h: 100 },
  { x: 202, y: 60, h: 80 },
  { x: 226, y: 40, h: 100 },
  { x: 250, y: 30, h: 110 },
  { x: 274, y: 20, h: 120 },
];

export const NPS = {
  score: 68,
  basis: "BASERT PÅ 38 SVAR",
  promoters: 28,
  passive: 8,
  detractors: 2,
};
