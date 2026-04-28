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
  type LucideIcon,
} from "lucide-react";

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
    label: "Operasjon",
    items: [
      { href: "/admin", label: "Dagens fokus", icon: Target },
      { href: "/admin/denne-uken", label: "Denne uken", icon: CalendarDays },
      {
        href: "/admin/coaching-board",
        label: "Coaching Board",
        icon: Kanban,
      },
      { href: "/admin/mission-board", label: "Mission Board", icon: Flag },
    ],
  },
  {
    label: "Personer",
    items: [
      {
        href: "/admin/elever",
        label: "Spillere",
        icon: Users,
        badge: { value: "42", tone: "muted" },
      },
      { href: "/admin/hub", label: "Oversikt", icon: LayoutGrid },
      {
        href: "/admin/godkjenninger",
        label: "Godkjenninger",
        icon: CheckSquare,
        badge: { value: "3", tone: "accent" },
      },
    ],
  },
  {
    label: "Plan",
    items: [
      { href: "/admin/kalender", label: "Kalender", icon: Calendar },
      { href: "/admin/bookinger", label: "Bookinger", icon: ClipboardList },
      { href: "/admin/okter", label: "Økter", icon: Dumbbell },
      { href: "/admin/focus", label: "Focus", icon: Zap },
    ],
  },
];

export function CoachHQDarkNav() {
  const pathname = usePathname();

  return (
    <nav
      className="h-full flex flex-col gap-0.5 py-3.5 px-3 overflow-y-auto border-r"
      style={{
        background: "#0A1F18",
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
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
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {section.label}
          </div>
          {section.items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      ))}
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
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors"
      style={{
        background: isActive ? "rgba(209,248,67,0.14)" : "transparent",
        color: isActive ? "#D1F843" : "rgba(255,255,255,0.75)",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className="w-[15px] h-[15px] shrink-0"
        strokeWidth={1.8}
        style={{ color: isActive ? "#D1F843" : undefined }}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className="px-1.5 rounded-[9px] text-[10px] font-bold"
          style={{
            background:
              item.badge.tone === "muted"
                ? "rgba(255,255,255,0.12)"
                : "#D1F843",
            color:
              item.badge.tone === "muted" ? "rgba(255,255,255,0.75)" : "#0A1F18",
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
