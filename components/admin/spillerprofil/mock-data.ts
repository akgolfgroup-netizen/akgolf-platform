import type {
  ActivityRow,
  CoachNote,
  EquipmentRow,
  GoalRow,
  KpiBlock,
  MoodLevel,
  MoodLog,
  PaymentRow,
  PlayerHero,
  SgRow,
  SignalCard,
  UpcomingItem,
} from "./types";

// TODO: erstatt med ekte Prisma-data via spillerId.
// Fra og med Sprint 2 hentes hero/HCP/SG fra User + UnifiedSkillIndex + RoundStats.
export const MOCK_HERO: PlayerHero = {
  initials: "SH",
  name: "Sofie Holm",
  club: "Asker GK",
  age: 24,
  memberSince: "Medlem siden 2024",
  handle: "sofie.holm",
  status: "Performance · Aktiv",
  hcp: 4.2,
  hcpDelta: -0.6,
  sgPerRound: 0.42,
  sessionsLast30Days: 22,
  streakDays: 14,
  activeGoals: 3,
};

export const MOCK_KPIS: KpiBlock[] = [
  { label: "HCP", value: "4.2", trend: "up", trendLabel: "↘ −0.6" },
  { label: "SG / runde", value: "+0.42", trend: "up", trendLabel: "↗" },
  { label: "Aktivitet 30d", value: "22", subText: "økter" },
  { label: "Streak", value: "14d" },
];

export const MOCK_KPIS_SUMMARY: KpiBlock[] = [
  { label: "HCP", value: "4.2", trend: "up", trendLabel: "↘ −0.6" },
  { label: "SG / runde", value: "+0.42", trend: "up", trendLabel: "↗ +0.18" },
  { label: "Aktivitet 30d", value: "22", subText: "økter" },
  { label: "Score-snitt", value: "73.8", trend: "up", trendLabel: "↘ −1.2" },
];

export const MOCK_SG: SgRow[] = [
  { label: "Off the tee", value: 0.18 },
  { label: "Approach", value: 0.08 },
  { label: "Around green", value: -0.1 },
  { label: "Putting", value: 0.26 },
];

export const MOCK_GOALS: GoalRow[] = [
  {
    name: "HCP under 3.5",
    meta: "Deadline 12 mai · 4.2 → 3.5",
    percent: 78,
    color: "accent",
  },
  {
    name: "SG short-game +0.6",
    meta: "+0.42 → +0.60 · på sporet",
    percent: 70,
    color: "success",
  },
  {
    name: "Kvalifisert NM jr.",
    meta: "Trenger 1 turneringsrunde til",
    percent: 62,
    color: "info",
  },
];

export const MOCK_ACTIVITY: ActivityRow[] = [
  {
    date: "28 apr · 07:00",
    kind: "session",
    title: "Driver-økt · Driving Range",
    meta: "45 MIN · BAY 4 · TRACKMAN · ANDERS K.",
    tag: { label: "Fullført", tone: "success" },
  },
  {
    date: "26 apr · 13:00",
    kind: "round",
    title: "Klubbrunde · 18 hull",
    meta: "76 (+4) · SG +0.51 · PR PUTT",
    tag: { label: "★ PR", tone: "accent" },
  },
  {
    date: "25 apr · 09:30",
    kind: "note",
    title: "Notat fra coach",
    meta: "«Stødig kontakt på 7-jern, fortsett tempo-fokus.»",
    tag: { label: "Anders K.", tone: "neutral" },
  },
  {
    date: "24 apr · 16:00",
    kind: "session",
    title: "Putting-økt · Putting Green",
    meta: "60 MIN · 3-fots-drill · 84% inn",
    tag: { label: "Fullført", tone: "success" },
  },
  {
    date: "22 apr · 14:30",
    kind: "round",
    title: "Klubbrunde · 9 hull",
    meta: "38 (+2) · SG +0.32",
    tag: { label: "−", tone: "neutral" },
  },
  {
    date: "20 apr · 10:00",
    kind: "session",
    title: "Bunker-økt · Studio 2",
    meta: "30 MIN · 6 typer lies · video",
    tag: { label: "Fullført", tone: "success" },
  },
];

export const MOCK_ACTIVITY_FULL: ActivityRow[] = [
  ...MOCK_ACTIVITY,
  {
    date: "22 apr · 11:00",
    kind: "payment",
    title: "Bunker-tillegg betalt",
    meta: "+450 KR · STRIPE",
  },
  {
    date: "18 apr · 08:00",
    kind: "session",
    title: "Iron-økt · Performance Studio",
    meta: "60 MIN · 5–9-jern · TRACKMAN",
    tag: { label: "Fullført", tone: "success" },
  },
];

export const MOCK_COACH_NOTES: CoachNote[] = [
  {
    date: "25 APR",
    coach: "Anders K.",
    body: "«Stødig kontakt på 7-jern, fortsett tempo-fokus. Putting-drill 3-fot 84% inn — bra.»",
  },
  {
    date: "22 APR",
    coach: "Anders K.",
    body: "«Bunker-økt: 6 typer lies. Trenger flere reps fra under-plante. Booket 30 min ekstra neste uke.»",
  },
];

// 30 dager mood, 0 = ingen data, 4 = topp
export const MOCK_MOOD_DAYS: MoodLevel[] = [
  3, 4, 3, 2, 3, 3, 2, 4, 3, 3, 4, 3, 3, 2, 1, 2, 3, 4, 4, 3, 3, 4, 3, 4, 4, 3,
  3, 4, 4, 3,
];

export const MOCK_MOOD_LOGS: MoodLog[] = [
  {
    date: "28 APR",
    context: "DRIVER-ØKT",
    body: "«Følte meg trygg på tempo, fokus var lett.»",
    tags: [
      { label: "Trygg", tone: "up" },
      { label: "Fokusert", tone: "up" },
    ],
  },
  {
    date: "26 APR",
    context: "KLUBBRUNDE",
    body: "«Litt nervøs på første tee, satte meg etter hull 4.»",
    tags: [
      { label: "Nervøs", tone: "warn" },
      { label: "Konsentrert", tone: "neutral" },
    ],
  },
  {
    date: "22 APR",
    context: "BUNKER",
    body: "«Frustrert i starten, men løsnet etterhvert.»",
    tags: [
      { label: "Frustrert", tone: "warn" },
      { label: "Tålmodig", tone: "up" },
    ],
  },
];

export const MOCK_PRE_ROUND = [
  { label: "5 min visualisering", tone: "neutral" as const },
  { label: "10 min full sving", tone: "neutral" as const },
  { label: "10 min wedges", tone: "neutral" as const },
  { label: "15 putts (3, 6, 10 fot)", tone: "neutral" as const },
  { label: "3 dyptpust før første tee", tone: "up" as const },
];

export const MOCK_EQUIPMENT: EquipmentRow[] = [
  { category: "Driver", item: "TaylorMade Stealth 2 · 9°", spec: "FUJIKURA VENTUS BLACK 6S" },
  { category: "3-wood", item: "TaylorMade Stealth · 15°", spec: "FUJIKURA VENTUS 7S" },
  { category: "Hybrid", item: "Titleist TSi3 · 21°", spec: "PROJECT X HZRDUS BLACK" },
  { category: "Jern 4–PW", item: "Mizuno JPX 923 Tour", spec: "DG TOUR ISSUE X100" },
  { category: "Wedges", item: "Vokey SM10 · 50°/54°/58°", spec: "DG WEDGE" },
  { category: "Putter", item: "Scotty Cameron Phantom X 5.5", spec: "34\" · GOLF PRIDE PRO ONLY" },
  { category: "Ball", item: "Titleist Pro V1x", spec: "SISTE INNKJØP 12 APR" },
];

export const MOCK_PAYMENTS: PaymentRow[] = [
  { description: "Performance Plus · april", reference: "FAKTURA #2025-082", date: "01 APR", amount: 2490 },
  { description: "Bunker-tillegg · 30 min", reference: "SUPPLEMENT", date: "22 APR", amount: 450 },
  { description: "Performance Plus · mars", reference: "FAKTURA #2025-068", date: "01 MAR", amount: 2490 },
  { description: "TrackMan-pakke 10x", reference: "PAKKE · 8 igjen", date: "15 FEB", amount: 1890 },
  { description: "Performance Plus · februar", reference: "FAKTURA #2025-044", date: "01 FEB", amount: 2490 },
];

export const MOCK_SIGNALS: SignalCard[] = [
  {
    tone: "up",
    title: "3 PR siste 30 dager",
    when: "26 APR",
    body: "Sofie har slått PR på score, putts/runde og SG-putting siste 4 uker. Foreslå turneringsmål — hun er klar.",
    primaryAction: "Sett turneringsmål",
    secondaryAction: "Avvis",
  },
  {
    tone: "warn",
    title: "Around-green nå svakeste ledd",
    when: "25 APR",
    body: "Chip- og pitch-volum er lavt. Snitt SG around-green har droppet til −0.10. Anbefal short-game-blokk i 2 uker før klubbmesterskapet.",
    primaryAction: "Lag short-game-plan",
    secondaryAction: "Snooze 7d",
  },
];

export const MOCK_UPCOMING: UpcomingItem[] = [
  {
    date: "Tirsdag 30. apr · 14:00",
    meta: "PERFORMANCE STUDIO · 60 MIN · ANDERS K.",
    highlight: true,
  },
  {
    date: "Lørdag 4. mai · 09:00",
    meta: "KLUBBMESTERSKAP · 18 HULL",
    highlight: false,
  },
];
