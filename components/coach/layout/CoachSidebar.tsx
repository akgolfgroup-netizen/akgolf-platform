"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Inbox,
  MessageSquare,
  Users,
  ClipboardList,
  CheckCircle,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/coach", icon: LayoutDashboard, exact: true },
  { name: "Inbox", href: "/coach/inbox", icon: Inbox },
  { name: "AI Chat", href: "/coach/chat", icon: MessageSquare },
  { name: "Spillere", href: "/coach/players", icon: Users },
  { name: "Okter", href: "/coach/sessions", icon: ClipboardList },
  { name: "Godkjenninger", href: "/coach/approvals", icon: CheckCircle },
];

export function CoachSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-ink-90)] border-r border-[var(--color-ink-80)]">
      <div className="flex h-16 items-center px-6 border-b border-[var(--color-ink-80)]">
        <Link href="/coach" className="text-xl font-bold text-white">
          Coach Hub
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
                  : "text-[var(--color-ink-40)] hover:bg-[var(--color-ink-80)] hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 space-y-1">
        <Link
          href="/coach/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/coach/settings")
              ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
              : "text-[var(--color-ink-40)] hover:bg-[var(--color-ink-80)] hover:text-white"
          )}
        >
          <Settings className="h-5 w-5" />
          Innstillinger
        </Link>
        <Link
          href="/portal"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-50)] hover:bg-[var(--color-ink-80)] hover:text-white transition-colors"
        >
          <span className="text-xs">Tilbake til Portal</span>
        </Link>
      </div>
    </aside>
  );
}
