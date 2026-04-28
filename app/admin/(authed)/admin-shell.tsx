"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { MCLayout } from "@/components/portal/mission-control";
import {
  MC_NAV_CONFIG,
  MC_ICON_MAP,
} from "@/components/portal/mission-control/mc-nav-config";
import {
  AdminToastProvider,
  AdminCommandPalette,
} from "@/components/portal/mission-control/ui";
import type { AdminCommandItem } from "@/components/portal/mission-control/ui";

interface AdminShellProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  children: React.ReactNode;
}

/**
 * Ruter som bruker den nye CoachHQDarkShell og skal IKKE wrappes i MCLayout.
 * Disse sidene rendrer hele rail/nav/topbar selv — pixel-nær mockup.
 */
const DARK_SHELL_ROUTES = [
  "/admin",
  "/admin/hub",
  "/admin/denne-uken",
  "/admin/coaching-board",
  "/admin/mission-board",
  "/admin/focus",
  "/admin/godkjenninger",
  "/admin/elever",
];

function isDarkShellRoute(pathname: string): boolean {
  return DARK_SHELL_ROUTES.some(
    (route) =>
      route === "/admin"
        ? pathname === "/admin"
        : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function AdminShell({ user, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const commandItems = useMemo<AdminCommandItem[]>(() => {
    const items: AdminCommandItem[] = [];
    for (const group of MC_NAV_CONFIG) {
      for (const navItem of group.items) {
        const Icon = MC_ICON_MAP[navItem.iconName];
        items.push({
          id: navItem.href,
          label: navItem.label,
          description: navItem.href,
          group: group.label,
          keywords: [navItem.label, group.label, navItem.href],
          icon: Icon ? <Icon className="w-4 h-4" /> : undefined,
          action: () => router.push(navItem.href),
        });
      }
    }
    return items;
  }, [router]);

  // Nye dark-shell-ruter rendrer egen shell — bypass MCLayout
  if (isDarkShellRoute(pathname)) {
    return (
      <AdminToastProvider>
        {children}
        <AdminCommandPalette items={commandItems} shortcut="k" />
      </AdminToastProvider>
    );
  }

  return (
    <AdminToastProvider>
      <MCLayout user={user}>{children}</MCLayout>
      <AdminCommandPalette items={commandItems} shortcut="k" />
    </AdminToastProvider>
  );
}
