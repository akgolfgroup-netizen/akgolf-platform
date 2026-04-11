"use client";

import Link from "next/link";
import { cn } from "@/lib/portal/utils/cn";

export interface SubNavTab {
  label: string;
  href: string;
}

interface SubNavTabsProps {
  tabs: SubNavTab[];
  activeTab: string;
  className?: string;
}

/**
 * SubNavTabs — gjenbrukbar tab/pills komponent for sub-navigasjon.
 * Brukes øverst på sider med flere faner (sosialt, statistikk, etc.).
 */
export function SubNavTabs({ tabs, activeTab, className }: SubNavTabsProps) {
  return (
    <nav className={cn("flex gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = tab.href === activeTab;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-grey-500 hover:bg-grey-50"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
