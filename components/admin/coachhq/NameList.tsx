"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  COACHHQ_PRIMARY_NAV,
  COACHHQ_TOOLS_NAV,
  type CoachHQNavItem,
} from "./coachhq-nav-config";
import { LiveStatusFooter } from "./LiveStatusFooter";

interface NameListProps {
  liveSessions?: number;
}

/**
 * 200px navnliste — matcher public/design-reference/coachhq-reference.html.
 *
 * Viser:
 *  - Workspace-header med "CoachHQ" + live-pille
 *  - Søk (kommer i v2)
 *  - Filter-pills (Alle/I dag/Mine — kommer i v2)
 *  - Primary nav (8 items)
 *  - "Verktøy"-seksjon (Agenter, Treningsplaner)
 */
export function NameList({ liveSessions }: NameListProps) {
  const pathname = usePathname();

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
          <div className="text-sm font-display font-semibold">CoachHQ</div>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest"
            style={{
              background: "rgba(209, 248, 67, 0.15)",
              color: "var(--color-accent)",
            }}
          >
            aktiv
          </span>
        </div>
      </div>

      {/* Section: Hovedmeny */}
      <div className="px-4 pt-2 pb-1">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.16em]"
          style={{ color: "var(--color-sidebar-muted)" }}
        >
          Meny
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {COACHHQ_PRIMARY_NAV.map((item) => (
          <NameListLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* Verktøy */}
        <div className="px-2.5 pt-4 pb-1">
          <span
            className="text-[10px] font-mono uppercase tracking-[0.16em]"
            style={{ color: "var(--color-sidebar-muted)" }}
          >
            Verktøy
          </span>
        </div>
        {COACHHQ_TOOLS_NAV.map((item) => (
          <NameListLink key={item.href} item={item} pathname={pathname} compact />
        ))}
      </nav>

      {/* Live status — alltid nederst */}
      <LiveStatusFooter liveSessions={liveSessions} />
    </aside>
  );
}

function NameListLink({
  item,
  pathname,
  compact = false,
}: {
  item: CoachHQNavItem;
  pathname: string;
  compact?: boolean;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors"
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
      <span className="flex items-center gap-2 min-w-0">
        {compact && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span className="truncate">{item.label}</span>
      </span>
      {!compact && item.shortcut && (
        <span
          className="text-[9px] font-mono shrink-0"
          style={{
            color: isActive
              ? "rgba(209, 248, 67, 0.7)"
              : "var(--color-sidebar-muted)",
          }}
        >
          ⌘{item.shortcut}
        </span>
      )}
    </Link>
  );
}
