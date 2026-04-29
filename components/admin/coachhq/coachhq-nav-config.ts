import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarDays,
  BarChart3,
  Wallet,
  Building2,
  Settings,
  Bookmark,
  Bot,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface CoachHQNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
}

export interface CoachHQNavSection {
  label?: string;
  items: CoachHQNavItem[];
}

/**
 * Flat hovedmeny — 8 items + verktøy.
 * Matcher public/design-reference/coachhq-reference.html.
 */
export const COACHHQ_PRIMARY_NAV: CoachHQNavItem[] = [
  { href: "/admin", label: "Dagens fokus", icon: LayoutDashboard, shortcut: "1" },
  { href: "/admin/elever", label: "Elever", icon: Users, shortcut: "2" },
  { href: "/admin/coaching-board", label: "Aktive økter", icon: Kanban, shortcut: "3" },
  { href: "/admin/bookinger", label: "Bookinger", icon: CalendarDays, shortcut: "4" },
  { href: "/admin/analytics", label: "Analyse", icon: BarChart3, shortcut: "5" },
  { href: "/admin/okonomi", label: "Økonomi", icon: Wallet, shortcut: "6" },
  { href: "/admin/fasiliteter", label: "Fasiliteter", icon: Building2, shortcut: "7" },
  { href: "/admin/team", label: "Innstillinger", icon: Settings, shortcut: "8" },
];

export const COACHHQ_TOOLS_NAV: CoachHQNavItem[] = [
  { href: "/admin/agenter", label: "AI Coach", icon: Bot },
  { href: "/admin/treningsplan", label: "Treningsplaner", icon: Bookmark },
  { href: "/admin/library", label: "Innholdsbibliotek", icon: BookOpen },
  { href: "/admin/talent", label: "Talenter", icon: Sparkles },
];

/**
 * Returner aktiv nav-item basert på pathname.
 */
export function getActiveNavItem(pathname: string): CoachHQNavItem | undefined {
  const all = [...COACHHQ_PRIMARY_NAV, ...COACHHQ_TOOLS_NAV];
  return all.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)),
  );
}
