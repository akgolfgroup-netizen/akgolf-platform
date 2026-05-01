import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarDays,
  Calendar,
  CheckSquare,
  Bookmark,
  Trophy,
  Building2,
  CreditCard,
  BarChart3,
  FileText,
  UserCog,
  BookOpen,
  Mail,
  Sparkles,
  Bot,
  MessageSquare,
  Package,
  Clock,
  Settings,
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
 * CoachHQ-navigasjon — strukturert i 6 seksjoner som folger coachens
 * arbeidsflyt: I dag (operativt) → Planlegg → Folg opp → Analyse → Drift
 * → Verktoy.
 *
 * Struktur (2026-05-01 omorganisering):
 *
 * I DAG: hva skjer akkurat na (Dagens fokus, Aktive okter, Godkjenninger)
 * PLANLEGG: forberedelse (Kalender, Bookinger, Treningsplaner, Turneringer)
 * FOLG OPP: spillerne (Elever 360, Grupper, Talenter)
 * ANALYSE: evaluer (Statistikk, Okonomi, Rapporter)
 * DRIFT: admin (Tjenester, Anlegg, Team, Library, Tilgjengelighet)
 * VERKTOY: sjeldnere (AI-assistent, Meldinger, E-postmaler, Agenter)
 *
 * Mission Board fjernet fra meny — duplikat av Dagens fokus.
 * Lokasjoner + Fasiliteter samlet under "Anlegg".
 */
export const COACHHQ_NAV: CoachHQNavSection[] = [
  {
    label: "I dag",
    items: [
      { href: "/admin", label: "Dagens fokus", icon: LayoutDashboard, shortcut: "1" },
      { href: "/admin/coaching-board", label: "Aktive okter", icon: Kanban, shortcut: "2" },
      { href: "/admin/godkjenninger", label: "Godkjenninger", icon: CheckSquare, shortcut: "3" },
    ],
  },
  {
    label: "Planlegg",
    items: [
      { href: "/admin/kalender", label: "Kalender", icon: Calendar },
      { href: "/admin/bookinger", label: "Bookinger", icon: CalendarDays, shortcut: "4" },
      { href: "/admin/treningsplan", label: "Treningsplaner", icon: Bookmark, shortcut: "5" },
      { href: "/admin/turneringer", label: "Turneringer", icon: Trophy },
    ],
  },
  {
    label: "Folg opp",
    items: [
      { href: "/admin/elever", label: "Elever", icon: Users, shortcut: "6" },
      { href: "/admin/grupper", label: "Grupper", icon: UserCog },
      { href: "/admin/talent", label: "Talenter", icon: Sparkles },
    ],
  },
  {
    label: "Analyse",
    items: [
      { href: "/admin/analytics", label: "Statistikk", icon: BarChart3 },
      { href: "/admin/okonomi", label: "Okonomi", icon: CreditCard },
      { href: "/admin/rapporter", label: "Rapporter", icon: FileText },
    ],
  },
  {
    label: "Drift",
    items: [
      { href: "/admin/tjenester", label: "Tjenester", icon: Package },
      { href: "/admin/anlegg", label: "Anlegg", icon: Building2 },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/library", label: "Library", icon: BookOpen },
      { href: "/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
    ],
  },
  {
    label: "Verktoy",
    items: [
      { href: "/admin/ai-assistent", label: "AI-assistent", icon: Bot },
      { href: "/admin/meldinger", label: "Meldinger", icon: MessageSquare },
      { href: "/admin/e-postmaler", label: "E-postmaler", icon: Mail },
      { href: "/admin/agenter", label: "Agenter", icon: Settings },
    ],
  },
];

/**
 * Bakoverkompatibel flat liste (gammel API).
 */
export const COACHHQ_PRIMARY_NAV: CoachHQNavItem[] = COACHHQ_NAV.flatMap(
  (section) => section.items,
);

export const COACHHQ_TOOLS_NAV: CoachHQNavItem[] = [];

/**
 * Sub-ruter mappet til hovedmeny-items (for active-state pa underliggende
 * sider og legacy-URLer).
 */
const HREF_ALIASES: Record<string, string> = {
  // Anlegg samler Lokasjoner + Fasiliteter
  "/admin/lokasjoner": "/admin/anlegg",
  "/admin/fasiliteter": "/admin/anlegg",
  // Dagens fokus samler Mission Board (deprecated meny-item)
  "/admin/mission-board": "/admin",
  // Hub er duplikat av Dagens fokus
  "/admin/hub": "/admin",
  // Tilgjengelighet samler Kapasitet
  "/admin/kapasitet": "/admin/tilgjengelighet",
  // Denne uken er sub-side av Kalender
  "/admin/denne-uken": "/admin/kalender",
  // Focus er sub-side av Dagens fokus
  "/admin/focus": "/admin",
  // Notifications er sub-side av meldinger
  "/admin/notifications": "/admin/meldinger",
};

/**
 * Returner aktiv nav-item basert pa pathname.
 */
export function getActiveNavItem(pathname: string): CoachHQNavItem | undefined {
  let resolvedPath = pathname;

  for (const [legacy, target] of Object.entries(HREF_ALIASES)) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`)) {
      resolvedPath = target;
      break;
    }
  }

  return COACHHQ_PRIMARY_NAV.find(
    (item) =>
      resolvedPath === item.href ||
      (item.href !== "/admin" && resolvedPath.startsWith(`${item.href}/`)),
  );
}
