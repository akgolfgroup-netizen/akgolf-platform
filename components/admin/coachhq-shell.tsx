"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Target,
  CalendarDays,
  Kanban,
  Flag,
  Users,
  LayoutGrid,
  CheckSquare,
  Calendar,
  ClipboardList,
  Dumbbell,
  Zap,
  Wrench,
  MapPin,
  Clock,
  Briefcase,
  Building,
  UsersRound,
  Library,
  Wallet,
  BarChart3,
  TrendingUp,
  UserCog,
  MessageCircle,
  Bot,
  Sparkles,
  Home,
  LayoutDashboard,
  Bell,
  MessageSquare,
  Search,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Operasjon",
    items: [
      { href: "/portal/admin", label: "Dagens fokus", icon: Target },
      { href: "/portal/admin/uke", label: "Denne uken", icon: CalendarDays },
      { href: "/portal/admin/coaching-board", label: "Coaching Board", icon: Kanban },
      { href: "/portal/admin/mission-board", label: "Mission Board", icon: Flag },
    ],
  },
  {
    title: "Personer",
    items: [
      { href: "/portal/admin/spillere", label: "Spillere", icon: Users },
      { href: "/portal/admin/spillere/grid", label: "Oversikt", icon: LayoutGrid },
      { href: "/portal/admin/godkjenninger", label: "Godkjenninger", icon: CheckSquare },
    ],
  },
  {
    title: "Plan",
    items: [
      { href: "/portal/admin/kalender", label: "Kalender", icon: Calendar },
      { href: "/portal/admin/bookinger", label: "Bookinger", icon: ClipboardList },
      { href: "/portal/admin/okter", label: "Økter", icon: Dumbbell },
      { href: "/portal/admin/focus", label: "Focus", icon: Zap },
      { href: "/portal/admin/treningsplan-bygger", label: "Treningsplan-bygger", icon: Wrench },
    ],
  },
  {
    title: "Drift",
    items: [
      { href: "/portal/admin/lokasjoner", label: "Lokasjoner", icon: MapPin },
      { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
      { href: "/portal/admin/tjenester", label: "Tjenester", icon: Briefcase },
      { href: "/portal/admin/fasiliteter", label: "Fasiliteter", icon: Building },
      { href: "/portal/admin/grupper", label: "Grupper", icon: UsersRound },
      { href: "/portal/admin/library", label: "Library", icon: Library },
    ],
  },
  {
    title: "Innsikt",
    items: [
      { href: "/portal/admin/okonomi", label: "Økonomi", icon: Wallet },
      { href: "/portal/admin/rapporter", label: "Rapporter", icon: BarChart3 },
      { href: "/portal/admin/analytics", label: "Analytics", icon: TrendingUp },
    ],
  },
  {
    title: "Team",
    items: [
      { href: "/portal/admin/team", label: "Team", icon: UserCog },
      { href: "/portal/admin/meldinger", label: "Meldinger", icon: MessageCircle },
    ],
  },
  {
    title: "AI",
    items: [
      { href: "/portal/admin/agenter", label: "Agenter", icon: Bot },
      { href: "/portal/admin/ai-assistent", label: "AI-assistent", icon: Sparkles },
    ],
  },
  {
    title: "Annet",
    items: [{ href: "/portal/admin/hub", label: "Hub-oversikt", icon: Home }],
  },
];

const RAIL_ITEMS: { icon: LucideIcon; title: string }[] = [
  { icon: LayoutDashboard, title: "Dashboard" },
  { icon: Users, title: "Spillere" },
  { icon: Calendar, title: "Kalender" },
  { icon: ClipboardList, title: "Bookinger" },
  { icon: TrendingUp, title: "Analytics" },
  { icon: Wallet, title: "Økonomi" },
  { icon: Sparkles, title: "AI" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/portal/admin") return pathname === "/portal/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CoachHQShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div
      className="fixed inset-0 z-50 text-white"
      style={{
        background: "#102B1E",
        display: "grid",
        gridTemplateColumns: "56px 220px 1fr",
        gridTemplateRows: "58px 1fr",
        gridTemplateAreas: '"rail nav top" "rail nav main"',
      }}
    >
      {/* RAIL */}
      <aside
        className="flex flex-col items-center gap-1 border-r border-white/5 bg-sidebar py-3"
        style={{ gridArea: "rail" }}
      >
        <div
          className="mb-4 grid h-8 w-8 place-items-center rounded-lg bg-accent text-[13px] font-extrabold tracking-tight text-ink"
          aria-label="AK Golf"
        >
          AK
        </div>
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              title={item.title}
              className="grid h-9 w-9 place-items-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          );
        })}
      </aside>

      {/* NAV */}
      <nav
        className="flex flex-col gap-0.5 overflow-y-auto border-r border-white/5 bg-sidebar px-3 py-3.5"
        style={{ gridArea: "nav" }}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <div className="px-2.5 pb-1.5 pt-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition " +
                    (active
                      ? "bg-accent/15 text-accent"
                      : "text-white/75 hover:bg-white/5 hover:text-white")
                  }
                >
                  <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.8} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* TOPBAR */}
      <header
        className="flex items-center gap-4 border-b border-white/5 bg-sidebar px-6"
        style={{ gridArea: "top" }}
      >
        <div className="min-w-0">
          <div className="font-inter-tight text-[14px] font-semibold tracking-tight text-white">
            CoachHQ
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
            Admin · AK Golf Academy
          </div>
        </div>
        <div className="ml-6 flex max-w-md flex-1 items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2 text-[12px] text-white/60">
          <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span className="truncate">Søk spillere, økter, bookinger…</span>
          <span className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/55">
            ⌘K
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            title="Notifikasjoner"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <Bell className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            title="Meldinger"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <div className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-accent text-[11px] font-bold text-ink">
            AK
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        className="overflow-y-auto bg-surface text-ink"
        style={{ gridArea: "main" }}
      >
        {children}
      </main>
    </div>
  );
}
