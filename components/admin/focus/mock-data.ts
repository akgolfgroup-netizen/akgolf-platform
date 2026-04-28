// TODO: koble til ekte data
// - dagens 3: Coach AI-utvalg basert pa risiko, plan-momentum og kalender
// - completed: hentes fra audit-log / CoachTask siste 8t
// - tomorrow preview: prisma.booking.findMany for neste dag

export interface FocusItem {
  num: string; // "01"
  tag: string; // "★ Topp prioritet"
  title: string;
  why: string;
  studentInitials: string;
  studentName: string;
  studentColor: string;
  studentMeta: string;
  primaryAction: { label: string; iconName: "send" | "edit-3" | "message-circle" };
  secondaryIcons: ("file-text" | "mic" | "phone" | "clock")[];
}

export interface CompletedItem {
  text: string;
  when: string;
}

export interface TomorrowItem {
  time: string;
  text: string;
}

export const FOCUS_ITEMS: FocusItem[] = [
  {
    num: "01",
    tag: "★ Topp prioritet",
    title: "Send plan til Sofie H. før klubbmesterskap",
    why: "Hun er foran skjema og spiller søndag. Hvis hun går inn uten en konkret plan blir det rotete. 5 minutter nå er bedre enn 25 minutter etter.",
    studentInitials: "SH",
    studentName: "Sofie Holm",
    studentColor: "#D1F843",
    studentMeta: "HCP 4.2",
    primaryAction: { label: "Send", iconName: "send" },
    secondaryIcons: ["file-text", "clock"],
  },
  {
    num: "02",
    tag: "⏱ Tidssensitiv",
    title: "Logg innsikt fra Pelle K. sin LIVE-økt",
    why: "Han er midt i økten nå. Du har 18 min før neste spiller. Skriv 3 setninger om hva som funket — det er gull i 6-måneders-rapporten hans.",
    studentInitials: "PK",
    studentName: "Pelle Kvist",
    studentColor: "#6FB3FF",
    studentMeta: "● LIVE 17:24",
    primaryAction: { label: "Logg", iconName: "edit-3" },
    secondaryIcons: ["mic", "clock"],
  },
  {
    num: "03",
    tag: "⚠ Risiko",
    title: "Personlig melding til Kari S.",
    why: "14 dager siden siste booking. AI flagget henne som drop-out-risiko. En kort melding nå koster 2 min — å miste henne koster 14.000 kr/år.",
    studentInitials: "KS",
    studentName: "Kari Solem",
    studentColor: "#F49283",
    studentMeta: "14 dager",
    primaryAction: { label: "Skriv", iconName: "message-circle" },
    secondaryIcons: ["phone", "clock"],
  },
];

export const COMPLETED_ITEMS: CompletedItem[] = [
  { text: "Sjekket SwingScore-data fra Erik L.", when: "07:42" },
  { text: "Godkjent video-feedback til Mona K.", when: "09:12" },
  { text: "Booking onsdag 14:00 flyttet til torsdag 09:00", when: "11:30" },
  { text: "Faktura sendt til Henrik V.", when: "15:18" },
];

export const TOMORROW_ITEMS: TomorrowItem[] = [
  { time: "08:00 · 60 min", text: "Iron-økt med Alex Brandt" },
  { time: "10:00 · 60 min", text: "Sving-analyse — Kari S." },
  { time: "13:00 · 60 min", text: "Re-onboarding — Emma L." },
];

export const AI_BLURB =
  "Sofie H. er foran skjema og trenger en konkret «next-step» før klubbmesterskapet søndag. Pelle K. har en LIVE-økt nå — bruk de 18 minuttene før neste til å sende en klar oppsummering. Kari S. har vist signaler på drop-out (ingen booking siste 14 dager) og bør få en personlig melding nå mens hun husker deg.";
