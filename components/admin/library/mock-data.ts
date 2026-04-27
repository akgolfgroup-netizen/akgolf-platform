// TODO: koble til ekte data
// - resources: prisma.libraryResource.findMany med tags og kategorier
// - usage stats: bookmark count, share count, view count

export type ResourceCard = {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  isVideo: boolean; // play-icon vs file-text-icon
  views: number;
  saves: number; // bookmark or download
  iconType: "bookmark" | "download";
  age: string;
};

export const MOCK_RESOURCES: ResourceCard[] = [
  {
    id: "drill-driver",
    type: "DRILL",
    category: "LONG-GAME",
    title: "Alignment-stick gate · driver",
    description:
      "Gate-bredden styres etter spillerens nivå. Brukes 2–4 uker for å lukke spin-axis.",
    tags: ["DRIVER", "SPIN-AXIS", "ELITE"],
    duration: "04:32",
    isVideo: true,
    views: 18,
    saves: 5,
    iconType: "bookmark",
    age: "3 DAGER",
  },
  {
    id: "video-quintic",
    type: "VIDEO",
    category: "PUTTING",
    title: "Quintic putting-test forklart",
    description:
      "Hva forteller stroke-konsistens? Erik bryter ned testen vi tar 2x i året.",
    tags: ["QUINTIC", "STROKE", "TEST"],
    duration: "12:08",
    isVideo: true,
    views: 34,
    saves: 11,
    iconType: "bookmark",
    age: "1 UKE",
  },
  {
    id: "pdf-sg",
    type: "PDF",
    category: "ARTIKKEL",
    title: "Strokes Gained · på norsk",
    description:
      "Akademiets korte intro til SG-rammeverket. Forklaringer + eksempler fra norsk junior-golf.",
    tags: ["SG", "BEGYNNER", "FORELDRE-OK"],
    duration: "8 SIDER",
    isVideo: false,
    views: 22,
    saves: 9,
    iconType: "download",
    age: "2 UKE",
  },
  {
    id: "drill-wedge",
    type: "DRILL",
    category: "SHORT-GAME",
    title: "Wedge ¾-swing klokke",
    description:
      "PW/GW/SW på 50/75/100 m med klokke-trigger. Anne (TPI) viser kropps-rotasjon.",
    tags: ["WEDGE", "GAPPING", "MELLOM"],
    duration: "06:18",
    isVideo: true,
    views: 15,
    saves: 4,
    iconType: "bookmark",
    age: "3 UKER",
  },
  {
    id: "video-mental",
    type: "VIDEO",
    category: "MENTAL",
    title: "Pre-shot routine · samtale m/ Marte",
    description:
      "Marte Sørli (mental) snakker om rutiner som tåler press på siste 4 hull.",
    tags: ["MENTAL", "PRESS", "RUTINE"],
    duration: "15:47",
    isVideo: true,
    views: 12,
    saves: 7,
    iconType: "bookmark",
    age: "4 UKER",
  },
  {
    id: "drill-tpi",
    type: "DRILL",
    category: "FYSISK",
    title: "TPI mobilitet · 20-min basis",
    description:
      "Daglig mobilitet — hofter, skuldre, T-spine. Anne demonstrerer hver bevegelse.",
    tags: ["TPI", "HJEMME", "FORE"],
    duration: "20 MIN",
    isVideo: true,
    views: 28,
    saves: 14,
    iconType: "bookmark",
    age: "1 MND",
  },
];

export type SidebarItem = {
  label: string;
  count?: number;
  active?: boolean;
};

export const TYPE_FILTERS: SidebarItem[] = [
  { label: "Alle", count: 142, active: true },
  { label: "Video", count: 56 },
  { label: "Drills", count: 28 },
  { label: "PDF", count: 18 },
  { label: "Artikler", count: 40 },
];

export const CATEGORY_FILTERS: SidebarItem[] = [
  { label: "Long-game", count: 38 },
  { label: "Short-game", count: 26 },
  { label: "Putting", count: 31 },
  { label: "Mental", count: 14 },
  { label: "Fysisk", count: 19 },
];

export const LEVEL_FILTERS: SidebarItem[] = [
  { label: "Begynner" },
  { label: "Mellom" },
  { label: "Avansert" },
];

export const AUTHOR_FILTERS: SidebarItem[] = [
  { label: "Erik Solheim" },
  { label: "Anne Rud · TPI" },
  { label: "PGA / ekstern" },
];
