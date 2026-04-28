"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PLAYERHQ_NAV,
  type PlayerHQNavItem,
} from "./playerhq-nav-config";
import { isPlayerHQRouteVisible } from "@/lib/portal/feature-flags";

/**
 * 200px navnliste — matcher public/design-reference/handoff-2026-04-27/screens/a1-min-profil.html.
 *
 * Brand Guide V2.0. Filtrerer items basert på feature-flag-set.
 */
export function NameList() {
  const pathname = usePathname();

  const sectionsWithVisibleItems = PLAYERHQ_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => isPlayerHQRouteVisible(item.href)),
  })).filter((section) => section.items.length > 0);

  return (
    <aside
      className="w-[200px] shrink-0 flex flex-col py-5 border-r"
      style={{
        background: "var(--color-sidebar)",
        color: "#FFFFFF",
        borderColor: "var(--color-sidebar-divider)",
      }}
    >
      {/* Header */}
      <div className="px-4 mb-4">
        <div
          className="text-[10px] font-mono uppercase tracking-[0.18em] mb-0.5"
          style={{ color: "var(--color-sidebar-muted)" }}
        >
          AK Golf
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-display font-semibold">PlayerHQ</div>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest"
            style={{
              background: "rgba(209, 248, 67, 0.15)",
              color: "var(--color-accent)",
            }}
          >
            spill
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-3">
        {sectionsWithVisibleItems.map((section) => (
          <div key={section.label}>
            <div className="px-2.5 pb-1">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.16em]"
                style={{ color: "var(--color-sidebar-muted)" }}
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
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function NameListLink({
  item,
  pathname,
}: {
  item: PlayerHQNavItem;
  pathname: string;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors"
      style={{
        background: isActive ? "var(--color-sidebar-hover)" : "transparent",
        color: isActive ? "var(--color-accent)" : "rgba(255, 255, 255, 0.65)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--color-sidebar-hover)";
          e.currentTarget.style.color = "#FFFFFF";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
        }
      }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
