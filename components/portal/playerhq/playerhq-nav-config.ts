import {
  Home,
  Target,
  Calendar,
  ClipboardList,
  CalendarCheck,
  User,
  Sparkles,
  BarChart3,
  FlagTriangleRight,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface PlayerHQNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface PlayerHQNavSection {
  label: string;
  items: PlayerHQNavItem[];
}

/**
 * PlayerHQ-navigasjon — fire seksjoner per design-mockup a1-min-profil.html.
 * Brand Guide V2.0.
 *
 * Synlighet styres av lib/portal/feature-flags.ts.
 */
export const PLAYERHQ_NAV: PlayerHQNavSection[] = [
  {
    label: "Spill",
    items: [
      { href: "/portal", label: "Hjem", icon: Home },
      { href: "/portal/min-plan", label: "Min plan", icon: Target },
    ],
  },
  {
    label: "Kalender",
    items: [
      {
        href: "/portal/treningsplan",
        label: "Treningsplanlegger",
        icon: Calendar,
      },
      {
        href: "/portal/treningsplan/uke",
        label: "Treningsplan",
        icon: ClipboardList,
      },
      { href: "/portal/bookinger", label: "Bookinger", icon: CalendarCheck },
    ],
  },
  {
    label: "Min side",
    items: [
      { href: "/portal/profil", label: "Profil", icon: User },
      { href: "/portal/ai-coach", label: "AI Coach", icon: Sparkles },
      { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
    ],
  },
  {
    label: "På banen",
    items: [
      { href: "/portal/runde", label: "Runde", icon: FlagTriangleRight },
      { href: "/portal/bag", label: "Bag", icon: Briefcase },
    ],
  },
];

/**
 * Flatten alle items — for icon-rail og aktiv-matching.
 */
export const PLAYERHQ_ALL_ITEMS: PlayerHQNavItem[] = PLAYERHQ_NAV.flatMap(
  (section) => section.items,
);

/**
 * Returner aktiv nav-item basert på pathname.
 */
export function getActivePlayerHQItem(
  pathname: string,
): PlayerHQNavItem | undefined {
  return PLAYERHQ_ALL_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/portal" && pathname.startsWith(`${item.href}/`)),
  );
}
