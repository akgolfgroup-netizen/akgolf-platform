// TODO: koble til ekte data
// - sessions: prisma.booking.findMany med Player + Coach + Location
// - heatmap: aggregat per coach per dag siste 28 dager
// - PR-tags: ny modell SessionAchievement eller flagg pa Booking
// - tags: TrackMan, Video, etc. fra eget felt

export type SessionType = "iron" | "driver" | "short" | "putt" | "bunker" | "tempo";
export type SessionStatus = "done" | "live" | "upcoming" | "cancelled";
export type SessionTag = "PR" | "VIDEO" | "TM" | "FULLFORT";

export interface OkterStat {
  label: string;
  value: string;
  unit?: string;
  tone?: "accent" | "success" | "default";
}

export interface SessionRow {
  id: string;
  date: string; // f.eks "30 apr"
  time: string; // f.eks "09:00"
  type: SessionType;
  iconName:
    | "target"
    | "zap"
    | "circle-dot"
    | "circle"
    | "activity"
    | "user-plus";
  studentInitials: string;
  studentName: string;
  studentSub: string;
  studentColor: string;
  title: string;
  detail: string;
  coach: string;
  location: string;
  duration: string;
  status?: SessionStatus;
  statusLabel?: string;
  tags?: SessionTag[];
}

export interface DayGroup {
  label: string;
  count: number;
  sessions: SessionRow[];
}

export interface HeatRow {
  coach: string;
  // 28 verdier 0–4
  cells: number[];
}

export const OKTER_STATS: OkterStat[] = [
  { label: "Fullført 30d", value: "142" },
  { label: "Planlagt", value: "12" },
  { label: "Snitt-lengde", value: "52", unit: "min" },
  { label: "PR-er 30d", value: "11", tone: "accent" },
  { label: "Utnyttelse", value: "87%", tone: "success" },
];

export const HEAT_ROWS: HeatRow[] = [
  {
    coach: "Anders K.",
    cells: [3, 4, 2, 0, 4, 3, 1, 3, 4, 3, 3, 4, 1, 0, 3, 4, 4, 2, 3, 3, 1, 4, 3, 4, 4, 3, 4, 2],
  },
  {
    coach: "Maria T.",
    cells: [1, 3, 2, 0, 3, 4, 0, 2, 3, 1, 3, 3, 1, 0, 3, 3, 4, 1, 2, 3, 0, 3, 4, 3, 3, 2, 3, 1],
  },
  {
    coach: "Erik S.",
    cells: [2, 2, 3, 0, 3, 1, 0, 3, 4, 2, 2, 3, 0, 0, 4, 3, 3, 2, 3, 4, 1, 3, 3, 3, 2, 3, 4, 1],
  },
  {
    coach: "Lisa M.",
    cells: [0, 2, 0, 0, 3, 0, 1, 0, 2, 0, 0, 3, 0, 0, 2, 0, 3, 0, 0, 3, 1, 0, 2, 0, 0, 2, 3, 0],
  },
];

export const DAY_GROUPS: DayGroup[] = [
  {
    label: "I MORGEN · ONSDAG 1. MAI · PLANLAGT",
    count: 5,
    sessions: [
      {
        id: "s-1",
        date: "01 mai",
        time: "08:00",
        type: "iron",
        iconName: "target",
        studentInitials: "AB",
        studentName: "Alex Brandt",
        studentSub: "HCP 7.4",
        studentColor: "#D1F843",
        title: "Iron-økt",
        detail: "Performance studio · 5–9-jern",
        coach: "Anders K.",
        location: "PERF STUDIO",
        duration: "60 m",
        status: "upcoming",
        statusLabel: "Planlagt",
      },
      {
        id: "s-2",
        date: "01 mai",
        time: "13:00",
        type: "iron",
        iconName: "user-plus",
        studentInitials: "EL",
        studentName: "Emma Lien",
        studentSub: "Re-engasjement",
        studentColor: "#F49283",
        title: "Re-onboarding",
        detail: "Status-sjekk + ny plan",
        coach: "Anders K.",
        location: "STUDIO 2",
        duration: "60 m",
        status: "upcoming",
        statusLabel: "Pending",
      },
    ],
  },
  {
    label: "I DAG · TIRSDAG 30. APRIL",
    count: 6,
    sessions: [
      {
        id: "s-3",
        date: "30 apr",
        time: "09:00",
        type: "tempo",
        iconName: "circle-dot",
        studentInitials: "PK",
        studentName: "Pelle Kvist",
        studentSub: "HCP 9.1",
        studentColor: "#6FB3FF",
        title: "Iron · Pågår",
        detail: "5–7-jern · TrackMan",
        coach: "Anders K.",
        location: "STUDIO 1",
        duration: "60 m",
        status: "live",
        statusLabel: "● Live",
      },
      {
        id: "s-4",
        date: "30 apr",
        time: "07:00",
        type: "driver",
        iconName: "zap",
        studentInitials: "SH",
        studentName: "Sofie Holm",
        studentSub: "HCP 4.2",
        studentColor: "#D1F843",
        title: "Driver-økt",
        detail: "Tempo-fokus · 18 baller",
        coach: "Anders K.",
        location: "RANGE 4",
        duration: "45 m",
        tags: ["FULLFORT", "TM"],
      },
    ],
  },
  {
    label: "MANDAG 28. APRIL",
    count: 5,
    sessions: [
      {
        id: "s-5",
        date: "28 apr",
        time: "16:00",
        type: "putt",
        iconName: "circle",
        studentInitials: "SH",
        studentName: "Sofie Holm",
        studentSub: "HCP 4.2",
        studentColor: "#D1F843",
        title: "Putting-drill",
        detail: "3-fot · 84% inn (PR)",
        coach: "Anders K.",
        location: "PUTTING GREEN",
        duration: "60 m",
        tags: ["PR", "VIDEO"],
      },
      {
        id: "s-6",
        date: "28 apr",
        time: "10:30",
        type: "iron",
        iconName: "target",
        studentInitials: "EL",
        studentName: "Erik Lund",
        studentSub: "HCP 18.5",
        studentColor: "#6FCBA1",
        title: "Iron-økt",
        detail: "7-jern repetition",
        coach: "Anders K.",
        location: "STUDIO 1",
        duration: "45 m",
        tags: ["FULLFORT"],
      },
      {
        id: "s-7",
        date: "28 apr",
        time: "09:30",
        type: "bunker",
        iconName: "activity",
        studentInitials: "CR",
        studentName: "Camilla Ruud",
        studentSub: "HCP 15.3",
        studentColor: "#C896E8",
        title: "Sving-analyse",
        detail: "Slow-mo + drill-plan",
        coach: "Maria T.",
        location: "STUDIO 2",
        duration: "60 m",
        tags: ["FULLFORT", "VIDEO"],
      },
      {
        id: "s-8",
        date: "28 apr",
        time: "15:00",
        type: "short",
        iconName: "circle-dot",
        studentInitials: "TS",
        studentName: "Tor Solberg",
        studentSub: "HCP 17.1",
        studentColor: "#E8B967",
        title: "Chip-økt",
        detail: "10–30 m · 6 baller",
        coach: "Erik S.",
        location: "SHORT GAME",
        duration: "30 m",
        tags: ["FULLFORT"],
      },
    ],
  },
  {
    label: "SØNDAG 27. APRIL",
    count: 3,
    sessions: [
      {
        id: "s-9",
        date: "27 apr",
        time: "10:00",
        type: "driver",
        iconName: "zap",
        studentInitials: "AB",
        studentName: "Alex Brandt",
        studentSub: "HCP 7.4",
        studentColor: "#D1F843",
        title: "Driver-test",
        detail: "Ball-speed PR 168 mph",
        coach: "Anders K.",
        location: "PERF STUDIO",
        duration: "60 m",
        tags: ["PR", "TM"],
      },
    ],
  },
];

export const FILTER_CHIPS = [
  { iconName: "zap", label: "Driver", count: 18 },
  { iconName: "target", label: "Iron", count: 32 },
  { iconName: "circle-dot", label: "Short-game", count: 24 },
  { iconName: "circle", label: "Putting", count: 28 },
  { iconName: "trophy", label: "PR", count: 11 },
] as const;
