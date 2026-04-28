"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  PLAYERHQ_NAV,
  type PlayerHQNavItem,
} from "./playerhq-nav-config";
import { isPlayerHQRouteVisible } from "@/lib/portal/feature-flags";

interface NameListProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onSignOut?: () => void;
  /** Optional: kalles ved klikk på et nav-item. Brukes for å lukke mobil-drawer. */
  onItemClick?: () => void;
}

/**
 * 220px sidebar — én panel med ikon + tekst per item.
 *
 * Brand Guide V2.0. Filtrerer items basert på feature-flag-set.
 */
export function NameList({ user, onSignOut, onItemClick }: NameListProps) {
  const pathname = usePathname();
  const initials = (user.name ?? user.email ?? "U")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  const sectionsWithVisibleItems = PLAYERHQ_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => isPlayerHQRouteVisible(item.href)),
  })).filter((section) => section.items.length > 0);

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col py-5 border-r"
      style={{
        background: "var(--color-sidebar)",
        color: "#FFFFFF",
        borderColor: "var(--color-sidebar-divider)",
      }}
    >
      {/* Header med logo */}
      <div className="px-4 mb-5 flex items-center gap-2.5">
        <Link
          href="/portal"
          className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-[12px] tracking-tight cursor-pointer select-none shrink-0"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-sidebar)",
          }}
          title="AK Golf — PlayerHQ"
        >
          AK
        </Link>
        <div className="min-w-0">
          <div
            className="text-[10px] font-mono uppercase tracking-[0.18em] leading-none mb-0.5"
            style={{ color: "rgba(255, 255, 255, 0.55)" }}
          >
            AK Golf
          </div>
          <div
            className="text-[13px] font-display font-semibold leading-tight"
            style={{ color: "#FFFFFF" }}
          >
            PlayerHQ
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-3">
        {sectionsWithVisibleItems.map((section) => (
          <div key={section.label}>
            <div className="px-2.5 pb-1">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.16em]"
                style={{ color: "rgba(255, 255, 255, 0.55)" }}
              >
                {section.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NameListLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bunn: avatar + logg ut */}
      <div
        className="px-3 pt-4 mt-2 border-t flex items-center gap-2.5"
        style={{ borderColor: "var(--color-sidebar-divider)" }}
      >
        <Link
          href="/portal/profil"
          className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[10px] shrink-0"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-accent)",
          }}
          title={user.name ?? user.email ?? "Profil"}
          aria-label="Profil"
        >
          {initials}
        </Link>
        <div className="min-w-0 flex-1">
          <div
            className="text-[12px] font-medium truncate"
            style={{ color: "#FFFFFF" }}
          >
            {user.name ?? "Spiller"}
          </div>
        </div>
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors text-white/55 hover:text-white hover:bg-[var(--color-sidebar-hover)]"
            title="Logg ut"
            aria-label="Logg ut"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

function NameListLink({
  item,
  pathname,
  onClick,
}: {
  item: PlayerHQNavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
        isActive
          ? "bg-[var(--color-sidebar-hover)] text-[var(--color-accent)]"
          : "text-white/88 hover:bg-[var(--color-sidebar-hover)] hover:text-white"
      }`}
    >
      <Icon
        className="w-4 h-4 shrink-0"
        strokeWidth={isActive ? 2.4 : 2}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
