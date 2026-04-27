// TODO: koble til ekte data
// Forelopig mock for D1 Dagens fokus.
// - signals: bruk computeCoachingSignalsForCoach() fra lib/portal/coaching-signals
// - timeline: query Booking der instructorId = coach.userId og startTime er i dag
// - tasks: ny tabell trengs (CoachTask) eller gjenbruk Notification
// - kpis: aggregat fra Player + Booking + Stripe MRR

export type SignalKind = "urgent" | "attention" | "opportunity";

export interface DagensFokusSignal {
  kind: SignalKind;
  cornerLabel: string;
  iconName: "alert-triangle" | "trending-down" | "award";
  count: number;
  unit: string;
  description: string;
  primaryAction: { label: string; iconName: string };
  secondaryAction: { label: string };
}

export interface DagensFokusKpi {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down";
  alert?: boolean;
}

export type TimelineStatus = "done" | "live" | "next" | "upcoming" | "warning";

export interface TimelineEntry {
  time: string;
  duration: string;
  title: string;
  status: TimelineStatus;
  statusLabel: string;
  meta: string;
  iconName: "map-pin" | "zap" | "alert-circle" | "users";
}

export interface TaskEntry {
  id: string;
  label: string;
  context: string;
  done: boolean;
  pillLabel: string;
  pillTone: "success" | "warn" | "neutral";
}

export interface QuickAction {
  iconName: string;
  label: string;
  hint: string;
}

export const MOCK_SIGNALS: DagensFokusSignal[] = [
  {
    kind: "urgent",
    cornerLabel: "Krever handling",
    iconName: "alert-triangle",
    count: 2,
    unit: "spillere",
    description:
      "Emma Lien og Henrik Vold har ikke logget runder pa 14+ dager. Vurder retention-touch.",
    primaryAction: { label: "Send melding", iconName: "message-circle" },
    secondaryAction: { label: "Se profiler" },
  },
  {
    kind: "attention",
    cornerLabel: "Trender ned",
    iconName: "trending-down",
    count: 3,
    unit: "spillere",
    description:
      "SG Putting har falt >0.4 siste 4 uker. Anbefaler short-game-fokus i neste plan.",
    primaryAction: { label: "Bygg plan", iconName: "layers" },
    secondaryAction: { label: "Se data" },
  },
  {
    kind: "opportunity",
    cornerLabel: "Mulighet",
    iconName: "award",
    count: 1,
    unit: "spiller",
    description:
      "Sofie Holm har slatt PR 3 ganger denne maneden. Foresla turneringsmal.",
    primaryAction: { label: "Sett mal", iconName: "trophy" },
    secondaryAction: { label: "Profil" },
  },
];

export const MOCK_KPIS: DagensFokusKpi[] = [
  { label: "Aktive spillere", value: "42", delta: "+3", deltaTone: "up" },
  { label: "Denne uken", value: "28", delta: "okter" },
  { label: "Snitt SG", value: "+0,42", delta: "+0,08", deltaTone: "up" },
  { label: "MRR", value: "68k", delta: "+5%", deltaTone: "up" },
  { label: "Forfalte fakturaer", value: "2", delta: "−", deltaTone: "down", alert: true },
];

export const MOCK_TIMELINE: TimelineEntry[] = [
  {
    time: "07:00",
    duration: "45 min",
    title: "Sofie Holm — Driving Range",
    status: "done",
    statusLabel: "Fullfort",
    meta: "Bay 4 · Driver-fokus · TrackMan logget",
    iconName: "map-pin",
  },
  {
    time: "09:30",
    duration: "60 min",
    title: "Erik Lund — Performance Studio",
    status: "done",
    statusLabel: "Fullfort",
    meta: "Studio 1 · Iron consistency · 3 nye datapoints",
    iconName: "map-pin",
  },
  {
    time: "14:00",
    duration: "60 min",
    title: "Markus Eide — Putting Green",
    status: "live",
    statusLabel: "Pagar na",
    meta: "Lag-styring · Started 14:00 · 32 min igjen",
    iconName: "zap",
  },
  {
    time: "15:30",
    duration: "45 min",
    title: "Henrik Vold — Banecoaching 9 hull",
    status: "next",
    statusLabel: "Neste opp",
    meta: "Hull 1–9 · Course management · Forberedt",
    iconName: "map-pin",
  },
  {
    time: "17:00",
    duration: "60 min",
    title: "Emma Lien — Performance Studio",
    status: "warning",
    statusLabel: "Ikke forberedt",
    meta: "Studio 2 · Fullswing-eval · Ingen plan satt",
    iconName: "alert-circle",
  },
  {
    time: "18:30",
    duration: "90 min",
    title: "Junior Group A — Kveldstrening",
    status: "upcoming",
    statusLabel: "8 pameldte",
    meta: "Driving Range · Aldersgruppe 10–13 · Markus assist",
    iconName: "users",
  },
];

export const MOCK_TASKS: TaskEntry[] = [
  { id: "1", label: "Send treningsplan til Sofie", context: "CRM · 08:14", done: true, pillLabel: "Done", pillTone: "success" },
  { id: "2", label: "Bekreft junior-gruppe pamelding", context: "Booking", done: true, pillLabel: "Done", pillTone: "success" },
  { id: "3", label: "Faktura-utsendelse mai (8 stk)", context: "Stripe", done: true, pillLabel: "Done", pillTone: "success" },
  { id: "4", label: "Forberede Emma kl 17 — fullswing-eval", context: "Forfaller 16:30", done: false, pillLabel: "2t", pillTone: "warn" },
  { id: "5", label: "Skriv oppsummering Erik (kveldsplan)", context: "Coaching", done: false, pillLabel: "I dag", pillTone: "neutral" },
  { id: "6", label: "Godkjenne Markus' nye plan-mal", context: "Team · venter", done: false, pillLabel: "3 d", pillTone: "warn" },
];

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { iconName: "user-plus", label: "Ny spiller", hint: "Onboard" },
  { iconName: "calendar-plus", label: "Ny okt", hint: "Book inn" },
  { iconName: "layers", label: "Ny plan", hint: "Mal-bibliotek" },
  { iconName: "receipt", label: "Ny faktura", hint: "Stripe" },
  { iconName: "message-square-plus", label: "Send melding", hint: "Til spiller" },
  { iconName: "sparkles", label: "AI-sammendrag", hint: "Dagens runder" },
];
