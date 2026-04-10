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
  "clipboard-list": ClipboardList,
  "check-circle": CheckCircle,
  clock: Clock,
  users: Users,
  "file-text": FileText,
  "message-square": MessageSquare,
  sparkles: Sparkles,
  bot: Bot,
  "bar-chart": BarChart3,
  wallet: Wallet,
};

export const MC_NAV_CONFIG: NavGroup[] = [
  {
    label: "Hub",
    items: [
      { href: "/admin", label: "Oversikt", iconName: "target" },
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
    ],
  },
  {
    label: "Elever & Coaching",
    items: [
      { href: "/admin/elever", label: "Elever", iconName: "users" },
      { href: "/admin/okter", label: "Coaching-notater", iconName: "file-text" },
    ],
  },
  {
    label: "Kommunikasjon & AI",
    items: [
      { href: "/admin/meldinger", label: "Meldinger", iconName: "message-square" },
      { href: "/admin/ai-assistent", label: "AI-assistent", iconName: "sparkles" },
      { href: "/admin/agenter", label: "Agenter", iconName: "bot" },
    ],
  },
  {
    label: "Analyse & Okonomi",
    items: [
      { href: "/admin/rapporter", label: "Rapporter", iconName: "bar-chart" },
      { href: "/admin/okonomi", label: "Okonomi", iconName: "wallet" },
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
