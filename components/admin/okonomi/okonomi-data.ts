// TODO: Hent live fra Stripe MRR + AppSubscription + Booking-aggregat
// Mock-data matcher d20-okonomi.html for visuell pixel-match.

export type Transaction = {
  initials: string;
  avatarColor: string;
  name: string;
  product: string;
  date: string;
  amount: number;
  status: "PAID" | "PENDING" | "REFUND";
};

export type RevenueMonth = {
  label: string;
  /** Heights i pixels per stack (matcher mockup) */
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  current?: boolean;
};

export type CategoryBreakdown = {
  label: string;
  sublabel: string;
  pct: number;
  amountKr: string;
  color: string;
};

export const HERO_STATS = {
  monthLabel: "April 2025 · måned-til-dato",
  grossKr: 184_600,
  yoyPct: 18,
  copy:
    "Sterk april drevet av Tour Camp-pre-salg, økt junior-pakke og stabilt flow på 1:1-coaching. Premium 360° topper margin-ranking — 3 solgt denne måneden.",
  cards: [
    { label: "Brutto · april", value: "184 600", suffix: "kr", delta: "+18 % YoY", down: false },
    { label: "Netto etter fee", value: "175 800", suffix: "kr", delta: "−4.8 % platform", down: false },
    { label: "Refusjoner", value: "2 400", suffix: "kr", delta: "2 saker", down: true },
    { label: "Utestående", value: "14 800", suffix: "kr", delta: "3 fakturaer", down: false },
  ],
};

export const PAYOUT = {
  amountKr: "88 200 kr",
  when: "Fredag 3. mai · 09:00 · 14 transaksjoner",
  gross: "92 400 kr",
  stripeFee: "−2 100 kr",
  refunds: "−2 100 kr",
  status: "SCHEDULED",
};

export const REVENUE_MONTHS: RevenueMonth[] = [
  { label: "MAI", s1: 38, s2: 18, s3: 10, s4: 8 },
  { label: "JUN", s1: 46, s2: 22, s3: 12, s4: 14 },
  { label: "JUL", s1: 56, s2: 24, s3: 14, s4: 30 },
  { label: "AUG", s1: 42, s2: 20, s3: 10, s4: 24 },
  { label: "SEP", s1: 36, s2: 16, s3: 10, s4: 6 },
  { label: "OKT", s1: 32, s2: 14, s3: 18, s4: 4 },
  { label: "NOV", s1: 28, s2: 10, s3: 22, s4: 0 },
  { label: "DES", s1: 34, s2: 14, s3: 24, s4: 0 },
  { label: "JAN", s1: 36, s2: 18, s3: 18, s4: 0 },
  { label: "FEB", s1: 42, s2: 22, s3: 14, s4: 6 },
  { label: "MAR", s1: 48, s2: 28, s3: 14, s4: 14 },
  { label: "APR", s1: 58, s2: 36, s3: 18, s4: 24, current: true },
];

export const TRANSACTIONS: Transaction[] = [
  { initials: "MN", avatarColor: "#6BB1FF", name: "Markus Nordby", product: "SESONGPAKKE 10X", date: "28. APR", amount: 10_800, status: "PAID" },
  { initials: "SA", avatarColor: "#C99CF3", name: "Sofie Aas", product: "VIDEO-ANALYSE", date: "28. APR", amount: 1_350, status: "PAID" },
  { initials: "JT", avatarColor: "#E8B967", name: "Jonas Tvedt", product: "TRACKMAN-TEST", date: "27. APR", amount: 1_950, status: "PAID" },
  { initials: "HJ", avatarColor: "#6FCBA1", name: "Hannah Johansen", product: "SWING 1:1", date: "26. APR", amount: 1_200, status: "PAID" },
  { initials: "AK", avatarColor: "#D1F843", name: "Anders Kristiansen", product: "JUNIOR-PAKKE VÅR", date: "25. APR", amount: 8_900, status: "PAID" },
  { initials: "PR", avatarColor: "#6BB1FF", name: "Per Rasmussen", product: "BANEØKT — AVLYST", date: "25. APR", amount: -1_200, status: "REFUND" },
  { initials: "LK", avatarColor: "#C99CF3", name: "Lars Kvam", product: "SESONGPAKKE 10X", date: "24. APR", amount: 10_800, status: "PENDING" },
  { initials: "SS", avatarColor: "#E8B967", name: "Stine Sand", product: "DAMEGRUPPE · 4X", date: "22. APR", amount: 1_800, status: "PAID" },
  { initials: "EH", avatarColor: "#6FCBA1", name: "Erik Hansen", product: "JUNIOR-PAKKE VÅR", date: "20. APR", amount: 8_900, status: "PAID" },
];

export const CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { label: "1:1 Coaching", sublabel: "56 BOOKINGER · SWING/PUTT/MENTAL", pct: 52, amountKr: "96k", color: "#D1F843" },
  { label: "Pakker", sublabel: "9 SESONGPAKKER + 14 JUNIOR", pct: 28, amountKr: "52k", color: "#6BB1FF" },
  { label: "Test & data", sublabel: "13 ØKTER", pct: 11, amountKr: "21k", color: "#C99CF3" },
  { label: "Camp + gruppe", sublabel: "TOUR CAMP PRE-SALG", pct: 9, amountKr: "16k", color: "#E8B967" },
];
