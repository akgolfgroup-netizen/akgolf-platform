import {
  Target,
  Zap,
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
  Users,
  FileText,
  MessageSquare,
  Sparkles,
  Bot,
  BarChart3,
  Wallet,
  LayoutDashboard,
  CalendarDays,
  GaugeCircle,
  Mail,
  Bell,
  Building2,
  Trophy,
  ClipboardCheck,
  NotebookPen,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  iconName: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Icon mapping for server-safe rendering
export const MC_ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  zap: Zap,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  "clipboard-list": ClipboardList,
  "clipboard-check": ClipboardCheck,
  "check-circle": CheckCircle,
  clock: Clock,
  users: Users,
  "file-text": FileText,
  "notebook-pen": NotebookPen,
  "message-square": MessageSquare,
  mail: Mail,
  bell: Bell,
  sparkles: Sparkles,
  bot: Bot,
  "bar-chart": BarChart3,
  "gauge-circle": GaugeCircle,
  wallet: Wallet,
  "layout-dashboard": LayoutDashboard,
  "building-2": Building2,
  trophy: Trophy,
  dumbbell: Dumbbell,
};

export const MC_NAV_CONFIG: NavGroup[] = [
  {
    label: "Hub",
    items: [
      { href: "/admin", label: "Oversikt", iconName: "target" },
      { href: "/admin/mission-board", label: "Mission Board", iconName: "layout-dashboard" },
      { href: "/admin/denne-uken", label: "Denne uken", iconName: "calendar-days" },
      { href: "/admin/focus", label: "Focus", iconName: "zap" },
    ],
  },
  {
    label: "Kalender & Bookinger",
    items: [
      { href: "/admin/kalender", label: "Kalender", iconName: "calendar" },
      { href: "/admin/bookinger", label: "Bookinger", iconName: "clipboard-list" },
      { href: "/admin/godkjenninger", label: "Godkjenninger", iconName: "check-circle" },
      { href: "/admin/tilgjengelighet", label: "Tilgjengelighet", iconName: "clock" },
      { href: "/admin/kapasitet", label: "Kapasitet", iconName: "gauge-circle" },
    ],
  },
  {
    label: "Elever & Coaching",
    items: [
      { href: "/admin/coaching-board", label: "Coaching Mission Board", iconName: "layout-dashboard" },
      { href: "/admin/elever", label: "Elever", iconName: "users" },
      { href: "/admin/elever/oversikt", label: "Elev-oversikt", iconName: "bar-chart" },
      { href: "/admin/grupper", label: "Treningsgrupper", iconName: "users" },
      { href: "/admin/okter", label: "Coaching-notater", iconName: "file-text" },
      { href: "/admin/treningsplan", label: "Treningsplaner", iconName: "notebook-pen" },
      { href: "/admin/teknisk-plan", label: "Teknisk Plan", iconName: "dumbbell" },
      { href: "/admin/turneringer", label: "Turneringer", iconName: "trophy" },
    ],
  },
  {
    label: "Kommunikasjon",
    items: [
      { href: "/admin/meldinger", label: "Meldinger", iconName: "message-square" },
      { href: "/admin/e-postmaler", label: "E-postmaler", iconName: "mail" },
      { href: "/admin/notifications", label: "Push-varsler", iconName: "bell" },
    ],
  },
  {
    label: "AI & Agenter",
    items: [
      { href: "/admin/ai-assistent", label: "AI-assistent", iconName: "sparkles" },
      { href: "/admin/agenter", label: "Agenter", iconName: "bot" },
    ],
  },
  {
    label: "Analyse & Okonomi",
    items: [
      { href: "/admin/analytics", label: "Analytics", iconName: "bar-chart" },
      { href: "/admin/okonomi", label: "Okonomi", iconName: "wallet" },
      { href: "/admin/rapporter", label: "Rapporter", iconName: "clipboard-check" },
    ],
  },
  {
    label: "Fasiliteter",
    items: [
      { href: "/admin/fasiliteter", label: "Fasiliteter", iconName: "building-2" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/team", label: "Team og tilgang", iconName: "users" },
    ],
  },
];

// Division configuration
export type Division = "coaching" | "junior" | "gfgk";

export const DIVISIONS: { id: Division; label: string; color: string }[] = [
  { id: "coaching", label: "Coaching", color: "var(--mc-color-coaching)" },
  { id: "junior", label: "Junior Academy", color: "var(--mc-color-junior)" },
  { id: "gfgk", label: "GFGK Junior", color: "var(--mc-color-gfgk)" },
];
