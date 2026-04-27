/**
 * Delte typer for spillerprofil-kort.
 * Komponentene tar imot ferdig-formet data — sidene leverer mock eller ekte
 * data via TODO-koblinger til Prisma.
 */

export type PlayerHero = {
  initials: string;
  name: string;
  club: string;
  age: number;
  memberSince: string;
  handle: string;
  status: string; // f.eks. "Performance · Aktiv"
  hcp: number;
  hcpDelta: number; // negativ = forbedring (HCP synker)
  sgPerRound: number;
  sessionsLast30Days: number;
  streakDays: number;
  activeGoals: number;
};

export type KpiBlock = {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  subText?: string;
};

export type SgRow = {
  label: string;
  value: number; // f.eks. +0.18 eller -0.10
};

export type GoalRow = {
  name: string;
  meta: string;
  percent: number;
  color?: "accent" | "success" | "info";
};

export type ActivityRow = {
  date: string; // "28 apr · 07:00"
  kind: "session" | "round" | "note" | "payment";
  title: string;
  meta: string;
  tag?: { label: string; tone: "success" | "accent" | "neutral" };
};

export type CoachNote = {
  date: string;
  coach: string;
  body: string;
};

export type MoodLevel = 0 | 1 | 2 | 3 | 4;

export type MoodLog = {
  date: string;
  context: string;
  body: string;
  tags: { label: string; tone: "up" | "warn" | "neutral" }[];
};

export type EquipmentRow = {
  category: string;
  item: string;
  spec: string;
};

export type PaymentRow = {
  description: string;
  reference: string;
  date: string;
  amount: number; // i kroner
};

export type SignalCard = {
  tone: "up" | "warn" | "danger";
  title: string;
  when: string;
  body: string;
  primaryAction?: string;
  secondaryAction?: string;
};

export type UpcomingItem = {
  date: string;
  meta: string;
  highlight: boolean;
};
