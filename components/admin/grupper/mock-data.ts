// TODO: koble til ekte data
// - prisma.coachingGroup.findMany med roster, schedule, attendance
// - HCP-snitt og belegg aggregert fra siste 6 økter
// - "neste økt" hentes fra prisma.booking + groupId
// - status (UNDER/FULL/OK) avledes fra capacity vs roster

export type GroupLevel = "ELITE" | "JUNIOR" | "DAME" | "KIDS" | "SENIOR" | "CAMP" | "UNDER";

export type GroupAvatar = {
  initials: string;
  color: string;
};

export type GroupCard = {
  id: string;
  name: string;
  level: GroupLevel;
  description: string;
  avatars: GroupAvatar[];
  moreCount: number;
  next: {
    label: string;
    icon: "calendar" | "alert-triangle";
  };
  stats: { label: string; value: string; tone?: "danger" | "success" }[];
  dimmed?: boolean;
};

export const GROUPS_KPIS = [
  { label: "Aktive grupper", value: "8" },
  { label: "Spillere på roster", value: "96" },
  { label: "Økter per uke", value: "12" },
  { label: "Belegg snitt", value: "87%" },
  { label: "Underbooket", value: "2", suffix: "grupper", tone: "alert" as const },
];

export const GROUPS_LIST: GroupCard[] = [
  {
    id: "junior-elite-oslo",
    name: "Junior Elite Oslo",
    level: "ELITE",
    description:
      "Junior 14–18 år · HCP < 12. Kohort 2025-vår. Fellesøkter mandag og torsdag, individuell coaching torsdag formiddag.",
    avatars: [
      { initials: "MN", color: "#6BB1FF" },
      { initials: "SA", color: "#C99CF3" },
      { initials: "JT", color: "#E8B967" },
      { initials: "HJ", color: "#6FCBA1" },
      { initials: "AK", color: "#D1F843" },
    ],
    moreCount: 9,
    next: { label: "Neste · Tor 2. mai 16:00 · Bogstad bay 4–8", icon: "calendar" },
    stats: [
      { label: "Roster", value: "14" },
      { label: "HCP snitt", value: "8.2" },
      { label: "Belegg", value: "93%" },
    ],
  },
  {
    id: "junior-mid",
    name: "Junior Mid 12–14 år",
    level: "JUNIOR",
    description:
      "12-ukers utviklingsprogram. Fokus: full swing-fundament, kort spill, baneetikette. Innsjekk hver torsdag.",
    avatars: [
      { initials: "EH", color: "#6BB1FF" },
      { initials: "LO", color: "#C99CF3" },
      { initials: "PR", color: "#E8B967" },
      { initials: "TM", color: "#6FCBA1" },
    ],
    moreCount: 8,
    next: { label: "Neste · Tor 2. mai 14:00 · Skullerud studio", icon: "calendar" },
    stats: [
      { label: "Roster", value: "12" },
      { label: "HCP snitt", value: "22.4" },
      { label: "Belegg", value: "100%" },
    ],
  },
  {
    id: "damegruppe-bogstad",
    name: "Damegruppe Bogstad",
    level: "DAME",
    description:
      "Onsdager 18:00. Mix av nybegynnere og erfarne. Fokus på fellesskap og baneferdigheter, lett konkurransepreg.",
    avatars: [
      { initials: "IM", color: "#C99CF3" },
      { initials: "AS", color: "#E8B967" },
      { initials: "VO", color: "#6FCBA1" },
      { initials: "KR", color: "#6BB1FF" },
    ],
    moreCount: 12,
    next: { label: "Neste · Ons 1. mai 18:00 · Bogstad range", icon: "calendar" },
    stats: [
      { label: "Roster", value: "16" },
      { label: "HCP snitt", value: "28.7" },
      { label: "Belegg", value: "88%" },
    ],
  },
  {
    id: "kids-academy",
    name: "Kids Academy 8–11 år",
    level: "KIDS",
    description:
      "Lørdager. Spillorientert: små baner, korte avstander, lekøkter. Foreldreinfo sendes hver søndag kveld.",
    avatars: [
      { initials: "OB", color: "#E8B967" },
      { initials: "MA", color: "#6BB1FF" },
      { initials: "EL", color: "#C99CF3" },
    ],
    moreCount: 15,
    next: { label: "Neste · Lør 4. mai 10:00 · Skullerud short course", icon: "calendar" },
    stats: [
      { label: "Roster", value: "18" },
      { label: "Alder", value: "8–11" },
      { label: "Belegg", value: "95%" },
    ],
  },
  {
    id: "senior-bogstad",
    name: "Senior Bogstad",
    level: "SENIOR",
    description:
      "Over 60 år. Tirsdager formiddag. Fokus på rytme, balanse og uten-press-treningsrunder.",
    avatars: [
      { initials: "RH", color: "#6FCBA1" },
      { initials: "JF", color: "#E8B967" },
      { initials: "UH", color: "#C99CF3" },
    ],
    moreCount: 7,
    next: { label: "Neste · Tir 30. apr 11:00 · Bogstad bay 1–4", icon: "calendar" },
    stats: [
      { label: "Roster", value: "10" },
      { label: "HCP snitt", value: "19.8" },
      { label: "Belegg", value: "82%" },
    ],
  },
  {
    id: "beginner-skullerud",
    name: "Beginner-pakken Skullerud",
    level: "UNDER",
    description:
      "Nybegynnerpakke 6 uker. Tirsdag kveld. Bare 4 av 8 påmeldt — vurder ekstra markedsføring eller flytt til onsdag.",
    avatars: [
      { initials: "NF", color: "#6BB1FF" },
      { initials: "SS", color: "#E8B967" },
      { initials: "DA", color: "#C99CF3" },
      { initials: "EW", color: "#6FCBA1" },
    ],
    moreCount: 0,
    next: { label: "Tir 30. apr 19:00 · 4/8 påmeldt", icon: "alert-triangle" },
    stats: [
      { label: "Roster", value: "4/8" },
      { label: "Status", value: "UNDER", tone: "danger" },
      { label: "Belegg", value: "50%", tone: "danger" },
    ],
    dimmed: true,
  },
  {
    id: "tour-camp-sommer",
    name: "Tour Camp Sommer",
    level: "CAMP",
    description:
      "3-dagers intensiv juni 12–14. Tour-spillere & sub-5 HCP. Inkluderer Trackman, on-course coaching, mental.",
    avatars: [
      { initials: "AK", color: "#D1F843" },
      { initials: "MN", color: "#6BB1FF" },
      { initials: "SA", color: "#C99CF3" },
    ],
    moreCount: 5,
    next: { label: "Camp · 12.–14. juni · Bogstad & Holtsmark", icon: "calendar" },
    stats: [
      { label: "Roster", value: "8" },
      { label: "Plasser", value: "8/8" },
      { label: "Status", value: "FULL", tone: "success" },
    ],
  },
  {
    id: "klubbcamp-holtsmark",
    name: "Klubbcamp Holtsmark",
    level: "UNDER",
    description:
      "2-dagers helgekamp ved Holtsmark Open i juli. Bare 5 av 12 påmeldt — push markedsføring uke 18.",
    avatars: [
      { initials: "RH", color: "#6FCBA1" },
      { initials: "JF", color: "#E8B967" },
    ],
    moreCount: 3,
    next: { label: "13.–14. juli · 5/12 påmeldt", icon: "alert-triangle" },
    stats: [
      { label: "Roster", value: "5/12" },
      { label: "Status", value: "UNDER", tone: "danger" },
      { label: "Belegg", value: "42%", tone: "danger" },
    ],
    dimmed: true,
  },
];
