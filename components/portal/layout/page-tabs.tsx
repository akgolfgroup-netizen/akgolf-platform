"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getTabGroupForPath,
  getActiveTab,
} from "@/lib/portal/page-tabs-config";

/**
 * PageTabs — horisontal tab-bar pa toppen av samle-sider i PlayerHQ.
 *
 * Vises automatisk hvis pathname matcher en gruppe i PORTAL_TAB_GROUPS.
 * Returnerer null hvis ingen tabs er definert for ruten.
 *
 * Mobil: horisontal scroll (overflow-x-auto), 44px touch-targets.
 * Desktop: alle tabs synlige, jevnt fordelt.
 *
 * Brand Guide V2.0 — accent-bg pa aktiv tab, primary-tekst pa inaktiv.
 */
export function PageTabs() {
  const pathname = usePathname();
  const group = getTabGroupForPath(pathname);

  if (!group) return null;

  const active = getActiveTab(group, pathname);

  return (
    <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none">
      <div
        className="inline-flex items-center gap-1 rounded-2xl p-1 min-w-full sm:min-w-0"
        style={{
          background: "var(--color-card, #FFFFFF)",
          border: "1px solid var(--color-line, #E4EAE6)",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
        }}
      >
        {group.tabs.map((tab) => {
          const isActive = active?.href === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-11 whitespace-nowrap"
              style={{
                background: isActive
                  ? "var(--color-primary, #005840)"
                  : "transparent",
                color: isActive ? "#FFFFFF" : "var(--color-ink-muted, #5C6B62)",
              }}
            >
              <span className="sm:hidden">{tab.mobileLabel ?? tab.label}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
