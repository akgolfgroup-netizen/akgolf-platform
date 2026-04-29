"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  PLAYERHQ_ALL_ITEMS,
  type PlayerHQNavItem,
} from "./playerhq-nav-config";
import { isPlayerHQRouteVisible } from "@/lib/portal/feature-flags";

interface IconRailProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onSignOut?: () => void;
}

/**
 * 56px ikonrad — matcher public/design-reference/handoff-2026-04-27/screens/a1-min-profil.html.
 *
 * Brand Guide V2.0:
 *   sidebar #0F1F18 · accent #D1F843 · sidebar-muted #A4B1AA
 */
export function IconRail({ user, onSignOut }: IconRailProps) {
  const pathname = usePathname();
  const initials = (user.name ?? user.email ?? "U")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();
  const visibleItems = PLAYERHQ_ALL_ITEMS.filter((item) =>
    isPlayerHQRouteVisible(item.href),
  );

  return (
    <aside
      className="w-14 shrink-0 flex flex-col items-center py-5 border-r"
      style={{
        background: "var(--color-sidebar)",
        borderColor: "var(--color-sidebar-divider)",
      }}
    >
      {/* Logo */}
      <Link
        href="/portal"
        className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-[13px] tracking-tight cursor-pointer select-none"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-sidebar)",
        }}
        title="AK Golf — PlayerHQ"
      >
        AK
      </Link>

      <div
        className="w-6 h-px my-5"
        style={{ background: "var(--color-sidebar-divider)" }}
      />

      <nav className="flex flex-col gap-1.5 flex-1 items-center">
        {visibleItems.map((item) => (
          <IconRailButton key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Logg ut */}
      {onSignOut && (
        <button
          type="button"
          onClick={onSignOut}
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors mb-2"
          style={{ color: "var(--color-sidebar-muted)" }}
          title="Logg ut"
          aria-label="Logg ut"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-sidebar-hover)";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-sidebar-muted)";
          }}
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      )}

      {/* Avatar */}
      <Link
        href="/portal/profil"
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ring-2 font-display font-bold text-[11px]"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-accent)",
          borderColor: "var(--color-sidebar-hover)",
        }}
        title={user.name ?? user.email ?? "Profil"}
        aria-label="Profil"
      >
        {initials}
      </Link>
    </aside>
  );
}

function IconRailButton({
  item,
  pathname,
}: {
  item: PlayerHQNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
      style={{
        background: isActive ? "var(--color-sidebar-hover)" : "transparent",
        color: isActive
          ? "var(--color-accent)"
          : "var(--color-sidebar-muted)",
      }}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--color-sidebar-hover)";
          e.currentTarget.style.color = "#FFFFFF";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-sidebar-muted)";
        }
      }}
    >
      {isActive && (
        <span
          className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r"
          style={{ background: "var(--color-accent)" }}
        />
      )}
      <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.4 : 2} />
    </Link>
  );
}
