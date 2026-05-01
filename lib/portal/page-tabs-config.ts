/**
 * Page-tabs konfigurasjon — hvilke sub-ruter som vises som tabs pa
 * samle-sider i PlayerHQ. Brukes av <PageTabs>-komponenten.
 *
 * Definert sentralt slik at samme tab-bar vises pa alle sub-ruter
 * (uansett hvilken som er aktiv).
 */

export interface PageTab {
  href: string;
  label: string;
  /** Kortere mobile-label hvis label er for langt */
  mobileLabel?: string;
}

export interface PageTabGroup {
  /** Pathname-prefiksene som skal vise denne tab-bar'en */
  paths: string[];
  /** Tabs i rekkefolge */
  tabs: PageTab[];
}

export const PORTAL_TAB_GROUPS: PageTabGroup[] = [
  {
    paths: ["/portal/min-plan", "/portal/treningsplan"],
    tabs: [
      { href: "/portal/min-plan", label: "Min plan" },
      {
        href: "/portal/treningsplan",
        label: "Treningsplanlegger",
        mobileLabel: "Planlegger",
      },
      {
        href: "/portal/treningsplan/uke",
        label: "Ukesoversikt",
        mobileLabel: "Uke",
      },
    ],
  },
  {
    paths: [
      "/portal/trening",
      "/portal/dagbok",
      "/portal/tester",
      "/portal/kartlegging",
    ],
    tabs: [
      { href: "/portal/trening", label: "Logg" },
      { href: "/portal/dagbok", label: "Dagbok" },
      { href: "/portal/tester", label: "Tester" },
    ],
  },
  {
    paths: ["/portal/turneringer", "/portal/turneringsplan"],
    tabs: [
      {
        href: "/portal/turneringer",
        label: "Mine turneringer",
        mobileLabel: "Mine",
      },
      {
        href: "/portal/turneringsplan",
        label: "Planlegger",
      },
    ],
  },
  {
    paths: [
      "/portal/statistikk",
      "/portal/benchmark",
      "/portal/sammenligning",
      "/portal/analyse",
    ],
    tabs: [
      { href: "/portal/statistikk", label: "Statistikk" },
      { href: "/portal/benchmark", label: "Benchmark" },
      {
        href: "/portal/sammenligning",
        label: "Sammenligning",
        mobileLabel: "Sammenlign",
      },
      { href: "/portal/analyse", label: "AI-analyse", mobileLabel: "Analyse" },
    ],
  },
  {
    paths: ["/portal/ai-coach", "/portal/coaching-historikk"],
    tabs: [
      { href: "/portal/ai-coach", label: "AI Coach" },
      {
        href: "/portal/coaching-historikk",
        label: "Coaching-historikk",
        mobileLabel: "Historikk",
      },
    ],
  },
];

/**
 * Returner aktiv tab-gruppe basert pa pathname, eller null hvis ingen
 * gruppe matcher.
 */
export function getTabGroupForPath(pathname: string): PageTabGroup | null {
  return (
    PORTAL_TAB_GROUPS.find((group) =>
      group.paths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      ),
    ) ?? null
  );
}

/**
 * Returner aktiv tab innen en gruppe basert pa pathname.
 * Match prioriterer eksakt match for kortere prefikser.
 */
export function getActiveTab(
  group: PageTabGroup,
  pathname: string,
): PageTab | null {
  // Sorter tabs etter href-lengde (lengst forst) for a finne mest spesifikk
  // match — slik at /portal/treningsplan/uke matcher "Uke" og ikke
  // "Treningsplanlegger".
  const sorted = [...group.tabs].sort((a, b) => b.href.length - a.href.length);

  return (
    sorted.find(
      (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
    ) ?? null
  );
}
