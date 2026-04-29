import type {
  AllocationRow,
  DayColumn,
  LibrarySection,
  PlanGoal,
  WeekTab,
} from "./types";

export const LIBRARY_SECTIONS: LibrarySection[] = [
  {
    id: "putting",
    title: "Drills · Putting",
    drills: [
      {
        id: "gate-15m",
        name: "Gate-drill 1.5m",
        meta: "10 MIN · QUINTIC",
        category: "putting",
      },
      {
        id: "lag-putt",
        name: "Lag-putt klokke",
        meta: "15 MIN · 6M+",
        category: "putting",
      },
    ],
  },
  {
    id: "long",
    title: "Drills · Long-game",
    drills: [
      {
        id: "alignment",
        name: "Alignment-stick gate",
        meta: "20 MIN · DRIVER",
        category: "long",
      },
      {
        id: "tempo-321",
        name: "Tempo-trener 3-2-1",
        meta: "15 MIN · IRONS",
        category: "long",
      },
      {
        id: "9-shot",
        name: "9-shot ladder",
        meta: "25 MIN · ALLE",
        category: "long",
      },
    ],
  },
  {
    id: "short",
    title: "Drills · Short-game",
    drills: [
      {
        id: "wedge-klokke",
        name: "Wedge ¾-swing klokke",
        meta: "20 MIN · 50/75/100M",
        category: "short",
      },
      {
        id: "bunker-ut",
        name: "Bunker · ut og ned",
        meta: "15 MIN · BUNKER",
        category: "short",
      },
    ],
  },
  {
    id: "fysisk",
    title: "Fysisk",
    drills: [
      {
        id: "tpi-mob",
        name: "TPI mobilitet 20-min",
        meta: "HOFTE · SKULDER",
        category: "fysisk",
      },
      {
        id: "styrke-30",
        name: "Styrke · 30-min",
        meta: "UNDERKROPP · CORE",
        category: "fysisk",
      },
    ],
  },
  {
    id: "mental",
    title: "Mental",
    drills: [
      {
        id: "pre-shot",
        name: "Pre-shot routine",
        meta: "10 MIN",
        category: "mental",
      },
    ],
  },
];

export const WEEK_TABS: WeekTab[] = [
  { id: "w1", label: "Uke 1", range: "6.–12. mai", blocks: 12, hours: 8.5 },
  { id: "w2", label: "Uke 2", range: "13.–19. mai", blocks: 10, hours: 7 },
  { id: "w3", label: "Uke 3", range: "20.–26. mai", blocks: 14, hours: 10 },
  {
    id: "w4",
    label: "Uke 4",
    range: "27.–02. juni",
    blocks: 8,
    hours: 6,
    taper: true,
  },
];

export const WEEK_1_DAYS: DayColumn[] = [
  {
    id: "man",
    label: "Man 6.",
    blocks: [
      {
        id: "b1",
        type: "range",
        name: "Range · alignment",
        meta: "45 MIN · DRILL S3",
      },
      { id: "b2", type: "fysisk", name: "TPI mobilitet", meta: "20 MIN" },
    ],
  },
  {
    id: "tir",
    label: "Tir 7.",
    blocks: [
      { id: "b3", type: "putt", name: "Gate 1.5m + lag-putt", meta: "25 MIN" },
      { id: "b4", type: "short", name: "Wedge klokke", meta: "20 MIN" },
    ],
  },
  {
    id: "ons",
    label: "Ons 8.",
    blocks: [{ id: "b5", type: "rest", name: "Rest-dag", meta: "LETT TUR EVT." }],
  },
  {
    id: "tor",
    label: "Tor 9.",
    blocks: [
      {
        id: "b6",
        type: "range",
        name: "Coaching-økt",
        meta: "60 MIN · ERIK · ALIGNMENT",
      },
      { id: "b7", type: "fysisk", name: "Styrke 30-min", meta: "UNDERKROPP" },
    ],
  },
  {
    id: "fre",
    label: "Fre 10.",
    blocks: [
      { id: "b8", type: "range", name: "Tempo 3-2-1", meta: "20 MIN · IRONS" },
      { id: "b9", type: "putt", name: "6m putt fokus", meta: "15 MIN" },
    ],
  },
  {
    id: "lor",
    label: "Lør 11.",
    blocks: [
      {
        id: "b10",
        type: "runde",
        name: "Runde · Bogstad",
        meta: "18 HULL · LOGG SG",
      },
    ],
  },
  {
    id: "son",
    label: "Søn 12.",
    blocks: [
      { id: "b11", type: "short", name: "Bunker ut + ned", meta: "15 MIN" },
      { id: "b12", type: "fysisk", name: "TPI mob.", meta: "20 MIN" },
    ],
  },
];

export const ALLOCATION_ROWS: AllocationRow[] = [
  { label: "Long-game", hours: 2.0, swatch: "#D1F843", pct: 25 },
  { label: "Putting", hours: 0.7, swatch: "#C99CF3", pct: 9 },
  { label: "Short-game", hours: 0.6, swatch: "#6BB1FF", pct: 7.5 },
  { label: "Fysisk", hours: 1.2, swatch: "#E8B967", pct: 15 },
  { label: "På bane", hours: 3.5, swatch: "#6FCBA1", pct: 43.5 },
];

export const PLAN_GOALS: PlanGoal[] = [
  {
    text: "Driver-spredning ↓ 20 %",
    iconName: "target",
    iconColor: "#D1F843",
  },
  {
    text: "6m-putt make % 15 → 22",
    iconName: "circle-dot",
    iconColor: "#C99CF3",
  },
  {
    text: "Klar for Tjuvholmen Open",
    iconName: "trophy",
    iconColor: "#E8B967",
  },
];
