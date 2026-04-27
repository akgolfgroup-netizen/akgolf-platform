// Grid-kort i gruppen "Trenger handling" (D6).
// TODO: erstatt med ekte data fra getPlayerGroups() server action.

import type { PlayerCard } from "./types";

export const ALERT_CARDS: PlayerCard[] = [
  {
    id: "g-emma",
    initials: "EL",
    avatarColor: "#F49283",
    fullName: "Emma Lien",
    metaLine: "HCP 16.4 · Pro plan",
    flag: "alert",
    pills: [
      { label: "Inaktiv 16d", tone: "coral" },
      { label: "Pro plan", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "16.4" },
      { label: "SG 30d", value: "−0.21", tone: "down" },
      { label: "Aktivitet", value: "↓", tone: "down" },
    ],
    sparkPoints:
      "0,12 20,14 40,15 60,13 80,16 100,18 120,20 140,21 160,22 180,23 200,24",
    sparkColor: "#F49283",
    lastSeenLabel: "Sist sett 12. apr",
    ctaLabel: "Send melding",
    ctaIcon: "message",
  },
  {
    id: "g-henrik",
    initials: "HV",
    avatarColor: "#F49283",
    fullName: "Henrik Vold",
    metaLine: "HCP 24.0 · Re-engagement",
    flag: "alert",
    pills: [
      { label: "Inaktiv 21d", tone: "coral" },
      { label: "Lavt engasjement", tone: "amber" },
    ],
    stats: [
      { label: "HCP", value: "24.0" },
      { label: "Runder 30d", value: "0" },
      { label: "Score", value: "−", tone: "down" },
    ],
    sparkPoints:
      "0,16 20,16 40,17 60,18 80,20 100,22 120,23 140,24 160,24 180,24 200,24",
    sparkColor: "#F49283",
    lastSeenLabel: "Sist sett 7. apr",
    ctaLabel: "Plan ny økt",
    ctaIcon: "calendar-plus",
  },
  {
    id: "g-lars",
    initials: "LB",
    avatarColor: "#E8B967",
    fullName: "Lars Berg",
    metaLine: "HCP 12.0 · Pro plan",
    flag: "warn",
    pills: [
      { label: "SG synker", tone: "amber" },
      { label: "Pro plan", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "12.0" },
      { label: "SG 30d", value: "−0.42", tone: "down" },
      { label: "Aktivitet", value: "8" },
    ],
    sparkPoints:
      "0,8 20,9 40,10 60,12 80,14 100,16 120,18 140,18 160,19 180,20 200,21",
    sparkColor: "#E8B967",
    lastSeenLabel: "Sist sett 25. apr",
    ctaLabel: "Plan justering",
    ctaIcon: "zap",
  },
  {
    id: "g-camilla",
    initials: "CR",
    avatarColor: "#C896E8",
    fullName: "Camilla Ruud",
    metaLine: "HCP 15.3 · Junior",
    flag: "warn",
    pills: [
      { label: "Mot mål: HCP 14", tone: "amber" },
      { label: "Junior", tone: "violet" },
    ],
    stats: [
      { label: "HCP", value: "15.3" },
      { label: "SG 30d", value: "+0.05" },
      { label: "Aktivitet", value: "6" },
    ],
    sparkPoints:
      "0,15 20,14 40,14 60,13 80,13 100,13 120,12 140,12 160,12 180,11 200,11",
    sparkColor: "#E8B967",
    lastSeenLabel: "Sist sett 26. apr",
    ctaLabel: "Booket 02. mai",
    ctaIcon: "calendar-check",
  },
  {
    id: "g-markus",
    initials: "ME",
    avatarColor: "#6FB3FF",
    fullName: "Markus Eide",
    metaLine: "HCP 18.7 · Pro plan",
    flag: "warn",
    pills: [
      { label: "Pågår nå", tone: "lime" },
      { label: "Plateau 6 uker", tone: "amber" },
    ],
    stats: [
      { label: "HCP", value: "18.7" },
      { label: "SG 30d", value: "+0.02" },
      { label: "Aktivitet", value: "14" },
    ],
    sparkPoints:
      "0,12 20,12 40,11 60,12 80,12 100,12 120,12 140,12 160,12 180,12 200,12",
    sparkColor: "#E8B967",
    lastSeenLabel: "Trener nå · 32 min igjen",
    ctaLabel: "Live",
    ctaIcon: "circle-dot",
  },
  {
    id: "g-tor",
    initials: "TS",
    avatarColor: "#E8B967",
    fullName: "Tor Solberg",
    metaLine: "HCP 17.1 · Klubbrunder",
    flag: "warn",
    pills: [
      { label: "Inkonsekvent", tone: "amber" },
      { label: "Klubbrunder", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "17.1" },
      { label: "SG 30d", value: "−0.08", tone: "down" },
      { label: "Aktivitet", value: "5" },
    ],
    sparkPoints:
      "0,10 20,15 40,8 60,18 80,12 100,16 120,9 140,17 160,11 180,15 200,13",
    sparkColor: "#E8B967",
    lastSeenLabel: "Sist sett 24. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-anne",
    initials: "AM",
    avatarColor: "#6FCBA1",
    fullName: "Anne Moen",
    metaLine: "HCP 22.8 · Ny spiller",
    flag: "warn",
    pills: [
      { label: "Ny 12d", tone: "green" },
      { label: "Trenger plan", tone: "amber" },
    ],
    stats: [
      { label: "HCP", value: "22.8" },
      { label: "SG 30d", value: "—", tone: "muted" },
      { label: "Aktivitet", value: "2" },
    ],
    sparkPoints: "0,14 60,14 120,14 200,14",
    sparkColor: "rgba(255,255,255,0.25)",
    sparkDashed: true,
    lastSeenLabel: "Onboarding pågår",
    ctaLabel: "Lag plan",
    ctaIcon: "sparkles",
  },
];
