import {
  Home,
  Target,
  CalendarCheck,
  User,
  Sparkles,
  BarChart3,
  FlagTriangleRight,
  Briefcase,
  Trophy,
  Dumbbell,
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
 * PlayerHQ-navigasjon — tre seksjoner som folger spillerutviklings-loopen:
 * Planlegg & oversikt → Utfor → Analyse/evaluer.
 *
 * Brand Guide V2.0. Synlighet styres av lib/portal/feature-flags.ts.
 *
 * Struktur (2026-05-01 omorganisering):
 * - PLANLEGG: oversikt + planlegging (Hjem, Min plan, Bookinger, Turneringer)
 * - UTFOR: gjennomforing (Trening, Runde, Utstyr)
 * - EVALUER: analyse (Statistikk, AI Coach)
 *
 * Eksisterende ruter beholdes — Min plan/Utstyr/Turneringer er samle-sider
 * med tabs til underliggende funksjonalitet.
 */
export const PLAYERHQ_NAV: PlayerHQNavSection[] = [
  {
    label: "Planlegg",
    items: [
      { href: "/portal", label: "Hjem", icon: Home },
      { href: "/portal/min-plan", label: "Min plan", icon: Target },
      { href: "/portal/bookinger", label: "Bookinger", icon: CalendarCheck },
      { href: "/portal/turneringer", label: "Turneringer", icon: Trophy },
    ],
  },
  {
    label: "Utfor",
    items: [
      { href: "/portal/trening", label: "Trening", icon: Dumbbell },
      { href: "/portal/runde", label: "Runde", icon: FlagTriangleRight },
      { href: "/portal/utstyr", label: "Utstyr", icon: Briefcase },
    ],
  },
  {
    label: "Evaluer",
    items: [
      { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
      { href: "/portal/ai-coach", label: "AI Coach", icon: Sparkles },
    ],
  },
];

/**
 * Flatten alle items — for icon-rail og aktiv-matching.
 * Inkluderer ogsa "skjulte" sub-ruter slik at active-state fungerer
 * nar bruker er pa f.eks. /portal/trackman (som na ligger under Utstyr).
 */
export const PLAYERHQ_ALL_ITEMS: PlayerHQNavItem[] = [
  ...PLAYERHQ_NAV.flatMap((section) => section.items),
  // Profil — vises i sidebar-footer, ikke i hovedmeny
  { href: "/portal/profil", label: "Profil", icon: User },
];

/**
 * Sub-ruter som mapper til hovedmeny-items (for aktiv-state pa underliggende
 * sider og legacy-URLer som er samlet under nye samle-sider).
 */
const HREF_ALIASES: Record<string, string> = {
  // Min plan samler treningsplan-ruter
  "/portal/treningsplan": "/portal/min-plan",
  "/portal/treningsplan/uke": "/portal/min-plan",
  // Utstyr samler TrackMan + Bag
  "/portal/trackman": "/portal/utstyr",
  "/portal/bag": "/portal/utstyr",
  // Turneringer samler turneringsplan
  "/portal/turneringsplan": "/portal/turneringer",
  // Trening samler dagbok + tester + kartlegging
  "/portal/dagbok": "/portal/trening",
  "/portal/tester": "/portal/trening",
  "/portal/kartlegging": "/portal/trening",
  // Evaluer samler analyse + benchmark + sammenligning
  "/portal/analyse": "/portal/statistikk",
  "/portal/benchmark": "/portal/statistikk",
  "/portal/sammenligning": "/portal/statistikk",
  // AI Coach samler coaching-historikk
  "/portal/coaching-historikk": "/portal/ai-coach",
};

/**
 * Returner aktiv nav-item basert pa pathname, med stotte for alias-mapping
 * (legacy/sub-ruter peker tilbake til samle-side).
 */
export function getActivePlayerHQItem(
  pathname: string,
): PlayerHQNavItem | undefined {
  // Sjekk eksakt match forst
  let resolvedPath = pathname;

  // Sjekk alias for eksakt path eller path-prefix
  for (const [legacy, target] of Object.entries(HREF_ALIASES)) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`)) {
      resolvedPath = target;
      break;
    }
  }

  return PLAYERHQ_ALL_ITEMS.find(
    (item) =>
      resolvedPath === item.href ||
      (item.href !== "/portal" && resolvedPath.startsWith(`${item.href}/`)),
  );
}
