"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CoachHQLayout } from "@/components/portal/coach-hq";
import {
  COACHHQ_NAV_CONFIG,
  COACHHQ_ICON_MAP,
} from "@/components/portal/coach-hq/mc-nav-config";
import {
  AdminToastProvider,
  AdminCommandPalette,
} from "@/components/portal/coach-hq/ui";
import type { AdminCommandItem } from "@/components/portal/coach-hq/ui";

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

export function AdminShell({ user, children }: AdminShellProps) {
  const router = useRouter();

  const commandItems = useMemo<AdminCommandItem[]>(() => {
    const items: AdminCommandItem[] = [];
    for (const group of COACHHQ_NAV_CONFIG) {
      for (const navItem of group.items) {
        const Icon = COACHHQ_ICON_MAP[navItem.iconName];
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

  return (
    <AdminToastProvider>
      <CoachHQLayout user={user}>{children}</CoachHQLayout>
      <AdminCommandPalette items={commandItems} shortcut="k" />
    </AdminToastProvider>
  );
}
