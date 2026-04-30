import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarDays,
  Settings,
  Bookmark,
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
 * Lansering 2026-04-30: kun 6 hovedmenypunkter aktive.
 * WIP-ruter (Analyse, Okonomi, Fasiliteter, AI Coach, Innholdsbibliotek,
 * Talenter) er fortsatt aktive paa URL men skjult fra navigasjon til de er
 * klare for lansering.
 */
export const COACHHQ_PRIMARY_NAV: CoachHQNavItem[] = [
  { href: "/admin", label: "Dagens fokus", icon: LayoutDashboard, shortcut: "1" },
  { href: "/admin/elever", label: "Elever", icon: Users, shortcut: "2" },
  { href: "/admin/coaching-board", label: "Aktive økter", icon: Kanban, shortcut: "3" },
  { href: "/admin/bookinger", label: "Bookinger", icon: CalendarDays, shortcut: "4" },
  { href: "/admin/treningsplan", label: "Treningsplaner", icon: Bookmark, shortcut: "5" },
  { href: "/admin/team", label: "Innstillinger", icon: Settings, shortcut: "6" },
];

export const COACHHQ_TOOLS_NAV: CoachHQNavItem[] = [];

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
