import type { MissionCard, MissionSummary } from "./types";

// TODO: koble til ekte data — Mission/Goal + Milestone i Prisma.

export const MOCK_SUMMARY: MissionSummary = {
  active: 12,
  averageProgress: "64%",
  withinDeadline: 5,
  closedQ1: 8,
};

export const MOCK_MISSIONS: MissionCard[] = [
  {
    id: "m1",
    studentName: "Sofie Holm",
    studentInitials: "SH",
    studentSub: "HCP 4.2 · Performance",
    avatarColor: "#D1F843",
    deadline: { variant: "near", label: "Deadline 12 mai" },
    goalTitle: "Kvalifisere til regions-turnering",
    goalSubtitle: "Senke HCP til 3.5 og oppnå snitt SG +0.6 over 5 runder",
    ringPercent: 75,
    ringColor: "#005840",
    glow: true,
    metrics: [
      { label: "HCP", delta: "4.2 → 3.5", percent: 78, color: "#D1F843" },
      { label: "SG", delta: "+0.42 → +0.6", percent: 70, color: "#6FCBA1" },
    ],
    milestones: [
      { label: "Initial-kartlegging fullført", when: "22 mar", done: true },
      { label: "Driver-protokoll iverksatt", when: "05 apr", done: true },
      { label: "3 PR-runder", when: "25 apr", done: true },
      { label: "Kvalifiseringsrunde", when: "10 mai", done: false },
    ],
    primaryAction: { icon: "message-circle", label: "Notat" },
  },
  {
    id: "m2",
    studentName: "Erik Lund",
    studentInitials: "EL",
    studentSub: "HCP 18.5 · Pro plan",
    avatarColor: "#6FB3FF",
    deadline: { variant: "default", label: "Deadline 30 jun" },
    goalTitle: "Bryte HCP 15 før sommer",
    goalSubtitle: "Iron consistency + putting under 30 putts/runde",
    ringPercent: 50,
    ringColor: "#6FCBA1",
    metrics: [
      { label: "HCP", delta: "18.5 → 15.0", percent: 45, color: "#6FCBA1" },
      {
        label: "Putts/runde",
        delta: "33.4 → 30",
        percent: 58,
        color: "#6FB3FF",
      },
    ],
    milestones: [
      { label: "12-ukers plan godkjent", when: "10 feb", done: true },
      { label: "Iron-baseline TrackMan", when: "18 feb", done: true },
      { label: "HCP under 17.0 (mid-check)", when: "15 mai", done: false },
      { label: "Mål-runde 79 eller bedre", when: "25 jun", done: false },
    ],
    primaryAction: { icon: "message-circle", label: "Notat" },
  },
  {
    id: "m3",
    studentName: "Junior Group B",
    studentInitials: "JB",
    studentSub: "8 spillere · 10–13 år",
    avatarColor: "#C896E8",
    deadline: { variant: "near", label: "Deadline 12 mai" },
    goalTitle: "Forberede til regions-turnering juniorer",
    goalSubtitle:
      "Alle 8 skal ha 9-hulls-test fullført + putt-grunnferdighet",
    ringPercent: 68,
    ringColor: "#C896E8",
    metrics: [
      {
        label: "9-hull-test",
        delta: "6/8 fullført",
        percent: 75,
        color: "#C896E8",
      },
      {
        label: "Putt-grunnferdighet",
        delta: "5/8 fullført",
        percent: 62,
        color: "#6FCBA1",
      },
    ],
    milestones: [
      { label: "Kick-off med foreldre", when: "15 mar", done: true },
      {
        label: "Grunnferdigheter (4 stasjoner)",
        when: "10 apr",
        done: true,
      },
      { label: "Påmelding regions-turnering", when: "05 mai", done: false },
      { label: "Turnering", when: "12 mai", done: false },
    ],
    primaryAction: { icon: "users", label: "8 spillere" },
  },
  {
    id: "m4",
    studentName: "Henrik Vold",
    studentInitials: "HV",
    studentSub: "HCP 24.0 · Re-engagement",
    avatarColor: "#F49283",
    deadline: { variant: "passed", label: "14 d inaktiv" },
    goalTitle: "Komme tilbake i rytme",
    goalSubtitle:
      "Logge 3 runder + 2 økter på 4 uker. Lavt-press oppstart.",
    ringPercent: 20,
    ringColor: "#F49283",
    metrics: [
      { label: "Runder", delta: "0/3", percent: 0, color: "#F49283" },
      { label: "Økter", delta: "1/2", percent: 50, color: "#E8B967" },
    ],
    milestones: [
      { label: "Re-engagement-melding sendt", when: "22 apr", done: true },
      { label: "Banecoaching booket man 28", when: "28 apr", done: true },
      { label: "Første runde logget", when: "05 mai", done: false },
      { label: "3-runder-mål", when: "25 mai", done: false },
    ],
    primaryAction: { icon: "message-circle", label: "Følg opp" },
  },
  {
    id: "m5",
    studentName: "Mia Dahl",
    studentInitials: "MD",
    studentSub: "HCP 9.8 · Performance",
    avatarColor: "#6FCBA1",
    deadline: { variant: "default", label: "Deadline 30 sep" },
    goalTitle: "Kvalifisere til klubbmesterskap",
    goalSubtitle:
      "Holde HCP under 9 og spille 3 turneringsrunder før september",
    ringPercent: 40,
    ringColor: "#6FCBA1",
    metrics: [
      { label: "HCP", delta: "9.8 → 9.0", percent: 35, color: "#6FCBA1" },
      {
        label: "Turneringsrunder",
        delta: "1/3",
        percent: 33,
        color: "#D1F843",
      },
    ],
    milestones: [
      { label: "Plan-mal valgt", when: "10 mar", done: true },
      { label: "Første turneringsrunde", when: "12 apr", done: true },
      { label: "HCP under 9.0", when: "15 jun", done: false },
      { label: "Påmelding klubbmesterskap", when: "15 sep", done: false },
    ],
    primaryAction: { icon: "message-circle", label: "Notat" },
  },
  {
    id: "m6",
    studentName: "Lars Berg",
    studentInitials: "LB",
    studentSub: "HCP 12.0 · Pro plan",
    avatarColor: "#E8B967",
    deadline: { variant: "default", label: "Deadline 15 aug" },
    goalTitle: "Iron-distance konsistens",
    goalSubtitle: "Treffe 7-jern innenfor ±3 yards 70%+ på TrackMan",
    ringPercent: 60,
    ringColor: "#E8B967",
    metrics: [
      {
        label: "Treffsone 7-jern",
        delta: "52% → 70%",
        percent: 62,
        color: "#E8B967",
      },
      {
        label: "TrackMan-økter",
        delta: "4/6",
        percent: 67,
        color: "#6FB3FF",
      },
    ],
    milestones: [
      { label: "Baseline 7-jern (52%)", when: "20 mar", done: true },
      { label: "Tempo-protokoll iverksatt", when: "02 apr", done: true },
      { label: "Mid-check (60%+)", when: "10 jun", done: false },
      { label: "Mål 70% treffsone", when: "15 aug", done: false },
    ],
    primaryAction: { icon: "message-circle", label: "Notat" },
  },
];
