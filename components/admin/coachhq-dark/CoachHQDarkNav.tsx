"use client";

/**
 * CoachHQ Nav — Sprint 0 HQ Foundation.
 * Rail: beholder mork (#061210).
 * Navnliste: lys (#FAFAF7), lime-pill active.
 */

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
  Package,
  MapPin,
  Building2,
  Clock,
  Wallet,
  BarChart3,
  MessageCircle,
  UserCog,
  BookOpen,
  Bot,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface NavUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: { value: string; tone?: "muted" | "accent" };
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    label: "Hub",
    items: [
      { href: "/admin/hub", label: "Hub-oversikt", icon: LayoutGrid },
      { href: "/admin", label: "Dagens fokus", icon: Target },
      { href: "/admin/denne-uken", label: "Denne uken", icon: CalendarDays },
    ],
  },
  {
    label: "Operasjon",
    items: [
      { href: "/admin/coaching-board", label: "Coaching Board", icon: Kanban },
      { href: "/admin/mission-board", label: "Mission Board", icon: Flag },
      { href: "/admin/focus", label: "Focus", icon: Zap },
      { href: "/admin/godkjenninger", label: "Godkjenninger", icon: CheckSquare },
    ],
  },
  {
    label: "Personer",
    items: [
      { href: "/admin/elever", label: "Spillere", icon: Users },
      { href: "/admin/grupper", label: "Grupper", icon: Users },
      { href: "/admin/team", label: "Team", icon: UserCog },
    ],
  },
  {
    label: "Plan",
    items: [
      { href: "/admin/kalender", label: "Kalender", icon: Calendar },
      { href: "/admin/bookinger", label: "Bookinger", icon: ClipboardList },
      { href: "/admin/okter", label: "Okter", icon: Dumbbell },
      { href: "/admin/treningsplan", label: "Treningsplan", icon: ClipboardList },
      { href: "/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
    ],
  },
  {
    label: "Drift",
    items: [
      { href: "/admin/tjenester", label: "Tjenester", icon: Package },
      { href: "/admin/lokasjoner", label: "Lokasjoner", icon: MapPin },
      { href: "/admin/fasiliteter", label: "Fasiliteter", icon: Building2 },
    ],
  },
  {
    label: "Innsikt",
    items: [
      { href: "/admin/okonomi", label: "Okonomi", icon: Wallet },
      { href: "/admin/rapporter", label: "Rapporter", icon: BarChart3 },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Verktoy",
    items: [
      { href: "/admin/meldinger", label: "Meldinger", icon: MessageCircle },
      { href: "/admin/library", label: "Library", icon: BookOpen },
      { href: "/admin/agenter", label: "Agenter", icon: Bot },
      { href: "/admin/ai-assistent", label: "AI Coach", icon: Sparkles },
    ],
  },
];

export function CoachHQDarkNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();
  const initials = (user?.name ?? user?.email ?? "U")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className="h-full flex flex-col py-3.5 px-3 overflow-y-auto border-r"
      style={{
        background: "#FAFAF7",
        borderColor: "#F0EDE5",
      }}
    >
      <Link href="/admin" className="px-2 mb-4 flex items-center gap-2.5">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] tracking-tight shrink-0"
          style={{ background: "#005840", color: "#FFFFFF" }}
        >
          AK
        </span>
        <span className="min-w-0">
          <span
            className="block leading-none mb-0.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9C9990",
            }}
          >
            AK Golf
          </span>
          <span
            className="block text-[13px] font-semibold leading-tight"
            style={{ color: "#0A1F18" }}
          >
            CoachHQ
          </span>
        </span>
      </Link>

      <div className="flex-1 flex flex-col gap-0.5">
        {NAV.map((section, idx) => (
          <div key={section.label}>
            <div
              className="px-2.5 pb-1.5"
              style={{
                paddingTop: idx === 0 ? "4px" : "14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9C9990",
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        ))}
      </div>

      {user && (
        <div
          className="px-2 pt-3 mt-2 border-t flex items-center gap-2.5"
          style={{ borderColor: "#F0EDE5" }}
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
            style={{ background: "#005840", color: "#FFFFFF" }}
            title={user.name ?? user.email ?? "Profil"}
          >
            {initials}
          </span>
          <span
            className="text-[12px] font-medium truncate"
            style={{ color: "#0A1F18" }}
          >
            {user.name ?? "Coach"}
          </span>
        </div>
      )}
    </nav>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] transition-colors"
      style={{
        borderRadius: 12,
        background: isActive ? "rgba(209,248,67,0.30)" : "transparent",
        color: isActive ? "#0A1F18" : "#5E5C57",
        fontWeight: isActive ? 600 : 400,
      }}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className="w-[15px] h-[15px] shrink-0"
        strokeWidth={1.75}
        style={{ color: isActive ? "#005840" : undefined }}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className="px-1.5 rounded-[9px] text-[10px] font-bold"
          style={{
            background:
              item.badge.tone === "muted"
                ? "#EFEDE6"
                : "#D1F843",
            color:
              item.badge.tone === "muted" ? "#5E5C57" : "#0A1F18",
            fontFamily: "'JetBrains Mono', monospace",
            paddingTop: "1px",
            paddingBottom: "1px",
          }}
        >
          {item.badge.value}
        </span>
      )}
    </Link>
  );
}
