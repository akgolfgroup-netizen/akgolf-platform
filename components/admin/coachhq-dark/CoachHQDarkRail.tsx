"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bookmark,
  TrendingUp,
  Wallet,
  Sparkles,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

interface CoachHQDarkRailProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface RailItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: string[];
}

const RAIL_ITEMS: RailItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/elever",
    label: "Spillere",
    icon: Users,
    matchPrefix: ["/admin/elever", "/admin/spillere"],
  },
  { href: "/admin/kalender", label: "Kalender", icon: Calendar },
  { href: "/admin/bookinger", label: "Bookinger", icon: Bookmark },
  { href: "/admin/analytics", label: "Analyse", icon: TrendingUp },
  { href: "/admin/okonomi", label: "Økonomi", icon: Wallet },
  { href: "/admin/agenter", label: "AI", icon: Sparkles },
  { href: "/admin/team", label: "Innstillinger", icon: Settings },
];

export function CoachHQDarkRail({ user }: CoachHQDarkRailProps) {
  const pathname = usePathname();
  const initials = (user.name ?? user.email ?? "AK")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="h-full flex flex-col items-center py-3 gap-1 border-r"
      style={{
        background: "#0A1F18",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div
        className="w-8 h-8 rounded-lg grid place-items-center font-extrabold text-[13px] mb-4"
        style={{
          background: "#D1F843",
          color: "#0A1F18",
          letterSpacing: "-0.04em",
        }}
        title="AK Golf"
        aria-label={initials}
      >
        AK
      </div>

      {RAIL_ITEMS.map((item) => (
        <RailButton key={item.href} item={item} pathname={pathname} />
      ))}

      <div className="flex-1" />

      <Link
        href="/admin/help"
        className="w-9 h-9 rounded-lg grid place-items-center transition-colors"
        style={{ color: "rgba(255,255,255,0.5)" }}
        title="Hjelp"
      >
        <LifeBuoy className="w-[18px] h-[18px]" strokeWidth={1.8} />
      </Link>
    </aside>
  );
}

function RailButton({ item, pathname }: { item: RailItem; pathname: string }) {
  const Icon = item.icon;
  const matches = item.matchPrefix ?? [item.href];
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : matches.some(
          (p) => pathname === p || pathname.startsWith(`${p}/`),
        );

  return (
    <Link
      href={item.href}
      className="w-9 h-9 rounded-lg grid place-items-center transition-colors"
      style={{
        background: isActive ? "rgba(209,248,67,0.10)" : "transparent",
        color: isActive ? "#D1F843" : "rgba(255,255,255,0.5)",
      }}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
    </Link>
  );
}
