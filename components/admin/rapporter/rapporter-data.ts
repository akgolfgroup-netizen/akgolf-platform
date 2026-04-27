// TODO: Hent fra coaching-progress-aggregat (HCP-historikk per spiller, SG-trender, booking-mix)
// Mock-data matcher d21-rapporter.html.

import {
  TrendingUp,
  Users,
  CalendarCheck2,
  CircleDot,
  Target,
  MapPin,
  Package,
  Clock,
  Banknote,
  Receipt,
  RotateCcw,
  FileText,
  Presentation,
  type LucideIcon,
} from "lucide-react";

export type ReportItem = {
  label: string;
  icon: LucideIcon;
  count?: string;
  active?: boolean;
};

export type ReportSection = {
  title: string;
  items: ReportItem[];
};

export const REPORT_SECTIONS: ReportSection[] = [
  {
    title: "Kjør en rapport",
    items: [
      { label: "Coach-effekt", icon: TrendingUp, count: "★", active: true },
      { label: "Spiller-utvikling", icon: Users, count: "42" },
      { label: "Belegg & bookinger", icon: CalendarCheck2 },
      { label: "Putting-segmenter", icon: CircleDot },
      { label: "Long-game shifts", icon: Target },
    ],
  },
  {
    title: "Drift",
    items: [
      { label: "Lokasjon-belegg", icon: MapPin },
      { label: "Tjeneste-mix", icon: Package },
      { label: "No-show-rate", icon: Clock },
    ],
  },
  {
    title: "Økonomi",
    items: [
      { label: "P&L · måned", icon: Banknote },
      { label: "Faktura-status", icon: Receipt },
      { label: "Refusjon-årsaker", icon: RotateCcw },
    ],
  },
  {
    title: "Klubb & styre",
    items: [
      { label: "Kvartalsrapport", icon: FileText },
      { label: "Foreldre-info", icon: Presentation },
    ],
  },
];

export const KPIS = [
  { label: "HCP-snitt før", value: "14.8", small: undefined },
  { label: "HCP-snitt nå", value: "12.2", small: "−2.6" },
  { label: "% spillere ned", value: "76%", small: undefined },
  { label: "Snitt SG · gain", value: "+1.4", small: undefined },
] as const;

export type TopPlayer = {
  initials: string;
  avatarColor: string;
  name: string;
  category: string;
  before: number;
  after: number;
  /** SVG-path for sparkline (60×24) */
  sparkPath: string;
};

export const TOP_PLAYERS: TopPlayer[] = [
  {
    initials: "SA",
    avatarColor: "#C99CF3",
    name: "Sofie Aas",
    category: "JUNIOR ELITE",
    before: 11.0,
    after: 7.7,
    sparkPath: "M0 8 L10 10 L20 8 L30 12 L40 14 L50 18 L60 20",
  },
  {
    initials: "AK",
    avatarColor: "#D1F843",
    name: "Anders Kristiansen",
    category: "JUNIOR ELITE",
    before: 11.4,
    after: 8.4,
    sparkPath: "M0 6 L10 9 L20 7 L30 11 L40 14 L50 16 L60 19",
  },
  {
    initials: "MN",
    avatarColor: "#6BB1FF",
    name: "Markus Nordby",
    category: "JUNIOR ELITE",
    before: 10.0,
    after: 7.4,
    sparkPath: "M0 7 L10 9 L20 9 L30 12 L40 13 L50 17 L60 19",
  },
  {
    initials: "EH",
    avatarColor: "#E8B967",
    name: "Erik Hansen",
    category: "JUNIOR MID",
    before: 11.6,
    after: 9.2,
    sparkPath: "M0 6 L10 9 L20 8 L30 12 L40 14 L50 16 L60 18",
  },
  {
    initials: "JT",
    avatarColor: "#6FCBA1",
    name: "Jonas Tvedt",
    category: "JUNIOR ELITE",
    before: 10.2,
    after: 8.0,
    sparkPath: "M0 8 L10 10 L20 9 L30 12 L40 13 L50 16 L60 17",
  },
];

export type ServiceMixSegment = {
  label: string;
  pct: number;
  color: string;
  /** stroke-dasharray (length out of 490 circumference) */
  dashLen: number;
  dashOffset: number;
};

export const SERVICE_MIX: ServiceMixSegment[] = [
  { label: "1:1 coaching", pct: 52, color: "#D1F843", dashLen: 254, dashOffset: 0 },
  { label: "Pakker", pct: 28, color: "#6BB1FF", dashLen: 137, dashOffset: -256 },
  { label: "Test & data", pct: 11, color: "#C99CF3", dashLen: 54, dashOffset: -394 },
  { label: "Camp + gruppe", pct: 9, color: "#E8B967", dashLen: 44, dashOffset: -450 },
];
