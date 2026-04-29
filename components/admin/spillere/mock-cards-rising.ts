// Grid-kort i gruppene "Stiger" og "Stabile" (D6).
// TODO: erstatt med ekte data fra getPlayerGroups() server action.

import type { PlayerCard } from "./types";

export const RISING_CARDS: PlayerCard[] = [
  {
    id: "g-sofie",
    initials: "SH",
    avatarColor: "#D1F843",
    fullName: "Sofie Holm",
    metaLine: "HCP 4.2 · Performance",
    flag: "up",
    pills: [
      { label: "PR ×3", tone: "lime" },
      { label: "Performance", tone: "green" },
    ],
    stats: [
      { label: "HCP", value: "4.2", small: "↘" },
      { label: "SG 30d", value: "+0.42", tone: "up" },
      { label: "Aktivitet", value: "22" },
    ],
    sparkPoints:
      "0,18 20,17 40,16 60,15 80,13 100,12 120,10 140,9 160,8 180,7 200,5",
    sparkColor: "#D1F843",
    lastSeenLabel: "Sist sett 28. apr",
    ctaLabel: "Sett mål",
    ctaIcon: "target",
  },
  {
    id: "g-erik",
    initials: "EL",
    avatarColor: "#6FCBA1",
    fullName: "Erik Lund",
    metaLine: "HCP 18.5 · Pro plan",
    flag: "up",
    pills: [
      { label: "+1.5 HCP siden Q1", tone: "green" },
      { label: "Pro plan", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "18.5", small: "↘" },
      { label: "SG 30d", value: "+0.31", tone: "up" },
      { label: "Aktivitet", value: "11" },
    ],
    sparkPoints:
      "0,16 20,15 40,14 60,12 80,11 100,10 120,9 140,9 160,8 180,7 200,7",
    sparkColor: "#6FCBA1",
    lastSeenLabel: "Sist sett 28. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-pelle",
    initials: "PK",
    avatarColor: "#6FB3FF",
    fullName: "Pelle K.",
    metaLine: "HCP 9.1 · Performance",
    flag: "up",
    pills: [
      { label: "Stabil framgang", tone: "green" },
      { label: "TrackMan", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "9.1", small: "↘" },
      { label: "SG 30d", value: "+0.19", tone: "up" },
      { label: "Aktivitet", value: "15" },
    ],
    sparkPoints:
      "0,15 20,14 40,13 60,12 80,12 100,11 120,10 140,10 160,9 180,9 200,8",
    sparkColor: "#6FCBA1",
    lastSeenLabel: "Sist sett 27. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-alex",
    initials: "AB",
    avatarColor: "#D1F843",
    fullName: "Alex Brandt",
    metaLine: "HCP 7.4 · Performance",
    flag: "up",
    pills: [
      { label: "Topp 5%", tone: "lime" },
      { label: "Performance", tone: "green" },
    ],
    stats: [
      { label: "HCP", value: "7.4", small: "↘" },
      { label: "SG 30d", value: "+0.28", tone: "up" },
      { label: "Aktivitet", value: "19" },
    ],
    sparkPoints:
      "0,17 20,16 40,15 60,14 80,12 100,11 120,10 140,8 160,8 180,7 200,6",
    sparkColor: "#D1F843",
    lastSeenLabel: "Sist sett 27. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-kari",
    initials: "KS",
    avatarColor: "#6FCBA1",
    fullName: "Kari Strand",
    metaLine: "HCP 14.2 · Pro plan",
    flag: "up",
    pills: [
      { label: "+0.8 HCP 30d", tone: "green" },
      { label: "Pro plan", tone: "default" },
    ],
    stats: [
      { label: "HCP", value: "14.2", small: "↘" },
      { label: "SG 30d", value: "+0.22", tone: "up" },
      { label: "Aktivitet", value: "9" },
    ],
    sparkPoints:
      "0,15 20,14 40,13 60,13 80,12 100,11 120,10 140,10 160,9 180,9 200,8",
    sparkColor: "#6FCBA1",
    lastSeenLabel: "Sist sett 27. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-jonas",
    initials: "JH",
    avatarColor: "#C896E8",
    fullName: "Jonas Hansen",
    metaLine: "HCP 16.8 · Junior",
    flag: "up",
    pills: [
      { label: "Stiger jevnt", tone: "green" },
      { label: "Junior · 14år", tone: "violet" },
    ],
    stats: [
      { label: "HCP", value: "16.8", small: "↘" },
      { label: "SG 30d", value: "+0.15", tone: "up" },
      { label: "Aktivitet", value: "8" },
    ],
    sparkPoints:
      "0,16 20,15 40,15 60,14 80,13 100,13 120,12 140,11 160,11 180,10 200,10",
    sparkColor: "#6FCBA1",
    lastSeenLabel: "Sist sett 26. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
];

export const STABLE_CARDS: PlayerCard[] = [
  {
    id: "g-per",
    initials: "PB",
    avatarColor: "#A5B2AD",
    fullName: "Per Bråten",
    metaLine: "HCP 11.5 · Pro plan",
    flag: "none",
    pills: [{ label: "Pro plan", tone: "default" }],
    stats: [
      { label: "HCP", value: "11.5" },
      { label: "SG 30d", value: "+0.04" },
      { label: "Aktivitet", value: "7" },
    ],
    sparkPoints:
      "0,12 20,13 40,12 60,12 80,13 100,12 120,12 140,12 160,11 180,12 200,12",
    sparkColor: "rgba(255,255,255,0.4)",
    lastSeenLabel: "Sist sett 26. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-mona",
    initials: "MK",
    avatarColor: "#A5B2AD",
    fullName: "Mona Knutsen",
    metaLine: "HCP 19.2 · Klubbrunder",
    flag: "none",
    pills: [{ label: "Klubbrunder", tone: "default" }],
    stats: [
      { label: "HCP", value: "19.2" },
      { label: "SG 30d", value: "−0.02" },
      { label: "Aktivitet", value: "4" },
    ],
    sparkPoints:
      "0,14 20,13 40,14 60,15 80,14 100,13 120,14 140,15 160,14 180,14 200,15",
    sparkColor: "rgba(255,255,255,0.4)",
    lastSeenLabel: "Sist sett 25. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
  {
    id: "g-rune",
    initials: "RJ",
    avatarColor: "#A5B2AD",
    fullName: "Rune Johansen",
    metaLine: "HCP 13.8 · Pro plan",
    flag: "none",
    pills: [{ label: "Pro plan", tone: "default" }],
    stats: [
      { label: "HCP", value: "13.8" },
      { label: "SG 30d", value: "+0.06" },
      { label: "Aktivitet", value: "8" },
    ],
    sparkPoints:
      "0,13 20,12 40,13 60,12 80,13 100,12 120,12 140,11 160,12 180,11 200,11",
    sparkColor: "rgba(255,255,255,0.4)",
    lastSeenLabel: "Sist sett 26. apr",
    ctaLabel: "Profil",
    ctaIcon: "arrow-right",
  },
];
